export default class SortableTable {
  subElements = {};
  element;


  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {

    this.headerConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;
    this.isSortLocally = true;


    this.render();
    this.initListeners();
  }


  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    const element = wrapper.firstElementChild;
    this.element = element;

    this.subElements = this.getSubElements(element);
  }

  getTemplate() {
    return `
    <div data-element="productsContainer" class="products-list__container">
    <div class="sortable-table">
    <div data-element="header" class="sortable-table__header sortable-table__row">
    ${this.getHeader()}
    </div>
    <div data-element="body" class="sortable-table__body">
    ${this.getBody()}
    </div>
    <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

    <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
      <div>
        <p>No products satisfies your filter criteria</p>
        <button type="button" class="button-primary-outline">Reset all filters</button>
      </div>
    </div>

  </div>
</div>`;
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

  getHeader() {
    return this.headerConfig.map(item => {
      return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
          <span>${item.title}</span>
          <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
        </div>`;
    }).join("");
  }

  getBody(res = this.data) {
    if (res !== 0) {
      return res.map(dataItem => {
        return `
        <a href="/products/${dataItem.id}" class="sortable-table__row">
        ${this.getDataItems(dataItem)}
        </a>`;
      }).join("");
    }
  }

  getDataItems(dataItem) {
    const cells = this.headerConfig.map(({id, template}) => {
      return {
        id,
        template
      };
    });
    return cells.map(({id, template}) => {
      return template
        ? template(dataItem[id])
        : `<div class= "sortable-table__cell" >${dataItem[id]}</div>`;
    }).join('');
  }


  sortData(fieldValue = 'title', orderValue = 'asc') {
    const res = [...this.data];
    const column = this.headerConfig.find(item => item.id === fieldValue);
    const {sortType} = column;

    const directions = {
      asc: 1,
      desc: -1
    };

    const direction = directions[orderValue];

    return res.sort((a, b) => {
      switch (sortType) {
      case 'number':
        return direction * (a[fieldValue] - b[fieldValue]);
      case 'string':
        return direction * a[fieldValue].localeCompare(b[fieldValue], ['ru-RU', 'en-US'], {caseFirst: 'upper'});
      default :
        return direction * (a[fieldValue] - b[fieldValue]);
      }
    });
  }

  sort(fieldValue = this.sorted.id, order = this.sorted.order) {
    const sortedData = this.sortData(fieldValue, order);
    const columns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id =${fieldValue}]`);

    columns.forEach(item => {
      item.dataset.order = '';
    });

    currentColumn.dataset.order = order;

    if (this.subElements) {
      this.subElements.body.innerHTML = this.getBody(sortedData);

    }
  }


  getSubElements(element) {
    const res = {};
    const elements = element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      res[name] = subElement;
    }
    return res;
  }

  initListeners() {
    document.addEventListener("DOMContentLoaded", event => {
      this.sort();
    });
    const header = this.element.querySelector('.sortable-table__header');
    header.addEventListener('pointerdown', event => {
      const headerCell = event.target.closest('.sortable-table__cell[data-sortable="true"]');
      if (headerCell) {
        this.sort(headerCell.dataset.id, (headerCell.dataset.order === 'asc' || !headerCell.dataset.order) ? 'desc' : this.sorted.order);
      }
    });
  }

}




