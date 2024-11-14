const API_KEY = '5c4807c9b47a393f6ad4d51297276142';
const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

const searchInput = document.querySelector('.search input');
const searchButton = document.querySelector('.search button');
const moviesGrid = document.getElementById('movies-grid');
const watchlistGrid = document.getElementById('watchlist-grid');
async function fetchMovies(query) {
    try {
        const response = await fetch(API_URL + query);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}
function displayMovies(movies) {
    moviesGrid.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('card');
        movieCard.dataset.id = movie.id;

        const movieImage = movie.poster_path
            ? IMAGE_BASE_URL + movie.poster_path
            : 'img/no-image.png';

        movieCard.innerHTML = `
            <div class="img">
                <img src="${movieImage}" alt="${movie.title}">
            </div>
            <div class="info">
                <h2>${movie.title}</h2>
                <div class="single-info">
                    <span>Rate:</span>
                    <span>${movie.vote_average} / 10</span>
                </div>
                <div class="single-info">
                    <span>Release Date:</span>
                    <span>${movie.release_date || 'N/A'}</span>
                </div>
                <button class="watchlist-btn" onclick="addToWatchlist(${movie.id})">
                    Add to Watchlist
                </button>
            </div>
        `;

        movieCard.addEventListener('click', () => showMovieDetails(movie.id));
        moviesGrid.appendChild(movieCard);
    });
}
function addToWatchlist(movieId) {
    if (!watchlist.includes(movieId)) {
        watchlist.push(movieId);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        displayWatchlist();
    }
}
function removeFromWatchlist(movieId) {
    watchlist = watchlist.filter(id => id !== movieId);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    displayWatchlist();
}
async function displayWatchlist() {
    watchlistGrid.innerHTML = '';
    for (let movieId of watchlist) {
        const movie = await fetchMovieDetails(movieId);
        const movieCard = document.createElement('div');
        movieCard.classList.add('card');

        const movieImage = movie.poster_path
            ? IMAGE_BASE_URL + movie.poster_path
            : 'img/no-image.png'; 

        movieCard.innerHTML = `
            <div class="img">
                <img src="${movieImage}" alt="${movie.title}">
            </div>
            <div class="info">
                <h2>${movie.title}</h2>
                <div class="single-info">
                    <span>Rate:</span>
                    <span>${movie.vote_average} / 10</span>
                </div>
                <div class="single-info">
                    <span>Release Date:</span>
                    <span>${movie.release_date || 'N/A'}</span>
                </div>
                <button class="watchlist-btn" onclick="removeFromWatchlist(${movie.id})">
                    Remove from Watchlist
                </button>
            </div>
        `;

        watchlistGrid.appendChild(movieCard);
    }
}
async function fetchMovieDetails(movieId) {
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
    );
    return await response.json();
}
async function showMovieDetails(movieId) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const movie = await fetchMovieDetails(movieId);
    const modal = document.getElementById('movieModal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalRate = document.getElementById('modal-rate');
    const modalReleaseDate = document.getElementById('modal-release-date');

    modalTitle.textContent = movie.title;
    modalImage.src = movie.poster_path
        ? IMAGE_BASE_URL + movie.poster_path
        : 'img/no-image.png';
    modalRate.textContent = `${movie.vote_average} / 10`;
    modalReleaseDate.textContent = movie.release_date || 'N/A';

    modal.classList.add('show-popup');
    
}
const closeModalButton = document.getElementById('closeModal');
closeModalButton.addEventListener('click', () => {
    const modal = document.getElementById('movieModal');
    modal.classList.remove('show-popup');
});
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchMovies(query);
    }
});
document.addEventListener('DOMContentLoaded', () => {
    displayWatchlist();
});
