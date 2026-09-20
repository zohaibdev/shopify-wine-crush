/* The CSS animation slides the track by -50%, which is only seamless while
   each half is at least as wide as the visible row. Two copies cover that for
   any normal card count; a short set on a wide screen needs more, so this adds
   copies in pairs until each half covers the row. It also turns the
   merchant's px/s speed into a duration, since CSS cannot derive one from a
   measured width. */
class WcMarquee extends HTMLElement {
  connectedCallback() {
    this.track = this.querySelector('.wc-marquee__track');
    this.set = this.track?.firstElementChild;
    if (!this.set) return;

    this.speed = Number(this.dataset.speed) || 40;
    this.update = this.update.bind(this);
    this.observer = new ResizeObserver(this.update);
    this.observer.observe(this);
    this.observer.observe(this.set);

    if (window.Shopify?.designMode) {
      this.onBlockSelect = (event) => this.toggleAttribute('data-paused', event.type === 'shopify:block:select');
      this.addEventListener('shopify:block:select', this.onBlockSelect);
      this.addEventListener('shopify:block:deselect', this.onBlockSelect);
    }
  }

  disconnectedCallback() {
    this.observer?.disconnect();
  }

  update() {
    const setWidth = this.set.getBoundingClientRect().width;
    if (!setWidth) return;

    const setsPerHalf = Math.max(1, Math.ceil(this.clientWidth / setWidth));
    const groups = this.track.children;
    const needed = setsPerHalf * 2;

    while (groups.length < needed) {
      const copy = this.set.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      copy.inert = true;
      copy.querySelectorAll('[data-shopify-editor-block]').forEach((node) => node.removeAttribute('data-shopify-editor-block'));
      this.track.append(copy);
    }
    while (groups.length > needed) groups[groups.length - 1].remove();

    const duration = `${((setWidth * setsPerHalf) / this.speed).toFixed(2)}s`;
    if (this.style.getPropertyValue('--marquee-duration') !== duration) {
      this.style.setProperty('--marquee-duration', duration);
    }
  }
}

if (!customElements.get('wc-marquee')) customElements.define('wc-marquee', WcMarquee);
