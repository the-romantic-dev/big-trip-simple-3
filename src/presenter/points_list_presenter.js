// import MessageView from '../view/message_view.js';
import { RenderPosition, render } from '../render.js';

import ListView from '../view/list_view.js';
import SortingView from '../view/sorting_view.js';
import MessageView from '../view/message_view.js';
import PointPresenter from './point_presenter.js';
import dayjs from 'dayjs';
import PointsModel from '../model/points_model.js';
import DestinationsModel from '../model/destinations_model.js';
import OffersModel from '../model/offers_model.js';
import FilterPresenter from './filter_presenter.js';
import { filters } from '../const.js';
import EditPointView from '../view/edit_point_view.js';

export default class PointsListPresenter {

  #pointsModel;
  #destinationsModel;
  #offersModel;
  #pointsPresenters = [];
  #currentMessage;

  get pointsPresenters() {
    return this.#pointsPresenters;
  }

  constructor(filtersContainer, pointsContainer) {
    this.filtersContainer = filtersContainer;
    this.pointsContainer = pointsContainer;

    this.filterPresenter = new FilterPresenter(filtersContainer);


    this.#pointsModel = new PointsModel();
    this.#destinationsModel = new DestinationsModel();
    this.#offersModel = new OffersModel();

    this.listView = new ListView();

    this.resetList = this.resetList.bind(this);
    this.sortList = this.sortList.bind(this);
    this.deletePoint = this.deletePoint.bind(this);
    this.addPoint = this.addPoint.bind(this);
    this.renderAddPointForm = this.renderAddPointForm.bind(this);

    for (let i = 0; i < 10; i++) {
      this.#pointsPresenters.push(new PointPresenter(
        this.#pointsModel.points[i],
        this.#destinationsModel.destinations[i],
        this.#offersModel.offers[i],
        this.resetList,
        this.deletePoint));
    }

    document.querySelector('.trip-main__event-add-btn')
      .addEventListener('click', this.renderAddPointForm);
  }

  #renderFilters() {
    this.filterPresenter.init((evt)=>{
      const daySort = this.sortingView.element.querySelector('.trip-sort__item--day');
      daySort.querySelector('input').checked = true;
      this.sortList('day');
      this.filterPresenter.setCurrnetFilter(evt.target.value);
      this.listView.clear();
      if (this.getFilteredPointsPresenters().length === 0) {
        this.#renderEmptyListMessage();
      } else {
        this.#currentMessage.element.remove();
        this.#renderList();
      }
    });

  }

  #renderSorting(){
    this.sortingView = new SortingView();
    this.sortingView.addClickListener(this.sortList);
    render(this.sortingView, this.pointsContainer);

  }

  renderAddPointForm() {
    this.addPointView = new EditPointView();
    this.addPointView.setResetButtonTitle('Cancel');
    this.addPointView.addSubmitListener((evt)=>{
      evt.preventDefault();
      this.addPoint(new PointPresenter(
        this.addPointView.point,
        this.addPointView.destination,
        this.addPointView.offers,
        this.resetList,
        this.deletePoint));
      evt.target.remove();
      this.sortList('day');
    });
    render(this.addPointView, this.listView.element, RenderPosition.AFTERBEGIN);
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

  #renderList() {
    const elementsList = this.getFilteredPointsPresenters().map((value)=>value.createNewEventViewElement());
    this.listView.addAllEvents(elementsList);
    render(this.listView, this.pointsContainer);
  }

  deletePoint(presenterToRemove) {
    presenterToRemove.editingEventView.element.remove();
    this.#pointsPresenters = this.#pointsPresenters.filter((element)=> element !== presenterToRemove);
    this.#renderList();
  }

  addPoint(pointPresenter) {
    this.#pointsPresenters.push(pointPresenter);
    this.resetList();
    this.#renderList();
  }

  init() {
    this.#renderFilters();
    this.#renderSorting();
    if (this.getFilteredPointsPresenters().size === 0) {
      this.#renderEmptyListMessage();
    } else {
      this.sortEventsByDay();
      this.#renderList();
    }
  }

  resetList() {
    this.pointsPresenters.forEach((value) => {
      if (value.currentView === value.editingEventView) {
        value.replaceEditingFormWithEvent();
      }
    });

  }

  sortList(type) {
    this.listView.clear();
    if (type === 'day') {
      this.sortEventsByDay();
      this.#renderList();
    } else if (type === 'price') {
      this.sortEventsByPrice();
      this.#renderList();
    }
  }

  sortEventsByDay() {
    const compareDates = (a, b) => {
      a = a.point.dateFrom;
      b = b.point.dateFrom;
      return dayjs(a).diff(dayjs(b), 'minutes');
    };

    this.pointsPresenters.sort(compareDates);
  }

  sortEventsByPrice() {

    const comparePrices = (a, b) => {
      a = a.point.price;
      b = b.point.price;

      return a - b;
    };

    this.#pointsPresenters.sort(comparePrices);
  }

  getFilteredPointsPresenters() {
    let result = this.#pointsPresenters;
    if (this.filterPresenter.getCurrentFilter() === filters[1]) {
      result = this.#pointsPresenters.filter((value) => {
        const currentDate = dayjs();
        const valueDate = dayjs(value.point.dateFrom);
        return valueDate.diff(currentDate) > 0;
      });
    }
    return result;
  }
}


