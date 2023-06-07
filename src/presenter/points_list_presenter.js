// import MessageView from '../view/message_view.js';
import { RenderPosition, remove, render } from '../framework/render.js';

import {FilterType, SortType, UpdateType, UserAction} from '../const.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import ListView from '../view/list_view.js';
import SortView from '../view/sort_view.js';
import MessageView from '../view/message_view.js';
import PointPresenter from './point_presenter.js';
import NewPointPresenter from './new_point_presenter.js';
import { filter, comparePointsByDay, sortPointsByPrice } from '../utils.js';
import LoadingView from '../view/loading_view.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class PointsListPresenter {


  #container = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filtersModel = null;

  #listView = new ListView();
  #sortView = null;
  #loadingView = new LoadingView();

  #pointsPresenters = new Map();
  #newPointPresenter = null;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  #filterType = FilterType.ALL;
  #currentSortType = SortType.DAY;
  #messageView = null;

  #isLoading = true;

  #onNewPointCreate = null;
  constructor({container, pointsModel, destinationsModel, offersModel, filtersModel, onNewPointDestroy, onNewPointCreate}) {

    this.#container = container;

    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filtersModel = filtersModel;

    this.#onNewPointCreate = onNewPointCreate;

    this.#newPointPresenter = new NewPointPresenter({
      pointId: this.#pointsModel.points.length,
      pointsListContainer: this.#listView.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#onPointDataChange,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#observeModelUpdate);
    this.#filtersModel.addObserver(this.#observeModelUpdate);
  }

  #observeModelUpdate = (updateType) => {
    if (updateType === UpdateType.INIT) {
      this.#isLoading = false;
      remove(this.#loadingView);
      this.#clearList();
      this.#renderPointsList();
    } else {
      this.#clearList();
      this.#renderPointsList();
    }
  };

  get points() {
    this.#filterType = this.#filtersModel.currentFilter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);
    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(comparePointsByDay);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointsByPrice);
    }

    return filteredPoints;
  }

  init() {
    this.#renderPointsList();
  }

  #renderLoading() {
    render(this.#loadingView, this.#listView.element, RenderPosition.AFTERBEGIN);
  }

  createPoint() {

    this.#currentSortType = SortType.DAY;
    this.#filtersModel.currentFilter = FilterType.ALL;

    this.#newPointPresenter.init(`${this.#pointsModel.points.length}`);
    this.#onNewPointCreate();
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      container: this.#listView.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#onPointDataChange,
      onModeChange: this.#onPointModeChange
    });
    pointPresenter.init(point);
    this.#pointsPresenters.set(point.id, pointPresenter);
  }

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderPointsList() {
    render(this.#listView, this.#container);
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    render(this.#listView, this.#container);
    this.#renderPoints(this.points);
  }

  #renderNoPoints() {
    this.#messageView = new MessageView(this.#filterType);
    render(this.#messageView, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderSort() {
    this.#sortView = new SortView(this.#currentSortType, this.#onSortTypeChange);
    render(this.#sortView, this.#container, RenderPosition.AFTERBEGIN);
  }

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearList();
    this.#renderPointsList();
  };

  #clearList(resetSortType = false) {
    this.#newPointPresenter.destroy();
    this.#pointsPresenters.forEach((presenter)=>presenter.destroy());
    this.#pointsPresenters.clear();

    remove(this.#sortView);
    remove(this.#loadingView);
    if (this.#messageView) {
      remove(this.#messageView);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  get pointsPresenters() {
    return this.#pointsPresenters;
  }

  #onPointDataChange = async (actionType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_TASK:
        await this.#pointsModel.updatePoint(update);
        break;
      case UserAction.ADD_TASK:
        await this.#pointsModel.addPoint(update);
        break;
      case UserAction.DELETE_TASK:
        await this.#pointsModel.deletePoint(update);
        break;
    }

    this.#uiBlocker.unblock();
  };

  #onPointModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointsPresenters.forEach((presenter)=>presenter.resetView());
  };
}


