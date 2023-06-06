import {generatePoint} from './fish';


export default class PointsModel {

  #points;

  constructor() {
    this.#points = [];
    for (let i = 0; i < 10; i++) {
      this.#points.push(generatePoint());
    }
  }

  get points() {
    return this.#points;
  }

  set points(points) {
    this.#points = points;
  }

  updatePoints(index, newPoints) {
    this.#points[index] = newPoints;
  }

}
