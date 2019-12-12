import {createMenuTemplate} from "./components/menu";
import {createFilterTemplate} from "./components/filter";
import {createSortTemplate} from "./components/sort-form";
import {createTripInfoTemplate} from "./components/trip-info";
import {createTripDaysContainerTemplate} from "./components/trip-day-container";
import {createEditTemplate} from "./components/trip-form";

import {getUniqueDays, renderComponent} from "./utils";
import {generateDays} from "./mocks/days";

const DAYS_COUNT = 10;
const daysData = generateDays(DAYS_COUNT);

const sortedDaysData = daysData.slice().sort((a, b) => a.date.getTime() - b.date.getTime());
const uniqueDays = getUniqueDays(sortedDaysData);

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);
const routeElement = siteHeaderElement.querySelector(`.trip-info`);
const controlElement = siteHeaderElement.querySelector(`.trip-controls`);
const contentElement = siteMainElement.querySelector(`.trip-events`);

renderComponent(routeElement, createTripInfoTemplate(uniqueDays));
renderComponent(controlElement, createMenuTemplate());
renderComponent(controlElement, createFilterTemplate());

renderComponent(contentElement, createSortTemplate());
renderComponent(contentElement, createEditTemplate(uniqueDays[0].events[0]));
renderComponent(contentElement, createTripDaysContainerTemplate(uniqueDays.slice(1)));
