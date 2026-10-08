// Displays the pet chosen via ?pet=ID&shelter=ID query parameters
const params = new URLSearchParams(window.location.search);
const shelter = shelters.find(s => s.id === params.get("shelter"));
const pet = shelter && shelter.pets.find(p => p.id === params.get("pet"));
const details = document.getElementById("petDetails");

if (!pet) {
    details.innerHTML = `<p>Pet not found.</p><a href="browse.html">&larr; Back to Browsing</a>`;
} else {
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
        <p><a href="browse.html?shelter=${shelter.id}">&larr; Back to Browsing</a></p>`;

    document.getElementById("applyBtn").addEventListener("click", () => {
        const q = new URLSearchParams({
            pet: pet.id, name: pet.name, type: pet.type, breed: pet.breed,
            adoptionFee: pet.adoptionFee, processingFee: shelter.processingFee
        });
        window.location.href = "apply.html?" + q.toString();
    });
}
