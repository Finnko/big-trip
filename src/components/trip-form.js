import AbstractSmartComponent from "./abstract-smart-component";
import {eventOptions, EventTypes} from "../const";
import {destinations, eventsData} from "../mocks/event";
import {formatTime, castTimeFormat} from "../utils/common";

const YEAR_OFFSET = 2;

const castDateTimeFormat = (date) => {
  const year = date.getFullYear().toString().substring(YEAR_OFFSET);
  const month = castTimeFormat(date.getMonth());
  const day = castTimeFormat(date.getDate());

  return `${day}/${month}/${year} ${formatTime(date)}`;
};

const createImagesMarkup = (images) => {
  return images.map((image) => {
    return (
      `<img class="event__photo" src="${image}" alt="Event photo">`
    );
  }).join(`\n`);
};

const createGroupTypesMarkup = (group, currentType) => {
  return group.map((type) => {
    const typeIcon = type.toLowerCase();
    const isChecked = group.find((chosenType) => chosenType === currentType);

    return (
      `<div class="event__type-item">
         <input
           id="event-type-${typeIcon}-1"
           class="event__type-input  visually-hidden"
           type="radio"
           name="event-type"
           value="${typeIcon}"
           ${isChecked ? `checked` : ``}
         >
         <label class="event__type-label  event__type-label--${typeIcon}" for="event-type-${typeIcon}-1">
          ${type}
         </label>
       </div>`
    );
  }).join(`\n`);
};

const createTypesMarkup = (allTypes, currentType) => {
  return Object.keys(allTypes).map((group) => {
    return (
      `<fieldset class="event__type-group">
        <legend class="visually-hidden">${allTypes[group]}</legend>
          ${createGroupTypesMarkup(allTypes[group], currentType)}
      </fieldset>`
    );
  }).join(`\n`);
};

const createOffersMarkup = (allOffers, chosenOffers) => {
  return allOffers.map((offer) => {
    const {name, type, price} = offer;
    const isChecked = Array.from(chosenOffers).some((chosenOffer) => chosenOffer.type === type);

    return (
      `<div class="event__offer-selector">
         <input
           class="event__offer-checkbox  visually-hidden"
           id="event-offer-${type}-1"
           type="checkbox"
           name="event-offer-${type}"
           ${isChecked ? `checked` : ``}
         >
         <label class="event__offer-label" for="event-offer-${type}-1">
           <span class="event__offer-title">${name}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </label>
      </div>`
    );
  }).join(`\n`);
};

const createDestinationsMarkup = () => {
  return [...destinations].map((item) => {
    return `<option value="${item}"></option>`;
  }).join(`\n`);
};

const createEditEventTemplate = (event) => {
  const {type, description, photos, dateStart, dateEnd, options, isFavorite, price, city} = event;

  const timeStartFormatted = castDateTimeFormat(dateStart);
  const timeEndFormatted = castDateTimeFormat(dateEnd);
  const images = createImagesMarkup(photos);
  const types = createTypesMarkup(EventTypes, type);
  const offers = createOffersMarkup(eventOptions, options);
  const destinationOptions = createDestinationsMarkup();

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          <div class="event__type-list">
            ${types}
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            Sightseeing at
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationOptions}
          </datalist>
        </div>
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${timeStartFormatted}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${timeEndFormatted}">
        </div>
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
        <input
          id="event-favorite-1"
          class="event__favorite-checkbox  visually-hidden"
          type="checkbox"
          name="event-favorite"
          ${isFavorite ? `checked` : ``}
        >
        <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
        </label>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offers}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${images}
            </div>
          </div>
        </section>
      </section>
    </form>`
  );
};

export default class TripEdit extends AbstractSmartComponent {
  constructor(event) {
    super();

    this._event = event;
    this._submitHandler = null;
    this._favoriteButtonHandler = null;
    this._closeButtonHandler = null;

    this._eventType = event.type;
    this._eventCity = event.city;
    this._eventDesc = event.description;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditEventTemplate(this._event);
  }

  setFavoriteButtonHandler(handler) {
    this.getElement().querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, handler);
    this._favoriteButtonHandler = handler;
  }

  setCloseButtonClick(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
    this._closeButtonHandler = handler;
  }

  setFormSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  recoveryListeners() {
    this.setFormSubmitHandler(this._submitHandler);
    this.setFavoriteButtonHandler(this._favoriteButtonHandler);
    this.setCloseButtonClick(this._closeButtonHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  reset() {
    this._event.type = this._eventType;
    this._event.city = this._eventCity;
    this._event.description = this._eventDesc;

    this.rerender();
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-list`)
      .addEventListener(`click`, (evt) => {
        if (evt.target.tagName === `INPUT`) {
          this._event.type = evt.target.value;
          this.rerender();
        }
      });

    element.querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => {
        if (evt.target.tagName === `INPUT`) {
          const currentCity = evt.target.value;

          if (this._event.city === currentCity) {
            return;
          }

          const index = eventsData.findIndex((item) => item.city === currentCity);
          this._event.description = eventsData[index].description;
          this._event.city = currentCity;
          this.rerender();
        }
      });
  }
}
