import {monthNames} from "../const";
import {timeTagFormatted} from "../utils/common";
import AbstractComponent from "./abstract-component";

const YEAR_OFFSET = 2;
const TIME_TAG_OFFSET = -6;

const createTripDayTemplate = (eventDate) => {
  let date = new Date(eventDate);
  let day = date.getDate();
  let month = monthNames[date.getMonth()];
  let year = date.getFullYear().toString().slice(YEAR_OFFSET);

  if (eventDate === 0) {
    day = ``;
    month = ``;
    year = ``;
  }

  const timeTagDateFormat = timeTagFormatted(date).slice(0, TIME_TAG_OFFSET);

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${day}</span>
        <time class="day__date" datetime="${timeTagDateFormat}">${month} ${year}</time>
      </div>
     </li>`
  );
};

export default class TripDay extends AbstractComponent {
  constructor(date) {
    super();

    this._date = date;
  }

  getTemplate() {
    return createTripDayTemplate(this._date);
  }
}
