import {createTripDayTemplate} from "./trip-day";

const generateDaysMarkup = (days) => {
  return days.map((day) => {
    return createTripDayTemplate(day.date, day.events);
  }).join(`\n`);
};

const createTripDaysContainerTemplate = (daysData) => {
  const daysMarkup = generateDaysMarkup(daysData);

  return (`
    <ul class="trip-days">
      ${daysMarkup}
    </ul>
  `);
};

export {createTripDaysContainerTemplate};
