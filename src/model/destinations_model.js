import { generateDestinastion } from './fish';


export default class DestinationsModel {

  #destinations;

  constructor() {
    this.#destinations = [];
    for (let i = 0; i < 10; i++) {
      this.#destinations.push(generateDestinastion());
    }
  }

  get destinations() {
    return this.#destinations;
  }

  set destinations(destinations) {
    this.#destinations = destinations;
  }

  updateDestination(index, newDestination) {
    this.#destinations[index] = newDestination;
  }

}
