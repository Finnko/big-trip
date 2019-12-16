import MenuComponent from "./components/menu";
import FilterComponent from "./components/filter";
import TripInfoComponent from "./components/trip-info";
import TripBoardComponent from "./components/trip-board";
import SortComponent from "./components/sort-form";
import TripDayComponent from "./components/trip-day";
import TripEventComponent from "./components/trip-event";
import TripEventEditComponent from "./components/trip-form";

import {getUniqueDays, renderComponent, RenderPosition} from "./utils";
import {generateDays} from "./mocks/days";

const DAYS_COUNT = 5;

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);
const routeElement = siteHeaderElement.querySelector(`.trip-info`);
const controlElement = siteHeaderElement.querySelector(`.trip-controls`);
const contentElement = siteMainElement.querySelector(`.trip-events`);

const renderTripDay = (eventDate, events) => {
  const tripDay = new TripDayComponent(eventDate);
  const eventListElement = tripDay.getElement().querySelector(`.trip-events__list`);

  events.forEach((event) => {
    const eventComponent = new TripEventComponent(event);
    const eventEditComponent = new TripEventEditComponent(event);
    const editButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);
    const eventForm = eventEditComponent.getElement();

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        replaceFormToEvent();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const replaceFormToEvent = () => {
      eventListElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
    };

    const replaceEventToForm = () => {
      eventListElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
    };

    editButton.addEventListener(`click`, function () {
      replaceEventToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    eventForm.addEventListener(`submit`, replaceFormToEvent);

    renderComponent(eventListElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
  });

  return tripDay.getElement();
};

const daysData = generateDays(DAYS_COUNT);

const sortedDaysData = daysData.slice().sort((a, b) => a.date.getTime() - b.date.getTime());
const uniqueDays = getUniqueDays(sortedDaysData);

renderComponent(routeElement, new TripInfoComponent(uniqueDays).getElement(), RenderPosition.BEFOREEND);
renderComponent(controlElement, new MenuComponent().getElement(), RenderPosition.BEFOREEND);
renderComponent(controlElement, new FilterComponent().getElement(), RenderPosition.BEFOREEND);
renderComponent(contentElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);

const boardComponent = new TripBoardComponent();
renderComponent(contentElement, boardComponent.getElement(), RenderPosition.BEFOREEND);

const renderDaysEvents = (days) => {
  days.forEach((day) => {
    const tripDay = renderTripDay(day.date, day.events);
    renderComponent(contentElement, tripDay, RenderPosition.BEFOREEND);
  });
};

renderDaysEvents(uniqueDays);
