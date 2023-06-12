import AbstractView from '../framework/view/abstract-view.js';

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

  addAllEvents(events) {
    events.forEach((event) => {
      this.addEvent(event);
    });
  }

  get template() {
    return createTemplate();
  }

  clear() {
    this.element.innerHTML = '';
  }
}


