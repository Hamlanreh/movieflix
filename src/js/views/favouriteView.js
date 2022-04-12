import ICONS from 'url:../../img/icons/sprite.svg';

class FavouriteView {
  #favouriteList = document.querySelector('.favourite__list');

  renderMovies(movies) {
    this.#favouriteList.innerHTML = '';
    const markup = movies
      .map(movie => {
        const movieMarkup = this._generateMarkup(movie);
        return movieMarkup;
      })
      .join('');
    this.#favouriteList.insertAdjacentHTML('beforeend', markup);
  }

  _generateMarkup(movie) {
    const { id, title, poster } = movie;
    return `
        <li class="favourite__item movie__item card__item" data-id=${id}>
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
}

export default new FavouriteView();
