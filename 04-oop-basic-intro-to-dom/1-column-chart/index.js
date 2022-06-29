

export default class ColumnChart {
  chartHeight = 50;
  subElements = {};

  constructor ({data = [], label = '', link = '', value = 0, formatHeading = data => data} = {}) {
    this.data = data;
    this.label = label;
    this.value = formatHeading(value);
    this.link = link;

    this.render();
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


  getColumns() {
    if (this.data.length !== 0) {
      const maxValue = Math.max(...this.data);
      const scale = this.chartHeight / maxValue;

      return this.data.map(item => {
        const percent = ((item / maxValue) * 100).toFixed(0);

        return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
      }).join("");
    }
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
    this.subElements = this.getSubElements();
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
    this.subElements.body.innerHTML = this.getColumns();
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


}
