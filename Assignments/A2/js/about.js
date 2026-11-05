// Insert the mission statement text from the pre-loaded aboutData.js "mission" value
document.getElementById("mission-text").textContent = aboutData.mission;

// Insert the team description text from the "teamDescription" value
document.getElementById("team-description").textContent = aboutData.teamDescription;

// Go through the "team" members and create a div with the appropraiet info per team member
const grid = document.getElementById("team-grid");

aboutData.team.forEach(member => {
    const card = document.createElement("div");
    card.className = "team-card";

    card.innerHTML = `
        <h3>${member.name}</h3>
        <p><strong>Role:</strong> ${member.role}</p>
        <p><strong>Experience:</strong> ${member.experience}</p>
        <p><strong>Qualifications:</strong> ${member.qualifications}</p>
    `;

    grid.appendChild(card);
});
