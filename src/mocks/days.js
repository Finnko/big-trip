import {getRandomDate, getRandomTime, repeat, getRandomInRange} from "../utils/common";
import {generateEvent} from "./event";

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

export {generateDays};
