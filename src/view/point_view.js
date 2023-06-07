import { dateFormats } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import { capitalize } from '../utils.js';
import dayjs from 'dayjs';

const offersListTemplate = (offers, checkedOffersIds) => {
  let result = '';
  for (const offer of offers) {
    if (checkedOffersIds.includes(offer.id)) {
      result += `
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`;
    }

  }
  return result;
};

const createTemplate = (point, destination, offers) => {
  const dateFrom = dayjs(point.date_from);
  const dateTo = dayjs(point.date_to);

  return `
  <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dateFrom.format(dateFormats.dashedDate)}">${dateFrom.format(dateFormats.MMMDD)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${capitalize(point.type)} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFrom.format(dateFormats.iso)}">${dateFrom.format(dateFormats.time)}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateTo.format(dateFormats.iso)}">${dateTo.format(dateFormats.time)}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${point.base_price}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersListTemplate(offers, point.offers)}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>
  `;
};

export default class PointView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = null;

  constructor({point, destination, offers, onEditClick}) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    this._callback.onEditClick = onEditClick;

    const button = this.element.querySelector('button');
    button.addEventListener('click', (evt)=>{
      evt.preventDefault();
      this._callback.onEditClick();
    });
  }

  get point() {
    return this.#point;
  }

  get template() {
    return createTemplate(this.#point, this.#destination, this.#offers);
  }
}


