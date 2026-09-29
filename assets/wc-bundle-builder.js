/*
 * <wc-bundle-builder> — sections/wc-bundle-builder.liquid (Figma 10072:1173)
 *
 * State is one ordered list of chosen products. Everything else — the slot
 * rows, the subtotal, the counter, the message, the card buttons and the
 * form's line-item properties — is rendered from it.
 *
 * The cart itself is Dawn's: the panel holds a real <product-form>, so adding
 * goes through assets/product-form.js (AJAX add, section re-render, the Wine
 * Crush cart drawer, error handling). This file only writes the properties
 * into that form and blocks the submit while the bundle is incomplete —
 * validated again at submit time, not just by disabling the button.
 *
 * Data comes from Liquid: each card carries the product's id, title, thumb
 * and availability; each pack radio carries its variant id, its bottle count
 * (the custom.bundle_bottles_quantity metafield) and its price.
 *
 * Each pack has its own list of bottles (the variant's custom.bundle_products),
 * rendered once and hidden until that pack is chosen. Only the chosen pack's
 * list is ever read, so a bottle from another pack can neither be shown,
 * selected, nor submitted.
 */
(() => {
  /* Strings come from the section (locales/en.default.json > wc_bundle), with
     [count] / [total] / [title] filled in here — the same convention as the
     cart's delivery message. Keys ending _one / _other are picked by count. */
  const t = (key, replacements = {}) => {
    const strings = window.wcBundleStrings || {};
    let name = key;
    if (strings[key + '_other']) {
      name = Number(replacements.count) === 1 ? key + '_one' : key + '_other';
    }
    let value = strings[name] || '';
    Object.entries(replacements).forEach(([token, replacement]) => {
      value = value.split('[' + token + ']').join(replacement);
    });
    return value;
  };

  class WcBundleBuilder extends HTMLElement {
    connectedCallback() {
      this.form = this.querySelector('[data-type="add-to-cart-form"]');
      this.variantInput = this.querySelector('[data-bundle-variant-id]');
      this.propertyHost = this.querySelector('[data-bundle-properties]');
      this.slotList = this.querySelector('[data-bundle-slots]');
      this.status = this.querySelector('[data-bundle-status]');
      this.subtotal = this.querySelector('[data-bundle-subtotal]');
      this.barCount = this.querySelector('[data-bundle-bar-count]');
      this.barTotal = this.querySelector('[data-bundle-bar-total]');
      this.submits = [...this.querySelectorAll('[data-bundle-submit]')];
      this.packs = [...this.querySelectorAll('[data-bundle-pack]')];
      /* Not `this.prefix`: Element.prefix is a read-only DOM property. */
      this.propertyName = this.dataset.propertyPrefix || 'Bottle';

      if (!this.form || !this.packs.length) return;

      /* One listener each, delegated, rather than one per card. */
      this.addEventListener('click', this.onClick);
      this.addEventListener('change', this.onChange);
      /* Capture, so an incomplete bundle never reaches product-form.js. */
      this.addEventListener('submit', this.onSubmit, true);

      this.selection = [];
      this.showList();
      this.render();
    }

    disconnectedCallback() {
      this.removeEventListener('click', this.onClick);
      this.removeEventListener('change', this.onChange);
      this.removeEventListener('submit', this.onSubmit, true);
    }

    get pack() {
      return this.packs.find((input) => input.checked) || this.packs[0];
    }

    get max() {
      return parseInt(this.pack.dataset.bottles, 10) || 0;
    }

    /* The chosen pack's own list of bottles. */
    get list() {
      return this.querySelector(`[data-bundle-list][data-variant-id="${this.pack.value}"]`);
    }

    get items() {
      const list = this.list;
      return list ? [...list.querySelectorAll('[data-bundle-item]')] : [];
    }

    /* --- Events --- */

    onClick = (event) => {
      if (event.target.closest('[data-bundle-pack], [data-bundle-submit]')) return;

      const item = event.target.closest('[data-bundle-item]');
      if (!item || !this.contains(item)) return;
      /* Belt and braces: only the chosen pack's bottles are selectable. */
      if (item.closest('[data-bundle-list]') !== this.list) return;

      /* The whole card is the control, so a click anywhere in it counts. */
      event.preventDefault();
      this.toggle(item);
    };

    onChange = (event) => {
      if (!event.target.matches('[data-bundle-pack]')) return;
      this.variantInput.value = event.target.value;
      /* Each pack has its own bottles, so the selection starts again: keeping
         it would carry bottles this pack may not even offer. */
      this.selection = [];
      this.showList();
      this.render();
    };

    /* Show the chosen pack's list, hide the rest. */
    showList() {
      this.querySelectorAll('[data-bundle-list]').forEach((list) => {
        const current = list.dataset.variantId === this.pack.value;
        list.hidden = !current;
        /* The hidden lists' images are lazy; reveal lets them load. */
        if (current) list.querySelectorAll('img[loading="lazy"]').forEach((img) => img.removeAttribute('loading'));
      });
    }

    onSubmit = (event) => {
      if (event.target !== this.form) return;

      const problem = this.validate();
      if (!problem) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      this.setStatus(problem, true);
      const firstEmpty = this.querySelector('.wc-bundle-builder__slot:not(.is-filled)');
      (firstEmpty || this.slotList).scrollIntoView({ block: 'center', behavior: 'smooth' });
    };

    /* --- Selection --- */

    toggle(item) {
      const id = item.dataset.productId;

      if (item.hasAttribute('data-unavailable')) {
        this.setStatus(t('unavailable_product', { title: item.dataset.title }), true);
        return;
      }

      const index = this.selection.indexOf(id);
      if (index > -1) {
        this.selection.splice(index, 1);
      } else if (this.selection.length >= this.max) {
        /* Full: the customer swaps rather than adds. */
        this.setStatus(t('full', { total: this.max }), true);
        return;
      } else {
        this.selection.push(id);
      }

      this.render();
    }

    /* Scoped to the chosen pack: a bottle only exists if this pack offers it. */
    itemFor(id) {
      const list = this.list;
      return list ? list.querySelector(`[data-bundle-item][data-product-id="${id}"]`) : null;
    }

    /* --- Rendering --- */

    render() {
      const max = this.max;
      const count = this.selection.length;

      this.renderCards(max);
      this.renderSlots(max);
      this.renderProperties();

      if (this.subtotal) this.subtotal.textContent = this.pack.dataset.price || '';
      if (this.barCount) this.barCount.textContent = count;
      if (this.barTotal) this.barTotal.textContent = `/ ${max}`;

      this.classList.toggle('is-full', count >= max);

      const problem = this.validate();
      this.submits.forEach((button) => {
        button.setAttribute('aria-disabled', problem ? 'true' : 'false');
      });
      this.setStatus(problem || t('counter', { count, total: max }), Boolean(problem));
    }

    renderCards(max) {
      this.items.forEach((item) => {
        const selected = this.selection.includes(item.dataset.productId);
        const button = item.querySelector('[data-bundle-toggle]');
        item.classList.toggle('is-selected', selected);
        if (!button) return;

        button.setAttribute('aria-pressed', String(selected));
        const label = button.querySelector('[data-bundle-toggle-label]');
        const mark = button.querySelector('[data-bundle-toggle-mark]');
        const a11y = button.querySelector('[data-bundle-toggle-a11y]');
        if (label) label.textContent = selected ? this.dataset.addedLabel : this.dataset.addLabel;
        if (mark) mark.textContent = selected ? '✓' : '+';
        if (a11y) {
          a11y.textContent = t(selected ? 'remove_from_bundle' : 'add_to_bundle', {
            title: item.dataset.title,
          });
        }
        /* At the limit the unchosen ones are announced as unavailable, but
           stay focusable so the customer hears why when they try. */
        button.setAttribute(
          'aria-disabled',
          !selected && this.selection.length >= max ? 'true' : 'false'
        );
      });
    }

    renderSlots(max) {
      if (!this.slotList) return;

      /* Rows never hide a chosen bottle: after switching down a pack the
         extras keep their row, flagged, until the customer removes them. */
      const rows = Math.max(max, this.selection.length);
      const markup = [];

      for (let i = 0; i < rows; i += 1) {
        const id = this.selection[i];
        const item = id ? this.itemFor(id) : null;
        const over = i >= max;

        if (item) {
          const thumb = item.dataset.thumb
            ? `<img class="wc-bundle-builder__slot-thumb" src="${item.dataset.thumb}" alt="" width="46" height="69" loading="lazy">`
            : '<span class="wc-bundle-builder__slot-thumb"></span>';
          markup.push(
            `<li class="wc-bundle-builder__slot is-filled${over ? ' is-over' : ''}">
               <span class="wc-bundle-builder__slot-index">${i + 1}</span>
               ${thumb}
               <span class="wc-bundle-builder__slot-title">${this.escape(item.dataset.title)}</span>
             </li>`
          );
        } else {
          markup.push(
            `<li class="wc-bundle-builder__slot">
               <span class="wc-bundle-builder__slot-index">${i + 1}</span>
               <span class="wc-bundle-builder__slot-label">${this.escape(t('slot_empty'))}</span>
             </li>`
          );
        }
      }

      this.slotList.innerHTML = markup.join('');
    }

    /* The cart request carries the selection: one property per bottle, in the
       order chosen, so it survives into the drawer, the cart, the checkout
       and the order. */
    renderProperties() {
      if (!this.propertyHost) return;

      this.propertyHost.innerHTML = this.selection
        .slice(0, this.max)
        .map((id, index) => {
          const item = this.itemFor(id);
          if (!item) return '';
          const name = `properties[${this.escape(this.propertyName)} ${index + 1}]`;
          return `<input type="hidden" name="${name}" value="${this.escape(item.dataset.title)}">`;
        })
        .join('');
    }

    escape(value) {
      return String(value == null ? '' : value).replace(
        /[&<>"']/g,
        (character) =>
          ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character])
      );
    }

    setStatus(message, isProblem) {
      if (!this.status) return;
      this.status.textContent = message;
      this.status.classList.toggle('is-problem', Boolean(isProblem));
    }

    /* --- Validation: the same check for the button state and the submit --- */

    validate() {
      const max = this.max;
      const count = this.selection.length;

      if (!max) return t('pack_unconfigured');
      /* A pack with no bottles set up cannot be built. */
      if (!this.items.length) return t('no_products');
      /* Nothing may reach the cart that this pack does not offer. */
      if (this.selection.some((id) => !this.itemFor(id))) return t('unavailable_selection');
      if (count > max) return t('remove_extra', { count: count - max, total: max });
      if (count < max) return t('select_more', { count: max - count, total: max });

      const unavailable = this.selection
        .map((id) => this.itemFor(id))
        .filter((item) => !item || item.hasAttribute('data-unavailable'));
      if (unavailable.length) return t('unavailable_selection');

      return '';
    }
  }

  if (!customElements.get('wc-bundle-builder')) {
    customElements.define('wc-bundle-builder', WcBundleBuilder);
  }
})();
