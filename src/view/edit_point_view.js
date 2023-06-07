import { dateFormats, eventTypes } from '../const.js';
import { capitalize } from '../utils.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';

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

const createDestinationListTemplate = (destinationsNames) => {
  let result = '';
  for (const name of destinationsNames) {
    result += `<option value="${capitalize(name)}"></option>`;
  }
  return result;
};

const createEventOfferSelectorListTemplate = (offers, checkedOffers) => {
  let result = '';
  for (const offer of offers) {
    const titleWithoutSpaces = offer.title.replace(/\s/g, '');
    let checkedAttr = '';
    if (checkedOffers.includes(offer.id)) {
      checkedAttr = 'checked';
    }
    result += `
    <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${titleWithoutSpaces}-1" type="checkbox" name="event-offer-${titleWithoutSpaces}" ${checkedAttr}>
    <label class="event__offer-label" for="event-offer-${titleWithoutSpaces}-1">
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
  for (const picture of destination.pictures) {
    result += `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
  }
  return result;
};

const createTemplate = (state) => {
  const point = state.point;
  const destination = state.destination;
  const offers = state.offers;
  const dateFrom = dayjs(point.date_from);
  const dateTo = dayjs(point.date_to);

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
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
          ${capitalize(point.type)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${createDestinationListTemplate(state.destinationsNames)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom.format(dateFormats.dayjs)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo.format(dateFormats.dayjs)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${point.base_price}">
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
        ${createEventOfferSelectorListTemplate(offers, point.offers)}
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

const blankPoint = {
  id: '-1',
  type: eventTypes[0],
  // eslint-disable-next-line camelcase
  date_from: new Date().toISOString(),
  // eslint-disable-next-line camelcase
  date_to: new Date().toISOString(),
  destination: 1,
  offers: [],
  // eslint-disable-next-line camelcase
  base_price: 100
};

export default class EditPointView extends AbstractStatefulView {

  static Type = {
    EDIT: 'EDIT',
    ADD: 'ADD'
  };

  #dateFromDatepicker = null;
  #dateToDatepicker = null;
  #viewType = null;
  #destinationsModel = null;
  #offersModel = null;

  constructor({pointId = '-1', point = {...blankPoint}, destinationsModel, offersModel, onSubmit, onDelete, onClose = ()=>{}, viewType = EditPointView.Type.EDIT}) {
    super();
    if (point.id === '-1') {
      point.id = pointId;
    }
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this._callback.onSubmit = onSubmit;
    this._callback.onDelete = onDelete;
    this._callback.onClose = onClose;
    this.#viewType = viewType;

    this._setState(EditPointView.parsePointToState(point, this.#destinationsModel, this.#offersModel));
    this._restoreHandlers();

    if (this.#viewType === EditPointView.Type.ADD) {
      this.element.querySelector('.event__reset-btn').textContent = 'Cancel';
      this.element.querySelector('.event__rollup-btn').remove();
    }
  }

  get template() {
    return createTemplate(this._state);
  }

  removeElement() {
    super.removeElement();

    if (this.#dateFromDatepicker) {
      this.#dateFromDatepicker.destroy();
      this.#dateFromDatepicker = null;
    }

    if (this.#dateToDatepicker) {
      this.#dateToDatepicker.destroy();
      this.#dateToDatepicker = null;
    }
  }

  reset(point) {
    this.updateElement(EditPointView.parsePointToState(point, this.#destinationsModel, this.#offersModel));
  }

  _restoreHandlers() {
    const typeInputs = this.element.querySelector('.event__type-group').querySelectorAll('.event__type-input');
    typeInputs.forEach((element)=>{
      element.addEventListener('change', this.#onTypeChange);
    });

    const resetButton = this.element.querySelector('.event__reset-btn');
    if (this.#viewType === EditPointView.Type.EDIT) {
      const rollupButton = this.element.querySelector('.event__rollup-btn');
      rollupButton.addEventListener('click', this._callback.onClose);
      resetButton.addEventListener('click', ()=>{
        this._callback.onDelete(this._state.point);
      });
    } else {
      resetButton.addEventListener('click', ()=>{
        this._callback.onDelete(this._state.point);
      });
    }

    const form = this.element.querySelector('form');
    form.addEventListener('submit', (evt)=> {
      evt.preventDefault();
      this._callback.onSubmit(EditPointView.parseStateToPoint(this._state));
    });

    const destinationSelector = this.element.querySelector('.event__input--destination');
    destinationSelector.addEventListener('change', this.#onDestinationChange);

    const priceSelector = this.element.querySelector('.event__input--price');
    priceSelector.addEventListener('change', this.#onPriceChange);

    this.#setDatepicker();
  }

  #onTypeChange = (evt) => {
    const typeValue = evt.target.value;
    const offers = this.#offersModel.getOffersByType(typeValue);
    this.updateElement({
      point: {...this._state.point, type: typeValue},
      offers: [...offers]
    });
  };

  #onDestinationChange = (evt)=> {
    let update = null;
    if (this.#destinationsModel.names.includes(evt.target.value)) {
      update = {destination: {...this.#destinationsModel.getDestinationByName(evt.target.value)}};
    } else {
      update = {destination: {...this._state.destination, pictures: [], name: '', description: ''}};
    }
    this.updateElement(update);
  };

  #onPriceChange = (evt) => {

    let value = evt.target.value;
    if (value === '') {
      value = 0;
    } else {
      value = parseInt(evt.target.value, 10);
    }
    // eslint-disable-next-line camelcase
    this.updateElement({point: {...this._state.point, base_price: value}});

  };

  #createFlatpickr(selector, onChange) {
    return flatpickr(
      selector, {
        enableTime: true,
        dateFormat: dateFormats.flatpickr,
        onChange: onChange
      });
  }


  #setDatepicker() {
    const dateFromSelector = this.element.querySelector('#event-start-time-1');
    const dateToSelector = this.element.querySelector('#event-end-time-1');

    this.#dateFromDatepicker = this.#createFlatpickr(dateFromSelector, (dates)=>{
      // eslint-disable-next-line camelcase
      this.updateElement({point: {...this._state.point, date_from: `${dates[0].toISOString()}`}});
    });

    this.#dateToDatepicker = this.#createFlatpickr(dateToSelector, (dates)=>{
      // eslint-disable-next-line camelcase
      this.updateElement({point: {...this._state.point, date_to: `${dates[0].toISOString()}`}});
    });

  }

  static parsePointToState(point, destinationsModel, offersModel) {

    const destination = destinationsModel.getDestinationById(point.destination);
    const offers = offersModel.getOffersByType(point.type);
    const destinationsNames = destinationsModel.names;
    return {
      point: {...point},
      destination: {...destination},
      offers: [...offers],
      destinationsNames: destinationsNames
    };
  }

  static parseStateToPoint(state) {
    // eslint-disable-next-line camelcase
    return {...state.point, is_favorite: true};
  }
}
