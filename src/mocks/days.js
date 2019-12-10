import {getRandomDate, getRandomTime, repeat} from "../utils";
import {generateEvent} from "./event";

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
  eventsData.push(generateEvent(dateStart, dateEnd));

  return {
    date: targetDate,
    events: eventsData,
  };
};

const generateDays = (count) => {
  return repeat(count, generateDay);
};

export {generateDay, generateDays};
