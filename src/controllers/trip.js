import TripDayComponent from "../components/trip-day";
import TripEventComponent from "../components/trip-event";
import TripEventEditComponent from "../components/trip-form";
import SortComponent, {SortType} from "../components/sort";
import NoEventsComponent from "../components/no-events";
import TripEventsListComponent from "../components/trip-events";
import TripDaysComponent from "../components/trip-days";
import {renderComponent, replaceComponent, RenderPosition} from "../utils/render";
import TripInfoComponent from "../components/trip-info";

const renderTripDay = (eventDate, events) => {
  const tripDay = new TripDayComponent(eventDate);
  const tripDayContainer = tripDay.getElement();
  renderEvents(events, tripDayContainer);

  return tripDay;
};

const renderEvents = (events, container) => {
  const eventListComponent = new TripEventsListComponent();
  const eventContainer = eventListComponent.getElement();
  renderComponent(container, eventListComponent, RenderPosition.BEFOREEND);

  events.forEach((event) => {
    const eventComponent = new TripEventComponent(event);
    const eventEditComponent = new TripEventEditComponent(event);

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        replaceFormToEvent();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const replaceFormToEvent = () => {
      replaceComponent(eventComponent, eventEditComponent);
    };

    const replaceEventToForm = () => {
      replaceComponent(eventEditComponent, eventComponent);
    };

    eventComponent.setEditButtonHandler(() => {
      replaceEventToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    eventEditComponent.setFormSubmitHandler(replaceFormToEvent);

    renderComponent(eventContainer, eventComponent, RenderPosition.BEFOREEND);
  });
};

const renderTripInfo = (days) => {
  const routeElement = document.querySelector(`.trip-info`);
  return renderComponent(routeElement, new TripInfoComponent(days), RenderPosition.BEFOREEND);
};

const renderDays = (days, container) => {
  days.forEach((day) => {
    const tripDay = renderTripDay(day.date, day.events);
    renderComponent(container, tripDay, RenderPosition.BEFOREEND);
  });
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._daysListComponent = new TripDaysComponent();
  }

  render(days) {
    const container = this._container.getElement();

    if (!days.length) {
      renderComponent(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    renderComponent(container, this._sortComponent, RenderPosition.BEFOREEND);
    renderComponent(container, this._daysListComponent, RenderPosition.BEFOREEND);
    const daysListElement = this._daysListComponent.getElement();

    renderTripInfo(days);
    renderDays(days, daysListElement);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      //debugger;
      const events = days.flatMap((day) => day.events);
      let sortedEvents = [];

      switch (sortType) {
        case SortType.PRICE:
          sortedEvents = events.slice().sort((a, b) => b.price - a.price);
          break;
        case SortType.DEFAULT:
          sortedEvents = [];
          break;
      }

      daysListElement.innerHTML = ``;
      if (sortedEvents.length) {
        renderEvents(sortedEvents, daysListElement);
        return;
      }

      renderDays(days, daysListElement);
    });
  }
}
