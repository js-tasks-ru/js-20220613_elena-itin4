export default class NotificationMessage {
  static activeNotification;

  constructor(message = '', {duration = 1000, type = 'error'} = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper.firstElementChild;

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
    this.remove();
    this.element = null;
    NotificationMessage.activeNotification = null;
  }


  show(root = document.body) {
    if (NotificationMessage.activeNotification) {
      NotificationMessage.activeNotification.remove();
    }
    root.append(this.element);
    setTimeout(() => this.remove(), this.duration);
    NotificationMessage.activeNotification = this;
  }
}
