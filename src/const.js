const eventOptions = [
  {
    name: `Add luggage`,
    type: `luggage`,
    price: 30
  },
  {
    name: `Switch to comfort`,
    type: `comfort`,
    price: 100
  },
  {
    name: `Add meal`,
    type: `meal`,
    price: 15
  },
  {
    name: `Choose seats`,
    type: `seats`,
    price: 5
  },
  {
    name: `Travel by train`,
    type: `train`,
    price: 40
  },
];

const monthNames = [
  `Jan`,
  `Feb`,
  `Mar`,
  `Apr`,
  `May`,
  `Jun`,
  `Jul`,
  `Aug`,
  `Sep`,
  `Oct`,
  `Nov`,
  `Dec`,
];

const eventTypes = [
  {
    type: `taxi`,
    kind: `action`
  },
  {
    type: `bus`,
    kind: `action`
  },
  {
    type: `train`,
    kind: `action`
  },
  {
    type: `ship`,
    kind: `action`
  },
  {
    type: `drive`,
    kind: `action`
  },
  {
    type: `flight`,
    kind: `action`
  },
  {
    type: `check-in`,
    kind: `place`
  },
  {
    type: `sightseeing`,
    kind: `place`
  },
  {
    type: `restaurant`,
    kind: `place`
  }
];

export {eventOptions, eventTypes, monthNames};
