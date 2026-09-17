class WcProductTabs extends HTMLElement {
  connectedCallback() {
    this.tabs = Array.from(this.querySelectorAll('[role="tab"]'));
    this.sliders = Array.from(this.querySelectorAll('[data-wc-slider]'));

    this.tabs.forEach((tab) => {
      tab.addEventListener('click', () => this.select(tab));
      tab.addEventListener('keydown', (event) => this.onKeydown(event));
    });

    this.sliders.forEach((slider) => this.bindSlider(slider));
  }

  select(tab) {
    this.tabs.forEach((item) => {
      const isTarget = item === tab;
      item.setAttribute('aria-selected', String(isTarget));
      item.tabIndex = isTarget ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !isTarget;
    });

    // Arrow state was computed against a hidden panel, so it is stale until the
    // panel has real dimensions again.
    this.sliders.forEach((slider) => this.syncArrows(slider));
  }

  onKeydown(event) {
    const step = { ArrowRight: 1, ArrowLeft: -1, Home: 'first', End: 'last' }[event.key];
    if (!step) return;

    event.preventDefault();
    const current = this.tabs.indexOf(event.currentTarget);
    let next;
    if (step === 'first') next = 0;
    else if (step === 'last') next = this.tabs.length - 1;
    else next = (current + step + this.tabs.length) % this.tabs.length;

    this.select(this.tabs[next]);
    this.tabs[next].focus();
  }

  bindSlider(slider) {
    const track = slider.querySelector('[data-wc-slider-track]');
    const prev = slider.querySelector('[data-wc-slider-prev]');
    const next = slider.querySelector('[data-wc-slider-next]');
    if (!track) return;

    const step = () => {
      const slide = track.querySelector('.wc-product-slider__slide');
      return slide ? slide.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : 0;
    };

    if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    if (next) next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

    track.addEventListener('scroll', () => this.syncArrows(slider), { passive: true });
    this.syncArrows(slider);
  }

  syncArrows(slider) {
    const track = slider.querySelector('[data-wc-slider-track]');
    const prev = slider.querySelector('[data-wc-slider-prev]');
    const next = slider.querySelector('[data-wc-slider-next]');
    if (!track || !prev || !next) return;

    const max = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft >= max - 1;
  }
}

if (!customElements.get('wc-product-tabs')) {
  customElements.define('wc-product-tabs', WcProductTabs);
}
