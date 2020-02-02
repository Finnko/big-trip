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

  getDestinations() {
    return this._load({url: `destinations`})
      .then((response) => response.json());
  }

  getOffers() {
    return this._load({url: `offers`})
      .then((response) => response.json());
  }

  getEvents() {
    return this._load({url: `points`})
      .then((response) => response.json())
      .then(EventModel.parseEvents);
  }

  getData() {
    return Promise.all([
      this.getEvents(),
      this.getOffers(),
      this.getDestinations(),
    ]).then((response) => {
      const [eventList, offersList, destinations] = response;
      return {
        events: eventList,
        offers: offersList,
        destinations,
      };
    });
  }

  createEvent(event) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(event.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(EventModel.parseEvent);
  }

  updateEvent(id, data) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(EventModel.parseEvent);
  }

  deleteEvent(id) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
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
