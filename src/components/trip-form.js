import {eventOptions, eventTypes} from "../const";
import {formatTime, castTimeFormat} from "../utils";

const YEAR_OFFSET = 2;

const castDateTimeFormat = (date) => {
  const year = date.getFullYear().toString().substring(YEAR_OFFSET);
  const month = castTimeFormat(date.getMonth());
  const day = castTimeFormat(date.getDate());

  return `${day}/${month}/${year} ${formatTime(date)}`;
};

const generateImagesMarkup = (images) => {
  return images.map((image) => {
    return (
      `<img class="event__photo" src="${image}" alt="Event photo">`
    );
  }).join(`\n`);
};

const generateAllTypesMarkup = (allTypes, currentType) => {
  return allTypes.map((type) => {
    const isChecked = allTypes.find((chosenType) => chosenType === currentType);

    return (
      `<div class="event__type-item">
         <input
           id="event-type-${type}-1"
           class="event__type-input  visually-hidden"
           type="radio"
           name="event-type"
           value="${type}"
           ${isChecked ? `checked` : ``}
         >
         <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">
          ${type}
         </label>
       </div>`
    );
  }).join(`\n`);
};

const generateAllOffersMarkup = (allOffers, chosenOffers) => {
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

const createEditTemplate = (event) => {
  const {type, description, photos, dateStart, dateEnd, options} = event;

  const timeStartFormatted = castDateTimeFormat(dateStart);
  const timeEndFormatted = castDateTimeFormat(dateEnd);
  const images = generateImagesMarkup(photos);
  const types = generateAllTypesMarkup(eventTypes, type);
  const offers = generateAllOffersMarkup(eventOptions, options);

  return (`
    <form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${types}
            </fieldset>
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>
              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>
              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            Sightseeing at
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
            <option value="Saint Petersburg"></option>
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
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
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
    </form>
  `);
};

export {createEditTemplate};
