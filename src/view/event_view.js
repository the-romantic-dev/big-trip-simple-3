import { monthNames } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import { capitalize } from '../utils.js';

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

  const date = `${event.begin.year}-${event.begin.month < 10 ? `0${event.begin.month}` : event.begin.month}-${event.begin.day < 10 ? `0${event.begin.day}` : event.begin.day}`;
  const beginTime = `${event.begin.hours < 10 ? `0${event.begin.hours}` : event.begin.hours}:${event.begin.minutes < 10 ? `0${event.begin.minutes}` : event.begin.minutes}`;
  const endTime = `${event.end.hours < 10 ? `0${event.end.hours}` : event.end.hours}:${event.end.minutes < 10 ? `0${event.end.minutes}` : event.end.minutes}`;
  const monthName = monthNames[event.begin.month - 1];

  return `
  <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${date}">${monthName} ${event.begin.day}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${event.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${capitalize(event.type)} ${destination.city}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${date}T${beginTime}">${beginTime}</time>
          &mdash;
          <time class="event__end-time" datetime="${date}T${endTime}">${endTime}</time>
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


