export default class ColumnChart {

  constructor (obj = {data: [], label: '', link: '', value: '0'}) {
    this.chartHeight = 50;
    this.data = obj.data;
    this.label = obj.label;
    this.value = obj.value;
    this.link = obj.link;
    this.formatHeading = obj.formatHeading;
    this.getFormatHeading();
    this.render();
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

  getFormatHeading() {
    if (this.formatHeading) {
      this.value = this.formatHeading(this.value);
    }
  }
  getColumns() {
    let res = '';
    if (this.data && this.data.length !== 0) {
      const maxValue = Math.max(...this.data);
      const scale = this.chartHeight / maxValue;
      for (const item of this.data) {
        res += `
        <div style=--value:${String(Math.floor(item * scale))}
        data-tooltip= ${(item / maxValue * 100).toFixed(0)}%></div>`;
      }
    }
    return res;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.classList.add("column-chart");
    if (!this.data || this.data.length === 0) {
      wrapper.classList.add("column-chart_loading");
    }
    wrapper.setAttribute('style', `--chart-height: ${this.chartHeight}`);
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper;
  }

  getTemplate() {
    return `
      ${this.getTitle()}
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.value}</div>
        <div data-element="body" class="column-chart__chart">
          ${this.getColumns()}
        </div>
      </div>
    </div>
  </div>
    `;
  }

  update(newData) {
    this.data = newData;
    this.render();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }


}
