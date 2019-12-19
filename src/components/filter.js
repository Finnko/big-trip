import {getFilterItems} from "../mocks/filter";
import AbstractComponent from "./abstract-component";

const createFilterMarkup = (filters) => {
  return filters.map((filter) => {
    const isChecked = filter.isChecked ? `checked` : ``;
    return (`
      <div class="trip-filters__filter">
        <input id="filter-${filter.title}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.title}" ${isChecked}>
        <label class="trip-filters__filter-label" for="filter-${filter.title}">${filter.title}</label>
      </div>
    `);
  }).join(`\n`);
};

const createFilterTemplate = () => {
  const filterItems = createFilterMarkup(getFilterItems());

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItems}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filter extends AbstractComponent {
  getTemplate() {
    return createFilterTemplate();
  }
}
