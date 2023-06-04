// import MessageView from '../view/message_view.js';
import { render } from '../render.js';
import FiltersView from '../view/filters_view.js';
import ListView from '../view/list_view.js';
import SortingView from '../view/sorting_view.js';
import EventView from '../view/event_view.js';
import EditingEventView from '../view/editing_event_view.js';
import Model from '../model/model.js';
import MessageView from '../view/message_view.js';
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

  #addEmptyListMessage(eventsContainer) {
    render(new MessageView('Click New Event to create your first point'), eventsContainer);
  }

  #addListenersForListElement(editingEventView, eventView) {
    const editingEventViewListener = () => {
      editingEventView.element.replaceWith(eventView.element);
      document.removeEventListener('keydown', escListener);
    };

    function escListener (event) {
      if (event.key === 'Escape') {
        editingEventViewListener();
      }
    }

    eventView.addButtonClickListener(() => {
      eventView.element.replaceWith(editingEventView.element);
      document.addEventListener('keydown', escListener);
    });

    editingEventView.addButtonClickListener(editingEventViewListener);
    editingEventView.addSubmitListener(editingEventViewListener);
  }


  #addList(eventsContainer) {
    const listView = new ListView();
    for (const event of this.#model.eventsMap) {

      const editingEventView = new EditingEventView(event);
      const eventView = new EventView(event);
      this.#addListenersForListElement(editingEventView, eventView);
      listView.addEvent(eventView.element);
    }
    render(listView, eventsContainer);
  }


  init(filtersContainer, eventsContainer) {
    this.#addFilters(filtersContainer);
    this.#addSorting(eventsContainer);
    if (this.#model.eventsMap.size === 0) {
      this.#addEmptyListMessage(eventsContainer);
    } else {
      this.#addList(eventsContainer);
    }
  }
}


