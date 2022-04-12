class ModalView {
  #modal = document.querySelector('.modal');
  #modalMessage = document.querySelector('.modal__message');
  #closeModalBtn = document.querySelector('.modal__close');

  addHandlerCloseModal(handler) {
    this.#closeModalBtn.addEventListener('click', handler);
  }

  closeModal() {
    this.#modal.style.opacity = '0';
    this.#modal.style.visibility = 'hidden';
  }

  renderError(message) {
    this.#modalMessage.textContent = `${message}`;
    this.#modal.style.opacity = '1';
    this.#modal.style.visibility = 'visible';
  }
}

export default new ModalView();
