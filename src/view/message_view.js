import { FilterType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const createTemplate = (message) => `<p class="trip-events__msg">${message}</p>`;

const MessageTexts = {
  [FilterType.ALL]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now'
};

export default class MessageView extends AbstractView {

  #message = null;
  constructor(filterType) {
    super();
    this.#message = MessageTexts[filterType];
  }

  get template() {
    return createTemplate(this.#message);
  }
}
