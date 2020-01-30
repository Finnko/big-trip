const eventOptions = [
  {
    name: `Add luggage`,
    type: `luggage`,
    price: 30,
  },
  {
    name: `Switch to comfort`,
    type: `comfort`,
    price: 100,
  },
  {
    name: `Add meal`,
    type: `meal`,
    price: 15,
  },
  {
    name: `Choose seats`,
    type: `seats`,
    price: 5,
  },
  {
    name: `Travel by train`,
    type: `train`,
    price: 40,
  },
];

const monthNames = [
  `Jan`,
  `Feb`,
  `Mar`,
  `Apr`,
  `May`,
  `Jun`,
  `Jul`,
  `Aug`,
  `Sep`,
  `Oct`,
  `Nov`,
  `Dec`,
];

const MenuTitles = {
  TABLE: `Table`,
  STATS: `Stats`,
};

const menuItems = [
  {
    title: `Table`,
    isActive: true,
  },
  {
    title: `Stats`,
    isActive: false,
  },
];

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`,
};

const emptyEvent = {
  type: `bus`,
  city: ``,
  photos: [],
  description: ``,
  eventOffers: [],
  startDate: Date.now(),
  endDate: Date.now(),
  price: 0,
  isFavorite: false
};

const EventTypes = {
  TRANSFER: [`bus`, `drive`, `flight`, `ship`, `taxi`, `train`, `transport`],
  ACTIVITY: [`check-in`, `restaurant`, `sightseeing`],
};

const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};

const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;
const AUTHORIZATION = `Basic gnr59199ik29889a`;

export {
  eventOptions, EventTypes, monthNames, FilterType, menuItems,
  MenuTitles, Method, END_POINT, AUTHORIZATION, emptyEvent, Mode
};
