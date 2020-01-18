import {monthNames} from "../const";
import AbstractComponent from "./abstract-component";

const getTripDuration = (events) => {
  const dateStart = events[0].dateStart;
  const dateEnd = events[events.length - 1].dateEnd;

  return dateStart.getMonth() === dateEnd.getMonth()
    ? `${monthNames[dateStart.getMonth()]} ${dateStart.getDate()} &mdash; ${dateEnd.getDate()}`
    : `${monthNames[dateStart.getMonth()]} ${dateStart.getDate()} &mdash; ${monthNames[dateEnd.getMonth()]} ${dateEnd.getDate()}`;
};

const getTotalTripPrice = (events) => {
  return events.reduce((accum, currentValue) => accum + currentValue.price, 0);
};

const getRoute = (events) => {
  const cities = events.map((item) => item.city);

  return cities.length > 3
    ? `${cities[0]} &mdash; &hellip; &mdash; ${cities[cities.length - 1]}`
    : cities.join(` &mdash; `);
};

const createTripInfoTemplate = (events) => {
  const duration = getTripDuration(events);
  const total = getTotalTripPrice(events);
  const title = getRoute(events);

  return (
    `<div class="trip-info__wrap">
      <div class="trip-info__main">
         <h1 class="trip-info__title">${title}</h1>
         <p class="trip-info__dates">${duration}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
      </p>
    </div>`
  );
};

export default class TripInfo extends AbstractComponent {
  constructor(days) {
    super();

    this._days = days;
  }

  getTemplate() {
    return createTripInfoTemplate(this._days);
  }
}
