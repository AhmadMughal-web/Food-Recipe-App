const searchBox = document.querySelector(".seachBox");
const searchBtn = document.querySelector("form button");
const recipeContainer = document.querySelector(".recipe-container");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".recipe-modal");
const loader = document.querySelector(".loader");

searchBtn.addEventListener("click", () => {
    const query = searchBox.value.trim();
    if (!query) return;

    loader.style.display = "flex";
    fetchRecipes(query);
});

async function fetchRecipes(query) {
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const data = await res.json();

    loader.style.display = "none";
    recipeContainer.innerHTML = "";

    if (!data.meals) {
        recipeContainer.innerHTML = "<h3>No recipes found</h3>";
        return;
    }

    data.meals.forEach(meal => {
        const card = document.createElement("div");
        card.className = "recipe-card";
        card.innerHTML = `
            <img src="${meal.strMealThumb}">
            <h4>${meal.strMeal}</h4>
        `;

        card.addEventListener("click", () => openModal(meal));
        recipeContainer.appendChild(card);
    });
}

function openModal(meal) {
    overlay.style.display = "flex";

    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const mea = meal[`strMeasure${i}`];
        if (ing) ingredients += `<li>${mea} ${ing}</li>`;
    }

    modal.innerHTML = `
        <img src="${meal.strMealThumb}">
        <h2>${meal.strMeal}</h2>

        <h3>Ingredients</h3>
        <ul>${ingredients}</ul>

        <h3>Instructions</h3>
        <p>${meal.strInstructions}</p>

        <button class="close-btn">&times</button>
    `;

    modal.querySelector(".close-btn").onclick = closeModal;
}

function closeModal() {
    overlay.style.display = "none";
}
