// Fills the pet info from the query string and submits the application to the server
const q = new URLSearchParams(window.location.search);
const petId = q.get("petId");
const shelterId = q.get("shelterId");
const petName = q.get("name");
const adoptionFee = Number(q.get("adoptionFee"));
const processingFee = Number(q.get("processingFee"));

// Show the pet's info at the top of the form (textContent so URL text is never treated as HTML)
const petInfo = document.getElementById("petInfo");
function addLine(tag, text) {
    const el = document.createElement(tag);
    el.textContent = text;
    petInfo.appendChild(el);
    return el;
}
addLine("h1", `Application for ${petName}`);
addLine("p", `${q.get("breed")} (${q.get("type")})`);
addLine("p", `Adoption Fee: $${adoptionFee}`);
addLine("p", `Processing Fee: $${processingFee}`);
addLine("p", `Total: $${adoptionFee + processingFee}`).style.fontWeight = "bold";

const form = document.getElementById("applyForm");
const careBox = document.getElementById("careAgg");
const guarBox = document.getElementById("guarAgg");
const submitBtn = document.getElementById("submitBtn");
const submitError = document.getElementById("submitError");

// Submit is only enabled when both checkboxes are ticked (and we know which pet this is for)
function updateSubmit() {
    submitBtn.disabled = !(petId && shelterId && careBox.checked && guarBox.checked);
}
careBox.addEventListener("change", updateSubmit);
guarBox.addEventListener("change", updateSubmit);
updateSubmit();

// Gather everything entered in the form into one object to send to the server
function buildApplication() {
    return {
        petId: petId,
        shelterId: shelterId,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        residents: document.getElementById("resNum").value,
        currentPets: document.getElementById("ownedPets").value,
        experience: document.getElementById("pastExp").value,
        location: document.getElementById("liveArea").value,
        donation: document.getElementById("support").value
    };
}

// Replace the form with the thank-you message
function showThankYou() {
    const thanks = document.getElementById("thanks");
    thanks.className = "card";
    thanks.innerHTML = `<h1>Application Submitted!</h1>
        <p></p>
        <button type="button" id="homeBtn" class="primary">Return to Home</button>`;
    thanks.querySelector("p").textContent =
        `Thank you for applying to adopt ${petName}. Your application will be reviewed and we will contact you soon.`;
    thanks.hidden = false;
    form.remove();
    document.getElementById("homeBtn").addEventListener("click", () => {
        window.location.href = "/";
    });
}

// POST the application to the server; only thank the user once the server has accepted it
submitBtn.addEventListener("click", () => {
    if (!form.reportValidity()) return; // check required fields first
    submitError.textContent = "";
    submitBtn.disabled = true;          // prevent double submissions while waiting

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
            updateSubmit();
        });
});
