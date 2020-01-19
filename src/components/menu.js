import AbstractComponent from "./abstract-component";

const ACTIVE_MENU_CLASS = `trip-tabs__btn--active`;

const createMenuMarkup = (items) => {
  return items.map((item) => {
    const activeClass = item.isActive ? ACTIVE_MENU_CLASS : ``;
    return (
      `<a class="trip-tabs__btn ${activeClass}" id="${item.title}" href="#">
        ${item.title}
      </a>`
    );
  }).join(`\n`);
};

const createMenuTemplate = (items) => {
  const menuItems = createMenuMarkup(items);

  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${menuItems}
    </nav>`
  );
};

export default class SiteMenu extends AbstractComponent {
  constructor(menuItems) {
    super();
    this._menuItems = menuItems;
  }

  getTemplate() {
    return createMenuTemplate(this._menuItems);
  }

  setActiveItem(selectedItem) {
    this.getElement().querySelectorAll(`.trip-tabs__btn`)
      .forEach((item) => {
        if (item.id === selectedItem) {
          item.classList.add(ACTIVE_MENU_CLASS);
        } else {
          item.classList.remove(ACTIVE_MENU_CLASS);
        }
      });
  }

  setChangeHandler(handler) {
    this.getElement()
      .addEventListener(`click`, (evt) => {
        if (evt.target.tagName !== `A`) {
          return;
        }
        const menuItem = evt.target.id;

        handler(menuItem);
      });
  }
}
