import TripDayComponent from "../components/trip-day";
import SortComponent, {SortType} from "../components/sort";
import NoEventsComponent from "../components/no-events";
import TripDaysComponent from "../components/trip-days";
import {renderComponent, RenderPosition} from "../utils/render";
import TripInfoComponent from "../components/trip-info";
import PointController from "./point";

const EMPTY_DATE = 0;

const renderTripDay = (eventDate, events, onDataChange, onViewChange, pointControllers) => {
  const tripDay = new TripDayComponent(eventDate);
  const tripDayContainer = tripDay.getElement();
  const eventListComponent = new TripEventsListComponent();
  const eventContainer = eventListComponent.getElement();
  renderComponent(tripDayContainer, eventListComponent, RenderPosition.BEFOREEND);

  events.forEach((event) => {
    const pointController = new PointController(eventContainer, onDataChange, onViewChange);
    pointController.render(event);
    pointControllers.push(pointController);
  });

  return tripDay;
};

const renderTripInfo = (days) => {
  const routeElement = document.querySelector(`.trip-info`);
  return renderComponent(routeElement, new TripInfoComponent(days), RenderPosition.BEFOREEND);
};

const renderEvents = (events, container, onDataChange, onViewChange) => {
  const pointControllers = [];
  const dates = Array.from(new Set(events.map((item) => new Date(item.dateStart).toDateString())));

  dates.forEach((date, dateIndex) => {
    const dayComponent = new TripDayComponent(date, dateIndex + 1);
    const eventsListContainer = dayComponent.getElement().querySelector(`.trip-events__list`);

    events
      .filter((item) => {
        return new Date(item.dateStart).toDateString() === date;
      })
      .forEach((item) => {
        const pointController = new PointController(eventsListContainer, onDataChange, onViewChange);
        pointController.render(item);
        pointControllers.push(pointController);
      });

    renderComponent(container, dayComponent, RenderPosition.BEFOREEND);
  });

  return pointControllers;
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._events = [];
    this._pointControllers = [];

    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._daysListComponent = new TripDaysComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(events) {
    this._events = events;
    const container = this._container.getElement();

    if (!this._events.length) {
      renderComponent(container, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }

    renderComponent(container, this._sortComponent, RenderPosition.BEFOREEND);
    renderComponent(container, this._daysListComponent, RenderPosition.BEFOREEND);
    const daysListElement = this._daysListComponent.getElement();

    renderTripInfo(this._events);
    this._pointControllers = renderEvents(this._events, daysListElement, this._onDataChange, this._onViewChange);
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._events.findIndex((item) => item === oldData);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));
    pointController.render(this._events[index]);
  }

  _onViewChange() {
    this._pointControllers.forEach((item) => item.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedEvents = [];

    switch (sortType) {
      case SortType.PRICE:
        sortedEvents = this._events.slice().sort((a, b) => b.price - a.price);
        break;
      case SortType.TIME:
        sortedEvents = this._events.slice().sort((a, b) =>
          Math.abs(b.dateStart.getTime() - b.dateEnd.getTime()) -
          Math.abs(a.dateStart.getTime() - a.dateEnd.getTime()));
        break;
      case SortType.DEFAULT:
        sortedEvents = [];
        break;
    }

    const daysListElement = this._daysListComponent.getElement();
    daysListElement.innerHTML = ``;

    if (sortedEvents.length) {
      const emptyDayWithSortedEvents = renderTripDay(EMPTY_DATE, sortedEvents, this._onDataChange, this._onViewChange, this._pointControllers);
      renderComponent(daysListElement, emptyDayWithSortedEvents, RenderPosition.BEFOREEND);
      return;
    }

    renderDays(this._days, daysListElement, this._onDataChange, this._onViewChange, this._pointControllers);
  }
}
