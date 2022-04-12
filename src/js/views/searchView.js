class SearchView {
  #searchForm = document.querySelector('.search__form');
  #searchMovie = document.querySelector('.search__movie');
  #searchYear = document.querySelector('.search__year');

  addHandlerSearchMovie(handler) {
    this.#searchForm.addEventListener('submit', handler);
  }

  getQuery() {
    const searchMovieInput = this.#searchMovie.value;
    const searchYearInput = this.#searchYear.value;
    this._clearInputs();

    return {
      query: searchMovieInput || '',
      year: searchYearInput || '',
    };
  }

  _clearInputs() {
    this.#searchMovie.value = this.#searchYear.value = '';
  }
}

export default new SearchView();
