export default class FiltersModel {

  #currentFilter;
  constructor(filter) {
    this.#currentFilter = filter;
  }

  get currentFilter() {
    return this.#currentFilter;
  }

  set currentFilter(currentFilter) {
    this.#currentFilter = currentFilter;
  }

}
