import {isOneDay} from './common.js';
import {FilterType} from '../const.js';

const getEverythingEvents = (events) => {
  return events.slice().sort((a, b) => a.startDate - b.startDate);
};

const getPastEvents = (events, date) => {
  return events.filter((event) => event.dateStart < date
    && !isOneDay(date, event.dateStart));
};

const getFutureEvents = (events, date) => {
  return events.filter((event) => event.dateStart > date
    && !isOneDay(date, event.dateStart));
};

const getEventsByFilter = (events, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.EVERYTHING:
      return getEverythingEvents(events);
    case FilterType.PAST:
      return getPastEvents(events, nowDate);
    case FilterType.FUTURE:
      return getFutureEvents(events, nowDate);
  }

  return events;
};

export {getEventsByFilter};
