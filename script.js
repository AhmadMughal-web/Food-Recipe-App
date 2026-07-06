const backBtnWrapper = document.getElementById("backBtnWrapper");
const backHomeBtn = document.getElementById("backHomeBtn");
const searchBox = document.getElementById("searchBox");
const searchBtn = document.getElementById("searchBtn");
const recipeContainer = document.getElementById("recipeContainer");
const overlay = document.getElementById("overlay");
const modal = document.getElementById("recipeModal");
const loader = document.getElementById("loader");
const heroSection = document.getElementById("heroSection");
const mainContent = document.getElementById("mainContent");

// Search on button click
searchBtn.addEventListener("click", triggerSearch);

// Search on Enter key
searchBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") triggerSearch();
});

// Back home button
backHomeBtn.addEventListener("click", () => {
    heroSection.style.display = "flex";
    mainContent.style.display = "none";
    recipeContainer.innerHTML = "";
    backBtnWrapper.style.display = "none";
    searchBox.value = "";
});

// Close modal on overlay click (outside modal)
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
});

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});

function quickSearch(term) {
    searchBox.value = term;
    triggerSearch();
}

function triggerSearch() {
    const query = searchBox.value.trim();
    if (!query) {
        searchBox.focus();
        return;
    }
    showLoader();
    fetchRecipes(query);
}

function showLoader() {
    loader.style.display = "flex";
}

function hideLoader() {
    loader.style.display = "none";
}

async function fetchRecipes(query) {
    try {
        const res = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`
        );
        const data = await res.json();

        hideLoader();
        recipeContainer.innerHTML = "";

        // Hero hide, main show — dono lines hamesha yahan chalengi
        heroSection.style.display = "none";
        mainContent.style.display = "block";

        if (!data.meals) {
            recipeContainer.innerHTML = `
                <div class="no-results">
                    <i class="fa-solid fa-bowl-food"></i>
                    <h3>No recipes found for "${query}"</h3>
                    <p>Try searching for something else like "pasta", "chicken", or "cake"</p>
                </div>
            `;
            return;
        }

        backBtnWrapper.style.display = "flex";

        data.meals.forEach(meal => {
            const card = document.createElement("div");
            card.className = "recipe-card";
            card.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy">
                <div class="recipe-card-body">
                    <h4>${meal.strMeal}</h4>
                    <span class="recipe-card-tag">${meal.strArea || meal.strCategory || "Recipe"}</span>
                </div>
            `;
            card.addEventListener("click", () => openModal(meal));
            recipeContainer.appendChild(card);
        });

    } catch (err) {
        hideLoader();
        heroSection.style.display = "none";
        mainContent.style.display = "block";
        recipeContainer.innerHTML = `
            <div class="no-results">
                <i class="fa-solid fa-wifi"></i>
                <h3>Connection error</h3>
                <p>Please check your internet connection and try again.</p>
            </div>
        `;
    }
}

function openModal(meal) {
    overlay.style.display = "flex";

    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const mea = meal[`strMeasure${i}`];
        if (ing && ing.trim()) {
            ingredients += `<div class="ingredient-pill">${mea ? mea.trim() + " " : ""}${ing.trim()}</div>`;
        }
    }

    const youtubeLink = meal.strYoutube
        ? `<a href="${meal.strYoutube}" target="_blank" class="youtube-btn"><i class="fa-brands fa-youtube"></i> Watch on YouTube</a>`
        : "";

    modal.innerHTML = `
        <div class="modal-header">
            <button class="close-btn" id="closeBtn">&times;</button>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h2>${meal.strMeal}</h2>
            <div class="modal-meta">
                ${meal.strCategory ? `<span class="modal-badge"><i class="fa-solid fa-tag"></i> ${meal.strCategory}</span>` : ""}
                ${meal.strArea ? `<span class="modal-badge"><i class="fa-solid fa-earth-americas"></i> ${meal.strArea}</span>` : ""}
            </div>
        </div>

        <div class="modal-body">
            <h3><i class="fa-solid fa-list"></i> Ingredients</h3>
            <div class="ingredients-grid">${ingredients}</div>

            <h3><i class="fa-solid fa-utensils"></i> Instructions</h3>
            <p class="instructions-text">${meal.strInstructions}</p>
        </div>

        ${youtubeLink ? `<div class="modal-footer">${youtubeLink}</div>` : ""}
    `;

    document.getElementById("closeBtn").addEventListener("click", closeModal);
}

function closeModal() {
    overlay.style.display = "none";
}