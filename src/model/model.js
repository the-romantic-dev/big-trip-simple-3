import { generateDestinastion, generateEvent, generateOffers } from './fish';


export default class Model {

  #eventsMap;

  constructor() {
    this.#eventsMap = new Map();
    for (let i = 0; i < 10; i++) {
      this.#eventsMap.set(generateEvent(), [generateDestinastion(), generateOffers()]);
    }
  }

  get eventsMap() {
    return this.#eventsMap;
  }
}

