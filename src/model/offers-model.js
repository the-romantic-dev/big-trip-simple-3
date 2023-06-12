export default class OffersModel {
  #offersApiService = null;
  #offers = [];

  constructor(offersApiService) {
    this.#offersApiService = offersApiService;
  }

  async init() {
    try {
      this.#offers = await this.#offersApiService.offers;
    } catch(err) {
      // eslint-disable-next-line no-console
      console.log(err);
      this.#offers = [];
    }
  }

  get offers() {
    return this.#offers;
  }

  getOffersByType(type) {
    let result = null;
    this.#offers.forEach((offer)=>{
      if (offer.type === type) {
        result = offer.offers;
      }
    });
    return result;
  }
}
