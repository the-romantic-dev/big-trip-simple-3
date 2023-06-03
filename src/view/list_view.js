import {createElement} from '../render.js';

const createTemplate = () => `
<ul class="trip-events__list">

</ul>`;

export default class ListView {

  #element;
  constructor() {
    this.#element = createElement(this.#getTemplate());
  }

  addEvent(event) {
    this.#element.appendChild(event);
  }

  #getTemplate() {
    return createTemplate();
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


