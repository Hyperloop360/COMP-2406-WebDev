// Populates browse.html from the shelters array (shelterData.js)
const shelterSelect = document.getElementById("location");
const typeButtons = document.getElementById("typeButtons");
const petsSection = document.getElementById("pets");
const buttons = typeButtons.querySelectorAll("button");

let currentShelter = null;

// Maps a pet's type to one of the button categories
function getCategory(type) {
    if (type === "Cat") return "Cats";
    if (type === "Dog") return "Dogs";
    if (type === "Bird" || type === "Parrot") return "Birds";
    if (type === "Reptile") return "Reptiles";
    return "Other";
}

// Fill the drop-down; no shelter is selected initially
function populateShelters() {
    shelterSelect.add(new Option("-- Select a shelter --", ""));
    shelters.forEach(s => shelterSelect.add(new Option(`${s.name} - ${s.city}`, s.id)));
}

// Show buttons/pets for the chosen shelter (or hide everything if none)
function showShelter(shelterId) {
    currentShelter = shelters.find(s => s.id === shelterId);
    if (!currentShelter) {
        typeButtons.hidden = true;
        petsSection.innerHTML = "";
        return;
    }
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
                window.location.href = `pet.html?pet=${pet.id}&shelter=${currentShelter.id}`;
            });
            card.appendChild(btn);
            petsSection.appendChild(card);
        });
}

populateShelters();
shelterSelect.addEventListener("change", () => showShelter(shelterSelect.value));
buttons.forEach(b => b.addEventListener("click", () => {
    if (!b.disabled) selectCategory(b.dataset.category);
}));

// Returning from pet.html: preselect the shelter given in the query string
const returnShelter = new URLSearchParams(window.location.search).get("shelter");
if (returnShelter) {
    shelterSelect.value = returnShelter;
    showShelter(returnShelter);
}
