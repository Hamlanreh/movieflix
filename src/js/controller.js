import * as model from './model';
import movieView from './views/movieView';
import favouriteView from './views/favouriteView';
import searchView from './views/searchView';
import modalView from './views/modalView';

const controlPopularMovies = async function () {
  try {
    // Render the spinner to load data
    movieView.renderMoviesSpinner();
    // Clear any existing movies or search
    model.clearSearch();
    // Get popular movies
    const popularMovies = await model.getPopularMovies();
    // Change to popular movies heading
    movieView.changeMovieHeading('Popular movies');
    // Render popular movies
    movieView.renderMovies(popularMovies);
  } catch (err) {
    modalView.renderError(`${err}`);
  }
};

const controlSearchMovies = async function (e) {
  try {
    e.preventDefault();
    // Render the spinner to load data
    movieView.renderMoviesSpinner();
    // Clear any existing movies or popular movies
    model.clearPopularMovies();
    // Get movies search query and/or query_year
    const { query, year } = searchView.getQuery();
    // Get the movies search result
    const movies = await model.searchMovie({ query, year });
    // Change to search movies heading
    movieView.changeMovieHeading(`Search => ${query} ${year}`);
    // Render movies search result
    movieView.renderMovies(movies);
  } catch (err) {
    modalView.renderError(`${err}`);
  }
};

const controlSelectMovie = async function (e) {
  try {
    e.preventDefault();
    // Check for selected movie
    const selectedMovie = e.target.closest('.card__link');
    if (!selectedMovie) return;
    // Hide the movies list display
    movieView.hideMovies();
    // Get the selected movie id
    const movieId = e.target.closest('.movie__item').dataset.id;
    // Get the selected movie
    const movie = await model.selectMovie(movieId);
    // Render the selected movie full information
    movieView.renderSelectedMovie(movie);
  } catch (err) {
    modalView.renderError(`${err}`);
  }
};

const controlCloseSelectedMovie = async function (e) {
  try {
    // Close the selected movie full information
    if (!e.target.classList.contains('movie__close')) return;
    movieView.closeSelectedMovie();
    // Render the movies list
    movieView.showMovies();
  } catch (err) {
    modalView.renderError(`${err}`);
  }
};

const controlPagination = async function (e) {
  try {
    // Get pagination btn
    const paginationBtn = e.target;
    let movies = [];
    // Get previous movies
    if (paginationBtn.classList.contains('pagination__prev')) {
      movies = await model.pagination('previous');
    }
    // Get next movies
    if (paginationBtn.classList.contains('pagination__next')) {
      movies = await model.pagination('next');
    }
    // Render the paginated movies
    movieView.renderMovies(movies);
  } catch (err) {
    modalView.renderError(`${err}`);
  }
};

const controlFavouriteMovie = async function (e) {
  try {
    // Check for selected favourite movie
    const favouriteIcon = e.target.closest('.card__icon > use');
    if (!favouriteIcon) return;
    // Get favourite movie
    const movie = favouriteIcon.closest('.movie__item');
    // Get favourite movie id
    const movieId = Number(movie.dataset.id);

    // Check to add or remove from favourite movies
    const movieList = document.querySelector('.movie__list');
    [...movieList.children].forEach(async movie => {
      if (Number(movie.dataset.id) === movieId) {
        movie.classList.toggle('favourite__item');

        let favouriteMovies;
        if (!movie.classList.contains('favourite__item')) {
          // Remove from favourite movies
          favouriteMovies = await model.removeFavouriteMovie(movieId);
        } else {
          // Add to favourite movies
          favouriteMovies = await model.addFavouriteMovie(movieId);
        }
        // Render favourite movies
        favouriteView.renderMovies(favouriteMovies);
      }
    });
  } catch (err) {
    modalView.renderError(`${err}`);
  }
};

const controlCloseModal = async function () {
  try {
    // Close the modal
    modalView.closeModal();
  } catch (error) {
    modalView.renderError(`${err}`);
  }
};

const init = (function () {
  movieView.addHandlerLoadPopularMovies(controlPopularMovies);
  movieView.addHandlerSelectMovies(controlSelectMovie);
  movieView.addHandlerCloseSelectedMovie(controlCloseSelectedMovie);
  movieView.addHandlerPagination(controlPagination);
  movieView.addHandlerFavouriteMovie(controlFavouriteMovie);
  ///////////////////////////////////////////////////////////////
  searchView.addHandlerSearchMovie(controlSearchMovies);
  ///////////////////////////////////////////////////////////////
  modalView.addHandlerCloseModal(controlCloseModal);
})();
