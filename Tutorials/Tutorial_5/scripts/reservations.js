
const restLocation = document.getElementById('location');
const date = document.getElementById('date');
const time = document.getElementById('time');
const guests = document.getElementById('guests');
const submit = document.querySelector('input[type="submit"]');


function updateState() {
    const selected = (restLocation.value !== "");

    date.disabled = !selected;
    time.disabled = !selected;
    guests.disabled = !selected;
    submit.disabled = !selected;
}

restLocation.addEventListener('change', updateState);
updateState();


// Prevent past dates
date.addEventListener('input', () => {
    const today = new Date().toISOString().split("T")[0];
    if (date.value < today)
        date.setCustomValidity("Date cannot be in the past");
    else
        date.setCustomValidity("");
    date.reportValidity();
});


// Reservations may only be made for a time between 11AM and 10PM
const earliest = 11 * 60;  // 11AM
const latest   = 22 * 60;  // 10PM

function timeToMinutes(t) {
    const [hours, minutes] = t.split(":").map(Number);
    return hours * 60 + minutes;
}

time.addEventListener('input', () => {
    if (!time.value) return; // handle empty string
    
    const mins = timeToMinutes(time.value);

    if (mins < earliest || mins > latest) {
        time.setCustomValidity("Please select a valid time range");
        time.style.color = 'red';
    } else {
        time.setCustomValidity("");
        time.style.color = 'black';
    }
});

document.querySelector("form").addEventListener("submit", function(e){
    e.preventDefault(); 

    const data = Object.fromEntries(new FormData(this));
    console.log(data);
});
