import AbstractSmartComponent from "./abstract-smart-component";
import {EventTypes, DefaultButtonText} from "../const";
import {Mode} from "../controllers/event";
import {inputTagTimeFormatted, getUpperCaseFirstLetter, getTripTitle, parseDate} from "../utils/common";
import flatpickr from 'flatpickr';
import nanoid from 'nanoid';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const SHAKE_ANIMATION_TIMEOUT = 600;

const flatpickrOptions = {
  allowInput: true,
  dateFormat: `d/m/y H:i`,
  enableTime: true,
  locale: {
    firstDayOfWeek: 1,
  },
};

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
  const {eventOffers, isFavorite} = event;
  const {
    currentCity, currentType, mode, currentDescription, destinations, offers,
    currentPhotos, currentPrice, buttonText, currentDateStart, currentDateEnd
  } = options;
  const timeStartFormatted = inputTagTimeFormatted(currentDateStart);
  const timeEndFormatted = inputTagTimeFormatted(currentDateEnd);
  const types = createTypesMarkup(EventTypes, currentType);
  const destinationList = createDestinationsMarkup(destinations);
  const currentOffers = createOffersMarkup(currentType, eventOffers, offers);
  const isAvailableOffers = checkOffers(currentType, offers);
  const images = createImagesMarkup(currentPhotos);

  const titlePlaceholder = getUpperCaseFirstLetter(getTripTitle(currentType, currentCity, `placeholder`));
  const deleteButtonText = buttonText.DELETE;
  const saveButtonText = buttonText.SAVE;
  const cancelButtonText = buttonText.CANCEL;
  const saveButtonDisableState = mode === Mode.ADDING;

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
            ${titlePlaceholder}
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
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${currentPrice}">
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit" ${saveButtonDisableState ? `disabled` : ``}>${saveButtonText}</button>

        <button class="event__reset-btn" type="reset">${mode === Mode.ADDING ? cancelButtonText : deleteButtonText}</button>

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
    this._currentPrice = event.price;
    this._currentDescription = event.description;
    this._currentPhotos = event.photos;
    this._currentDateStart = event.dateStart;
    this._currentDateEnd = event.dateEnd;
    this._destinations = destinations;
    this._offers = offers;
    this._buttonText = DefaultButtonText;

    this._applyFlatpickrs();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditEventTemplate(this._event, {
      currentType: this._currentType,
      currentCity: this._currentCity,
      currentDescription: this._currentDescription,
      currentPhotos: this._currentPhotos,
      currentPrice: this._currentPrice,
      currentDateStart: this._currentDateStart,
      currentDateEnd: this._currentDateEnd,
      destinations: this._destinations,
      offers: this._offers,
      mode: this._mode,
      buttonText: this._buttonText,
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

  blockFormElements() {
    const form = this.getElement();

    form.querySelectorAll(`input`)
      .forEach((element) => (element.disabled = true));

    form.querySelectorAll(`button`)
      .forEach((element) => (element.disabled = true));
  }

  setButtonText(data) {
    this._buttonText = Object.assign({}, DefaultButtonText, data);

    this.rerender();
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

    this._applyFlatpickrs();
  }

  reset() {
    const event = this._event;

    this._currentType = event.type;
    this._currentCity = event.city;
    this._currentPrice = event.price;
    this._currentDescription = event.description;
    this._currentPhotos = event.photos;
    this._currentDateStart = event.dateStart;
    this._currentDateEnd = event.dateEnd;

    this.rerender();
  }

  shake() {
    const element = this.getElement();

    element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      element.style.animation = ``;

      this.setButtonText({
        SAVE: DefaultButtonText.SAVE,
        DELETE: DefaultButtonText.DELETE,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _applyFlatpickrs() {
    this._deleteFlatpickrs();

    const element = this.getElement();
    const dateStartElement = element.querySelector(`#event-start-time-1`);
    const dateEndElement = element.querySelector(`#event-end-time-1`);

    this._flatpickrStartDate = flatpickr(dateStartElement,
        Object.assign(
            {},
            flatpickrOptions,
            {
              defaultDate: this._event.dateStart,
            }
        )
    );

    this._flatpickrEndDate = flatpickr(dateEndElement,
        Object.assign(
            {},
            flatpickrOptions,
            {
              defaultDate: this._event.dateEnd,
              minDate: this._event.dateStart
            }
        )
    );
  }

  _deleteFlatpickrs() {
    if (this._flatpickrStartDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrStartDate = null;
    }

    if (this._flatpickrEndDate) {
      this._flatpickrEndDate.destroy();
      this._flatpickrEndDate = null;
    }
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    const saveButton = element.querySelector(`.event__save-btn`);
    const typeElement = element.querySelector(`.event__type-list`);
    const destinationElement = element.querySelector(`.event__input--destination`);
    const priceElement = element.querySelector(`.event__input--price`);
    const startTimeElement = element.querySelector(`#event-start-time-1`);
    const endTimeElement = element.querySelector(`#event-end-time-1`);

    const checkSaveButtonState = () => {
      return (this._currentCity === `` || this._currentCity === undefined)
        || (this._currentPrice <= 0 || isNaN(this._currentPrice));
    };

    typeElement.addEventListener(`click`, (evt) => {
      if (evt.target.tagName === `INPUT`) {
        this._currentType = evt.target.value;
        this.rerender();
        saveButton.disabled = checkSaveButtonState();
      }
    });

    startTimeElement.addEventListener(`change`, (evt) => {
      this._currentDateStart = parseDate(evt.target.value);

      const defaultDate = parseDate(this._currentDateEnd) > this._currentDateStart
        ? this._currentDateEnd : this._currentDateStart;

      this._flatpickrEndDate = flatpickr(endTimeElement,
          Object.assign(
              {},
              flatpickrOptions,
              {
                defaultDate,
                minDate: this._currentDateStart
              }
          )
      );
    });

    endTimeElement.addEventListener(`change`, (evt) => {
      this._currentDateEnd = parseDate(evt.target.value);
    });

    priceElement.addEventListener(`change`, (evt) => {
      this._currentPrice = parseInt(evt.target.value, 10);
      saveButton.disabled = checkSaveButtonState();
    });

    destinationElement.addEventListener(`change`, (evt) => {
      const destination = this._destinations.find((item) => {
        return item.name === evt.target.value;
      });

      if (!destination) {
        saveButton.disabled = true;
        return;
      }

      this._currentDescription = destination.description;
      this._currentPhotos = destination.pictures;
      this._currentCity = destination.name;
      saveButton.disabled = checkSaveButtonState();
      this.rerender();
    });
  }
}
