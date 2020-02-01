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

const DefaultButtonText = {
  SAVE: `Save`,
  DELETE: `Delete`,
  CANCEL: `Cancel`
};

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
  EventTypes, monthNames, FilterType, menuItems, DefaultButtonText,
  MenuTitles, Method, END_POINT, AUTHORIZATION, emptyEvent, Mode
};
