import AbstractView from '../framework/view/abstract-view.js';

const createTemplate = (message) => `<p class="trip-events__msg">${message}</p>`;

export default class MessageView extends AbstractView {

  constructor(message) {
    super();
    this.message = message;
  }

  get template() {
    return createTemplate(this.message);
  }
}
