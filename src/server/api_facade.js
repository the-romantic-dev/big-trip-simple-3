import PointsApiService from './services/points_api_service';
import OffersApiService from './services/offers_api_service';
import DestinationsApiService from './services/destinations_api_service';

export default class ApiFacade {
  constructor(url, authToken) {
    this.pointsApiService = new PointsApiService(url, authToken);
    this.offersApiService = new OffersApiService(url, authToken);
    this.destinationsApiService = new DestinationsApiService(url, authToken);
  }

  loadData(callback) {
    this.pointsApiService.points.then((pointsResult)=> {
      this.offersApiService.offers.then((offersResult)=>{
        this.destinationsApiService.destinations.then((destinationsResult)=>{
          callback(pointsResult, offersResult, destinationsResult);
        });
      });
    });
  }
}
