import TripEventComponent from "../components/trip-event";
import TripEventEditComponent from "../components/trip-form";
import {renderComponent, replaceComponent, RenderPosition} from '../utils/render.js';
import {removeElement} from "../utils/render";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`,
};

const emptyEvent = {
  id: String(new Date() + Math.random()),
  type: `flight`,
  title: ``,
  city: ``,
  description: ``,
  photos: [],
  dateStart: null,
  dateEnd: null,
  price: 0,
  isFavorite: false,
  offers: [],
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._tripEventComponent = null;
    this._tripEventEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event, mode) {
    const oldTripEventComponent = this._tripEventComponent;
    const oldTripEventEditComponent = this._tripEventEditComponent;
    this._mode = mode;

    this._tripEventComponent = new TripEventComponent(event);
    this._tripEventEditComponent = new TripEventEditComponent(event);

    this._tripEventComponent.setEditButtonHandler(() => {
      this._replaceEventToForm();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._tripEventEditComponent.setCloseButtonClickHandler(() => {
      this._replaceFormToEvent();
    });

    this._tripEventEditComponent.setFavoriteButtonHandler(() => {
      this._onDataChange(this, event, Object.assign({}, event, {
        isFavorite: !event.isFavorite,
      }));
    });

    this._tripEventEditComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._tripEventEditComponent.getData();
      this._onDataChange(this, event, data);
    });

    this._tripEventEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, event, null));

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
