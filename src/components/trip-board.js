import AbstractComponent from "./abstract-component";

const createBoardTemplate = () => {
  return (`<ul class="trip-days"></ul>`);
};

export default class TripBoard extends AbstractComponent {
  getTemplate() {
    return createBoardTemplate();
  }
}
