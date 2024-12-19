// References to DOM elements
const trendingSection = document.getElementById("trendingSection");
const searchFormSec = document.getElementById("searchFormSec");
const searchResultsSection = document.getElementById("searchResultsSection");
const searchResultsContainer = document.getElementById("searchResults");
const backToTopButton = document.getElementById("backToTop");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

let currentPage = 1; // Track the current page for pagination
let isFetching = false; // Prevent multiple fetch calls

// Function to fetch search results from Jikan API
async function fetchSearchResults(query, page) {
    const apiUrl = `https://api.jikan.moe/v4/anime?q=${query}&page=${page}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data.data);
        displaySearchResults(data.data);
    } catch (error) {
        console.error("Error fetching search results:", error);
    }
}

// Function to display search results
function displaySearchResults(animeList) {
    animeList.forEach(anime => {
        const animeCard = `
            <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all">
                 <a href="anime-details.html?id=${anime.mal_id}"><img src="${anime.images.jpg.image_url}" alt="${anime.title_english}" class="w-full h-64 object-cover rounded-md" loading="lazy">
                <h3 class="mt-2 font-semibold text-lg">${anime.title_english}</h3>
                <p class="text-sm text-gray-600">${anime.synopsis ? anime.synopsis.substring(0, 100) + "..." : "No synopsis available."}</p></a>
            </div>
        `;
        searchResultsContainer.innerHTML += animeCard;
    });
}

// Handle search form submission
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();

    if (query) {
        // Hide trending section and show search results
        trendingSection.classList.add("hidden");
        searchFormSec.classList.remove("py-20");
        searchFormSec.classList.add("py-3");
        searchResultsSection.classList.remove("hidden");

        // Reset search results and fetch new ones
        searchResultsContainer.innerHTML = "";
        currentPage = 1;
        fetchSearchResults(query, currentPage);
    }
});
// References to DOM elements
const trendingAnimeContainer = document.getElementById("trendingAnime");

// Fetch trending anime from Jikan API
async function fetchTrendingAnime() {
    const apiUrl = "https://api.jikan.moe/v4/top/anime";
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data);
        displayTrendingAnime(data.data);
    } catch (error) {
        console.error("Error fetching trending anime:", error);
    }
}

// Display trending anime dynamically
function displayTrendingAnime(animeList) {
    trendingAnimeContainer.innerHTML = ""; // Clear any existing content
    animeList.slice(0, 25).forEach(anime => {
        const animeCard = `
  <div class="flex-shrink-0 w-64 p-0 rounded-lg transition-all">
                <a href="anime-details.html?id=${anime.mal_id}">
                    <img src="${anime.images.jpg.image_url}" alt="${anime.title_english}" class="w-full h-64 object-cover rounded-md" loading="lazy">
                </a>
            </div>
        `;
        trendingAnimeContainer.innerHTML += animeCard;
    });
}

// Fetch trending anime on page load
fetchTrendingAnime();
// Infinite Scroll for Search Results
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && !isFetching) {
        isFetching = true;
        currentPage++;
        fetchSearchResults(searchInput.value.trim(), currentPage).then(() => {
            isFetching = false;
        });
    }
});

// Back to Top Button Visibility
window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        backToTopButton.classList.remove("hidden");
    } else {
        backToTopButton.classList.add("hidden");
    }
});

// Scroll to Top when Button is Clicked
backToTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Reset to Trending Section on Page Load
window.addEventListener("load", () => {
    if (!searchInput.value.trim()) {
        searchResultsSection.classList.add("hidden");
        trendingSection.classList.remove("hidden");
    }
});