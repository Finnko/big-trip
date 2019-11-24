export const createTripInfoTemplate = () => {
  return (`
    <div class="trip-info__main">
      <h1 class="trip-info__title">Amsterdam &mdash; Geneva &mdash; Chamonix &mdash; Geneva &mdash; Amsterdam</h1>
      
      <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;21</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
    </p>
  `);
};
