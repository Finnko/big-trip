import {getRandomDate, getRandomTime, repeat, getRandomInRange} from "../utils/common";
import {generateEvent} from "./event";

const DAYS_COUNT = 5;
const EVENTS_MIN = 1;
const EVENTS_MAX = 4;

const generateDay = () => {
  const targetDate = getRandomDate();
  let eventsData = [];

  for (let i = 1; i <= getRandomInRange(EVENTS_MIN, EVENTS_MAX); i++) {
    let startEvent = getRandomTime(targetDate);
    let endEvent = getRandomTime(targetDate);

    if (startEvent.getTime() > endEvent.getTime()) {
      [startEvent, endEvent] = [endEvent, startEvent];
    }
    eventsData.push(generateEvent(startEvent, endEvent));
  }

  return {
    date: targetDate,
    events: eventsData,
  };
};

const generateDays = (count) => {
  return repeat(count, generateDay);
};

const daysData = generateDays(DAYS_COUNT);

const destinations = new Set(daysData.flatMap((day) => day.events).map(({city}) => city));

export {daysData, destinations};
