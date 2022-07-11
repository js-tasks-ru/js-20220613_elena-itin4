class Tooltip {
  element;
  tooltipText;

  constructor() {
    if (Tooltip._instance) {
      return Tooltip._instance;
    }
    Tooltip._instance = this;
  }


  initialize() {
    document.addEventListener('pointerover', event => {
      this.handlePointerOver(event);
    });

    document.addEventListener('pointerout', event => {
      this.handlePointerOut(event);
    });

  }

  render() {
    const tooltip = document.createElement('div');
    tooltip.innerHTML = `<div class="tooltip">${this.tooltipText}</div>`;
    this.element = tooltip.firstElementChild;
    document.body.append(this.element);
  }


  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    document.removeEventListener('pointerover', this.handlePointerOver);
    document.removeEventListener('pointerout', this.handlePointerOut);
    document.removeEventListener("pointermove", this.handlePointerMove);
    this.remove();
    this.element = null;

  }

  handlePointerOver(event) {
    const div = event.target.closest('div[data-tooltip]');
    if (div) {
      this.tooltipText = div.dataset.tooltip;
      this.render();
      document.addEventListener('pointermove', event => {
        this.handlePointerMove(event);
      });
    }
  }

  handlePointerOut() {
    if (this.element) {
      this.destroy();
    }
    document.removeEventListener('pointerover', this.handlePointerOver);
    document.removeEventListener("pointermove", this.handlePointerMove);
  }


  handlePointerMove(event) {
    const step = 5;
    if (this.element) {
      this.element.style.left = event.pageX + step + "px";
      this.element.style.top = event.pageY + step + "px";
    }
  }

}

export default Tooltip;
