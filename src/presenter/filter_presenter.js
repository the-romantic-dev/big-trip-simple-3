import { filters } from '../const';
import { render } from '../render.js';
import FiltersModel from '../model/filters_model';
import FiltersView from '../view/filters_view.js';
export default class FilterPresenter {

  #filtersModel;
  #filtersView;
  constructor(filtersContainer) {
    this.filtersContainer = filtersContainer;

    this.#filtersView = new FiltersView();
    this.#filtersModel = new FiltersModel(filters[0]);
  }

  init(filterChangeCallback) {
    this.#filtersView.addFilterChangeListener(filterChangeCallback);
    render(this.#filtersView, this.filtersContainer);
  }

  setCurrnetFilter(filter) {
    this.#filtersModel.currentFilter = filter;
  }

  getCurrentFilter() {
    return this.#filtersModel.currentFilter;
  }

}
