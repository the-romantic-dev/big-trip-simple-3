// import MessageView from '../view/message_view.js';
import { render } from '../render.js';
import FiltersView from '../view/filters_view.js';
import ListView from '../view/list_view.js';
import SortingView from '../view/sorting_view.js';
import EventView from '../view/event_view.js';
import EditingEventView from '../view/editing_event_view.js';
import Model from '../model/model.js';

export default class Presenter {

  #model;

  constructor() {
    this.#model = new Model();
  }

  #addFilters(filtersContainer) {
    render(new FiltersView(), filtersContainer);
  }

  #addSorting(eventsContainer){
    render(new SortingView(), eventsContainer);
  }

  #addListenerForListElement(editingEventViewElement, eventViewElement) {
    const editingEventViewListener = () => {
      editingEventViewElement.replaceWith(eventViewElement);
      document.removeEventListener('keydown', escListener);
    };

    function escListener (event) {
      if (event.key === 'Escape') {
        editingEventViewListener();
      }
    }

    const eventViewListener = () => {
      eventViewElement.replaceWith(editingEventViewElement);
      document.addEventListener('keydown', escListener);
    };



    eventViewElement.querySelector('button')
      .addEventListener('click', eventViewListener);

    editingEventViewElement.querySelector('form')
      .addEventListener('submit', editingEventViewListener);

    editingEventViewElement.querySelector('.event__rollup-btn')
      .addEventListener('click', editingEventViewListener);
  }


  #addList(eventsContainer) {
    const listView = new ListView();
    for (const event of this.#model.eventsMap) {
      const editingEventViewElement = new EditingEventView(event).getElement();
      const eventViewElement = new EventView(event).getElement();
      this.#addListenerForListElement(editingEventViewElement, eventViewElement);
      listView.addEvent(eventViewElement);
    }
    render(listView, eventsContainer);
  }


  init(filtersContainer, eventsContainer) {
    this.#addFilters(filtersContainer);
    this.#addSorting(eventsContainer);
    this.#addList(eventsContainer);
  }
}


