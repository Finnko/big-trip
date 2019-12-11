import {getRandomDate, getRandomTime, repeat, getRandomInRange} from "../utils";
import {generateEvent} from "./event";

const EVENTS_MIN = 1;
const EVENTS_MAX = 4;

// const generateEvents = (count, startDate, endDate) => {
//   return repeat(count, generateEvent(startDate, endDate));
// };

const generateDay = () => {
  const targetDate = getRandomDate();
  const startEvent = getRandomTime(targetDate);
  const endEvent = getRandomTime(targetDate);
  let dateStart = startEvent;
  let dateEnd = endEvent;

  if (startEvent.getTime() > endEvent.getTime()) {
    [dateStart, dateEnd] = [endEvent, startEvent];
  }

  let eventsData = [];

  for (let i = 1; i <= getRandomInRange(EVENTS_MIN, EVENTS_MAX); i++) {
    eventsData.push(generateEvent(dateStart, dateEnd));
  }

  return {
    date: targetDate,
    events: eventsData,
  };
};

const generateDays = (count) => {
  return repeat(count, generateDay);
};

export {generateDay, generateDays};
