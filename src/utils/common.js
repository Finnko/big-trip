import moment from "moment";
import {EventTypes} from "../const";

const getUpperCaseFirstLetter = (string) => string.substring(0, 1).toUpperCase() + string.slice(1);

const getTripTitle = (type, city, modifier = `title`) => {
  let delimiter = ``;

  if (EventTypes.TRANSFER.includes(type)) {
    delimiter = `to`;
  } else {
    delimiter = `in`;
  }

  if (modifier === `title`) {
    return `${type} ${delimiter} ${city}`;
  } else {
    return `${type} ${delimiter}`;
  }
};

const parseDate = (dateString) => moment(dateString, `DD/MM/YY HH:mm`).valueOf();

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

const getDatesHoursDiff = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return b.diff(a, `hours`);
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

const isOneDay = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return a.diff(b, `days`) === 0 && dateA === dateB;
};

export {
  getUpperCaseFirstLetter, getTripTitle, getEventDuration, parseDate, timeTagFormatted,
  castDurationFormat, castTimeFormat, inputTagTimeFormatted, isOneDay, getDatesHoursDiff,
};
