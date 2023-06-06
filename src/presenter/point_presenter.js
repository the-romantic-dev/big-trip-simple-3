import PointView from '../view/event_view.js';
import EditPointView from '../view/edit_point_view.js';

export default class PointPresenter {

  #currentView;
  constructor(point, destination, offers, resetListCallback, resetButtonListener) {
    this.editingEventView = new EditPointView(point, destination, offers);
    this.eventView = new PointView(point, destination, offers);
    this.resetListCallback = resetListCallback;
    this.#currentView = this.eventView;
    this.editingEventView.addResetButtonListener(()=>{
      resetButtonListener(this);
    });
  }

  get currentView() {
    return this.#currentView;
  }

  get point() {
    return this.eventView.point;
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

    this.editingEventView.addCloseButtonClickListener(editingEventViewListener);
    this.editingEventView.addSubmitListener(editingEventViewListener);
  }

  createNewEventViewElement() {
    this.#addListenersForListElement();
    return this.eventView.element;
  }
}
