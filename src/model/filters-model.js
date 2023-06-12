import { FilterType, UpdateType } from '../const';
import Observable from '../framework/observable';

export default class FiltersModel extends Observable{

  #currentFilter = FilterType.ALL;


  get currentFilter() {
    return this.#currentFilter;
  }

  set currentFilter(currentFilter) {
    this.#currentFilter = currentFilter;
    this._notify(UpdateType.UPDATE);
  }

}
