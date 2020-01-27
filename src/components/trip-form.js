import AbstractSmartComponent from "./abstract-smart-component";
import {EventTypes} from "../const";
import {Mode} from "../controllers/event";
import {inputTagTimeFormatted, getUpperCaseFirstLetter} from "../utils/common";
import flatpickr from 'flatpickr';
import nanoid from 'nanoid';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const createImagesMarkup = (images) => {
  return images.map((image) => {
    return (
      `<img class="event__photo" src="${image.src}" alt="Event photo">`
    );
  }).join(`\n`);
};

const createGroupTypesMarkup = (group, currentType) => {
  return group.map((type) => {
    const isChecked = type === currentType;
    return (
      `<div class="event__type-item">
         <input
           id="event-type-${type}"
           class="event__type-input  visually-hidden"
           type="radio"
           name="event-type"
           value="${type}"
           ${isChecked ? `checked` : ``}
         >
         <label class="event__type-label  event__type-label--${type}" for="event-type-${type}">
          ${getUpperCaseFirstLetter(type)}
         </label>
       </div>`
    );
  }).join(`\n`);
};

const createTypesMarkup = (allTypes, currentType) => {
  return Object.keys(allTypes).map((group) => {
    return (
      `<fieldset class="event__type-group">
        <legend class="visually-hidden">${group.toLowerCase()}</legend>
          ${createGroupTypesMarkup(allTypes[group], currentType)}
      </fieldset>`
    );
  }).join(`\n`);
};

const checkOffers = (type, offers) => {
  return offers.find((offer) => type === (offer.type)).offers.length !== 0;
};

const createOffersMarkup = (type, eventOffers, allOffers) => {
  const availableOffers = allOffers.find((item) => type === item.type);

  return availableOffers.offers
    .map((offer) => {
      const offerId = nanoid();
      const isChecked = eventOffers.find((eventOffer) => eventOffer.title === offer.title);

      return `<div class="event__offer-selector">
               <input
                 class="event__offer-checkbox  visually-hidden"
                 id="event-offer-${offerId}"
                 type="checkbox"
                 name="event-offer-${type}"
                 ${isChecked ? `checked` : ``}
               >
               <label class="event__offer-label" for="event-offer-${offerId}">
                 <span class="event__offer-title">${offer.title}</span>
                  &plus;
                  &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
              </label>
              </div>`;
    }).join(`\n`);
};

const createDestinationsMarkup = (destinations) => {
  return destinations
    .map((destination) => {
      return `
        <option value="${destination.name}"></option>
      `;
    })
    .join(``);
};

const createEditEventTemplate = (event, options = {}) => {
  const {dateStart, dateEnd, eventOffers, isFavorite, price, photos} = event;
  const {currentCity, currentType, mode, currentDescription, destinations, offers} = options;
  const timeStartFormatted = inputTagTimeFormatted(dateStart);
  const timeEndFormatted = inputTagTimeFormatted(dateEnd);
  const types = createTypesMarkup(EventTypes, currentType);
  const destinationList = createDestinationsMarkup(destinations);
  const currentOffers = createOffersMarkup(currentType, eventOffers, offers);
  const isAvailableOffers = checkOffers(currentType, offers);
  const images = createImagesMarkup(photos);

  return (
    `<form class="trip-events__item event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType}.png" alt="Event type icon">
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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentCity}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationList}
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

        <button class="event__reset-btn" type="reset">${mode === Mode.ADDING ? `Cancel` : `Delete`}</button>

        ${mode === Mode.ADDING ? `<div class="visually-hidden">` : ``}
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
          ${mode === Mode.ADDING ? `</div>` : ``}
      </header>

      ${mode === Mode.ADDING && currentDescription === ``
      ? ``
      : `<section class="event__details">

         ${isAvailableOffers ? `<section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>

              <div class="event__available-offers">
                ${currentOffers}
              </div>
            </section>
          ` : ``}

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${currentDescription}</p>
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${images}
            </div>
          </div>
        </section>
      </section>`
    }
    </form>`
  );
};

export default class TripEdit extends AbstractSmartComponent {
  constructor(event, mode, destinations, offers) {
    super();

    this._event = event;
    this._submitHandler = null;
    this._favoriteButtonHandler = null;
    this._closeButtonHandler = null;
    this._deleteButtonHandler = null;
    this._flatpickr = null;

    this._mode = mode;
    this._currentType = event.type;
    this._currentCity = event.city;
    this._currentDescription = event.description;
    this._destinations = destinations;
    this._offers = offers;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditEventTemplate(this._event, {
      currentType: this._currentType,
      currentCity: this._currentCity,
      currentDescription: this._currentDescription,
      destinations: this._destinations,
      offers: this._offers,
      mode: this._mode,
    });
  }

  getData() {
    const form = this.getElement();
    return new FormData(form);
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    super.removeElement();
  }

  setFavoriteButtonHandler(handler) {
    this.getElement().querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, handler);
    this._favoriteButtonHandler = handler;
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
    this._closeButtonHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);
    this._deleteButtonHandler = handler;
  }

  setFormSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  recoveryListeners() {
    this.setFormSubmitHandler(this._submitHandler);
    this.setFavoriteButtonHandler(this._favoriteButtonHandler);
    this.setCloseButtonClickHandler(this._closeButtonHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  reset() {
    const event = this._event;

    this._currentType = event.type;
    this._currentCity = event.city;
    this._currentDescription = event.description;

    this.rerender();
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    const dateStartElement = this.getElement().querySelector(`#event-start-time-1`);
    const dateEndElement = this.getElement().querySelector(`#event-end-time-1`);

    const setFlatpickr = (input, date) => {
      this._flatpickr = flatpickr(input, {
        allowInput: true,
        defaultDate: date,
        enableTime: true,
        dateFormat: `d/m/y H:i`,
        locale: {
          firstDayOfWeek: 1,
        },
      });
    };

    setFlatpickr(dateStartElement, this._event.dateStart);
    setFlatpickr(dateEndElement, this._event.dateEnd);
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-list`)
      .addEventListener(`click`, (evt) => {
        if (evt.target.tagName === `INPUT`) {
          this._currentType = evt.target.value;
          this.rerender();
        }
      });

    element.querySelector(`.event__input--destination`)
      .addEventListener(`input`, (evt) => {
        const destination = this._destinations.find((item) => {
          return item.name === evt.target.value;
        });

        if (!destination) {
          return;
        }

        const targetCity = destination.name;

        if (this._currentCity === targetCity) {
          return;
        }
        this._currentDescription = destination.description;
        this._currentCity = targetCity;
        this.rerender();
      });
  }
}
