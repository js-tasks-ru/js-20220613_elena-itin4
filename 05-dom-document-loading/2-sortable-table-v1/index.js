export default class SortableTable {
  subElements = {};
  element;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();

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
      return `<div className="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="asc">
          <span>${item.title}</span>
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
        template};
    });
    return cells.map(({id, template}) => {
      return template
        ? template(dataItem[id])
        : `<div class= "sortable-table__cell" >${dataItem[id]}</div>`;
    }).join('');
  }



  sort(fieldValue = 'title', orderValue = 'asc') {
    const res = [...this.data];
    const column = this.headerConfig.find(item => item.id === fieldValue);
    const { sortType } = column;

    const directions = {
      asc: 1,
      desc: -1
    };

    const direction = directions[orderValue];

    res.sort((a, b) =>{
      switch (sortType) {
      case 'number':
        return direction * (a[fieldValue] - b[fieldValue]);
      case 'string':
        return direction * a[fieldValue].localeCompare(b[fieldValue], ['ru-RU', 'en-US'], {caseFirst: 'upper'});
      default :
        return direction * (a[fieldValue] - b[fieldValue]);
      }
    });

    this.subElements.body.innerHTML = this.getBody(res);

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
}

