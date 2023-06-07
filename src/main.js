import PointsModel from './model/points_model';
import OffersModel from './model/offers_model';
import DestinationsModel from './model/destinations_model';
import { generateRandomString } from './utils';
import FiltersModel from './model/filters_model';
import PointsApiService from './server/services/points_api_service';
import OffersApiService from './server/services/offers_api_service';
import DestinationsApiService from './server/services/destinations_api_service';
import PointsListPresenter from './presenter/points_list_presenter';
import NewPointButtonView from './view/new_point_button_view';
import FiltersPresenter from './presenter/filters_presenter';
import { render } from './framework/render';


const url = 'https://18.ecmascript.pages.academy/big-trip';
const authToken = 'Basic arn83jd6xyz';

const pointsContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');
const newPointButtonContainter = document.querySelector('.trip-main');

const pointsModel = new PointsModel(new PointsApiService(url, authToken));
const offersModel = new OffersModel(new OffersApiService(url, authToken));
const destinationsModel = new DestinationsModel(new DestinationsApiService(url, authToken));
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
