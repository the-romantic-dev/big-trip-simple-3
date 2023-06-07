import FiltersPresenter from './filters_presenter';
import PointsListPresenter from './points_list_presenter';
import SortPresenter from './sort_presenter';
import { remove, render } from '../framework/render';
import MessageView from '../view/message_view';
import { filters } from '../const';

export default class MainPresenter {
  #presenters;
  #currentMessage;

  constructor(filtersContainer, pointsListContainer, models) {
    this.#presenters = {
      pointsListPresenter: new PointsListPresenter(pointsListContainer, models),
      filtersPresenter: new FiltersPresenter(filtersContainer),
      sortPresenter: new SortPresenter()
    };
  }

  init() {
    this.#presenters.filtersPresenter.init(this.#onFiltersChange);
    this.#presenters.sortPresenter.init();
    this.#presenters.pointsListPresenter.init();
  }

  #renderEmptyListMessage() {
    if (this.filterPresenter.getCurrentFilter() === filters[0]) {
      this.#currentMessage = new MessageView('Click New Event to create your first point');
      render(this.#currentMessage, this.pointsContainer);
    } else {
      this.#currentMessage = new MessageView('There are no future events now');
      render(this.#currentMessage, this.pointsContainer);
    }
  }

  #onFiltersChange(evt) {
    // const daySort = this.sortingView.element.querySelector('.trip-sort__item--day');
    // daySort.querySelector('input').checked = true;
    // this.sortList('day');

    this.#presenters.filtersPresenter.setCurrentFilter(evt.target.value);
    this.#presenters.pointsListPresenter.listView.clear();
    if (this.getFilteredPointsPresenters().length === 0) {
      this.#renderEmptyListMessage();
    } else {
      remove(this.#currentMessage);
      this.#presenters.pointsListPresenter.renderList();
    }
  }
}
