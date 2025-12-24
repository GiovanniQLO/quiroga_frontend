document.addEventListener("DOMContentLoaded", function () {
  fetchTeamData();
});

function fetchTeamData() {
  showLoadingAnimation("team");

  fetch("config.json")
    .then((response) => response.json())
    .then((config) => {
    const apiUrl = `${config.apiBaseUrl}/api/team`;
      return new Promise((resolve) => {
        setTimeout(() => {
          fetch(apiUrl)
            .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
              return response.json();
            })
            .then((teamData) => {
    displayTeamData(teamData);
              resolve(teamData);
            })
            .catch((error) => {
    console.error("Error fetching team data:", error);
    useMockData();
              resolve(null);
            });
        }, 5000);
      });
    })
    .catch((error) => {
      console.warn("Could not load config.json, using default API URL:", error);
      useMockData();
    });
}

function useMockData() {
  const mockTeamData = [
    {
      id: "1",
      name: "Elena Ramirez",
      role: "Co-Founder & Senior Attorney",
      bio: "Immigration Lawyer",
      photoUrl: "./assets/lawyer-f.svg",
    },
    {
      id: "2",
      name: "Marcus Nguyen",
      role: "Co-Founder & Managing Partner",
      bio: "Immigration Lawyer",
      photoUrl: "./assets/lawyer-m.svg",
    },
    {
      id: "3",
      name: "Sophia Patel",
      role: "Managing Partner",
      bio: "Immigration Lawyer",
      photoUrl: "./assets/lawyer-f.svg",
    },
  ];

  displayTeamData(mockTeamData);
}

function displayTeamData(teamMembers) {
  const teamGrid = document.querySelector(".team__grid");

  if (!teamGrid) {
    console.error("Team grid container not found");
    return;
  }

  teamGrid.innerHTML = "";

  teamMembers.forEach((member) => {
    const teamCard = createTeamCard(member);
    teamGrid.appendChild(teamCard);
  });
}

function createTeamCard(member) {
  const teamCard = document.createElement("div");
  teamCard.className = "team-card";

  teamCard.innerHTML = `
        <div
            class="team-card__image"
            style="background-image: url('${
              member.photoUrl || "./assets/lawyer-m.svg"
            }')"
        ></div>
        <h3 class="team-card__name">${member.name}</h3>
        <p class="team-card__position">${member.role}</p>
        <p class="team-card__specialty">${member.bio || ""}</p>
    `;

  return teamCard;
}

function showLoadingAnimation(section) {
  let container;
  let message;

  if (section === "team") {
    container = document.querySelector(".team__grid");
    message = "Loading team data...";
  } else if (section === "articles") {
    container = document.querySelector(".articles__grid");
    message = "Loading articles data...";
  } else {
    container = document.querySelector(".team__grid");
    message = "Loading team data...";
  }

  if (container) {
    container.innerHTML = `
      <div class="loading-container">
        <div class="spinner"></div>
        <p>${message}</p>
      </div>
    `;
  }
}

function displayErrorMessage(message) {
  const teamSection = document.querySelector("#team");
  if (teamSection) {
    const errorDiv = document.createElement("div");
    errorDiv.style.color = "red";
    errorDiv.style.textAlign = "center";
    errorDiv.style.padding = "20px";
    errorDiv.textContent = message;

    const teamGrid = teamSection.querySelector(".team__grid");
    if (teamGrid) {
      teamGrid.innerHTML = "";
      teamGrid.appendChild(errorDiv);
    }
  }
}
