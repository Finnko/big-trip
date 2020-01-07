import {isOneDay} from './common.js';
import {FilterType} from '../const.js';

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
  console.log(filterType);

  switch (filterType) {
    case FilterType.EVERYTHING:
      console.log(1);
      return events;
    case FilterType.PAST:
      console.log(2);
      return getPastEvents(events, nowDate);
    case FilterType.FUTURE:
      console.log(3);
      return getFutureEvents(events, nowDate);
  }

  return events;
};

export {getEventsByFilter};
