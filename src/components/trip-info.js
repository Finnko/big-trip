import {monthNames} from "../const";

const getTripDuration = (events) => {
  const dateStart = events[0].dateStart;
  const dateEnd = events[events.length - 1].dateEnd;

  return (dateStart.getTime() < dateEnd.getTime())
    ? `${monthNames[dateStart.getMonth()]} ${dateStart.getDate()} &mdash; ${dateEnd.getDate()}`
    : `${monthNames[dateEnd.getMonth()]} ${dateEnd.getDate()} &mdash; ${dateStart.getDate()}`;
};

const getTotalTripPrice = (events) => {
  return events.reduce((accum, currentValue) => accum + currentValue.price, 0);
};

const createTripInfoTemplate = (events) => {
  events.slice().sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime());
  const title = events.map((item) => item.city).join(` &mdash; `);
  const duration = getTripDuration(events);
  const total = getTotalTripPrice(events);

  return (
    `<div class="trip-info__main">
         <h1 class="trip-info__title">${title}</h1>
         <p class="trip-info__dates">${duration}</p>
     </div>
     <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
    </p>`
  );
};

export {createTripInfoTemplate};
