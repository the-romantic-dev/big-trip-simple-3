// import MessageView from '../view/message_view.js';
import { render } from '../render.js';
import FiltersView from '../view/filters_view.js';
import ListView from '../view/list_view.js';
import SortingView from '../view/sorting_view.js';
import EventView from '../view/event_view.js';
import AddingEventView from '../view/adding_event_view.js';
import EditingEventView from '../view/editing_event_view.js';
import Model from '../model/model.js';
import { generateDestinastion, generateEvent, generateOffers } from '../model/fish.js';

export default class Presenter {

  constructor() {
    this.model = new Model();
  }

  addFilters(filtersContainer) {
    render(new FiltersView(), filtersContainer);
  }

  addSorting(eventsContainer){
    render(new SortingView(), eventsContainer);
  }


  addList(eventsContainer) {
    const listView = new ListView();
    // listView.addEvent(new AddingEventView().getElement());
    listView.addEvent(new EditingEventView([generateEvent(), [generateDestinastion(), generateOffers()]]).getElement());
    for (const event of this.model.eventsMap) {
      listView.addEvent(new EventView(event).getElement());
    }
    render(listView, eventsContainer);
  }


  init(filtersContainer, eventsContainer) {
    this.addFilters(filtersContainer);
    this.addSorting(eventsContainer);
    this.addList(eventsContainer);
  }
}


