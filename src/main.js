import MenuComponent from "./components/menu";
import FilterComponent from "./components/filter";
import TripInfoComponent from "./components/trip-info";
import TripBoardComponent from "./components/trip-board";
import SortComponent from "./components/sort-form";
import TripDayComponent from "./components/trip-day";
import TripEventComponent from "./components/trip-event";
import TripEventEditComponent from "./components/trip-form";
import NoEventsComponent from "./components/no-events";

import {renderComponent, RenderPosition} from "./utils/render";
import {getUniqueDays} from "./utils/common";
import {generateDays} from "./mocks/days";
import BoardController from "./controllers/board";

const DAYS_COUNT = 5;

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);
const routeElement = siteHeaderElement.querySelector(`.trip-info`);
const controlElement = siteHeaderElement.querySelector(`.trip-controls`);
const contentElement = siteMainElement.querySelector(`.page-body__container`);

const daysData = generateDays(DAYS_COUNT);

const sortedDaysData = daysData.slice().sort((a, b) => a.date.getTime() - b.date.getTime());
const uniqueDays = getUniqueDays(sortedDaysData);

renderComponent(controlElement, new MenuComponent(), RenderPosition.BEFOREEND);
renderComponent(controlElement, new FilterComponent(), RenderPosition.BEFOREEND);
renderComponent(routeElement, new TripInfoComponent(uniqueDays), RenderPosition.BEFOREEND);

const boardComponent = new TripBoardComponent();
renderComponent(contentElement, boardComponent, RenderPosition.BEFOREEND);

const boardController = new BoardController(boardComponent);
boardController.render(uniqueDays);
