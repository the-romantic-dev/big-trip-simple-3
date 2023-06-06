import { generateOffers } from './fish';


export default class OffersModel {

  #offers;

  constructor() {
    this.#offers = [];
    for (let i = 0; i < 10; i++) {
      this.#offers.push(generateOffers());
    }
  }

  get offers() {
    return this.#offers;
  }

  set offers(offers) {
    this.#offers = offers;
  }

  updateOffers(index, newOffers) {
    this.#offers[index] = newOffers;
  }

}
