import * as model from './model';
import movieView from './views/movieView';
import favouriteView from './views/favouriteView';
import searchView from './views/searchView';
import modalView from './views/modalView';

const controlPopularMovies = async function () {
  try {
    movieView.renderMoviesSpinner();
    model.clearSearch();

    const popularMovies = await model.getPopularMovies();
    movieView.changeMovieHeading('Popular movies');
    movieView.renderMovies(popularMovies);
  } catch (err) {
    modalView.renderMessage(`${err}`);
  }
};

const controlSearchMovies = async function (e) {
  try {
    e.preventDefault();
    movieView.renderMoviesSpinner();
    model.clearPopularMovies();

    const { query, year } = searchView.getQuery();
    const movies = await model.searchMovie({ query, year });
    movieView.changeMovieHeading(`Search => ${query} ${year}`);
    movieView.renderMovies(movies);
    console.log();
  } catch (err) {
    modalView.renderMessage(`${err}`);
  }
};

const controlSelectMovie = async function (e) {
  try {
    e.preventDefault();
    const selectedMovie = e.target.closest('.card__link');
    if (!selectedMovie) return;
    movieView.hideMovies();
    const movieId = e.target.closest('.movie__item').dataset.id;
    const movie = await model.selectMovie(movieId);
    movieView.renderSelectedMovie(movie);
  } catch (err) {
    modalView.renderMessage(`${err}`);
  }
};

const controlCloseSelectedMovie = async function (e) {
  try {
    if (!e.target.classList.contains('movie__close')) return;
    movieView.closeSelectedMovie();
    movieView.showMovies();
  } catch (err) {
    modalView.renderMessage(`${err}`);
  }
};

const controlPagination = async function (e) {
  try {
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
    modalView.renderMessage(`${err}`);
  }
};

const controlFavouriteMovie = async function (e) {
  try {
    const favouriteIcon = e.target.closest('.card__icon > use');
    if (!favouriteIcon) return;
    const movie = favouriteIcon.closest('.movie__item');
    const movieId = Number(movie.dataset.id);

    // Change favourite movie
    const movieList = document.querySelector('.movie__list');
    [...movieList.children].forEach(async movie => {
      if (Number(movie.dataset.id) === movieId) {
        movie.classList.toggle('favourite__item');

        let favouriteMovies;
        if (!movie.classList.contains('favourite__item')) {
          // Remove from favourite movie
          favouriteMovies = await model.removeFavouriteMovie(movieId);
        } else {
          // Add to favourite movie
          favouriteMovies = await model.addFavouriteMovie(movieId);
        }
        favouriteView.renderMovies(favouriteMovies);
      }
    });
  } catch (err) {
    modalView.renderMessage(`${err}`);
  }
};

const controlCloseModal = async function () {
  try {
    modalView.closeModal();
  } catch (error) {
    modalView.renderMessage(`${err}`);
  }
};

const init = (function () {
  movieView.addHandlerLoadPopularMovies(controlPopularMovies);
  movieView.addHandlerSelectMovies(controlSelectMovie);
  movieView.addHandlerCloseSelectedMovie(controlCloseSelectedMovie);
  movieView.addHandlerPagination(controlPagination);
  movieView.addHandlerAddFavouriteMovie(controlFavouriteMovie);
  ///////////////////////////////////////////////////////////////
  searchView.addHandlerSearchMovie(controlSearchMovies);
  ///////////////////////////////////////////////////////////////
  modalView.addHandlerCloseModal(controlCloseModal);
})();
