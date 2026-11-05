// Paws & Claws - Assignment 2 server (no external modules)
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const SHELTERS_DIR = path.join(__dirname, 'data', 'shelters');
const MAX_BODY_BYTES = 1e6;
const VALID_STATUSES = ['Unprocessed', 'Pending', 'Rejected', 'Approved'];

// All data lives in RAM
let shelters = [];
let applications = [];
let nextApplicationNumber = 1;

// Clean URL -> HTML file
const PAGE_ROUTES = {
    '/':             'index.html',
    '/browse':       'browse.html',
    '/details':      'pet.html',
    '/apply':        'apply.html',
    '/applications': 'applications.html',
    '/about':        'about.html'
};

// Static files are only served from these folders
const STATIC_PREFIXES = ['/styles/', '/js/', '/images/'];


// ---------- Helpers ----------

function getMimeType(file) {
    switch (path.extname(file).toLowerCase()) {
        case '.js': return 'application/javascript';
        case '.css': return 'text/css';
        case '.jpg': return 'image/jpeg';
        case '.png': return 'image/png';
        case '.svg': return 'image/svg+xml';
        case '.json': return 'application/json';
        case '.html': return 'text/html';
        default: return 'text/plain';
    }
}

function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
}

function sendError(res, statusCode, message) {
    res.writeHead(statusCode, {'Content-Type': 'text/plain'});
    res.end(message);
}

function serveStatic(filePath, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) return sendError(res, 404, 'File not found');
        res.writeHead(200, {'Content-Type': getMimeType(filePath)});
        res.end(data);
    });
}

function isAllowedStaticPath(pathname) {
    return !pathname.includes('..') && STATIC_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

// Read a request body and parse it as JSON (rejects if too big or invalid)
function readJSONBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
            if (body.length > MAX_BODY_BYTES) {
                reject(new Error('Request body too large'));
                req.destroy();
            }
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                reject(new Error('Invalid JSON'));
            }
        });
        req.on('error', reject);
    });
}

function toCleanString(value) {
    return (value === undefined || value === null) ? '' : String(value).trim();
}

// A shelter without its pets array
function getBasicShelter(shelter) {
    return {
        id: shelter.id,
        name: shelter.name,
        city: shelter.city,
        processingFee: shelter.processingFee
    };
}

function findShelter(shelterId) {
    return shelters.find(s => s.id === shelterId);
}

function findPet(shelterId, petId) {
    const shelter = findShelter(shelterId);
    return shelter ? shelter.pets.find(p => p.id === petId) : undefined;
}

function findApplication(applicationId) {
    return applications.find(a => a.applicationId === applicationId);
}


// ---------- Start-up ----------

// Read every .json file in data/shelters/ (new shelter files are picked up automatically)
async function loadShelters() {
    const files = (await fs.promises.readdir(SHELTERS_DIR))
        .filter(file => path.extname(file).toLowerCase() === '.json');

    const loaded = await Promise.all(files.map(async file => {
        const text = await fs.promises.readFile(path.join(SHELTERS_DIR, file), 'utf8');
        return JSON.parse(text);
    }));

    loaded.sort((a, b) => a.id.localeCompare(b.id, undefined, {numeric: true}));
    return loaded;
}


// ---------- GET handlers ----------

// /shelters returns basic info; /shelters?id=s1 returns one full shelter
function handleGetShelters(query, res) {
    if (query.id === undefined)
        return sendJSON(res, 200, shelters.map(getBasicShelter));

    const shelter = findShelter(query.id);
    if (!shelter) return sendError(res, 404, 'Not Found');
    return sendJSON(res, 200, shelter);
}

function handleGetPet(query, res) {
    const pet = findPet(query.shelterId, query.petId);
    if (!pet) return sendError(res, 404, 'Not Found');
    return sendJSON(res, 200, pet);
}

function handleGetApplicationsData(res) {
    const summaries = applications.map(a => ({
        dateSubmitted: a.dateSubmitted,
        applicationId: a.applicationId,
        shelterId: a.shelterId,
        petId: a.petId,
        petType: a.petType,
        status: a.status
    }));
    return sendJSON(res, 200, summaries);
}

function handleGetApplicationDetails(query, res) {
    const application = findApplication(query.id);
    if (!application) return sendError(res, 404, 'Not Found');
    return sendJSON(res, 200, application);
}

function handleGet(pathname, query, res) {
    if (PAGE_ROUTES[pathname])
        return serveStatic(path.join(__dirname, PAGE_ROUTES[pathname]), res);

    switch (pathname) {
        case '/shelters':              return handleGetShelters(query, res);
        case '/shelters/pets':         return handleGetPet(query, res);
        case '/applications-data':     return handleGetApplicationsData(res);
        case '/applications-details':  return handleGetApplicationDetails(query, res);
    }

    if (isAllowedStaticPath(pathname))
        return serveStatic(path.join(__dirname, pathname), res);

    return sendError(res, 404, 'Not Found');
}


// ---------- POST / PUT handlers ----------

// Adds an id, submission date and "Unprocessed" status, then stores the application
async function handleSubmitApplication(req, res) {
    let body;
    try {
        body = await readJSONBody(req);
    } catch (err) {
        return sendError(res, 400, err.message);
    }

    const pet = body && findPet(body.shelterId, body.petId);
    if (!pet) return sendError(res, 400, 'Unknown petId / shelterId');

    const application = {
        applicationId: 'a' + nextApplicationNumber++,
        dateSubmitted: new Date().toISOString(),
        status: 'Unprocessed',
        petId: pet.id,
        shelterId: body.shelterId,
        petType: pet.type,
        name: toCleanString(body.name),
        email: toCleanString(body.email),
        phone: toCleanString(body.phone),
        address: toCleanString(body.address),
        residents: toCleanString(body.residents),
        currentPets: toCleanString(body.currentPets),
        experience: toCleanString(body.experience),
        location: toCleanString(body.location),
        donation: toCleanString(body.donation)
    };
    applications.push(application);

    return sendJSON(res, 201, {
        message: 'Application received',
        applicationId: application.applicationId
    });
}

async function handleUpdateApplication(req, res) {
    let body;
    try {
        body = await readJSONBody(req);
    } catch (err) {
        return sendError(res, 400, err.message);
    }

    if (!body || !VALID_STATUSES.includes(body.status))
        return sendError(res, 400, 'Invalid status');

    const application = findApplication(body.applicationId);
    if (!application) return sendError(res, 404, 'Not Found');

    application.status = body.status;
    return sendJSON(res, 200, {
        message: 'Status updated',
        applicationId: application.applicationId,
        status: application.status
    });
}


// ---------- Main request handler ----------

function handleRequest(req, res) {
    const parsed = url.parse(req.url, true);

    let pathname;
    try {
        pathname = decodeURIComponent(parsed.pathname);
    } catch (e) {
        return sendError(res, 400, 'Bad Request');
    }

    if (req.method === 'GET')
        return handleGet(pathname, parsed.query, res);

    if (req.method === 'POST' && pathname === '/submitapplication')
        return handleSubmitApplication(req, res);

    if (req.method === 'PUT' && pathname === '/applications-update')
        return handleUpdateApplication(req, res);

    return sendError(res, 404, 'Not Found');
}


// Only start listening once all shelter data has been loaded
loadShelters()
    .then(loaded => {
        shelters = loaded;
        console.log(`Loaded ${shelters.length} shelters from data/shelters/`);
        http.createServer(handleRequest).listen(PORT);
        console.log(`Pet Adoption Server running on http://localhost:${PORT}`);
    })
    .catch(err => {
        console.error('Could not load shelter data - server not started.', err);
        process.exit(1);
    });