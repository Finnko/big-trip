import MenuComponent from "./components/menu";
import TripBoardComponent from "./components/trip-board";
import TripController from "./controllers/trip";
import FilterController from "./controllers/filter";
import EventsModel from "./models/events";
import StatisticsComponent from './components/statistics.js';

import {renderComponent, RenderPosition} from "./utils/render";
import {eventsData} from "./mocks/event";
import {menuItems} from "./const";

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);
const controlElement = siteHeaderElement.querySelector(`.trip-controls`);
const contentElement = siteMainElement.querySelector(`.page-body__container`);
const createEventElement = siteHeaderElement.querySelector(`.trip-main__event-add-btn`);

const menuComponent = new MenuComponent(menuItems);
const statisticsComponent = new StatisticsComponent();
renderComponent(controlElement, menuComponent, RenderPosition.BEFOREEND);
renderComponent(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);

createEventElement.addEventListener(`click`, () => {
  tripController.createEvent();
});

const eventsModel = new EventsModel();
eventsModel.setEvents(eventsData);

const filterController = new FilterController(controlElement, eventsModel);
filterController.render();

const boardComponent = new TripBoardComponent();
renderComponent(contentElement, boardComponent, RenderPosition.BEFOREEND);

const tripController = new TripController(boardComponent, eventsModel);

tripController.render();
