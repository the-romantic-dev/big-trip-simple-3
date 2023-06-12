import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import { remove, render, replace } from '../framework/render.js';
import {UserAction} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #container = null;
  #onDataChange = null;
  #onModeChange = null;

  #pointView = null;
  #editPointView = null;

  #point = null;
  #mode = Mode.DEFAULT;

  #destinationsModel = null;
  #offersModel = null;

  constructor({container, destinationsModel, offersModel, onDataChange, onModeChange}) {
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
    this.#container = container;
  }

  init(point) {
    this.#point = point;
    const destination = this.#destinationsModel.getDestinationById(this.#point.destination);
    const offers = this.#offersModel.getOffersByType(this.#point.type);

    const previousPointView = this.#pointView;
    const previousEditPointView = this.#editPointView;

    this.#pointView = new PointView({
      point: point,
      destination: destination,
      offers: offers,
      onEditClick: this.#replacePointToForm
    });

    this.#editPointView = new EditPointView({
      point: point,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onSubmit: this.#onEdit,
      onDelete: this.#onDelete,
      onClose: this.#onClose,
      viewType: EditPointView.Type.EDIT
    });

    if (previousPointView === null || previousEditPointView === null) {
      render(this.#pointView, this.#container);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointView, previousPointView);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointView, previousEditPointView);
      this.#mode = Mode.DEFAULT;
    }

    remove(previousPointView);
    remove(previousEditPointView);
  }

  destroy() {
    remove(this.#pointView);
    remove(this.#editPointView);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editPointView.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  #onEdit = (update) => {
    this.#onDataChange(UserAction.UPDATE_TASK, update);
  };

  #onDelete = (point) => {
    this.#onDataChange(UserAction.DELETE_TASK, point);
  };

  #onClose = () => {
    this.#editPointView.reset(this.#point);
    this.#replaceFormToPoint();
  };

  get point() {
    return this.eventView.point;
  }

  #replacePointToForm = () => {
    replace(this.#editPointView, this.#pointView);
    document.addEventListener('keydown', this.#onEscKeydown);
    this.#onModeChange();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint() {
    replace(this.#pointView, this.#editPointView);
    document.removeEventListener('keydown', this.#onEscKeydown);
    this.#mode = Mode.DEFAULT;
  }

  #onEscKeydown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#editPointView.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };
}
