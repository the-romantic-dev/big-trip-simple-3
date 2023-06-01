import {createElement} from '../render.js';

const createTemplate = (message) => `<p class="trip-events__msg">${message}</p>`;

export default class MessageView {
  getTemplate(message) {
    return createTemplate(message);
  }

  getElement(message) {
    if (!this.element) {
      this.element = createElement(this.getTemplate(message));
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
