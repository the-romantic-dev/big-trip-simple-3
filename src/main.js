import PointsListPresenter from './presenter/points_list_presenter';

const tripEventsElement = document.querySelector('.trip-events');
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');

const presenter = new PointsListPresenter(tripControlsFiltersElement, tripEventsElement);
presenter.init();
