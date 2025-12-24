document.addEventListener("DOMContentLoaded", function () {
  fetchTeamData();
  fetchArticlesData();
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

function fetchArticlesData() {
  showLoadingAnimation("articles");

  fetch("config.json")
    .then((response) => response.json())
    .then((config) => {
      const apiUrl = `${config.apiBaseUrl}/api/articles`;
      return new Promise((resolve) => {
        setTimeout(() => {
          fetch(apiUrl)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then((articlesData) => {
              displayArticlesData(articlesData);
              resolve(articlesData);
            })
            .catch((error) => {
              console.error("Error fetching articles data:", error);
              useMockArticlesData();
              resolve(null);
            });
        }, 5000);
      });
    })
    .catch((error) => {
      console.warn("Could not load config.json, using default API URL:", error);
      useMockArticlesData();
    });
}

function useMockArticlesData() {
  const mockArticlesData = [
    {
      id: "1",
      title: "Understanding Your Rights During Immigration Proceedings",
      slug: "understanding-rights-immigration-proceedings",
      summary:
        "Learn about the fundamental rights every individual has during immigration proceedings in the United States, including the right to legal representation and due process.",
      content:
        "Understanding your rights during immigration proceedings is crucial for navigating the complex legal system. Every individual has the right to legal representation, to remain silent, and to due process. This article outlines these rights and how to exercise them effectively.",
      publishedAt: "2025-09-10T00:00:00",
    },
    {
      id: "2",
      title: "Pathways to Legal Status for Undocumented Immigrants",
      slug: "pathways-legal-status-undocumented",
      summary:
        "Explore various legal pathways that may be available to undocumented immigrants seeking to obtain legal status in the United States.",
      content:
        "There are several pathways that undocumented immigrants may explore to obtain legal status in the United States, including asylum, cancellation of removal, U visas for crime victims, and other forms of relief. This article provides an overview of these options.",
      publishedAt: "2025-08-15T00:00:00",
    },
    {
      id: "3",
      title: "Preparing for Your Immigration Court Hearing",
      slug: "preparing-immigration-court-hearing",
      summary:
        "Tips and guidelines for preparing effectively for your immigration court hearing to ensure the best possible outcome.",
      content:
        "Proper preparation for your immigration court hearing can significantly impact the outcome of your case. This includes gathering all necessary documents, preparing your testimony, and working closely with your attorney to build a strong defense.",
      publishedAt: "2025-07-20T00:00:00",
    },
  ];

  displayArticlesData(mockArticlesData);
}

function displayArticlesData(articles) {
  const articlesGrid = document.querySelector(".articles__grid");

  if (!articlesGrid) {
    console.error("Articles grid container not found");
    return;
  }

  articlesGrid.innerHTML = "";

  articles.forEach((article) => {
    const articleCard = createArticleCard(article);
    articlesGrid.appendChild(articleCard);
  });
}

function createArticleCard(article) {
  const articleCard = document.createElement("article");
  articleCard.className = "article-card";

  const date = new Date(article.publishedAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const dateISO = date.toISOString().split("T")[0];

  articleCard.innerHTML = `
    <div class="article-card__content">
      <time datetime="${dateISO}" class="article-card__date">${formattedDate}</time>
      <h3 class="article-card__title">${article.title}</h3>
      <p class="article-card__summary">${article.summary}</p>
      <a href="#" class="btn btn--primary article-card__read-more">
        Read more →
      </a>
    </div>
  `;

  return articleCard;
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
