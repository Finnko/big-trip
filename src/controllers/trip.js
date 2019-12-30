import TripDayComponent from "../components/trip-day";
import SortComponent, {SortType} from "../components/sort";
import NoEventsComponent from "../components/no-events";
import TripEventsListComponent from "../components/trip-events";
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

const renderDays = (days, container, onDataChange, onViewChange, pointControllers) => {
  days.forEach((day) => {
    const tripDay = renderTripDay(day.date, day.events, onDataChange, onViewChange, pointControllers);
    renderComponent(container, tripDay, RenderPosition.BEFOREEND);
  });
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._days = [];
    this._pointControllers = [];

    this._noTasksComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._daysListComponent = new TripDaysComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(days) {
    this._days = days;
    const container = this._container.getElement();

    if (!this._days.length) {
      renderComponent(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    renderComponent(container, this._sortComponent, RenderPosition.BEFOREEND);
    renderComponent(container, this._daysListComponent, RenderPosition.BEFOREEND);
    const daysListElement = this._daysListComponent.getElement();

    renderTripInfo(this._days);
    renderDays(this._days, daysListElement, this._onDataChange, this._onViewChange, this._pointControllers);
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._days.findIndex((item) => item === oldData);

    if (index === -1) {
      return;
    }

    this._days = [].concat(this._days.slice(0, index), newData, this._days.slice(index + 1));
    pointController.render(this._days[index]);
  }

  _onViewChange() {
    this._pointControllers.forEach((item) => item.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    const events = this._days.flatMap((day) => day.events);
    let sortedEvents = [];

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

    const daysListElement = this._daysListComponent.getElement();
    daysListElement.innerHTML = ``;

    if (sortedEvents.length) {
      const emptyDayWithSortedEvents = renderTripDay(EMPTY_DATE, sortedEvents, this._onDataChange, this._onViewChange, this._pointControllers);
      renderComponent(daysListElement, emptyDayWithSortedEvents, RenderPosition.BEFOREEND);
      return;
    }

    this._pointControllers = [];
    renderDays(this._days, daysListElement, this._onDataChange, this._onViewChange, this._pointControllers);
  }
}
