// Fills the pet info from the query string and handles form submission
const q = new URLSearchParams(window.location.search);
const adoptionFee = Number(q.get("adoptionFee"));
const processingFee = Number(q.get("processingFee"));

document.getElementById("petInfo").innerHTML = `
    <h1>Application for ${q.get("name")}</h1>
    <p>${q.get("breed")} (${q.get("type")})</p>
    <p>Adoption Fee: $${adoptionFee}</p>
    <p>Processing Fee: $${processingFee}</p>
    <p><strong>Total: $${adoptionFee + processingFee}</strong></p>`;

const form = document.getElementById("applyForm");
const careBox = document.getElementById("careAgg");
const guarBox = document.getElementById("guarAgg");
const submitBtn = document.getElementById("submitBtn");

// Submit is only enabled when both checkboxes are ticked
function updateSubmit() {
    submitBtn.disabled = !(careBox.checked && guarBox.checked);
}
careBox.addEventListener("change", updateSubmit);
guarBox.addEventListener("change", updateSubmit);

submitBtn.addEventListener("click", () => {
    if (!form.reportValidity()) return; // check required fields first
    const thanks = document.getElementById("thanks");
    thanks.className = "card";
    thanks.innerHTML = `<h1>Application Submitted!</h1>
        <p>Thank you for applying to adopt ${q.get("name")}. Your application will be
        reviewed and we will contact you soon.</p>
        <button type="button" id="homeBtn" class="primary">Return to Home</button>`;
    thanks.hidden = false;
    form.remove();
    document.getElementById("homeBtn").addEventListener("click", () => {
        window.location.href = "index.html";
    });
});
