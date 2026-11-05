// Pet details page. The pet comes from /shelters/pets and the shelter's processing fee
// from /shelters; the page is only rendered once BOTH have arrived.

const params = new URLSearchParams(window.location.search);
const petId = params.get("petId");
const shelterId = params.get("shelterId");
const petContainer = document.getElementById("petDetailsContainer");
const backButton = document.getElementById("back-button");

// Show an error message in place of the pet card
function showError(message) {
    petContainer.innerHTML = `<p class="error">${message}</p>`;
}

// fetch() only rejects on network failures, so turn HTTP errors (like 404) into rejections too
function checkResponse(response) {
    if (!response.ok) throw new Error(`Server responded with ${response.status}`);
    return response.json();
}

// Render the pet details page by inserting the image and pet data into the static HTML
function renderPetPage(pet, shelter) {
    // Build up the traits list
    const traitsList = pet.traits.length
        ? `<ul>${pet.traits.map(t => `<li>${t}</li>`).join("")}</ul>`
        : "<br>";

    // Fees: the processing fee comes from the shelter
    const processingFee = shelter.processingFee;
    const totalFee = Number(pet.adoptionFee) + Number(processingFee);

    // Link to the application form. Everything the form needs is passed in the query string.
    const applyUrl = `/apply?petId=${encodeURIComponent(pet.id)}`
        + `&shelterId=${encodeURIComponent(shelter.id)}`
        + `&petName=${encodeURIComponent(pet.name)}`
        + `&petType=${encodeURIComponent(pet.type)}`
        + `&petBreed=${encodeURIComponent(pet.breed)}`
        + `&adoptionFee=${encodeURIComponent(pet.adoptionFee)}`
        + `&processingFee=${encodeURIComponent(processingFee)}`;

    petContainer.innerHTML = `
        <div class="pet-detail-card">
            <img src="${pet.image}" alt="${pet.name}" class="pet-detail-image">
            <h2>${pet.name}</h2>
            <p>${pet.age} year old ${pet.breed} (${pet.type})</p>
            <p><strong>Health:</strong> ${pet.health}</p>
            ${traitsList}
            <p><strong>Days at Shelter:</strong> ${pet.daysAtShelter ?? "N/A"}</p>
            <hr>
            <p><strong>Adoption Fee:</strong> $${pet.adoptionFee}</p>
            <p><strong>Processing Fee:</strong> $${processingFee}</p>
            <p><strong>Total (before taxes):</strong> $${totalFee}</p>
            <a href="${applyUrl}" class="apply-button">Apply to Adopt this Pet</a>
        </div>`;
}

// Back button returns to the browse page with the same shelter selected
if (shelterId) {
    backButton.innerHTML =
        `<a href="/browse?shelterId=${encodeURIComponent(shelterId)}" class="back-link">Back to Browsing</a>`;
} else {
    backButton.innerHTML = `<a href="/browse" class="back-link">Back to Browsing</a>`;
}

if (!petId || !shelterId) {
    showError("Pet not found.");
} else {
    // Request the pet and the basic shelter list at the same time, and wait for both
    const petRequest = fetch(`/shelters/pets?petId=${encodeURIComponent(petId)}&shelterId=${encodeURIComponent(shelterId)}`)
        .then(checkResponse);
    const shelterRequest = fetch("/shelters")
        .then(checkResponse)
        .then(shelters => shelters.find(s => s.id === shelterId));

    Promise.all([petRequest, shelterRequest])
        .then(([pet, shelter]) => {
            if (!shelter) throw new Error("Shelter not found");
            renderPetPage(pet, shelter);
        })
        .catch(() => showError("Pet not found."));
}
