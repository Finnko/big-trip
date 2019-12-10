import {createMenuTemplate} from "./components/menu";
import {createFilterTemplate} from "./components/filter";
import {createSortTemplate} from "./components/sort-form";
import {createTripDaysContainerTemplate} from "./components/trip-day-container";

import {renderComponent} from "./utils";
import {generateDays} from "./mocks/days";
import {createEditTemplate} from "./components/trip-form";

const DAYS_COUNT = 4;
const daysData = generateDays(DAYS_COUNT);
const sortedDaysData = daysData.slice().sort((a, b) => a.date.getTime() - b.date.getTime());

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);
// const routeElement = siteHeaderElement.querySelector(`.trip-info`);
const controlElement = siteHeaderElement.querySelector(`.trip-controls`);
const contentElement = siteMainElement.querySelector(`.trip-events`);


// renderComponent(routeElement, createTripInfoTemplate(eventsData));
renderComponent(controlElement, createMenuTemplate());
renderComponent(controlElement, createFilterTemplate());

renderComponent(contentElement, createSortTemplate());
renderComponent(contentElement, createEditTemplate(sortedDaysData[0]));
renderComponent(contentElement, createTripDaysContainerTemplate(sortedDaysData.slice(1)));
