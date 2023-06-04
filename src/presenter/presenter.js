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

    this.resetList = this.resetList.bind(this);
  }

  #addFilters() {
    render(new FiltersView(), this.filtersContainer);
  }

  #addSorting(){
    render(new SortingView(), this.eventsContainer);
  }

  #addEmptyListMessage() {
    render(new MessageView('Click New Event to create your first point'), this.eventsContainer);
  }

  #addList() {
    const listView = new ListView();
    for (const event of this.#model.eventsMap) {
      const eventPresenter = new EventPresenter(event, this.resetList);
      this.#eventPresenters.push(eventPresenter);
      const newEventElement = eventPresenter.createNewEventViewElement();
      listView.addEvent(newEventElement);
    }
    render(listView, this.eventsContainer);
  }


  init() {
    this.#addFilters();
    this.#addSorting();
    if (this.#model.eventsMap.size === 0) {
      this.#addEmptyListMessage();
    } else {
      this.#addList();
    }
  }

  resetList() {
    this.eventPresenters.forEach((value) => {
      if (value.currentView === value.editingEventView) {
        value.replaceEditingFormWithEvent();
      }
    });

  }
}


