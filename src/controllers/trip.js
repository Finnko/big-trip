import TripDayComponent from "../components/trip-day";
import SortComponent, {SortType} from "../components/sort";
import NoEventsComponent from "../components/no-events";
import TripDaysComponent from "../components/trip-days";
import {renderComponent, RenderPosition} from "../utils/render";
import TripInfoComponent from "../components/trip-info";
import EventController, {Mode as EventControllerMode, emptyEvent} from "./event";

const getRouteContainer = () => {
  return document.querySelector(`.trip-info`);
};

const renderEvents = (
    events,
    container,
    onDataChange,
    onViewChange,
    destinations,
    offers,
    isSortedByDefault) => {
  const eventControllers = [];
  const dates = isSortedByDefault
    ? Array.from(new Set(events.map((item) => new Date(item.dateStart).toDateString())))
    : [1];

  dates.forEach((date, dateIndex) => {
    const dayComponent = isSortedByDefault ? new TripDayComponent(date, dateIndex + 1) : new TripDayComponent();
    const eventsListContainerElement = dayComponent.getElement().querySelector(`.trip-events__list`);

    events
      .filter((item) => {
        return isSortedByDefault ? new Date(item.dateStart).toDateString() === date : item;
      })
      .forEach((item) => {
        const eventController = new EventController(eventsListContainerElement, onDataChange, onViewChange, destinations, offers);
        eventController.render(item, EventControllerMode.DEFAULT);
        eventControllers.push(eventController);
      });

    renderComponent(container, dayComponent, RenderPosition.BEFOREEND);
  });

  return eventControllers;
};

export default class TripController {
  constructor(container, eventsModel, api) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._api = api;
    this._eventControllers = [];
    this._creatingEvent = null;
    this._destinations = [];
    this._offers = [];
    this._activeSortType = SortType.DEFAULT;

    this._noEventsComponent = null;
    this._sortComponent = new SortComponent();
    this._daysListComponent = new TripDaysComponent();
    this._tripInfoComponent = new TripInfoComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const events = this._eventsModel.getEvents();
    const container = this._container.getElement();
    const routeContainerElement = getRouteContainer();

    if (!events.length) {
      this._noEventsComponent = new NoEventsComponent();
      renderComponent(container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    renderComponent(container, this._sortComponent, RenderPosition.BEFOREEND);
    renderComponent(container, this._daysListComponent, RenderPosition.BEFOREEND);
    renderComponent(routeContainerElement, this._tripInfoComponent, RenderPosition.BEFOREEND);

    this._renderEvents(events, true);
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }

    this._onViewChange();
    const daysListElement = this._daysListComponent.getElement();

    this._creatingEvent = new EventController(
        daysListElement,
        this._onDataChange,
        this._onViewChange,
        this._destinations,
        this._offers);

    this._creatingEvent.render(emptyEvent, EventControllerMode.ADDING);
  }

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  setOffers(offers) {
    this._offers = offers;
  }

  _updateEvents() {
    this._removeEvents();
    this._renderEvents(this._eventsModel.getEvents(), true);
  }

  _removeEvents() {
    const daysListElement = this._daysListComponent.getElement();
    daysListElement.innerHTML = ``;

    this._eventControllers.forEach((eventController) => eventController.destroy());
    this._eventControllers = [];
  }

  _renderEvents(events, isSortedByDefault) {
    const daysListElement = this._daysListComponent.getElement();
    this._eventControllers = renderEvents(
        events,
        daysListElement,
        this._onDataChange,
        this._onViewChange,
        this._destinations,
        this._offers,
        isSortedByDefault);

    this._tripInfoComponent.setEvents(events);
  }

  _createEvent(eventController, newEvent) {
    eventController.blockForm();
    this._api.createEvent(newEvent)
      .then((eventModel) => {
        this._eventsModel.addEvent(eventModel);
        eventController.render(eventModel, EventControllerMode.DEFAULT);

        this._eventControllers = [].concat(eventController, this._eventControllers);

        this._updateEvents();
      })
      .catch(() => {
        eventController.shake();
      });
  }

  _removeCreatingEvent() {
    if (this._creatingEvent) {
      this._creatingEvent.destroy();
      this._creatingEvent = null;
    }
  }

  _updateEvent(eventController, oldEvent, newEvent) {
    eventController.blockForm();
    newEvent.id = oldEvent.id;
    this._api.updateEvent(oldEvent.id, newEvent)
      .then((eventModel) => {
        const isSuccess = this._eventsModel.updateEvent(oldEvent.id, eventModel);

        if (isSuccess) {
          eventController.render(newEvent, EventControllerMode.DEFAULT);
        }
      })
      .catch(() => {
        eventController.shake();
      });
  }

  _deleteEvent(eventController, oldEvent) {
    eventController.blockForm();
    this._api.deleteEvent(oldEvent.id)
      .then(() => {
        this._eventsModel.removeEvent(oldEvent.id);
        this._updateEvents();
      })
      .catch(() => {
        eventController.shake();
      });
  }

  _onDataChange(eventController, oldEvent, newEvent) {
    if (oldEvent === emptyEvent) {
      this._creatingEvent = null;

      if (newEvent === null) {
        eventController.destroy();
        this._updateEvents();

      } else {
        this._createEvent(eventController, newEvent);
      }

    } else if (newEvent === null) {
      this._deleteEvent(eventController, oldEvent);
    } else {
      this._updateEvent(eventController, oldEvent, newEvent);
    }

    this._tripInfoComponent.setEvents(this._eventsModel.getEvents());
  }

  _onViewChange() {
    this._removeCreatingEvent();
    this._eventControllers.forEach((item) => item.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedEvents = [];
    const events = this._eventsModel.getEvents();
    this._activeSortType = sortType;

    switch (sortType) {
      case SortType.PRICE:
        sortedEvents = events.slice().sort((a, b) => b.price - a.price);
        break;
      case SortType.TIME:
        sortedEvents = events.slice().sort((a, b) =>
          Math.abs(b.dateStart - b.dateEnd) -
          Math.abs(a.dateStart - a.dateEnd));
        break;
      case SortType.DEFAULT:
        sortedEvents = [];
        break;
    }

    if (sortedEvents.length) {
      this._removeEvents();
      this._renderEvents(sortedEvents, false);
      return;
    }

    this._removeEvents();
    this._renderEvents(events, true);
  }

  _onFilterChange() {
    this._updateEvents();
    this._onSortTypeChange(this._activeSortType);
  }
}
