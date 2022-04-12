import ICONS from 'url:../../img/icons/sprite.svg';

class MovieView {
  #moviesSection = document.querySelector('.movies');
  #movieSection = document.querySelector('.movie');
  #movieList = document.querySelector('.movie__list');
  #movieHeading = document.querySelector('.movies__data');
  #favouriteList = document.querySelector('.favourite__list');
  #pagination = document.querySelector('.pagination');

  addHandlerLoadPopularMovies(handler) {
    window.addEventListener('load', handler);
  }

  addHandlerSelectMovies(handler) {
    this.#movieList.addEventListener('click', handler);
  }

  addHandlerCloseSelectedMovie(handler) {
    this.#movieSection.addEventListener('click', handler);
  }

  addHandlerPagination(handler) {
    this.#pagination.addEventListener('click', handler);
  }

  addHandlerFavouriteMovie(handler) {
    this.#movieList.addEventListener('click', handler);
    this.#favouriteList.addEventListener('click', handler);
  }

  changeMovieHeading(headingText) {
    this._clearMovieHeading();
    this.#movieHeading.textContent = headingText;
  }

  _clearMovieHeading() {
    this.#movieHeading.textContent = '';
  }

  closeSelectedMovie() {
    this.#movieSection.dataset.id = '';
    this.#movieSection.innerHTML = '';
  }

  showMovies() {
    this.#moviesSection.style.display = 'block';
  }

  hideMovies() {
    this.#moviesSection.style.display = 'none';
  }

  renderSelectedMovie(movie) {
    this.#movieSection.innerHTML = '';
    const markup = this._generateSelectedMovieMarkup(movie);
    this.#movieSection.insertAdjacentHTML('beforeend', markup);
  }

  renderMovies(movies) {
    this.#movieList.innerHTML = '';
    const markup = movies
      .map(movie => {
        const movieMarkup = this._generateMarkup(movie);
        return movieMarkup;
      })
      .join('');
    this.#movieList.insertAdjacentHTML('beforeend', markup);
  }

  renderSelectedMovieSpinner() {
    const markup = `
      <svg class="spinner">
        <use xlink:href="${ICONS}#icon-spinner9"></use>
      </svg>
    `;
    this.#movieSection.innerHTML = markup;
  }

  renderMoviesSpinner() {
    const markup = `
      <svg class="spinner">
        <use xlink:href="${ICONS}#icon-spinner9"></use>
      </svg>
    `;
    this.#movieList.innerHTML = markup;
  }

  _generateMarkup(movie) {
    const { id, title, poster } = movie;
    return `
      <li class="movie__item card__item" data-id=${id}>
        <img
          class="card__image"
          src=${poster}
          alt=${title}
        />
        <svg class="card__icon">
          <use xlink:href="${ICONS}#icon-heart"></use>
          </svg>
        <div class="card__content">
          <h4><a href="./" class="card__link">${title}</a></h4>
        </div>
      </li>
    `;
  }

  _generateSelectedMovieMarkup(movie) {
    const {
      id,
      title,
      poster,
      tagline,
      releaseDate,
      runtime,
      popularity,
      overview,
      voteAverage,
      voteCount,
      genres,
      languages,
    } = movie;

    const genresMarkup = genres
      .map(genre => {
        return `<li>${genre}</li>`;
      })
      .join(', ');

    const languagesMarkup = languages
      .map(language => {
        return `<li>${language}</li>`;
      })
      .join(', ');

    this.#movieSection.dataset.id = id;

    return `
      <button class="movie__close">&times;</button>
      <h2 class="heading--2">
        Movie: <span class="movies__heading">${title}</span>
      </h2>
      <div class="movie__content">
        <div class="movie__image-box">
          <img src="${poster}" alt="${title}" class="movie__image" />
          <h3 class="movie__tagline">${tagline}</h3>
        </div>
        <h3 class="movie__heading">Release date: ${releaseDate}</h3>
        <h3 class="movie__heading">Genres: </h3>
        <ul class="movie__genres">
          ${genresMarkup}
        </ul>
        <h3 class="movie__heading">Languages: </h3>
        <ul class="movie__languages">
          ${languagesMarkup}
        </ul>
        <h3 class="movie__heading">Duration: ${runtime} minutes</h3>
        <h3 class="movie__heading">Popularity: ${popularity}</h3>
        <h3 class="movie__heading">Vote Average: ${voteAverage}</h3>
        <h3 class="movie__heading">Vote Count: ${voteCount}</h3>
        <h3 class="movie__heading">Overview: </h3>
        <p class="movie__overview">${overview}</p>
      </div>
    `;
  }
}

export default new MovieView();
