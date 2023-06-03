import {createElement} from '../render.js';

const createTemplate = (message) => `<p class="trip-events__msg">${message}</p>`;

export default class MessageView {

  #element;
  constructor(message) {
    this.message = message;
  }

  #getTemplate() {
    return createTemplate(this.message);
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.#getTemplate());
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
