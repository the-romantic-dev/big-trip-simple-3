import PointsModel from './model/points-model';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model';
import FiltersModel from './model/filters-model';
import PointsApiService from './server/services/points-api-service';
import OffersApiService from './server/services/offers-api-service';
import DestinationsApiService from './server/services/destinations-api-service';
import PointsListPresenter from './presenter/points-list-presenter';
import NewPointButtonView from './view/new-point-button-view';
import FiltersPresenter from './presenter/filters-presenter';
import { render } from './framework/render';


const URL = 'https://18.ecmascript.pages.academy/big-trip';
const AUTH_TOKEN = 'Basic arn83jd6xyz';

const pointsContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');
const newPointButtonContainter = document.querySelector('.trip-main');

const pointsModel = new PointsModel(new PointsApiService(URL, AUTH_TOKEN));
const offersModel = new OffersModel(new OffersApiService(URL, AUTH_TOKEN));
const destinationsModel = new DestinationsModel(new DestinationsApiService(URL, AUTH_TOKEN));
const filtersModel = new FiltersModel();

const filtersPresenter = new FiltersPresenter({
  container: filtersContainer,
  filtersModel: filtersModel,
  pointsModel: pointsModel
});

const pointsListPresenter = new PointsListPresenter({
  container: pointsContainer,
  pointsModel: pointsModel,
  destinationsModel: destinationsModel,
  offersModel: offersModel,
  filtersModel: filtersModel,
  onNewPointDestroy: onNewPointDestroy,
  onNewPointCreate: ()=>{filtersPresenter.init();}
});

const newPointButtonView = new NewPointButtonView(onNewPointButtonClick);

function onNewPointButtonClick() {
  pointsListPresenter.createPoint();
  newPointButtonView.element.disabled = true;
}

function onNewPointDestroy() {
  newPointButtonView.element.disabled = false;
}

filtersPresenter.init();
pointsListPresenter.init();
offersModel.init().finally(()=>{
  destinationsModel.init().finally(()=>{
    pointsModel.init().finally(()=>{
      render(newPointButtonView, newPointButtonContainter);
    });
  });
});
