// import MessageView from '../view/message_view.js';
import { render } from '../render.js';
import FiltersView from '../view/filters_view.js';
import ListView from '../view/list_view.js';
import SortingView from '../view/sorting_view.js';
import EventView from '../view/event_view.js';
import AddingEventView from '../view/adding_event_view.js';
import EditingEventView from '../view/editing_event_view.js';

const contentAndSortingContainer = document.querySelector('.trip-events');
const filtersContainerElement = document.querySelector('.trip-controls__filters');

const addFilters = () => {
  render(new FiltersView(), filtersContainerElement);
};
const addSorting = () => {
  render(new SortingView(), contentAndSortingContainer);
};

const addList = () => {
  const listView = new ListView();
  listView.addEvent(new AddingEventView().getElement());
  listView.addEvent(new EditingEventView().getElement());
  listView.addEvent(new EventView().getElement());
  listView.addEvent(new EventView().getElement());
  listView.addEvent(new EventView().getElement());
  render(listView, contentAndSortingContainer);
};

export const initView = () => {
  addFilters();
  addSorting();
  addList();
};


