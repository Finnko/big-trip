import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import '../../node_modules/chart.js/dist/Chart.min.css';

const CHART_TEXT_COLOR = `#000000`;
const CHART_TEXT_COLOR_INVERSE = `#ffffff`;

const renderChart = (ctx, data) => {
  return new Chart(ctx, {
    type: `horizontalBar`,
    plugins: [ChartDataLabels],
    data,
    options: {
      layout: {
        padding: {
          left: 70,
          right: 0,
          top: 0,
          bottom: 0
        }
      },

      tooltips: {
        enabled: false
      },

      legend: {
        display: false
      },
    }
  });
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class StatisticsComponent extends AbstractSmartComponent {
  constructor({eventsData}) {
    super();

    this._events = eventsData;
    this._moneyChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  show() {
    super.show();

    this.rerender(this._events);
  }

  rerender() {
    super.rerender();

    this._renderCharts();
  }

  recoveryListeners() {}

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    // const tagsCtx = element.querySelector(`.statistic__tags`);
    // const colorsCtx = element.querySelector(`.statistic__colors`);

    this._resetCharts();

    this._moneyChart = renderChart(moneyCtx, [20,30,40,50,60]);
  }


  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    // if (this._tagsChart) {
    //   this._tagsChart.destroy();
    //   this._tagsChart = null;
    // }
    //
    // if (this._colorsChart) {
    //   this._colorsChart.destroy();
    //   this._colorsChart = null;
    // }
  }
}
