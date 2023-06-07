import { FilterType } from '../const';
import FiltersView from '../view/filters_view.js';
import { filter } from '../utils';
import { remove, replace, render } from '../framework/render';
export default class FiltersPresenter {

  #filtersModel = null;
  #filtersView = null;
  #container = null;

  #pointsModel = null;
  constructor({container, filtersModel, pointsModel}) {
    this.#container = container;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;
  }

  get filters() {
    const points = this.#pointsModel.points;

    return [
      {
        type: FilterType.ALL,
        name: 'everything',
        count: filter[FilterType.ALL](points).length,
      },
      {
        type: FilterType.FUTURE,
        name: 'future',
        count: filter[FilterType.FUTURE](points).length,
      }
    ];
  }

  init() {
    const previousFiltersView = this.#filtersView;
    this.#filtersView = new FiltersView(this.#onFilterTypeChange);

    if (previousFiltersView === null) {
      render(this.#filtersView, this.#container);
      return;
    }

    replace(this.#filtersView, previousFiltersView);
    remove(previousFiltersView);
    // this.#filtersView.addFilterChangeListener(filterChangeCallback);
    // render(this.#filtersView, this.filtersContainer);
  }

  #onFilterTypeChange = (filterType) => {
    if (this.#filtersModel.currentFilter === filterType) {
      return;
    }

    this.#filtersModel.currentFilter = filterType;
  };

  // setCurrentFilter(filter) {
  //   this.#filtersModel.currentFilter = filter;
  // }

  // getCurrentFilter() {
  //   return this.#filtersModel.currentFilter;
  // }
}
