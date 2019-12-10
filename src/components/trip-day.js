import {monthNames} from "../const";
import {timeTagFormatted} from "../utils";
import {createTripEventTemplate} from "./trip-event";

const YEAR_OFFSET = 2;
const TIME_TAG_OFFSET = -6;

const createTripDayTemplate = (eventDate, events) => {
  const date = new Date(eventDate);
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear().toString().slice(0, YEAR_OFFSET);
  const timeTagDateFormat = timeTagFormatted(date).slice(0, TIME_TAG_OFFSET);
  console.log(events);
  // const eventsMarkup = createTripEventTemplate(events).join(`\n`);

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${day}</span>
        <time class="day__date" datetime="${timeTagDateFormat}">${month} ${year}</time>
      </div>
      <ul class="trip-events__list">
   
      </ul>
     </li>`
  );
};

export {createTripDayTemplate};
