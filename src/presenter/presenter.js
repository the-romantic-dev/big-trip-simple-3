// import MessageView from '../view/message_view.js';
import { render } from '../render.js';
import FiltersView from '../view/filters_view.js';
import ListView from '../view/list_view.js';
import SortingView from '../view/sorting_view.js';

import Model from '../model/model.js';
import MessageView from '../view/message_view.js';
import EventPresenter from './event_presenter.js';
export default class Presenter {

  #model;
  #eventPresenters = [];

  get eventPresenters() {
    return this.#eventPresenters;
  }

  constructor(filtersContainer, eventsContainer) {
    this.filtersContainer = filtersContainer;
    this.eventsContainer = eventsContainer;
    this.#model = new Model();
    this.listView = new ListView();
    this.resetList = this.resetList.bind(this);
    this.sortList = this.sortList.bind(this);

    for (const event of this.#model.eventsMap) {
      const eventPresenter = new EventPresenter(event, this.resetList);
      this.#eventPresenters.push(eventPresenter);
    }
  }

  #renderFilters() {
    render(new FiltersView(), this.filtersContainer);
  }

  #renderSorting(){
    const sortingView = new SortingView();
    sortingView.addClickListener(this.sortList);
    render(sortingView, this.eventsContainer);

  }

  #renderEmptyListMessage() {
    render(new MessageView('Click New Event to create your first point'), this.eventsContainer);
  }

  #renderList() {
    const elementsList = this.#eventPresenters.map((value)=>value.createNewEventViewElement());
    this.listView.addAllEvents(elementsList);
    render(this.listView, this.eventsContainer);
  }


  init() {
    this.#renderFilters();
    this.#renderSorting();
    if (this.#model.eventsMap.size === 0) {
      this.#renderEmptyListMessage();
    } else {
      this.sortEventsByDay();
      this.#renderList();
    }
  }

  resetList() {
    this.eventPresenters.forEach((value) => {
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
    console.log(this.#eventPresenters.map((value)=>value.event[0].begin));
    const compareDates = (a, b) => {
      a = a.event[0].begin;
      b = b.event[0].begin;
      const dateA = new Date(a.year, a.month - 1, a.day, a.hours, a.minutes);
      const dateB = new Date(b.year, b.month - 1, b.day, b.hours, b.minutes);
      return dateA.getTime() - dateB.getTime();
    };

    this.eventPresenters.sort(compareDates);
    console.log(this.#eventPresenters.map((value)=>value.event[0].begin));
  }

  sortEventsByPrice() {

    const comparePrices = (a, b) => {
      a = a.event[0];
      b = b.event[0];

      return a.price - b.price;
    };

    this.eventPresenters.sort(comparePrices);
  }
}


