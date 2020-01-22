export default class EventModel {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.city = data[`destination`][`name`];
    this.dateStart = new Date(data[`date_from`]).getTime();
    this.dateEnd = new Date(data[`date_to`]).getTime();
    this.offers = data[`offers`];
    this.photos = data[`destination`][`pictures`];
    this.description = data[`destination`][`description`];
    this.price = data[`base_price`];
    this.isFavorite = data[`is_favorite`];
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
      'offers': this.offers,
      'type': this.type
    };
  }

  static parseEvent(data) {
    return new EventModel(data);
  }

  static parseEvents(data) {
    return data.map((item) => EventModel.parseEvent(item));
  }

  static clone(data) {
    return new EventModel(data.toRAW());
  }
}
