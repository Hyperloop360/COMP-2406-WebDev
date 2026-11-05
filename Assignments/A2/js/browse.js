// Browse page: pick a shelter, then show (and filter) its pets.
// All data comes from the server via fetch().

const shelterDropdown = document.getElementById("shelterDropdown");
const petContainer = document.getElementById("petContainer");
const petTypeBar = document.getElementById("petTypeBar");
const messageBox = document.getElementById("message");

// A shelter id passed in when returning from the pet details page (e.g., /browse?shelterId=s2)
const savedShelterId = new URLSearchParams(window.location.search).get("shelterId");

// State for the currently selected shelter (its pets are replaced every time we load a shelter)
let currentPets = [];
let activeType = "All";

// The pet-type buttons only know these categories. Anything else (e.g., "Parrot") is
// grouped into one of them so that every pet can be found with a type button.
function getPetCategory(type) {
    if (["Cat", "Dog", "Bird", "Reptile"].includes(type)) return type;
    if (type === "Parrot") return "Bird";
    return "Other";
}

// Show (or clear, with "") an error/info message under the drop-down
function showMessage(text) {
    messageBox.textContent = text;
}

// fetch() only rejects on network failures, so turn HTTP errors (like 404) into rejections too
function checkResponse(response) {
    if (!response.ok) throw new Error(`Server responded with ${response.status}`);
    return response.json();
}


// ---------- Fetching from the server ----------

// Request the basic list of shelters (no pets) and fill the drop-down menu
function loadShelterList() {
    fetch("/shelters")
        .then(checkResponse)
        .then(shelters => {
            shelters.forEach(shelter => {
                const option = document.createElement("option");
                option.value = shelter.id;
                option.textContent = shelter.name;
                shelterDropdown.appendChild(option);
            });

            // If we came back from a pet's page, re-select that shelter and load its pets
            if (savedShelterId && shelters.some(s => s.id === savedShelterId)) {
                shelterDropdown.value = savedShelterId;
                loadShelter(savedShelterId);
            }
        })
        .catch(() => showMessage("Sorry, the list of shelters could not be loaded."));
}

// Request ONE shelter's full data (including pets) and display it
function loadShelter(shelterId) {
    showMessage("");
    fetch(`/shelters?id=${encodeURIComponent(shelterId)}`)
        .then(checkResponse)
        .then(shelter => {
            // Ignore this response if the user has already picked a different shelter
            if (shelterDropdown.value !== shelterId) return;

            // Overwrite whatever shelter data we had before
            currentPets = shelter.pets;
            activeType = "All";
            renderPets(currentPets);
            updatePetTypeButtons(currentPets);
        })
        .catch(() => {
            if (shelterDropdown.value !== shelterId) return;
            resetPage();
            showMessage("Sorry, that shelter's pets could not be loaded.");
        });
}


// ---------- Rendering ----------

// Clear the pets and hide the type bar (nothing selected)
function resetPage() {
    currentPets = [];
    petContainer.innerHTML = "";
    petTypeBar.classList.add("hidden");
    petTypeBar.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
}

// Return a histogram object of { pet category : count }
function getPetTypes(pets) {
    const types = { Cat: 0, Dog: 0, Bird: 0, Reptile: 0, Other: 0 };
    pets.forEach(p => {
        types[getPetCategory(p.type)]++;
    });
    return types;
}

// Render the pets on the page, grouped as little cards
function renderPets(pets) {
    petContainer.innerHTML = "";
    pets.forEach(p => {
        const card = document.createElement("div");
        card.className = "pet-card";
        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <button>View Details</button>`;

        // Clicking View Details requests the pet's details page from the server
        card.querySelector("button").addEventListener("click", () => {
            window.location.href =
                `/details?petId=${encodeURIComponent(p.id)}&shelterId=${encodeURIComponent(shelterDropdown.value)}`;
        });

        petContainer.appendChild(card);
    });
}

// Update the set of pet type buttons for the given pets
function updatePetTypeButtons(pets) {
    const counts = getPetTypes(pets);

    petTypeBar.querySelectorAll("button").forEach(btn => {
        const type = btn.dataset.type;
        btn.classList.remove("active");

        // "All" is always enabled and selected by default; others are disabled if no pets match
        if (type === "All") {
            btn.classList.add("active");
            btn.classList.remove("disabled");
        } else {
            btn.classList.toggle("disabled", counts[type] === 0);
        }
    });
    petTypeBar.classList.remove("hidden");
}


// ---------- Event handlers ----------

// Handle shelter selection
shelterDropdown.addEventListener("change", () => {
    const shelterId = shelterDropdown.value;
    showMessage("");

    if (!shelterId) {
        resetPage();
        return;
    }
    loadShelter(shelterId);
});

// Handle pet type button selection
petTypeBar.addEventListener("click", e => {
    // Ignore clicks that are not on an enabled button
    if (e.target.tagName !== "BUTTON" || e.target.classList.contains("disabled"))
        return;

    activeType = e.target.dataset.type;

    // Highlight the active button, and unhighlight the others
    petTypeBar.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");

    // Show only the pets of the chosen type
    const filtered = currentPets.filter(p =>
        activeType === "All" || getPetCategory(p.type) === activeType);
    renderPets(filtered);
});

// Start by loading the shelter list (this also restores a previously selected shelter)
loadShelterList();
