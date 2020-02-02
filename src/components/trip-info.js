import {monthNames} from "../const";
import AbstractSmartComponent from "./abstract-smart-component";

const CITIES_MAX_TO_SHOW = 3;

const getTripDuration = (events) => {
  if (!events || typeof events === `undefined`) {
    return ``;
  }
  const dateStart = new Date(events[0].dateStart);
  const dateEnd = new Date(events[events.length - 1].dateEnd);

  return dateStart.getMonth() === dateEnd.getMonth()
    ? `${monthNames[dateStart.getMonth()]} ${dateStart.getDate()} &mdash; ${dateEnd.getDate()}`
    : `${monthNames[dateStart.getMonth()]} ${dateStart.getDate()} &mdash; ${monthNames[dateEnd.getMonth()]} ${dateEnd.getDate()}`;
};

const getTotalTripPrice = (events) => {
  if (!events || typeof events === `undefined`) {
    return 0;
  }
  return events
    .reduce((totalCost, value) => totalCost + value.price +
      value.eventOffers
        .reduce((totalOffersCost, offer) => totalOffersCost + offer.price, 0), 0);
};

const getRoute = (events) => {
  if (!events || typeof events === `undefined`) {
    return ``;
  }
  const cities = events.map((item) => item.city);

  return cities.length > CITIES_MAX_TO_SHOW
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

export default class TripInfo extends AbstractSmartComponent {
  constructor(events) {
    super();

    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }

  setEvents(events) {
    this._events = events;

    super.rerender();
  }

  recoveryListeners() {
  }
}
