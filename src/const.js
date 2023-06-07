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

export const UpdateType = {
  UPDATE: 'UPDATE',
  INIT: 'INIT',
};
