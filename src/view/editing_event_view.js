import { cities, cityToPhotos, eventTypes } from '../const.js';
import { capitalize, getRandomInteger } from '../utils.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { eventTypeToOffers } from '../const.js';
const createEventTypeItemListTemplate = () => {
  let result = '';
  for (const type of eventTypes) {
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
  for (const city of cities) {
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

const createIamgeListTemplate = (destination) => {
  let result = '';
  for (const photo of destination.photos) {
    result += `<img class="event__photo" src="${photo}" alt="Event photo">`;
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

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${createIamgeListTemplate(destination)}
          </div>
        </div>
      </section>
    </section>
  </form>
  </li>`;
};

export default class EditingEventView extends AbstractStatefulView {

  #event;
  #destination;
  #offers;

  constructor(event) {
    super();
    this.#event = event[0];
    this.#destination = event[1][0];
    this.#offers = event[1][1];
    this.#addTypeChangeListener();
    this.#addDestinationChangeListener();
  }

  get template() {
    return createTemplate(this.#event, this.#destination, this.#offers);
  }

  addSubmitListener(listener) {
    this._callback.submit = listener;
    const form = this.element.querySelector('form');
    form.addEventListener('submit', listener);
  }

  addButtonClickListener(listener) {
    this._callback.buttonClick = listener;
    const button = this.element.querySelector('.event__rollup-btn');
    button.addEventListener('click', listener);
  }

  #addTypeChangeListener() {
    const typeInputs = this.element.querySelector('.event__type-group').querySelectorAll('.event__type-input');
    typeInputs.forEach((element)=>{
      element.addEventListener('change', () => {
        const typeValue = element.value;
        this.#event.type = typeValue;
        this.#offers = eventTypeToOffers.get(typeValue).map((value)=>({
          title: value[1],
          price: getRandomInteger(10, 100),
          name: value[0]
        }));
        this.updateElement(this.#event);
        this.updateElement(this.#offers);
      });
    });
  }

  #addDestinationChangeListener() {
    const destinationSelector = this.element.querySelector('.event__input--destination');
    destinationSelector.addEventListener('change', (evt) => {
      console.log(cities.includes(evt.target.value));
      if (cities.includes(evt.target.value)) {
        this.#destination.city = evt.target.value;
        this.#destination.photos = cityToPhotos.get(evt.target.value);
        this.updateElement(this.#destination);
      }

    });
  }

  setResetButtonTitle(title) {
    this.element.querySelector('.event__reset-btn').textContent = title;
  }

  _restoreHandlers() {
    this.#addTypeChangeListener();
    this.addButtonClickListener(this._callback.buttonClick);
    this.addSubmitListener(this._callback.submit);
    this.#addDestinationChangeListener();
  }
}
