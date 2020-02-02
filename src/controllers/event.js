import TripEventComponent from "../components/trip-event";
import TripEventEditComponent from "../components/trip-form";
import EventModel from "../models/event";
import {renderComponent, replaceComponent, removeElement, RenderPosition} from '../utils/render.js';
import {parseDate} from "../utils/common";
import {emptyEvent, Mode, ActionButtonText} from "../const";
import moment from 'moment';
import he from 'he';

const parseFormData = (formData, form, destinations) => {
  const city = he.encode(formData.get(`event-destination`));
  const destination = destinations.find((item) => {
    return city === item.name;
  });

  const offersChecked = [...form.querySelectorAll(`.event__offer-checkbox:checked`)];
  const offers = offersChecked.map((input) => {
    return {
      title: input.parentElement.querySelector(`.event__offer-title`).textContent,
      price: parseInt(input.parentElement.querySelector(`.event__offer-price`).textContent, 10),
    };
  });

  const startDate = parseDate(formData.get(`event-start-time`));
  const endDate = parseDate(formData.get(`event-end-time`));
  const price = he.encode(formData.get(`event-price`));

  return new EventModel({
    'type': formData.get(`event-type`),
    'destination': destination,
    'offers': offers,
    'date_from': moment(startDate).toISOString(),
    'date_to': moment(endDate).toISOString(),
    'base_price': parseInt(price, 10),
    'is_favorite': formData.get(`event-favorite`) === `on`,
  });
};

export default class EventController {
  constructor(container, onDataChange, onViewChange, destinations, offers) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;
    this._destinations = destinations;
    this._offers = offers;

    this._tripEventComponent = null;
    this._tripEventEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event, mode) {
    const oldTripEventComponent = this._tripEventComponent;
    const oldTripEventEditComponent = this._tripEventEditComponent;
    this._mode = mode;
    this._event = event;

    this._tripEventComponent = new TripEventComponent(this._event);
    this._tripEventEditComponent = new TripEventEditComponent(this._event, this._mode, this._destinations, this._offers);

    this._tripEventComponent.setEditButtonHandler(() => {
      this._replaceEventToForm();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._tripEventEditComponent.setFavoriteButtonHandler(() => {
      const newEvent = EventModel.clone(this._event);
      newEvent.isFavorite = !newEvent.isFavorite;

      this._onDataChange(this, this._event, newEvent);
    });

    this._tripEventEditComponent.setCloseButtonClickHandler(() => {
      this._replaceFormToEvent();
    });

    this._tripEventEditComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();

      const formData = this._tripEventEditComponent.getData();
      const form = this._tripEventEditComponent.getElement();
      const parsedFormData = parseFormData(formData, form, this._destinations);

      this._tripEventEditComponent.setButtonText({
        SAVE: ActionButtonText.SAVE
      });

      this._onDataChange(this, this._event, parsedFormData);
    });

    this._tripEventEditComponent.setDeleteButtonClickHandler(() => {
      this._onDeleteButtonClick(this._mode);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldTripEventComponent && oldTripEventEditComponent) {
          replaceComponent(this._tripEventComponent, oldTripEventComponent);
          replaceComponent(this._tripEventEditComponent, oldTripEventEditComponent);

          this._replaceFormToEvent();
        } else {
          renderComponent(this._container, this._tripEventComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldTripEventComponent && oldTripEventEditComponent) {
          removeElement(oldTripEventComponent);
          removeElement(oldTripEventEditComponent);
        }

        document.addEventListener(`keydown`, this._onEscKeyDown);
        renderComponent(this._container, this._tripEventEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  destroy() {
    removeElement(this._tripEventComponent);
    removeElement(this._tripEventEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  blockForm() {
    this._tripEventEditComponent.blockFormElements();
  }

  shake() {
    this._tripEventEditComponent.shake();
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  _replaceFormToEvent() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._tripEventEditComponent.reset();

    if (document.contains(this._tripEventEditComponent.getElement())) {
      replaceComponent(this._tripEventComponent, this._tripEventEditComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _replaceEventToForm() {
    this._onViewChange();

    replaceComponent(this._tripEventEditComponent, this._tripEventComponent);
    this._mode = Mode.EDIT;
  }

  _onDeleteButtonClick(mode) {
    if (mode === Mode.ADDING) {
      this._onDataChange(this, emptyEvent, null);
    } else {
      this._tripEventEditComponent.setButtonText({
        DELETE: ActionButtonText.DELETE
      });

      this._onDataChange(this, this._event, null);
    }
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, emptyEvent, null);
      }
      this._replaceFormToEvent();
    }
  }
}

export {Mode, emptyEvent};
