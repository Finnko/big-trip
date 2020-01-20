import {Method} from "./const";
import EventModel from "./models/event";

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }


  getEvents() {
    return this._load({url: `points`})
      .then((response) => response.json)
      .then(EventModel.parseEvents);
  }

  createEvent(event) {
  }

  updateEvent(id, data) {
  }

  deleteEvent(id) {
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
