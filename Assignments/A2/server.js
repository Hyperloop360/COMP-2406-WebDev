/*
 * New Home Animal Rescue - Assignment 2 server
 *
 * A plain node.js HTTP server (no external modules) that:
 *   - loads every shelter .json file from data/shelters/ BEFORE it starts listening
 *   - serves the site's HTML pages from clean URLs ("/", "/browse", ...)
 *   - serves static resources (css, js, images, aboutData.js)
 *   - provides JSON endpoints for shelters, pets and adoption applications
 *   - stores all submitted applications in RAM (lost when the server restarts)
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const SHELTERS_DIR = path.join(__dirname, 'data', 'shelters');
const MAX_BODY_BYTES = 1e6;   // refuse request bodies larger than ~1MB

// The only values an application's status is allowed to have
const VALID_STATUSES = ['Unprocessed', 'Pending', 'Rejected', 'Approved'];

// ---------------------------------------------------------------------------
// In-memory state
// ---------------------------------------------------------------------------
let shelters = [];          // full shelter objects (including pets), loaded at start up
let applications = [];      // all submitted applications, in order of submission
let nextApplicationNumber = 1;   // used to build unique ids: a1, a2, a3, ...


// ---------------------------------------------------------------------------
// Routing tables
// ---------------------------------------------------------------------------

// Clean URL  ->  HTML file that is served for it
const PAGE_ROUTES = {
    '/':             'index.html',
    '/browse':       'browse.html',
    '/details':      'pet.html',
    '/apply':        'apply.html',
    '/applications': 'applications.html',
    '/about':        'about.html'
};

// Static files may ONLY come from these folders / files. This keeps server.js and the
// raw shelter .json files from being downloaded as "static" files.
const STATIC_PREFIXES = ['/css/', '/js/', '/images/'];
const STATIC_FILES = ['/data/aboutData.js'];


// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

// Return the Content-type based on the file type. This is needed for static file serving.
function getMimeType(file) {
    const ext = path.extname(file).toLowerCase();
    switch(ext) {
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

// Send a JSON response with the given status code
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
}

// Send a plain-text error (e.g., the "standard" 404)
function sendError(res, statusCode, message) {
    res.writeHead(statusCode, {'Content-Type': 'text/plain'});
    res.end(message);
}

// This function serves all the static files
function serveStatic(filePath, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            sendError(res, 404, 'File not found');
        } else {
            res.writeHead(200, {'Content-Type': getMimeType(filePath)});
            res.end(data);
        }
    });
}

// Is this URL path one of the static resources we are willing to serve?
function isAllowedStaticPath(pathname) {
    if (pathname.includes('..')) return false;     // no directory-traversal tricks
    return STATIC_FILES.includes(pathname) ||
           STATIC_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

// Collect the body of a POST/PUT request and parse it as JSON.
// Resolves with the parsed object, or rejects if it is too big or is not valid JSON.
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

// Convert any incoming value to a trimmed string ('' if it is missing)
function toCleanString(value) {
    return (value === undefined || value === null) ? '' : String(value).trim();
}


// ---------------------------------------------------------------------------
// Data look-ups
// ---------------------------------------------------------------------------

// The "basic" version of a shelter: everything EXCEPT the pets array
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

// Find a pet within a specific shelter (undefined if either does not exist)
function findPet(shelterId, petId) {
    const shelter = findShelter(shelterId);
    return shelter ? shelter.pets.find(p => p.id === petId) : undefined;
}

function findApplication(applicationId) {
    return applications.find(a => a.applicationId === applicationId);
}


// ---------------------------------------------------------------------------
// Start-up: load shelters
// ---------------------------------------------------------------------------

// Read every .json file in data/shelters/ and parse it. Any new shelter file dropped into
// that folder is picked up automatically - nothing in this code names a specific file.
async function loadShelters() {
    const files = (await fs.promises.readdir(SHELTERS_DIR))
        .filter(file => path.extname(file).toLowerCase() === '.json');

    const loaded = await Promise.all(files.map(async file => {
        const text = await fs.promises.readFile(path.join(SHELTERS_DIR, file), 'utf8');
        return JSON.parse(text);
    }));

    // Directory order is alphabetical by filename; sort by shelter id (s1, s2, ... s10) instead
    loaded.sort((a, b) => a.id.localeCompare(b.id, undefined, {numeric: true}));
    return loaded;
}


// ---------------------------------------------------------------------------
// GET handlers
// ---------------------------------------------------------------------------

// GET /shelters                -> array of basic shelters (no pets)
// GET /shelters?id=s1          -> one full shelter (with pets), or 404
function handleGetShelters(query, res) {
    if (query.id === undefined) {
        return sendJSON(res, 200, shelters.map(getBasicShelter));
    }
    const shelter = findShelter(query.id);
    if (!shelter) return sendError(res, 404, 'Not Found');
    return sendJSON(res, 200, shelter);
}

// GET /shelters/pets?petId=p1&shelterId=s1  -> one pet, or 404
function handleGetPet(query, res) {
    const pet = findPet(query.shelterId, query.petId);
    if (!pet) return sendError(res, 404, 'Not Found');
    return sendJSON(res, 200, pet);
}

// GET /applications-data -> summary of every application (not the applicant's personal details)
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

// GET /applications-details?id=a4 -> the full application, or 404
function handleGetApplicationDetails(query, res) {
    const application = findApplication(query.id);
    if (!application) return sendError(res, 404, 'Not Found');
    return sendJSON(res, 200, application);
}

function handleGet(pathname, query, res) {
    // HTML pages (clean URLs)
    if (PAGE_ROUTES[pathname]) {
        return serveStatic(path.join(__dirname, PAGE_ROUTES[pathname]), res);
    }

    // JSON data routes
    switch (pathname) {
        case '/shelters':              return handleGetShelters(query, res);
        case '/shelters/pets':         return handleGetPet(query, res);
        case '/applications-data':     return handleGetApplicationsData(res);
        case '/applications-details':  return handleGetApplicationDetails(query, res);
    }

    // Anything else must be an allowed static resource
    if (isAllowedStaticPath(pathname)) {
        return serveStatic(path.join(__dirname, pathname), res);
    }
    return sendError(res, 404, 'Not Found');
}


// ---------------------------------------------------------------------------
// POST / PUT handlers
// ---------------------------------------------------------------------------

// POST /submitapplication
// Validates the incoming application, adds an applicationId, submission date and an
// "Unprocessed" status, then stores it in RAM.
async function handleSubmitApplication(req, res) {
    let body;
    try {
        body = await readJSONBody(req);
    } catch (err) {
        return sendError(res, 400, err.message);
    }

    // The pet and shelter being applied for must really exist
    const pet = body && findPet(body.shelterId, body.petId);
    if (!pet) return sendError(res, 400, 'Unknown petId / shelterId');

    // Only keep the fields we know about (so a client cannot store arbitrary junk)
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

// PUT /applications-update   body: { applicationId: 'a4', status: 'Approved' }
async function handleUpdateApplication(req, res) {
    let body;
    try {
        body = await readJSONBody(req);
    } catch (err) {
        return sendError(res, 400, err.message);
    }

    if (!body || !VALID_STATUSES.includes(body.status)) {
        return sendError(res, 400, 'Invalid status');
    }
    const application = findApplication(body.applicationId);
    if (!application) return sendError(res, 404, 'Not Found');

    application.status = body.status;
    return sendJSON(res, 200, {
        message: 'Status updated',
        applicationId: application.applicationId,
        status: application.status
    });
}


// ---------------------------------------------------------------------------
// Main request handler
// ---------------------------------------------------------------------------
function handleRequest(req, res) {
    const parsed = url.parse(req.url, true);

    // Decode %20 etc. so the allowed-path checks see the real path
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

    // Handle anything else as an error
    return sendError(res, 404, 'Not Found');
}


// ---------------------------------------------------------------------------
// Start server - but only AFTER all the shelter data has been loaded
// ---------------------------------------------------------------------------
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
