import AbstractView from '../framework/view/abstract-view.js';
import {createElement} from '../render.js';

const createTemplate = () => `
<ul class="trip-events__list">

</ul>`;

export default class ListView extends AbstractView{

  constructor() {
    super();

  }

  addEvent(event) {
    this.element.appendChild(event);
  }

  get template() {
    return createTemplate();
  }
}


