document.getElementById('search-btn').addEventListener('click', getMealList);


function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    const apiKey = '69a0e18df8374224a52ef915ee239077';
    let apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${searchInputTxt}&number=6&apiKey=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            let html = '';
            if (data.results && data.results.length > 0) {
                data.results.forEach(meal => {
                    html += `
                        <div class="meal-item">
                            <div class="meal-img">
                                <img src="${meal.image}" alt="${meal.title}">
                            </div>
                            <div class="meal-name">
                                <h3>${meal.title}</h3>
                                <a href="#" class="recipe-btn" onclick="getMealRecipe(${meal.id})">Get Recipe :)</a>
                                <button class="fav-btn" onclick="toggleFavorite(${meal.id}, '${meal.title}', '${meal.image}')">
                                    <i class="fas fa-heart"></i> Add to Favourites
                                </button>
                            </div>
                        </div>
                    `;
                });
            } else {
                html = '<p>No results found. Try again!</p>';
            }
            document.getElementById('meal').innerHTML = html;
        })
        .catch(error => console.error('Error fetching the data:', error));
}
function toggleFavorite(id, title, image) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const mealExists = favorites.find(meal => meal.id === id);

    if (mealExists) {
        favorites = favorites.filter(meal => meal.id !== id);
        alert(`${title} has been removed from your favorites.`);
    } else {
        favorites.push({ id, title, image });
        alert(`${title} has been added to your favorites.`);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showFavorites();
}


function getMealRecipe(id) {
    const apiKey = '69a0e18df8374224a52ef915ee239077';
    let apiUrl = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(meal => {
            let html = `
                <h2 class="recipe-title">${meal.title}</h2>
                <p class="recipe-category">${meal.dishTypes.join(', ')}</p>
                <div class="recipe-instruct">
                    <h3>Instructions:</h3>
                    <p>${meal.instructions || "No instructions available."}</p>
                </div>
                <div class="recipe-meal-img">
                    <img src="${meal.image}" alt="${meal.title}">
                </div>
                <div class="recipe-link">
                    <a href="${meal.sourceUrl}" target="_blank">Watch Tutorial</a>
                </div>
            `;
            document.querySelector('.meal-details-content').innerHTML = html;
            document.querySelector('.meal-details').classList.add('showrRecipe');
        })
        .catch(error => console.error('Error fetching the recipe:', error));
}
document.getElementById('recipe-close-btn').addEventListener('click', function() {
    document.querySelector('.meal-details').classList.remove('showrRecipe');
});


function showFavorites() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let favHtml = '';
    if (favorites.length > 0) {
        favorites.forEach(meal => {
            favHtml += `
                <div class="meal-item">
                    <div class="meal-img">
                        <img src="${meal.image}" alt="${meal.title}">
                    </div>
                    <div class="meal-name">
                        <h3>${meal.title}</h3>
                        <button class="fav-btn" onclick="toggleFavorite(${meal.id}, '${meal.title}', '${meal.image}')">
                            <i class="fas fa-heart-broken"></i> Remove from Favourites
                        </button>
                    </div>
                </div>
            `;
        });
    } else {
        favHtml = '<p>No favorite meals yet. Add some!</p>';
    }
    document.getElementById('favorite-meals').innerHTML = favHtml;
}
window.onload = showFavorites;
