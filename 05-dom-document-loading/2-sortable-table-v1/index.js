export default class SortableTable {
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = [...headerConfig];
    this.data = [...data];

    this.sort();
    this.render();

  }

  render() {

    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper.firstElementChild;

    this.subElements = this.getSubElement();
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
    if (this.headerConfig.length !== 0) {
      return this.headerConfig.map(item => {
        return `<div className="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="asc">
          <span>${item.title}</span>
        </div>`;
      }).join("");
    }

  }

  getBody() {
    if (this.data !== 0) {
      return this.data.map(dataItem => {
        return `
        <a href="/products/${dataItem.id}" class="sortable-table__row">
        ${this.getDataItems(dataItem)}
        </a>`;
      }).join("");
    }
  }

  getDataItems(dataItem) {
    return this.headerConfig.map(headerItem => {
      return headerItem.id !== 'images' ? `<div class= "sortable-table__cell" >${dataItem[headerItem.id]}</div>` : this.getImage(headerItem.template, dataItem[headerItem.id]);
    }).join("");
  }


  getImage(template, arr = []) {
    if (template) {
      return template(arr);
    } else {
      return `
    <div class="sortable-table__cell">
      <img class="sortable-table-image" alt="Image" src="http://magazilla.ru/jpg_zoom1/246743.jpg">
    </div>`;
    }
  }


  sort(fieldValue = 'title', orderValue = 'asc') {
    const res = [...this.data];
    const sortType = this.headerConfig.filter(item => (item.id === fieldValue))[0].sortType;
    if (sortType === 'string') {
      if (orderValue === 'desc') {
        res.sort((a, b) => b[fieldValue].localeCompare(a[fieldValue], ['ru-RU', 'en-US'], {caseFirst: 'upper'}));
      } else if (orderValue === 'asc') {
        res.sort((a, b) => a[fieldValue].localeCompare(b[fieldValue], ['ru-RU', 'en-US'], {caseFirst: 'upper'}));
      }
    } else if (sortType === 'number') {
      if (orderValue === 'desc') {
        res.sort((a, b) => b[fieldValue] - a[fieldValue]);
      } else if (orderValue === 'asc') {
        res.sort((a, b) => a[fieldValue] - b[fieldValue]);
      }
    }
    this.data = res;

    if (this.subElements) {
      this.subElements.body.innerHTML = this.getBody();
    }
  }


  getSubElement() {
    const res = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      res[name] = subElement;
    }
    return res;
  }
}

