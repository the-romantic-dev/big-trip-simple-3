import {getRandomInteger} from '../utils.js';
import { cities, eventTypes, offersTypesAndTitles } from '../const.js';

const randomType = () => {
  const randomIndex = getRandomInteger(0, eventTypes.length - 1);
  return eventTypes[randomIndex];
};

const randomDate = () => ({
  day: getRandomInteger(1, 31),
  month: getRandomInteger(1, 12),
  year: getRandomInteger(2023, 2030),
  hours: getRandomInteger(0, 23),
  minutes: getRandomInteger(0, 59)
});


export const generateEvent = () => ({
  type: randomType(),
  begin: randomDate(),
  end: randomDate(),
  price: getRandomInteger(10, 100),
});

export const generateDestinastion = () => {
  const randomIndex = getRandomInteger(0, cities.length - 1);

  return {
    city: cities[randomIndex],
    description: 'Lorem ipsum dolor sit amet',
    photos: [
      `http://picsum.photos/248/152?r=${getRandomInteger(5, 33)}`,
      `http://picsum.photos/248/152?r=${getRandomInteger(5, 33)}`
    ]
  };
};

export const generateOffers = () => {
  const randomCount = getRandomInteger(0, 3);
  const result = [];
  for (let i = 0; i < randomCount; i++) {
    const offerIndex = getRandomInteger(0, offersTypesAndTitles.length - 1);
    result.push({
      title: offersTypesAndTitles[offerIndex][1],
      price: getRandomInteger(10, 100),
      name: offersTypesAndTitles[offerIndex][0]
    });
  }
  return result;
};
