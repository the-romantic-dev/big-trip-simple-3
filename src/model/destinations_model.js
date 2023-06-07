export default class DestinationsModel {

  #destinations = [];
  #destinationsApiService = null;
  #names = null;
  constructor(destinationsApiService) {
    this.#destinationsApiService = destinationsApiService;

  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      this.#destinations = await this.#destinationsApiService.destinations;
    } catch(err) {
      // eslint-disable-next-line no-console
      console.log(err);
      this.#destinations = [];
    }
  }

  get names() {
    if (!this.#names) {
      this.#names = this.#destinations.map((destination)=>destination.name);
    }
    return this.#names;
  }

  getDestinationById(id) {
    let result = null;
    this.#destinations.forEach((destination)=>{
      if(destination.id === id) {
        result = destination;
      }
    });
    return result;
  }

  getDestinationByName(name) {
    let result = null;
    this.#destinations.forEach((destination)=>{
      if(destination.name === name) {
        result = destination;
      }
    });
    return result;
  }

}
