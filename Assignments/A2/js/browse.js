// Populates browse.html using data requested from the server with fetch()
const shelterSelect = document.getElementById("location");
const typeButtons = document.getElementById("typeButtons");
const petsSection = document.getElementById("pets");
const messageBox = document.getElementById("message");
const buttons = typeButtons.querySelectorAll("button");

// The shelter whose full data (including pets) was last received from the server
let currentShelter = null;

// Maps a pet's type to one of the button categories
function getCategory(type) {
    if (type === "Cat") return "Cats";
    if (type === "Dog") return "Dogs";
    if (type === "Bird" || type === "Parrot") return "Birds";
    if (type === "Reptile") return "Reptiles";
    return "Other";
}

// Show (or clear, with "") an error message under the drop-down
function showMessage(text) {
    messageBox.textContent = text;
}

// fetch() only rejects on network failures, so turn HTTP errors (like 404) into rejections too
function checkResponse(response) {
    if (!response.ok) throw new Error(`Server responded with ${response.status}`);
    return response.json();
}

// Request the basic shelter list (no pets) and fill the drop-down; none is selected initially
function populateShelters() {
    shelterSelect.add(new Option("-- Select a shelter --", ""));

    fetch("/shelters")
        .then(checkResponse)
        .then(shelterList => {
            shelterList.forEach(s => shelterSelect.add(new Option(`${s.name} - ${s.city}`, s.id)));

            // Returning from pet.html: preselect the shelter given in the query string
            const returnShelter = new URLSearchParams(window.location.search).get("shelterId");
            if (returnShelter && shelterList.some(s => s.id === returnShelter)) {
                shelterSelect.value = returnShelter;
                loadShelter(returnShelter);
            }
        })
        .catch(() => showMessage("Sorry, the list of shelters could not be loaded."));
}

// Hide the buttons and pets (no shelter selected)
function clearShelter() {
    currentShelter = null;
    typeButtons.hidden = true;
    petsSection.innerHTML = "";
}

// Request ONE shelter's full data (with pets) from the server, replacing the previous shelter's data
function loadShelter(shelterId) {
    showMessage("");
    fetch(`/shelters?id=${encodeURIComponent(shelterId)}`)
        .then(checkResponse)
        .then(shelter => {
            // Ignore a late response if the user has already chosen a different shelter
            if (shelterSelect.value !== shelterId) return;
            showShelter(shelter);
        })
        .catch(() => {
            if (shelterSelect.value !== shelterId) return;
            clearShelter();
            showMessage("Sorry, that shelter's pets could not be loaded.");
        });
}

// Show buttons/pets for the shelter data received from the server
function showShelter(shelter) {
    currentShelter = shelter;
    typeButtons.hidden = false;
    // Disable buttons for which the shelter has no pets ("All" is always enabled)
    buttons.forEach(b => {
        const cat = b.dataset.category;
        b.disabled = cat !== "All" && !currentShelter.pets.some(p => getCategory(p.type) === cat);
    });
    selectCategory("All");
}

// Mark one button selected and display the matching pets
function selectCategory(category) {
    buttons.forEach(b => b.classList.toggle("selected", b.dataset.category === category));
    petsSection.innerHTML = "";
    currentShelter.pets
        .filter(p => category === "All" || getCategory(p.type) === category)
        .forEach(pet => {
            const card = document.createElement("div");
            card.className = "petCard";
            card.innerHTML = `<img src="${pet.image}" alt="${pet.name}"><h3>${pet.name}</h3>`;
            const btn = document.createElement("button");
            btn.textContent = "View Details";
            btn.addEventListener("click", () => {
                window.location.href =
                    `/details?petId=${encodeURIComponent(pet.id)}&shelterId=${encodeURIComponent(currentShelter.id)}`;
            });
            card.appendChild(btn);
            petsSection.appendChild(card);
        });
}

populateShelters();
shelterSelect.addEventListener("change", () => {
    showMessage("");
    if (shelterSelect.value) loadShelter(shelterSelect.value);
    else clearShelter();
});
buttons.forEach(b => b.addEventListener("click", () => {
    if (!b.disabled) selectCategory(b.dataset.category);
}));
