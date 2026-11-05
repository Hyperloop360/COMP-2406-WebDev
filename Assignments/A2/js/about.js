// Fills about.html from the aboutData object (aboutData.js)
document.getElementById("mission").textContent = aboutData.mission;
document.getElementById("teamDescription").textContent = aboutData.teamDescription;

const teamSection = document.getElementById("team");
aboutData.team.forEach(member => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${member.name}</h3>
        <p><strong>Role:</strong> ${member.role}</p>
        <p><strong>Experience:</strong> ${member.experience}</p>
        <p><strong>Qualifications:</strong> ${member.qualifications}</p>`;
    teamSection.appendChild(card);
});
