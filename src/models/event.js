export default class EventModel {
  constructor(event) {
    this.id = event[`id`];
    this.type = event[`type`];
    this.city = event[`destination`][`name`];
    this.dateStart = new Date(event[`date_from`]).getTime();
    this.dateEnd = new Date(event[`date_to`]).getTime();
    this.eventOffers = event[`offers`];
    this.photos = event[`destination`][`pictures`];
    this.description = event[`destination`][`description`];
    this.price = event[`base_price`];
    this.isFavorite = event[`is_favorite`];
  }

  toRAW() {
    return {
      'id': this.id,
      'base_price': this.price,
      'date_from': new Date(this.dateStart).toISOString(),
      'date_to': new Date(this.dateEnd).toISOString(),
      'destination': {
        description: this.description,
        name: this.city,
        pictures: this.photos
      },
      'is_favorite': this.isFavorite,
      'offers': this.eventOffers,
      'type': this.type
    };
  }

  static parseEvent(event) {
    return new EventModel(event);
  }

  static parseEvents(events) {
    return events.map((item) => EventModel.parseEvent(item));
  }

  static clone(event) {
    return new EventModel(event.toRAW());
  }
}
