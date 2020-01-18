import {monthNames} from "../const";
import {timeTagFormatted} from "../utils/common";
import AbstractComponent from "./abstract-component";

const TIME_TAG_OFFSET = -6;

const createTripDayTemplate = (tripDate, dayCount) => {
  const date = new Date(tripDate);
  const count = dayCount ? dayCount : ``;
  const month = tripDate ? monthNames[date.getMonth()] : ``;
  const day = tripDate ? date.getDate() : ``;

  const timeTagDateFormat = timeTagFormatted(date).slice(0, TIME_TAG_OFFSET);

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${count}</span>
        <time class="day__date" datetime="${timeTagDateFormat}">${month} ${day}</time>
      </div>
      <ul class="trip-events__list">

      </ul>
     </li>`
  );
};

export default class TripDay extends AbstractComponent {
  constructor(day, dayCount) {
    super();

    this._day = day;
    this._dayCount = dayCount;
  }

  getTemplate() {
    return createTripDayTemplate(this._day, this._dayCount);
  }
}
