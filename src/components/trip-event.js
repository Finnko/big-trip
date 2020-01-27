import {
  timeTagFormatted,
  castTimeFormat,
  getEventDuration,
  getTripTitle,
  getUpperCaseFirstLetter,
} from "../utils/common";
import AbstractComponent from "./abstract-component";

const OFFERS_MAX_TO_SHOW = 3;

const createOffersMarkup = (offers) => {
  return offers.map((offer) => {
    return (
      `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
        &plus;
       &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
  </li>`
    );
  }).slice(0, OFFERS_MAX_TO_SHOW).join(`\n`);
};

const createTripEventTemplate = (event) => {
  const {type, price, dateStart, dateEnd, eventOffers, city} = event;

  const timeStart = castTimeFormat(dateStart);
  const timeStartTagFormat = timeTagFormatted(dateStart);
  const timeEnd = castTimeFormat(dateEnd);
  const timeEndTagFormat = timeTagFormatted(dateEnd);
  const currentOffers = createOffersMarkup(eventOffers);
  const title = getUpperCaseFirstLetter(getTripTitle(type, city));

  const duration = getEventDuration(dateStart, dateEnd);

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
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${currentOffers}
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
