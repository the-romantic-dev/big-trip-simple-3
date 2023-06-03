import {createElement} from '../render.js';
import { cities, eventTypes } from '../const.js';
import { capitalize } from '../utils.js';
const createEventTypeItemListTemplate = () => {
  let result = '';
  for (const type in eventTypes) {
    result += `
    <div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalize(type)}</label>
    </div>`;
  }
  return result;
};

const createDestinationListTemplate = () => {
  let result = '';
  for (const city in cities) {
    result += `<option value="${capitalize(city)}"></option>`;
  }
  return result;
};

const createEventOfferSelectorListTemplate = (offers) => {
  let result = '';
  for (const offer of offers) {
    result += `
    <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.name}-1" type="checkbox" name="event-offer-${offer.name}">
    <label class="event__offer-label" for="event-offer-${offer.name}-1">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;
  }
  return result;
};

const createTemplate = (event, destination, offers) => {
  const date = `${event.begin.year % 100}/${event.begin.month < 10 ? `0${event.begin.month}` : event.begin.month}/${event.begin.day < 10 ? `0${event.begin.day}` : event.begin.day}`;
  const beginTime = `${event.begin.hours < 10 ? `0${event.begin.hours}` : event.begin.hours}:${event.begin.minutes < 10 ? `0${event.begin.minutes}` : event.begin.minutes}`;
  const endTime = `${event.end.hours < 10 ? `0${event.end.hours}` : event.end.hours}:${event.end.minutes < 10 ? `0${event.end.minutes}` : event.end.minutes}`;

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${event.type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createEventTypeItemListTemplate()}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${capitalize(event.type)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.city}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${createDestinationListTemplate()}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${date} ${beginTime}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${date} ${endTime}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${event.price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        ${createEventOfferSelectorListTemplate(offers)}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>
      </section>
    </section>
  </form>
  </li>`;
};

export default class EditingEventView {

  #event;
  #destination;
  #offers;
  #element;
  constructor(event) {
    this.#event = event[0];
    this.#destination = event[1][0];
    this.#offers = event[1][1];
  }

  getTemplate() {
    return createTemplate(this.#event, this.#destination, this.#offers);
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
