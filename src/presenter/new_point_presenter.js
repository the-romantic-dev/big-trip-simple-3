import {remove, render, RenderPosition} from '../framework/render.js';
import EditPointView from '../view/edit_point_view.js';
import {UserAction} from '../const.js';

export default class NewPointPresenter {
  #pointsListContainer = null;
  #onDataChange = null;
  #onDestroy = null;

  #destinationsModel = null;
  #offersModel = null;

  #editPointView = null;
  constructor({pointsListContainer, destinationsModel, offersModel, onDataChange, onDestroy}) {
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointsListContainer = pointsListContainer;
    this.#onDataChange = onDataChange;
    this.#onDestroy = onDestroy;
  }

  init(pointId) {
    if (this.#editPointView !== null) {
      return;
    }

    this.#editPointView = new EditPointView({
      pointId: pointId,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onSubmit: this.#onSubmit,
      onDelete: this.#onDelete,
      viewType: EditPointView.Type.ADD
    });

    render(this.#editPointView, this.#pointsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#onEscKeydown);
  }

  destroy() {
    if (this.#editPointView === null) {
      return;
    }

    this.#onDestroy();

    remove(this.#editPointView);
    this.#editPointView = null;

    document.removeEventListener('keydown', this.#onEscKeydown);
  }

  #onSubmit = (task) => {
    this.#onDataChange(
      UserAction.ADD_TASK,
      task
    );
  };

  #onDelete = () => {
    this.destroy();
  };

  #onEscKeydown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
