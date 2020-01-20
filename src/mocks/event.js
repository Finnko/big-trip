import {getRandomInRange, getRandomArrayItem, repeat, getRandomDate, getTripTitle} from "../utils/common";
import {eventOptions, EventTypes} from "../const";

const EVENTS_COUNT = 10;

const PHOTOS_MIN_PER_CARD = 3;
const PHOTOS_MAX_PER_CARD = 6;

const PRICE_MAX = 1250;
const PRICE_MIN = 100;
const OFFERS_MIN_NUMBER = 0;
const OFFERS_MAX_NUMBER = 2;

const DESC_MIN_NUMBER = 1;
const DESC_MAX_NUMBER = 3;

const cities = [`Moscow`, `Amsterdam`, `Paris`, `New-York`, `Tokio`, `Helsinki`, `Geneva`];

const defaultDescription = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`.split(`. `);

const generatePhoto = () => `http://picsum.photos/300/150?r=${Math.random()}`;

const generatePhrase = () => getRandomArrayItem(defaultDescription);

const generateOption = () => getRandomArrayItem(eventOptions);


const generateEvent = () => {
  const eventType = getRandomArrayItem(Math.random() > 0.5 ? EventTypes.TRANSFER : EventTypes.ACTIVITY);
  const city = getRandomArrayItem(cities);
  const title = getTripTitle(eventType, city);

  let startDate = getRandomDate();
  let endDate = getRandomDate();

  if (startDate.getTime() > endDate.getTime()) {
    [startDate, endDate] = [endDate, startDate];
  }

  return {
    id: String(new Date() + Math.random()),
    type: eventType,
    title,
    city,
    description: repeat(getRandomInRange(DESC_MIN_NUMBER, DESC_MAX_NUMBER), generatePhrase),
    photos: repeat(getRandomInRange(PHOTOS_MIN_PER_CARD, PHOTOS_MAX_PER_CARD), generatePhoto),
    dateStart: startDate,
    dateEnd: endDate,
    price: getRandomInRange(PRICE_MIN, PRICE_MAX),
    isFavorite: Math.random() > 0.5,
    offers: new Set(repeat(getRandomInRange(OFFERS_MIN_NUMBER, OFFERS_MAX_NUMBER), generateOption)),
  };
};

const eventsData = repeat(EVENTS_COUNT, generateEvent).sort((a, b) => a.dateStart - b.dateStart);

const destinations = new Set(eventsData.map(({city}) => city));

export {eventsData, destinations};
