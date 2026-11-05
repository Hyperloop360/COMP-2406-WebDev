// Application form page. The pet's details arrive as query parameters from the pet page;
// on submit, the application is POSTed to the server as JSON.

const params = new URLSearchParams(window.location.search);
const petId = params.get("petId");
const shelterId = params.get("shelterId");
const petName = params.get("petName");
const petType = params.get("petType");
const petBreed = params.get("petBreed");
const adoptionFee = params.get("adoptionFee");
const processingFee = params.get("processingFee");

const petInfoSection = document.getElementById("petApplicationInfo");
const submitBtn = document.getElementById("submitBtn");
const submitError = document.getElementById("submitError");
const agreement1 = document.getElementById("agreement1");
const agreement2 = document.getElementById("agreement2");
const form = document.getElementById("adoptionForm");


// Insert the chosen pet's information at the top of the form.
// (textContent is used so that text coming from the URL can never be treated as HTML)
if (petId && shelterId && petName && petType && petBreed && adoptionFee && processingFee) {
    const total = parseInt(adoptionFee) + parseInt(processingFee);

    const heading = document.createElement("h2");
    heading.textContent = `Applying to Adopt: ${petName}`;
    const typeLine = document.createElement("p");
    typeLine.textContent = `Type: ${petType} | Breed: ${petBreed}`;
    const feeLine = document.createElement("p");
    feeLine.textContent =
        `Adoption Fee: $${adoptionFee} + Processing Fee: $${processingFee} = Total (before taxes): $${total}`;

    petInfoSection.append(heading, typeLine, feeLine);
} else {
    // Handle case where pet information is missing
    petInfoSection.innerHTML = "<p class=\"error\">Incomplete Pet information.</p>";
    submitBtn.disabled = true;
}

// Enable Submit button only when both checkboxes are checked (and the pet info is complete)
function updateSubmitState() {
    const petInfoComplete = petInfoSection.querySelector(".error") === null;
    submitBtn.disabled = !(petInfoComplete && agreement1.checked && agreement2.checked);
}
agreement1.addEventListener("change", updateSubmitState);
agreement2.addEventListener("change", updateSubmitState);
updateSubmitState();


// Gather everything entered in the form into one object to send to the server
function buildApplication() {
    return {
        petId: petId,
        shelterId: shelterId,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        residents: document.getElementById("residents").value,
        currentPets: document.getElementById("currentPets").value,
        experience: document.getElementById("experience").value,
        location: document.getElementById("location").value,
        donation: document.getElementById("donation").value
    };
}

// Replace the form with the thank-you message
function showThankYou() {
    form.innerHTML = `
        <h2>Application Submitted Successfully!</h2>
        <p>Thank you for applying to adopt a pet. Our team will review your application and contact you soon.</p>
        <a href="/" class="return-home-button">Return to Home</a>`;
}

// Handle form submission: send it to the server, and only thank the user once the server accepts it
form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitError.textContent = "";
    submitBtn.disabled = true;     // prevent double submissions while waiting

    fetch("/submitapplication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildApplication())
    })
        .then(response => {
            if (!response.ok) throw new Error(`Server responded with ${response.status}`);
            return response.json();
        })
        .then(() => showThankYou())
        .catch(() => {
            submitError.textContent = "Sorry, your application could not be submitted. Please try again.";
            updateSubmitState();
        });
});
