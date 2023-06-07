import { UpdateType } from '../const';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable{

  #pointsApiService = null;
  #points = [];

  constructor(pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  async init() {
    try {
      this.#points = await this.#pointsApiService.points;
    } catch(err) {
      // eslint-disable-next-line no-console
      console.log(err);
      this.#points = [];
    }

    this._notify(UpdateType.INIT);

  }

  get points() {
    return this.#points;
  }

  async updatePoint(update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        response,
        ...this.#points.slice(index + 1),
      ];
      this._notify(UpdateType.UPDATE);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(update) {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      this.#points = [response, ...this.#points];
      this._notify(UpdateType.UPDATE);
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(update) {
    console.log(update);
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#pointsApiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(UpdateType.UPDATE);
    } catch(err) {
      throw new Error('Can\'t delete point');
    }
  }
}
