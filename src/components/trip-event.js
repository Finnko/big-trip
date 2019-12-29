import {castDateFormat, timeTagFormatted, formatTime} from "../utils/common";
import AbstractComponent from "./abstract-component";

const createOffersMarkup = (offers) => {
  return offers.map((offer) => {
    return (
      `<li class="event__offer">
      <span class="event__offer-title">${offer.name}</span>
        &plus;
       &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
  </li>`
    );
  }).slice(0, 3).join(`\n`);
};

const getEventTimeDuration = (dateStart, dateEnd) => {
  const daysDiff = Math.abs(dateStart.getDate() - dateEnd.getDate());
  const hoursDiff = Math.abs(dateStart.getHours() - dateEnd.getHours());
  const minutesDiff = Math.abs(dateStart.getMinutes() - dateEnd.getMinutes());

  let formattedInterval = daysDiff > 0 ? castDateFormat(daysDiff) : ``;
  if (hoursDiff > 0) {
    formattedInterval += ` ${castDateFormat(hoursDiff, `H`)} `;
  } else {
    formattedInterval += ` `;
  }
  formattedInterval += `${castDateFormat(minutesDiff, `M`)}`;

  return formattedInterval.trim();
};

const getPriceOptions = (offers) => {
  return (offers.size) ? Array.from(offers).reduce((accum, currentValue) => accum + currentValue.price, 0) : 0;
};

const createTripEventTemplate = (event) => {
  const {type, title, price, dateStart, dateEnd, options} = event;

  const timeStart = formatTime(dateStart);
  const timeStartTagFormat = timeTagFormatted(dateStart);
  const timeEnd = formatTime(dateEnd);
  const timeEndTagFormat = timeTagFormatted(dateEnd);
  const offers = createOffersMarkup(Array.from(options));
  const priceWithOptions = price + getPriceOptions(options);

  const duration = getEventTimeDuration(dateStart, dateEnd);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${title}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${timeStartTagFormat}">${timeStart}</time>
            &mdash;
            <time class="event__end-time" datetime="${timeEndTagFormat}">${timeEnd}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${priceWithOptions}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offers}
        </ul>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class TripEvent extends AbstractComponent {
  constructor(event) {
    super();

    this._event = event;
  }

  getTemplate() {
    return createTripEventTemplate(this._event);
  }

  setEditButtonHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}
