import {FilterType} from "../const";
import {getEventsByFilter} from "../utils/filter";

export default class Point {
  constructor() {
    this._events = [];
    this._activeFilterType = FilterType.EVERYTHING;

    this._filterChangeHandlers = [];
  }

  getEvents() {
    return getEventsByFilter(this._events, this._activeFilterType);
  }

  setEvents(events) {
    this._events = Array.from(events);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  updateEvent(id, event) {
    const index = this._events.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), event, this._events.slice(index + 1));

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
