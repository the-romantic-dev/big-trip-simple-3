import AbstractView from '../framework/view/abstract-view.js';
import { capitalize } from '../utils.js';
import dayjs from 'dayjs';

const offersListTemplate = (offers) => {
  let result = '';
  for (const offer of offers) {
    result += `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`;
  }
  return result;
};

const createTemplate = (event, destination, offers) => {
  const dateFrom = dayjs(event.dateFrom);
  const dateTo = dayjs(event.dateTo);

  return `
  <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dateFrom.format('YYYY-MM-DD')}">${dateFrom.format('MMM DD')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${event.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${capitalize(event.type)} ${destination.city}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFrom.format('YYYY-MM-DDTHH:mm')}">${dateFrom.format('HH:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateTo.format('YYYY-MM-DDTHH:mm')}">${dateTo.format('HH:mm')}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${event.price}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersListTemplate(offers)}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>
  `;
};

export default class EventView extends AbstractView {
  #event;
  #destination;
  #offers;

  constructor(event) {
    super();
    this.#event = event[0];
    this.#destination = event[1][0];
    this.#offers = event[1][1];
  }

  get template() {
    return createTemplate(this.#event, this.#destination, this.#offers);
  }

  addButtonClickListener(listener) {
    this._callback.buttonClick = listener;
    const button = this.element.querySelector('button');
    button.addEventListener('click', listener);
  }
}


