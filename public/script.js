
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

const resultsContainer = document.getElementById("results-container");
const searchInfo = document.getElementById("search-info");
const resultCount = document.getElementById("result-count");



// Afficher les résultats
function displayResults(results) {
    resultsContainer.replaceChildren();

    searchInfo.hidden = false;
    resultCount.textContent = `${results.length} résultat(s)`;

    if (results.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-results";
        message.textContent = "Aucun résultat trouvé pour votre recherche.";

        resultsContainer.appendChild(message);
        return;
    }

    results.forEach(result => {
        const article = document.createElement("article");
        article.className = "result";

        const url = document.createElement("p");
        url.className = "result-url";
        url.textContent = result.url;

        const title = document.createElement("a");
        title.className = "result-title";
        title.textContent = result.title;

        // Autoriser uniquement les liens HTTP et HTTPS
        try {
            const parsedUrl = new URL(result.url);

            if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
                title.href = parsedUrl.href;
                title.target = "_blank";
                title.rel = "noopener noreferrer";
            }
        } catch {
            title.removeAttribute("href");
        }

        const description = document.createElement("p");
        description.className = "result-description";
        description.textContent = result.subtitle
            ? `${result.subtitle} — ${result.content || ""}`
            : result.content || "";

        article.append(url, title, description);
        resultsContainer.appendChild(article);
    });
}

// Recherche
searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();

    if (!query) return;

    const pendingResults = await fetch("/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query, mode: currentMode })
    });

    if (!pendingResults.ok) 
        return;

    const data = await pendingResults.json();
    displayResults(data.results);
});



const modeButtons = document.querySelectorAll(".mode-btn");

let currentMode = "standard";

// Sélection du mode
modeButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentMode = button.dataset.mode;

        modeButtons.forEach(btn => {
            const selected = btn === button;

            btn.classList.toggle("active", selected);
            btn.setAttribute("aria-pressed", selected);
        });

        console.log("Mode sélectionné :", currentMode);
    });
});
