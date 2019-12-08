import {getRandomInRange, getRandomArrayItem, getRandomDate, repeat} from "../utils";
import {eventOptions} from "../const";

const PHOTOS_MIN_PER_CARD = 3;
const PHOTOS_MAX_PER_CARD = 6;

const PRICE_MAX = 1250;
const PRICE_MIN = 100;

const OFFERS_MIN_NUMBER = 0;
const OFFERS_MAX_NUMBER = 2;

const DESC_MIN_NUMBER = 1;
const DESC_MAX_NUMBER = 3;

const eventTypes = [`taxi`, `bus`, `train`, `ship`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];

const cities = [`Moscow`, `Amsterdam`, `Paris`, `New-York`, `Tokio`, `Helsinki`, `Geneva`];

const defaultDescription = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`];
const descriptions = defaultDescription.toString().split(`. `).sort(() => Math.random() - 0.5);

const generatePhoto = () => `http://picsum.photos/300/150?r=${Math.random()}`;

const generatePhrase = () => getRandomArrayItem(descriptions);

const generateOption = () => getRandomArrayItem(eventOptions);


const generateEvent = () => {
  return {
    type: getRandomArrayItem(eventTypes),
    title: `Title`,
    city: getRandomArrayItem(cities),
    description: repeat(getRandomInRange(DESC_MIN_NUMBER, DESC_MAX_NUMBER), generatePhrase),
    photos: repeat(getRandomInRange(PHOTOS_MIN_PER_CARD, PHOTOS_MAX_PER_CARD), generatePhoto),
    dateStart: getRandomDate(),
    dateEnd: getRandomDate(),
    price: getRandomInRange(PRICE_MIN, PRICE_MAX),
    options: new Set(repeat(getRandomInRange(OFFERS_MIN_NUMBER, OFFERS_MAX_NUMBER), generateOption)),
  };
};

const generateEvents = (count) => {
  return repeat(count, generateEvent);
};

export {generateEvent, generateEvents};
