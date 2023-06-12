import { FilterType } from '../const';
import FiltersView from '../view/filters-view.js';
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
  }

  #onFilterTypeChange = (filterType) => {
    if (this.#filtersModel.currentFilter === filterType) {
      return;
    }

    this.#filtersModel.currentFilter = filterType;
  };
}
