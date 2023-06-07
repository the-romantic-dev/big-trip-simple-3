export const eventTypes = [
  'taxi', 'bus', 'train',
  'ship', 'drive', 'flight',
  'check-in', 'sightseeing','restaurant'
];

export const dateFormats = {
  dayjs: 'DD/MM/YY HH:mm',
  flatpickr: 'd/m/y H:i',
  iso: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  time: 'HH:mm',
  dashedDate: 'YYYY-MM-DD',
  MMMDD: 'MMM DD'
};

export const UserAction = {
  UPDATE_TASK: 'UPDATE_TASK',
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
};

export const SortType = {
  DAY: 'day',
  PRICE: 'price'
};

export const FilterType = {
  ALL: 'everything',
  FUTURE: 'future'
};

export const cities = ['Chamonix', 'Geneva', 'Amsterdam'];
export const cityToPhotos = new Map([
  [cities[0], ['http://picsum.photos/248/152?r=1', 'http://picsum.photos/248/152?r=2']],
  [cities[1], ['http://picsum.photos/248/152?r=3', 'http://picsum.photos/248/152?r=4']],
  [cities[2], ['http://picsum.photos/248/152?r=5', 'http://picsum.photos/248/152?r=6']]
]);
export const offersTypesAndTitles = [
  ['train', 'Travel by train'],
  ['luggage', 'Add luggage'],
  ['comfort', 'Switch to comfort class'],
  ['meal', 'Add meal'],
  ['seats', 'Choose seats'],
  ['uber', 'Order Uber'],
  ['cabin', 'Large cabin'],
  ['rent', 'Rent a car']
];

export const eventTypeToOffers = new Map([
  [eventTypes[0], [offersTypesAndTitles[2], offersTypesAndTitles[5]]],
  [eventTypes[1], [offersTypesAndTitles[3], offersTypesAndTitles[4]]],
  [eventTypes[2], [offersTypesAndTitles[2], offersTypesAndTitles[3]]],
  [eventTypes[3], [offersTypesAndTitles[6]]],
  [eventTypes[4], [offersTypesAndTitles[7]]],
  [eventTypes[5], [offersTypesAndTitles[1], offersTypesAndTitles[2],offersTypesAndTitles[3], offersTypesAndTitles[4]]],
  [eventTypes[6], []],
  [eventTypes[7], []],
  [eventTypes[8], []]
]);

export const destinationTemple = {
  id: 1,
  description: '',
  name: '',
  pictures: [{}]
};

export const pictureTemple = {
  src: '',
  description: ''
};

export const offerTemple = {
  id: 1,
  title: '',
  price: 0
};

export const pointTemple = {
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destinationId: 0,
  id: 0,
  offersId: 0,
  type: ''
};

export const UpdateType = {
  UPDATE: 'UPDATE',
  INIT: 'INIT',
};
