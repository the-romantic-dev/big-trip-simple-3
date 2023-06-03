import Presenter from './presenter/presenter';

const tripEventsElement = document.querySelector('.trip-events');
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');

const presenter = new Presenter();
presenter.init(tripControlsFiltersElement, tripEventsElement);
