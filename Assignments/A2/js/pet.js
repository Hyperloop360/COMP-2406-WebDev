// Displays the pet chosen via ?petId=ID&shelterId=ID query parameters.
// The pet comes from /shelters/pets and the processing fee from /shelters;
// the page is only rendered once BOTH have arrived.
const params = new URLSearchParams(window.location.search);
const petId = params.get("petId");
const shelterId = params.get("shelterId");
const details = document.getElementById("petDetails");

// Link back to the browse page with the same shelter selected
const backUrl = shelterId ? `/browse?shelterId=${encodeURIComponent(shelterId)}` : "/browse";

// fetch() only rejects on network failures, so turn HTTP errors (like 404) into rejections too
function checkResponse(response) {
    if (!response.ok) throw new Error(`Server responded with ${response.status}`);
    return response.json();
}

function showNotFound() {
    details.innerHTML = `<p>Pet not found.</p><a href="${backUrl}">&larr; Back to Browsing</a>`;
}

// Render the pet details once both the pet and its shelter are known
function showPet(pet, shelter) {
    const total = pet.adoptionFee + shelter.processingFee;
    details.className = "card petDetails";
    details.innerHTML = `
        <img src="${pet.image}" alt="${pet.name}">
        <h1>${pet.name}</h1>
        <p>${pet.age} year old ${pet.breed} (${pet.type})</p>
        <p><strong>Health:</strong> ${pet.health}</p>
        <p><strong>Traits:</strong> ${pet.traits.join(", ")}</p>
        <p>${pet.daysAtShelter} Days at Shelter</p>
        <p>Adoption Fee: $${pet.adoptionFee}</p>
        <p>Processing Fee: $${shelter.processingFee}</p>
        <p><strong>Total: $${total}</strong></p>
        <button type="button" id="applyBtn" class="primary">Apply to Adopt this Pet</button>
        <p><a href="${backUrl}">&larr; Back to Browsing</a></p>`;

    // Pass everything the application form needs (including the shelterId) in the query string
    document.getElementById("applyBtn").addEventListener("click", () => {
        const q = new URLSearchParams({
            petId: pet.id, shelterId: shelter.id, name: pet.name, type: pet.type, breed: pet.breed,
            adoptionFee: pet.adoptionFee, processingFee: shelter.processingFee
        });
        window.location.href = "/apply?" + q.toString();
    });
}

if (!petId || !shelterId) {
    showNotFound();
} else {
    // Request the pet and the basic shelter list (no pets) at the same time, then wait for both
    const petRequest = fetch(`/shelters/pets?petId=${encodeURIComponent(petId)}&shelterId=${encodeURIComponent(shelterId)}`)
        .then(checkResponse);
    const shelterRequest = fetch("/shelters")
        .then(checkResponse)
        .then(shelterList => shelterList.find(s => s.id === shelterId));

    Promise.all([petRequest, shelterRequest])
        .then(([pet, shelter]) => {
            if (!shelter) throw new Error("Shelter not found");
            showPet(pet, shelter);
        })
        .catch(showNotFound);
}
