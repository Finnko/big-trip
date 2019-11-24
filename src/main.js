import {createTripInfoTemplate} from "./components/trip-info";
import {createMenuTemplate} from "./components/menu";
import {createFilterTemplate} from "./components/filter";
import {createSortTemplate} from "./components/sort-form";
import {createEditTemplate} from "./components/trip-form";
import {createTripDaysContainerTemplate} from "./components/trip-day-container";
import {createTripDayTemplate} from "./components/trip-day";
import {createTripEventTemplate} from "./components/trip-event";

const EVENTS_COUNT = 3;

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);
const routeElement = siteHeaderElement.querySelector(`.trip-info`);
const controlElement = siteHeaderElement.querySelector(`.trip-controls`);
const contentElement = siteMainElement.querySelector(`.trip-events`);

const renderComponent = (container, template, position = `beforeend`) => {
  container.insertAdjacentHTML(position, template);
};

const repeat = (count, fn) => {
  Array(count).fill(``).forEach(fn);
};

renderComponent(routeElement, createTripInfoTemplate());
renderComponent(controlElement, createMenuTemplate());
renderComponent(controlElement, createFilterTemplate());

renderComponent(contentElement, createSortTemplate());
renderComponent(contentElement, createEditTemplate());
renderComponent(contentElement, createTripDaysContainerTemplate());

const tripDaysContainer = document.querySelector(`.trip-days`);
renderComponent(tripDaysContainer, createTripDayTemplate());

const tripDay = document.querySelector(`.trip-events__list`);
repeat(EVENTS_COUNT, () => {
  renderComponent(tripDay, createTripEventTemplate());
});
