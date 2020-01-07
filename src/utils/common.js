import moment from "moment";

const getRandomInRange = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomInRange(0, array.length - 1);

  return array[randomIndex];
};

const getRandomDate = () => {
  const targetDate = new Date();

  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomInRange(0, 3);
  const hours = getRandomInRange(0, 23);
  const minutes = getRandomInRange(0, 59);

  targetDate.setDate(targetDate.getDate() + diffValue);
  targetDate.setHours(hours, minutes);

  return targetDate;
};

const castTimeFormat = (value) => {
  return moment(value).format(`HH:mm`);
};

const castDurationFormat = (value, liter = `D`) => {
  return value < 10 ? `0${value}${liter}` : `${value}${liter}`;
};

const timeTagFormatted = (date) => {
  return moment(date).format(`YYYY-MM-DDTHH:mm`);
};

const inputTagTimeFormatted = (date) => {
  return moment(date).format(`DD/MM/YY HH:mm`);
};

const repeat = (count, fn) => {
  return Array(count).fill(``).map(fn);
};

const getEventDuration = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);
  const daysDiff = b.diff(a, `days`);
  const hoursDiff = b.diff(a, `hours`) - daysDiff * 24;
  const minutesDiff = b.diff(a, `minutes`) - daysDiff * 24 * 60 - hoursDiff * 60;

  let formattedInterval = daysDiff > 0 ? castDurationFormat(daysDiff) : ``;
  if (hoursDiff > 0) {
    formattedInterval += ` ${castDurationFormat(hoursDiff, `H`)} `;
  } else {
    formattedInterval += ` `;
  }
  formattedInterval += `${castDurationFormat(minutesDiff, `M`)}`;

  return formattedInterval.trim();
};

export {
  getRandomInRange, getRandomArrayItem, getRandomDate, repeat, getEventDuration,
  timeTagFormatted, castDurationFormat, castTimeFormat, inputTagTimeFormatted
};
