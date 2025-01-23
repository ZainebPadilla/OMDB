const API_KEY = "12ad33f0"; 
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const moviesContainer = document.getElementById("movies-container");

// Événement lors du submit du formulaire
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = input.value.trim();
  if (!query) return;

  // Efface les résultats précédents
  moviesContainer.innerHTML = "";

  // Récupération des films depuis l'API
  const movies = await fetchMovies(query);
  displayMovies(movies);
});

// Fonction pour récupérer les films
async function fetchMovies(query) {
  try {
    const response = await fetch(`${API_URL}&s=${query}`);
    const data = await response.json();
    return data.Search || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des films :", error);
    return [];
  }
}

// Fonction pour afficher les films
function displayMovies(movies) {
  if (movies.length === 0) {
    moviesContainer.innerHTML = "<p class='text-center'>Aucun film trouvé.</p>";
    return;
  }

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("col-md-4", "d-flex");

    movieCard.innerHTML = `
      <div class="card shadow-sm">
        <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300'}" class="card-img-top" alt="${movie.Title}">
        <div class="card-body">
          <h5 class="card-title">${movie.Title}</h5>
          <p class="card-text">Année : ${movie.Year}</p>
          <button class="btn btn-primary read-more-btn" data-id="${movie.imdbID}">Read More</button>
        </div>
      </div>
    `;
    moviesContainer.appendChild(movieCard);
  });

  // Ajouter les événements sur les boutons "Read More"
  document.querySelectorAll(".read-more-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const movieId = button.getAttribute("data-id");
      fetchMovieDetails(movieId);
    });
  });
}

// Fonction pour récupérer les détails d'un film
async function fetchMovieDetails(id) {
  try {
    const response = await fetch(`${API_URL}&i=${id}`);
    const movie = await response.json();
    showMovieModal(movie);
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du film :", error);
  }
}

// Fonction pour afficher la popup avec les détails du film
function showMovieModal(movie) {
  const modalHtml = `
    <div class="modal fade" id="movieModal" tabindex="-1" aria-labelledby="movieModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="movieModalLabel">${movie.Title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300'}" class="img-fluid mb-3" alt="${movie.Title}">
            <p><strong>Année :</strong> ${movie.Year}</p>
            <p><strong>Genre :</strong> ${movie.Genre}</p>
            <p><strong>Synopsis :</strong> ${movie.Plot}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Ajoute la modal au DOM
  const modalContainer = document.createElement("div");
  modalContainer.innerHTML = modalHtml;
  document.body.appendChild(modalContainer);

  // Affiche la modal
  const modal = new bootstrap.Modal(modalContainer.querySelector("#movieModal"));
  modal.show();

  // Nettoie le DOM après fermeture
  modalContainer.querySelector("#movieModal").addEventListener("hidden.bs.modal", () => {
    modalContainer.remove();
  });
}
