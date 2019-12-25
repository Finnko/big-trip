import AbstractComponent from "./abstract-component";

const createBoardTemplate = () => {
  return (`<ul class="trip-days"></ul>`);
};

export default class TripDays extends AbstractComponent {
  getTemplate() {
    return createBoardTemplate();
  }
}
