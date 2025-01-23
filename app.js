const API_KEY = "12ad33f0"; 
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;
const form = document.getElementById("search-form"); //Formulaire contenant le champ de recherche.
const input = document.getElementById("search-input"); //Champ de saisie de recherche.
const moviesContainer = document.getElementById("movies-container"); //Conteneur dans lequel les résultats des films seront affichés.

// Événement lors du submit du formulaire
form.addEventListener("submit", async (e) => {
  e.preventDefault(); //e.preventDefault() : empêche la page de se recharger (comportement par défaut d’un formulaire HTML)
  const query = input.value.trim(); //On récupère et supprime les espaces de la saisie dans le champ de recherche.
  if (!query) return;

  // Efface les résultats précédents
  moviesContainer.innerHTML = "";

  // Récupération des films depuis l'API (fonctions ecrites en ligne 21 et 34)
  const movies = await fetchMovies(query); //On appelle la fonction fetchMovies pour récupérer les films correspondant à la recherche.
  displayMovies(movies); //Les films récupérés sont passés à la fonction displayMovies pour être affichés
});

// Fonction pour récupérer les films
async function fetchMovies(query) { // interroge l'API OMDB avec le paramètre de recherche s
  try {
    const response = await fetch(`${API_URL}&s=${query}`);
    const data = await response.json(); //transforme la réponse en JSON
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

  movies.forEach((movie) => { //parcourt liste films. Pour chaque film, on crée un élément div contenant les classes CSS de mise en page
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
    moviesContainer.appendChild(movieCard); //On ajoute chaque carte au conteneur principal
  });

 
}



