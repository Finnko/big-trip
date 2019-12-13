import {monthNames} from "../const";
import {createElement, timeTagFormatted} from "../utils";

const YEAR_OFFSET = 2;
const TIME_TAG_OFFSET = -6;

const createTripDayTemplate = (eventDate) => {
  const date = new Date(eventDate);
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear().toString().slice(YEAR_OFFSET);

  const timeTagDateFormat = timeTagFormatted(date).slice(0, TIME_TAG_OFFSET);

  // const eventsMarkup = events.map((event) => createTripEventTemplate(event)).join(`\n`);

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${day}</span>
        <time class="day__date" datetime="${timeTagDateFormat}">${month} ${year}</time>
      </div>
      <ul class="trip-events__list">

      </ul>
     </li>`
  );
};

// const generateDaysMarkup = (days) => {
//   return days.map((day) => {
//     return createTripDayTemplate(day.date, day.events);
//   }).join(`\n`);
// };


export default class TripDay {
  constructor(date) {
    this._date = date;
    this._element = null;
  }

  getTemplate() {
    return createTripDayTemplate(this._date);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
