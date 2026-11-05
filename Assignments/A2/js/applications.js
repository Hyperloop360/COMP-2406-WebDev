// Applications page (administrative view).
//  - loads all applications from /applications-data (fetch().then().catch())
//  - lets the user change an application's status (PUT /applications-update)
//  - lets the user toggle a detailed view of ONE application (async/await fetch)

const STATUSES = ["Unprocessed", "Pending", "Rejected", "Approved"];

const tableBody = document.getElementById("applicationsBody");
const detailsSection = document.getElementById("applicationDetails");
const messageBox = document.getElementById("message");

let applications = [];          // summaries from the server (kept in sync with status changes)
let selectedApplicationId = null;   // id whose details are showing (null = none)
let selectedData = null;        // { application, pet, details } for the details being shown
let detailsRequestCount = 0;    // lets us ignore responses that arrive after the user moved on


// ---------- Small helpers ----------

// Show (or clear, with "") a message above the table
function showMessage(text) {
    messageBox.textContent = text;
}

// fetch() only rejects on network failures, so turn HTTP errors (like 404) into rejections too
function checkResponse(response) {
    if (!response.ok) throw new Error(`Server responded with ${response.status}`);
    return response.json();
}

// Create an element with some text (textContent keeps applicant-typed text from being treated as HTML)
function makeElement(tag, text, className) {
    const el = document.createElement(tag);
    if (text !== undefined) el.textContent = text;
    if (className) el.className = className;
    return el;
}

// CSS class that colours things according to a status, e.g. "status-pending"
function statusClass(status) {
    return "status-" + status.toLowerCase();
}

function formatDate(isoString) {
    return new Date(isoString).toLocaleString();
}


// ---------- Loading and showing the table ----------

function loadApplications() {
    fetch("/applications-data")
        .then(checkResponse)
        .then(data => {
            applications = data;
            renderTable();
        })
        .catch(() => showMessage("Sorry, the applications could not be loaded."));
}

// Build the <select> used to change an application's status
function makeStatusSelect(app) {
    const select = makeElement("select", undefined, "status-select " + statusClass(app.status));
    STATUSES.forEach(status => {
        const option = makeElement("option", status);
        option.value = status;
        select.appendChild(option);
    });
    select.value = app.status;
    select.addEventListener("change", () => updateStatus(app, select));
    return select;
}

// Build one table row for an application
function makeRow(app) {
    const row = document.createElement("tr");

    row.appendChild(makeElement("td", formatDate(app.dateSubmitted)));

    // Application id cell: the id plus its View button
    const idCell = document.createElement("td");
    idCell.appendChild(makeElement("span", app.applicationId));
    const viewBtn = makeElement("button", "View", "view-button");
    viewBtn.dataset.id = app.applicationId;
    viewBtn.addEventListener("click", () => toggleDetails(app));
    idCell.appendChild(viewBtn);
    row.appendChild(idCell);

    row.appendChild(makeElement("td", app.shelterId));
    row.appendChild(makeElement("td", app.petId));
    row.appendChild(makeElement("td", app.petType));

    const statusCell = document.createElement("td");
    statusCell.appendChild(makeStatusSelect(app));
    row.appendChild(statusCell);

    return row;
}

function renderTable() {
    tableBody.innerHTML = "";

    if (applications.length === 0) {
        const row = document.createElement("tr");
        const cell = makeElement("td", "No applications have been submitted yet.", "empty-row");
        cell.colSpan = 6;
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }
    applications.forEach(app => tableBody.appendChild(makeRow(app)));
}


// ---------- Changing a status ----------

// Send the new status to the server. If that fails, put the drop-down back the way it was.
function updateStatus(app, select) {
    const newStatus = select.value;
    const oldStatus = app.status;
    showMessage("");

    fetch("/applications-update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: app.applicationId, status: newStatus })
    })
        .then(checkResponse)
        .then(() => {
            app.status = newStatus;
            select.className = "status-select " + statusClass(newStatus);

            // If this application's details are showing, refresh them so the status matches
            if (selectedApplicationId === app.applicationId && selectedData) {
                renderDetails(selectedData);
            }
        })
        .catch(() => {
            select.value = oldStatus;
            select.className = "status-select " + statusClass(oldStatus);
            showMessage(`Sorry, the status of ${app.applicationId} could not be updated.`);
        });
}


// ---------- Application details (View buttons) ----------

// Remove the details from the page and un-highlight every View button
function clearDetails() {
    detailsRequestCount++;          // any request still in flight is now out of date
    selectedApplicationId = null;
    selectedData = null;
    detailsSection.hidden = true;
    detailsSection.innerHTML = "";
    document.querySelectorAll(".view-button").forEach(btn => btn.classList.remove("active"));
}

// Toggle the details of one application: clicking the selected one hides it, clicking
// another one switches to it (only one can be showing at a time).
async function toggleDetails(app) {
    const alreadySelected = (selectedApplicationId === app.applicationId);
    clearDetails();
    if (alreadySelected) return;

    selectedApplicationId = app.applicationId;
    document.querySelector(`.view-button[data-id="${app.applicationId}"]`).classList.add("active");
    detailsSection.hidden = false;
    detailsSection.replaceChildren(makeElement("p", "Loading details...", "details-message"));

    const requestNumber = detailsRequestCount;
    try {
        // Ask for the applicant details and the pet's data at the same time
        const [detailsResponse, petResponse] = await Promise.all([
            fetch(`/applications-details?id=${encodeURIComponent(app.applicationId)}`),
            fetch(`/shelters/pets?petId=${encodeURIComponent(app.petId)}&shelterId=${encodeURIComponent(app.shelterId)}`)
        ]);
        const details = await checkResponse(detailsResponse);
        const pet = await checkResponse(petResponse);

        // The user may have toggled something else while we were waiting
        if (requestNumber !== detailsRequestCount) return;

        selectedData = { application: app, pet: pet, details: details };
        renderDetails(selectedData);
    } catch (err) {
        if (requestNumber !== detailsRequestCount) return;
        detailsSection.replaceChildren(
            makeElement("p", "Sorry, the application details could not be loaded.", "details-message error-message"));
    }
}

// Build a card with a heading and a list of "Label: value" lines
function makeCard(title, fields, extraClass) {
    const card = makeElement("div", undefined, "details-card " + (extraClass || ""));
    card.appendChild(makeElement("h3", title));
    fields.forEach(([label, value]) => {
        const line = document.createElement("p");
        line.appendChild(makeElement("strong", label + ": "));
        // value may be plain text or a ready-made element (e.g., the status badge)
        line.append(value === "" || value === undefined ? "-" : value);
        card.appendChild(line);
    });
    return card;
}

// Show the application, pet, applicant and household information below the table
function renderDetails({ application, pet, details }) {
    const grid = makeElement("div", undefined, "details-grid");

    // Application information (uses the current status from the table)
    const appCard = makeCard("Application Information", [
        ["Application ID", application.applicationId],
        ["Date Submitted", formatDate(application.dateSubmitted)],
        ["Status", makeElement("span", application.status, "status-badge " + statusClass(application.status))],
        ["Pet ID", application.petId],
        ["Shelter ID", application.shelterId]
    ]);

    // Pet requested, including its picture
    const petCard = makeCard("Pet Requested", [
        ["Name", pet.name],
        ["Type", pet.type],
        ["Breed", pet.breed],
        ["Age", pet.age + (pet.age === 1 ? " year" : " years")],
        ["Days at Shelter", pet.daysAtShelter]
    ], "pet-card-details");
    const image = makeElement("img", undefined, "details-pet-image");
    image.src = "/" + pet.image;
    image.alt = pet.name;
    petCard.insertBefore(image, petCard.children[1]);

    const applicantCard = makeCard("Applicant Information", [
        ["Name", details.name],
        ["Email", details.email],
        ["Phone", details.phone],
        ["Address", details.address]
    ]);

    const householdCard = makeCard("Household Details", [
        ["Number of Residents", details.residents],
        ["Current Pets", details.currentPets],
        ["Experience Level", details.experience],
        ["Pet Location", details.location]
    ]);

    grid.append(appCard, petCard, applicantCard, householdCard);
    detailsSection.replaceChildren(makeElement("h2", `Details for Application ${application.applicationId}`), grid);
}


// Load the applications as soon as the page opens
loadApplications();
