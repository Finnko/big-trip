import MenuComponent from "./components/menu";
import TripBoardComponent from "./components/trip-board";
import TripController from "./controllers/trip";
import FilterController from "./controllers/filter";
import EventsModel from "./models/events";
import StatisticsComponent from './components/statistics.js';
import {renderComponent, RenderPosition} from "./utils/render";
import {eventsData} from "./mocks/event";
import {menuItems, MenuTitles} from "./const";


const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);
const controlElement = siteHeaderElement.querySelector(`.trip-controls`);
const contentElement = siteMainElement.querySelector(`.page-body__container`);
const createEventElement = siteHeaderElement.querySelector(`.trip-main__event-add-btn`);

const eventsModel = new EventsModel();

const menuComponent = new MenuComponent(menuItems);
const statisticsComponent = new StatisticsComponent();
const boardComponent = new TripBoardComponent();

const filterController = new FilterController(controlElement, eventsModel);
const tripController = new TripController(boardComponent, eventsModel);

createEventElement.addEventListener(`click`, () => {
  tripController.createEvent();
});

menuComponent.setChangeHandler((menuItem) => {
  switch (menuItem) {
    case MenuTitles.TABLE:
      menuComponent.setActiveItem(MenuTitles.TABLE);
      tripController.show();
      statisticsComponent.hide();
      break;
    case MenuTitles.STATS:
      menuComponent.setActiveItem(MenuTitles.STATS);
      statisticsComponent.show();
      tripController.hide();
      break;
  }
});

eventsModel.setEvents(eventsData);

renderComponent(controlElement, menuComponent, RenderPosition.BEFOREEND);
renderComponent(contentElement, boardComponent, RenderPosition.BEFOREEND);
renderComponent(contentElement, statisticsComponent, RenderPosition.BEFOREEND);

filterController.render();
tripController.render();
