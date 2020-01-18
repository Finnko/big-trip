import AbstractComponent from "./abstract-component";

const ACTIVE_MENU_CLASS = `trip-tabs__btn--active`;

const createMenuMarkup = (items) => {
  return items.map((item) => {
    const activeClass = item.isActive ? ACTIVE_MENU_CLASS : ``;
    return (
      `<a class="trip-tabs__btn ${activeClass}" href="#">
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
}
