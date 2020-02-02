import FilterComponent from '../components/filter.js';
import {FilterType} from '../const.js';
import {getEventsByFilter} from "../utils/filter";
import {renderComponent, replaceComponent, RenderPosition} from "../utils/render";

export default class FilterController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._activeFilterType = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._eventsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const events = this._eventsModel.getEventsAll();

    const filters = Object.values(FilterType).map((filterType) => {
      return {
        title: filterType,
        checked: filterType === this._activeFilterType,
        disabled: events.length ? getEventsByFilter(events, filterType).length === 0 : false
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replaceComponent(this._filterComponent, oldComponent);
    } else {
      renderComponent(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  _onDataChange() {
    this.render();
  }


  _onFilterChange(filterType) {
    this._eventsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }
}
