import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  chartHeight = 50;
  subElements = {};
  element;
  data = {};

  constructor({
    data = [],
    value = 0,
    label = '',
    link = '',
    formatHeading = data => data,
    url = '',
    range = {from: new Date(), to: new Date()}
  } = {}) {

    this.data = data;
    this.label = label;
    this.value = formatHeading(value);
    this.formatHeading = formatHeading;
    this.link = link;
    this.range = range;
    this.url = new URL(url, BACKEND_URL);

    this.render();
    this.update(this.range.from, this.range.to);
  }

  getSubElements() {
    const res = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      res[name] = subElement;
    }
    return res;
  }

  getTitle() {
    if (this.link) {
      return `
    <div class ="column-chart__title">
      Total ${this.label}
    <a class ="column-chart__link" href=${this.link}>View all</a>
    </div>`;
    } else {
      return `
    <div class ="column-chart__title">
      Total ${this.label}
    </div>`;
    }
  }


  getColumns(data) {
    const maxValue = Math.max(...Object.values(data));

    return Object.entries(data).map(([key, value]) => {
      const scale = this.chartHeight / maxValue;
      const percent = ((value / maxValue) * 100).toFixed(0);
      return `<div style="--value: ${Math.floor(value * scale)}" data-tooltip="${percent}%"></div>`;
    }).join("");
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.classList.add("column-chart");
    wrapper.setAttribute('style', `--chart-height: ${this.chartHeight}`);
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper;
    this.subElements = this.getSubElements();
  }

  getTemplate() {
    return `
      ${this.getTitle()}
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.value}</div>
        <div data-element="body" class="column-chart__chart">
          ${this.getColumns(this.data)}
        </div>
      </div>
    </div>
  </div>`;
  }

  async update(from, to) {
    this.element.classList.add('column-chart_loading');

    const data = await this.loadData(from, to);

    this.setNewRange(from, to);

    if (data && Object.values(data).length) {
      this.subElements.header.innerHTML = this.getHeaderValue(data);
      this.subElements.body.innerHTML = this.getColumns(data);

      this.element.classList.remove("column-chart_loading");
    }

    this.data = data;
    return this.data;
  }

  async loadData(from, to) {
    this.url.searchParams.set('from', from.toISOString());
    this.url.searchParams.set('to', to.toISOString());
    return await fetchJson(this.url);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }

  setNewRange(from, to) {
    this.range.from = from;
    this.range.to = to;
  }

  getHeaderValue(data) {
    return this.formatHeading(Object.values(data).reduce((accum, item) => accum + item, 0));
  }
}
