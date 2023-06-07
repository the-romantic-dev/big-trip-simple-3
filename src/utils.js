import dayjs from 'dayjs';
import { FilterType } from './const';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const capitalize =
  (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const generateRandomString =
  (length) => Math.random().toString(36).slice(2, length);

export const filter = {
  [FilterType.ALL]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs(point.date_from).diff(dayjs()) > 0)
};

export const comparePointsByDay = (pointA, pointB) => {
  const dateA = pointA.date_from;
  const dateB = pointB.date_from;
  return dayjs(dateA).diff(dayjs(dateB), 'minutes');
};

export const sortPointsByPrice = (pointA, pointB) => {
  const priceA = pointA.base_price;
  const priceB = pointB.base_price;
  return priceA - priceB;
};
