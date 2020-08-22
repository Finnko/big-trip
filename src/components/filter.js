import AbstractComponent from "./abstract-component";

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const createFilterMarkup = (filter, isChecked, isDisabled) => {
  const {title} = filter;

  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${title}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${title}"
        ${isChecked ? `checked` : ``}
        ${isDisabled ? `disabled` : ``}
      >
      <label class="trip-filters__filter-label" for="filter-${title}">
        ${title}
      </label>
    </div>`
  );
};

const createFilterTemplate = (filters) => {
  const filterItems = filters.map((item) => createFilterMarkup(item, item.checked, item.disabled)).join(`\n`);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItems}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
