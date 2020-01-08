import TripDayComponent from "../components/trip-day";
import SortComponent, {SortType} from "../components/sort";
import NoEventsComponent from "../components/no-events";
import TripDaysComponent from "../components/trip-days";
import {renderComponent, RenderPosition} from "../utils/render";
import TripInfoComponent from "../components/trip-info";
import PointController, {Mode as EventControllerMode, emptyEvent} from "./point";

const renderTripInfo = (days) => {
  const routeElement = document.querySelector(`.trip-info`);
  return renderComponent(routeElement, new TripInfoComponent(days), RenderPosition.BEFOREEND);
};

const renderEvents = (events, container, onDataChange, onViewChange, isSortedByDefault) => {
  const pointControllers = [];
  let dates = isSortedByDefault
    ? Array.from(new Set(events.map((item) => new Date(item.dateStart).toDateString())))
    : [1];

  dates.forEach((date, dateIndex) => {
    const dayComponent = isSortedByDefault ? new TripDayComponent(date, dateIndex + 1) : new TripDayComponent();
    const eventsListContainer = dayComponent.getElement().querySelector(`.trip-events__list`);

    events
      .filter((item) => {
        return isSortedByDefault ? new Date(item.dateStart).toDateString() === date : item;
      })
      .forEach((item) => {
        const pointController = new PointController(eventsListContainer, onDataChange, onViewChange);
        pointController.render(item, EventControllerMode.DEFAULT);
        pointControllers.push(pointController);
      });

    renderComponent(container, dayComponent, RenderPosition.BEFOREEND);
  });

  return pointControllers;
};

export default class TripController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._pointControllers = [];
    this._creatingEvent = null;

    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._daysListComponent = new TripDaysComponent();

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

    if (!events.length) {
      renderComponent(container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    renderComponent(container, this._sortComponent, RenderPosition.BEFOREEND);
    renderComponent(container, this._daysListComponent, RenderPosition.BEFOREEND);

    renderTripInfo(events);
    this._renderEvents(events, true);
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }
    const daysListElement = this._daysListComponent.getElement();

    this._creatingEvent = new PointController(daysListElement, this._onDataChange, this._onViewChange);
    this._creatingEvent.render(emptyEvent, EventControllerMode.ADDING);
  }

  _updateEvents() {
    this._removeEvents();
    this._renderEvents(this._eventsModel.getEvents(), true);
  }

  _removeEvents() {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
  }

  _renderEvents(events, isSortedByDefault) {
    const daysListElement = this._daysListComponent.getElement();

    this._pointControllers = renderEvents(events, daysListElement, this._onDataChange, this._onViewChange, isSortedByDefault);
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === emptyEvent) {
      this._creatingEvent = null;
      if (newData === null) {
        pointController.destroy();
        this._updateEvents();
      } else {
        this._eventsModel.addEvent(newData);
        pointController.render(newData, EventControllerMode.DEFAULT);

        const destroyedEvent = this._pointControllers.pop();
        if (destroyedEvent) {
          destroyedEvent.destroy();
        }

        this._pointControllers = [].concat(pointController, this._pointControllers);
      }
    } else if (newData === null) {
      this._eventsModel.removeEvent(oldData.id);
      this._updateEvents();
    } else {
      const isSuccess = this._eventsModel.updateEvent(oldData.id, newData);

      if (isSuccess) {
        pointController.render(newData, EventControllerMode.DEFAULT);
      }
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((item) => item.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedEvents = [];
    const events = this._eventsModel.getEvents();

    switch (sortType) {
      case SortType.PRICE:
        sortedEvents = events.slice().sort((a, b) => b.price - a.price);
        break;
      case SortType.TIME:
        sortedEvents = events.slice().sort((a, b) =>
          Math.abs(b.dateStart.getTime() - b.dateEnd.getTime()) -
          Math.abs(a.dateStart.getTime() - a.dateEnd.getTime()));
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
  }
}
