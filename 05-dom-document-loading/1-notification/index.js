export default class NotificationMessage {
  static subElement = null;

  constructor(message = '', {duration = 0, type = 'error'} = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper.firstElementChild;

    NotificationMessage.subElement = this.getSubElement();
  }

  getSubElement () {
    return document.querySelector(".notification");
  }

  getTemplate() {
    return `
    <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${this.type}</div>
      <div class="notification-body">
        ${this.message}
      </div>
    </div>
  </div>
    `;
  }


  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.duration = 0;
    this.remove();
    this.element = null;

  }


  show(div) {
    if (NotificationMessage.subElement && !div) {
      NotificationMessage.subElement.replaceWith(this.element);
    } else if (div) {
      if (NotificationMessage.subElement) {
        NotificationMessage.subElement.remove();
      }
      div.append(this.element);
    } else {
      const rootElement = document.querySelector("#btn1");
      rootElement.after(this.element);
    }
    setTimeout(() => this.remove(), this.duration);
  }
}
