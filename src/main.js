import MenuComponent from "./components/menu";
import TripBoardComponent from "./components/trip-board";
import TripController from "./controllers/trip";
import FilterController from "./controllers/filter";
import EventsModel from "./models/point";

import {renderComponent, RenderPosition} from "./utils/render";
import {eventsData} from "./mocks/event";

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);
const controlElement = siteHeaderElement.querySelector(`.trip-controls`);
const contentElement = siteMainElement.querySelector(`.page-body__container`);

renderComponent(controlElement, new MenuComponent(), RenderPosition.BEFOREEND);
const eventsModel = new EventsModel();
eventsModel.setEvents(eventsData);

const filterController = new FilterController(controlElement, eventsModel);
filterController.render();

const boardComponent = new TripBoardComponent();
renderComponent(contentElement, boardComponent, RenderPosition.BEFOREEND);

const tripController = new TripController(boardComponent, eventsModel);

tripController.render();
