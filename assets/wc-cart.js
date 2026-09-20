/**
 * Wine Crush cart additions — loaded on every page (layout/theme.liquid).
 *
 * <wc-age-gate>    date of birth + "over 18" confirmation (snippets/wc-age-gate.liquid)
 * <wc-cart-extras> gift message + delivery notes (snippets/wc-cart-extras.liquid)
 * checkout guard   blocks every route to checkout until the age check passes
 *
 * The cart itself is Dawn's (assets/cart.js, cart-drawer.js, product-form.js);
 * this file only reads and writes cart attributes / the note via
 * /cart/update.js. Both elements live inside the drawer's .drawer__inner,
 * which Dawn re-renders after every cart change, so all state is restored from
 * the cart (Liquid pre-fills from cart.attributes / cart.note) rather than held
 * in memory.
 */
(() => {
  if (window.wcCartInitialised) return;
  window.wcCartInitialised = true;

  const config = window.wcAgeGateConfig || { enabled: false, minAge: 18 };
  const ATTR_DOB = 'Date of birth';
  const ATTR_CONFIRMED = 'Age confirmed';
  const ATTR_GIFT = 'Gift message';

  const updateUrl = () => `${(window.routes && window.routes.cart_update_url) || '/cart/update'}.js`;
  const checkoutUrl = () => `${(window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/'}checkout`;

  function updateCart(body) {
    return fetch(updateUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    }).then((response) => {
      if (!response.ok) throw new Error(`Cart update failed (${response.status})`);
      return response.json();
    });
  }

  /** Whole years between a date of birth and today; NaN for impossible dates (31 Feb). */
  function ageFrom(year, month, day, now = new Date()) {
    const dob = new Date(year, month - 1, day);
    if (dob.getFullYear() !== year || dob.getMonth() !== month - 1 || dob.getDate() !== day) return NaN;
    let age = now.getFullYear() - year;
    const hadBirthday = now.getMonth() > month - 1 || (now.getMonth() === month - 1 && now.getDate() >= day);
    if (!hadBirthday) age -= 1;
    return age;
  }

  function isoDate(year, month, day) {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  /** Validity from what is saved on the cart — used when no gate is on the page. */
  async function cartPassesAgeCheck() {
    try {
      const cart = await fetch(`${(window.routes && window.routes.cart_url) || '/cart'}.js`).then((r) => r.json());
      const attributes = cart.attributes || {};
      const [y, m, d] = String(attributes[ATTR_DOB] || '').split('-').map(Number);
      return attributes[ATTR_CONFIRMED] === 'yes' && ageFrom(y, m, d) >= config.minAge;
    } catch (error) {
      return false;
    }
  }

  /* ---------------------------------------------------------------- age gate */

  class WcAgeGate extends HTMLElement {
    connectedCallback() {
      if (this.initialised) return;
      this.initialised = true;

      this.minAge = parseInt(this.dataset.minAge, 10) || config.minAge;
      this.selects = {
        day: this.querySelector('[data-dob="day"]'),
        month: this.querySelector('[data-dob="month"]'),
        year: this.querySelector('[data-dob="year"]'),
      };
      this.confirm = this.querySelector('[data-confirm]');
      this.errors = {
        dob: this.querySelector('[data-error="dob"]'),
        confirm: this.querySelector('[data-error="confirm"]'),
      };

      this.addEventListener('change', () => {
        this.clearErrors();
        clearTimeout(this.saveTimer);
        this.saveTimer = setTimeout(() => this.save(), 300);
      });
    }

    values() {
      return {
        day: parseInt(this.selects.day?.value, 10),
        month: parseInt(this.selects.month?.value, 10),
        year: parseInt(this.selects.year?.value, 10),
        confirmed: Boolean(this.confirm?.checked),
      };
    }

    /** Returns true when the visitor may check out; optionally shows the errors. */
    validate(showErrors = false) {
      const { day, month, year, confirmed } = this.values();
      let dobError = '';
      if (!day || !month || !year) dobError = this.dataset.msgRequired;
      else if (!(ageFrom(year, month, day) >= this.minAge)) dobError = this.dataset.msgUnderage;
      const confirmError = confirmed ? '' : this.dataset.msgRequired;

      if (showErrors) {
        this.showError('dob', dobError, this.selects.day);
        this.showError('confirm', confirmError, this.confirm);
        const firstInvalid = dobError
          ? Object.values(this.selects).find((select) => !select.value) || this.selects.day
          : confirmError
            ? this.confirm
            : null;
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      }
      return !dobError && !confirmError;
    }

    showError(key, message, field) {
      const node = this.errors[key];
      if (!node) return;
      node.textContent = message;
      node.hidden = !message;
      const fields = key === 'dob' ? Object.values(this.selects) : [field];
      fields.forEach((input) => input?.toggleAttribute('aria-invalid', Boolean(message)));
    }

    clearErrors() {
      Object.keys(this.errors).forEach((key) => this.showError(key, '', this.confirm));
    }

    /** Persist on the cart so the order records it and re-renders keep it. */
    save() {
      clearTimeout(this.saveTimer);
      const { day, month, year, confirmed } = this.values();
      const dob = day && month && year && !Number.isNaN(ageFrom(year, month, day)) ? isoDate(year, month, day) : '';
      this.pending = updateCart({ attributes: { [ATTR_DOB]: dob, [ATTR_CONFIRMED]: confirmed ? 'yes' : '' } }).catch(
        () => null
      );
      return this.pending;
    }
  }

  if (!customElements.get('wc-age-gate')) customElements.define('wc-age-gate', WcAgeGate);

  /* ----------------------------------------------------------- checkout guard */

  const CHECKOUT_SELECTOR =
    'button[name="checkout"], input[name="checkout"], a[href$="/checkout"], a[href*="/checkout?"]';

  function gateFor(control) {
    return (
      (control.id && document.querySelector(`wc-age-gate[data-checkout="${control.id}"]`)) ||
      control.closest('cart-drawer, form, .cart__footer')?.querySelector('wc-age-gate') ||
      null
    );
  }

  let proceeding = false;

  async function guardCheckout(event, control) {
    if (!config.enabled || proceeding) return;

    // Always stop the native action first; checkout only continues from here.
    event.preventDefault();
    event.stopImmediatePropagation();

    const gate = gateFor(control);
    let allowed;
    if (gate) {
      allowed = gate.validate(true);
      if (allowed) await gate.save();
    } else {
      // No visible gate (e.g. removed or hidden): trust only what the cart holds.
      allowed = await cartPassesAgeCheck();
      if (!allowed) document.querySelector('cart-drawer')?.open?.();
    }
    if (!allowed) return;

    proceeding = true;
    control.setAttribute('aria-busy', 'true');
    window.location.href = checkoutUrl();
  }

  document.addEventListener(
    'click',
    (event) => {
      const control = event.target.closest?.(CHECKOUT_SELECTOR);
      if (control) guardCheckout(event, control);
    },
    true
  );

  document.addEventListener(
    'submit',
    (event) => {
      const submitter = event.submitter;
      if (submitter && submitter.name === 'checkout') guardCheckout(event, submitter);
    },
    true
  );

  /* ------------------------------------------------------- gift / delivery notes */

  class WcCartExtras extends HTMLElement {
    connectedCallback() {
      if (this.initialised) return;
      this.initialised = true;

      this.addEventListener('change', (event) => {
        const toggle = event.target.closest('[data-toggle]');
        if (toggle) this.onToggle(toggle.dataset.toggle, toggle.checked);
      });

      this.addEventListener('click', (event) => {
        const save = event.target.closest('[data-save]');
        if (save) this.save(save.dataset.save, save);
        const edit = event.target.closest('[data-edit]');
        if (edit) this.edit(edit.dataset.edit);
      });
    }

    panel(key) {
      return this.querySelector(`[data-panel="${key}"]`);
    }

    onToggle(key, on) {
      const panel = this.panel(key);
      if (!panel) return;
      panel.hidden = !on;
      if (on) {
        if (!panel.querySelector('[data-saved-text]').textContent.trim()) this.edit(key);
        return;
      }
      // Switching off removes the saved text from the order.
      const field = panel.querySelector('[data-field]');
      if (field.value.trim() || panel.querySelector('[data-saved-text]').textContent.trim()) {
        field.value = '';
        this.persist(key, '').then(() => this.render(key, ''));
      }
    }

    edit(key) {
      const panel = this.panel(key);
      panel.querySelector('[data-edit]').hidden = true;
      panel.querySelector('[data-editor]').hidden = false;
      panel.querySelector('[data-field]').focus();
    }

    persist(key, value) {
      return updateCart(key === 'note' ? { note: value } : { attributes: { [ATTR_GIFT]: value } });
    }

    async save(key, button) {
      const panel = this.panel(key);
      const field = panel.querySelector('[data-field]');
      const status = panel.querySelector('[data-status]');
      const value = field.value.trim();

      button.setAttribute('aria-disabled', 'true');
      try {
        await this.persist(key, value);
        this.render(key, value);
        status.textContent = '';
        panel.querySelector('[data-edit]').focus();
      } catch (error) {
        status.textContent = window.cartStrings?.error || 'Error';
      } finally {
        button.removeAttribute('aria-disabled');
      }
    }

    render(key, value) {
      const panel = this.panel(key);
      const saved = panel.querySelector('[data-edit]');
      const text = panel.querySelector('[data-saved-text]');
      text.textContent = '';
      value.split('\n').forEach((line, index) => {
        if (index) text.appendChild(document.createElement('br'));
        text.appendChild(document.createTextNode(line));
      });
      saved.hidden = !value;
      panel.querySelector('[data-editor]').hidden = Boolean(value);
    }
  }

  if (!customElements.get('wc-cart-extras')) customElements.define('wc-cart-extras', WcCartExtras);
})();
