document.addEventListener("DOMContentLoaded", function () {
  fetchTeamData();
  fetchArticlesData();
  fetchSuccessStoriesData();
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
              displayErrorMessage('We couldn\'t load the team information at the moment. Please refresh the page or try again later.', 'team');
              resolve(null);
            });
        }, 3000);
      });
    })
    .catch((error) => {
      console.warn("Could not load config.json, using default API URL:", error);
      displayErrorMessage('We couldn\'t load the configuration at the moment. Please refresh the page or try again later.', 'team');
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
              displayErrorMessage('We couldn\'t load the articles at the moment. Please refresh the page or try again later.', 'articles');
              resolve(null);
            });
        }, 3000);
      });
    })
    .catch((error) => {
      console.warn("Could not load config.json, using default API URL:", error);
      displayErrorMessage('We couldn\'t load the configuration at the moment. Please refresh the page or try again later.', 'articles');
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
      <a href="./pages/article.html?slug=${article.slug}" class="btn btn--primary article-card__read-more">
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
  } else if (section === "success") {
    container = document.querySelector(".victories__slider");
    message = "Loading success stories...";
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

function displayErrorMessage(message, section) {
  let container;

  if (section === 'team') {
    container = document.querySelector(".team__grid");
  } else if (section === 'articles') {
    container = document.querySelector(".articles__grid");
  } else if (section === 'success') {
    container = document.querySelector(".victories__slider");
  } else {
    container = document.querySelector(".team__grid");
  }

  if (container) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;

    container.innerHTML = "";
    container.appendChild(errorDiv);
  }
}

function fetchSuccessStoriesData() {
  showLoadingAnimation("success");

  fetch('config.json')
    .then(response => response.json())
    .then(config => {
      const apiUrl = `${config.apiBaseUrl}/api/success`;
      return new Promise(resolve => {
        setTimeout(() => {
          fetch(apiUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then(successStoriesData => {
              displaySuccessStoriesData(successStoriesData);
              resolve(successStoriesData);
            })
            .catch(error => {
              console.error("Error fetching success stories data:", error);
              displayErrorMessage('We couldn\'t load the success stories at the moment. Please refresh the page or try again later.', 'success');
              resolve(null);
            });
        }, 3000);
      });
    })
    .catch(error => {
      console.warn('Could not load config.json, using default API URL:', error);
      displayErrorMessage('We couldn\'t load the configuration at the moment. Please refresh the page or try again later.', 'success');
    });
}

function useMockSuccessStoriesData() {
  const mockSuccessStoriesData = [
    {
      id: "1",
      title: "Asylum Granted",
      clientName: "A.M.",
      caseType: "Political Persecution Asylum – Full Approval",
      story: "Successfully obtained asylum for a client facing political persecution in their home country. After thorough preparation of the case and evidence of past persecution, the client was granted asylum, allowing them to remain in the U.S. and eventually apply for permanent residency.",
      date: "2025-09-15"
    },
    {
      id: "2",
      title: "Removal Proceedings Terminated",
      clientName: "J.R.",
      caseType: "Cancellation of Removal – Approved",
      story: "Our client was in removal proceedings but qualified for cancellation of removal. We demonstrated that the client had been physically present in the U.S. for more than 10 years, had good moral character, and that their removal would cause exceptional and extremely unusual hardship to their U.S. citizen family members.",
      date: "2025-07-22"
    },
    {
      id: "3",
      title: "Green Card Approved",
      clientName: "M.S.",
      caseType: "Marriage-Based Adjustment of Status – Successful",
      story: "Successfully guided a client through the marriage-based adjustment of status process. The case involved an I-130 petition and I-485 application for adjustment of status. Despite potential issues with the client's previous immigration history, we were able to demonstrate eligibility and obtain approval for the green card.",
      date: "2025-11-10"
    }
  ];

  displaySuccessStoriesData(mockSuccessStoriesData);
}

function displaySuccessStoriesData(successStories) {
  const victoriesSlider = document.querySelector(".victories__slider");

  if (!victoriesSlider) {
    console.error("Victories slider container not found");
    return;
  }

  victoriesSlider.innerHTML = "";

  successStories.forEach(story => {
    const victoryCard = createVictoryCard(story);
    victoriesSlider.appendChild(victoryCard);
  });
}

function createVictoryCard(story) {
  const victoryCard = document.createElement("div");
  victoryCard.className = "victory-card";

  const date = new Date(story.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  victoryCard.innerHTML = `
    <div class="victory-card__content">
      <div class="victory-card__left">
        <div class="victory-card__result">${story.title}</div>
        <h3 class="victory-card__title">${story.caseType}</h3>
        <p class="victory-card__client">Client: ${story.clientName}</p>
        <time datetime="${story.date}" class="victory-card__date">${formattedDate}</time>
        <div class="victory-card__story" style="display: none;">${story.story}</div>
        <button class="victory-card__toggle-btn">+</button>
      </div>
      <div class="victory-card__right">
      </div>
    </div>
  `;

  const toggleBtn = victoryCard.querySelector('.victory-card__toggle-btn');
  const storyEl = victoryCard.querySelector('.victory-card__story');

  toggleBtn.addEventListener('click', function() {
    if (storyEl.style.display === 'none') {
      storyEl.style.display = 'block';
      toggleBtn.textContent = '-';
    } else {
      storyEl.style.display = 'none';
      toggleBtn.textContent = '+';
    }
  });

  return victoryCard;
}
