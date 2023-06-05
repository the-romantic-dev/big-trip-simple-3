import EventView from '../view/event_view.js';
import EditingEventView from '../view/editing_event_view.js';

export default class EventPresenter {

  #event;
  #currentView;
  constructor(event, resetListCallback) {
    this.#event = event;
    this.editingEventView = new EditingEventView(this.event);
    this.eventView = new EventView(this.event);
    this.resetListCallback = resetListCallback;
    this.#currentView = this.eventView;
  }

  get event() {
    return this.#event;
  }

  get currentView() {
    return this.#currentView;
  }

  replaceEventWithEditingForm() {
    this.eventView.element.replaceWith(this.editingEventView.element);
    this.#currentView = this.editingEventView;
  }

  replaceEditingFormWithEvent() {
    this.editingEventView.element.replaceWith(this.eventView.element);
    this.#currentView = this.eventView;
  }

  #addListenersForListElement() {
    const editingEventViewListener = () => {
      this.replaceEditingFormWithEvent();
      document.removeEventListener('keydown', escListener);
    };

    function escListener (event) {
      if (event.key === 'Escape') {
        editingEventViewListener();
      }
    }

    this.eventView.addButtonClickListener(() => {
      this.resetListCallback();
      this.replaceEventWithEditingForm();
      document.addEventListener('keydown', escListener);
    });

    this.editingEventView.addButtonClickListener(editingEventViewListener);
    this.editingEventView.addSubmitListener(editingEventViewListener);
  }

  createNewEventViewElement() {
    this.#addListenersForListElement();
    return this.eventView.element;
  }
}
