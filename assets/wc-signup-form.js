/**
 * Multi-step newsletter sign-up — see snippets/wc-signup-form.liquid.
 * One instance per <wc-signup-form>; every query is scoped to the instance, so
 * any number can share a page (Coming Soon, 5% off) without touching each other.
 *
 * Why steps never fire `submit`: Shopify injects a storefront form-protection
 * script that listens for `submit` on the document and, for any customer form
 * posting to /contact without a `form_key`, calls `form.submit()` natively —
 * ignoring `event.defaultPrevented`. A submit event on step 1 therefore posted
 * the half-filled form and navigated away. So the arrow is a plain button,
 * Enter is handled here, and any stray submit is stopped at the form.
 *
 * The final step posts with `fetch`, so the page never reloads: Shopify
 * answers a customer POST with a redirect back to this page carrying
 * `customer_posted=true`, or re-renders it with `form.errors`, and both are
 * read straight out of the response. See `submitForm()`.
 *
 * That needs storefront spam protection to be OFF. With it on, Shopify answers
 * with a challenge page that only ever clears in a top-level document, which a
 * fetch cannot resolve — so anything unreadable falls back to posting the form
 * as an ordinary navigation, the way Dawn's own newsletter does. Shopify sees
 * the challenge through and returns here in its success or error state, both of
 * which the snippet already renders. See `finish()` and `submitNatively()`.
 */
class WcSignupForm extends HTMLElement {
  connectedCallback() {
    // Guard against a second connect (e.g. the element being moved in the DOM).
    if (this.initialised) return;
    this.initialised = true;

    this.form = this.querySelector('form[data-signup-form]');
    if (!this.form) return;

    const success = this.querySelector('[data-signup-success]');
    if (success) {
      // Rendered by Liquid after the native (challenge) fallback returned.
      this.track('wc_newsletter_signup');
      if (window.location.hash === `#${this.form.id}`) success.focus({ preventScroll: true });
      return;
    }

    this.steps = Array.from(this.querySelectorAll('[data-signup-step]'));
    this.row = this.querySelector('[data-signup-row]');
    this.error = this.querySelector('[data-signup-error]');
    this.progress = this.querySelector('[data-signup-progress]');
    this.submitButton = this.querySelector('[data-signup-submit]');
    this.lastName = this.querySelector('[data-signup-last-name]');
    this.successTemplate = this.querySelector('template[data-signup-success-template]');
    if (this.steps.length === 0 || !this.submitButton) return;

    this.busy = false;
    this.posting = false;

    // Without JS the arrow is a real submit button and all fields show at once.
    this.submitButton.type = 'button';
    this.submitButton.addEventListener('click', () => this.advance());
    this.form.addEventListener('submit', (event) => this.onSubmit(event));

    this.steps.forEach((step) => {
      const input = this.input(step);
      input.addEventListener('input', () => this.clearError());
      input.addEventListener('keydown', (event) => this.onKeydown(event, input));
    });

    this.classList.add('is-enhanced');
    const start = parseInt(this.row?.dataset.startStep, 10) || 0;
    // A server-side error (from the native fallback) is already rendered; keep it.
    this.go(Math.min(start, this.steps.length - 1), { focus: false, keepError: true });
  }

  input(step) {
    return step.querySelector('input');
  }

  get isLastStep() {
    return this.index === this.steps.length - 1;
  }

  onKeydown(event, input) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.advance();
    } else if (event.key === 'Backspace' && input.value === '' && this.index > 0) {
      // The design has no Back control; Backspace in an empty field steps back.
      event.preventDefault();
      this.go(this.index - 1);
    }
  }

  onSubmit(event) {
    // The fallback navigation in `submitNatively()` is the one submit allowed
    // through — Shopify's protection listens on the document and has to see it
    // to attach the form key. Every other submit is a step change.
    if (this.posting) return;
    event.preventDefault();
    event.stopPropagation();
    this.advance();
  }

  go(index, { focus = true, keepError = false } = {}) {
    if (index < 0 || index >= this.steps.length) return;
    this.index = index;

    this.steps.forEach((step, i) => {
      step.hidden = i !== index;
    });

    // The button is an icon; only its accessible name changes per step.
    const label = this.isLastStep ? this.dataset.submitLabel : this.dataset.nextLabel;
    if (label) this.submitButton.setAttribute('aria-label', label);
    if (this.progress) {
      this.progress.textContent = (this.dataset.stepTemplate || '[current] / [total]')
        .replace('[current]', index + 1)
        .replace('[total]', this.steps.length);
    }

    if (!keepError) this.clearError();
    else if (this.error && !this.error.hidden) this.markInvalid(this.input(this.steps[index]));

    if (focus) this.input(this.steps[index]).focus();
  }

  advance() {
    if (this.busy) return;

    const message = this.validate(this.steps[this.index]);
    if (message) {
      this.showError(message);
      return;
    }

    if (!this.isLastStep) {
      this.go(this.index + 1);
      return;
    }

    // Re-check every step (autofill can clear an earlier one) before posting.
    for (let i = 0; i < this.steps.length; i += 1) {
      const stepMessage = this.validate(this.steps[i]);
      if (stepMessage) {
        this.go(i);
        this.showError(stepMessage);
        return;
      }
    }

    this.submitForm();
  }

  validate(step) {
    const input = this.input(step);
    const value = input.value.trim();
    input.value = value;

    switch (step.dataset.signupStep) {
      case 'name':
        return value ? '' : this.dataset.errorName;
      case 'email':
        // The browser's own type=email check, plus a dot in the domain, which
        // the spec allows to be absent but no real inbox is without.
        return value && input.checkValidity() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : this.dataset.errorEmail;
      case 'phone':
        return this.auPhone(value) ? '' : this.dataset.errorPhone;
      default:
        return '';
    }
  }

  /**
   * The shop is Australian and every number it collects is an Australian one,
   * so this accepts the national form (mobile 04xx xxx xxx, landlines on 02 /
   * 03 / 07 / 08) and the international form (+61…, 0061…, 61…) in any common
   * spacing — and a leading trunk 0 left in after the country code, which is
   * the usual way people mistype it.
   *
   * Returns E.164 (`+61…`) because that is what Shopify stores a customer
   * phone as; a bare local number is what it rejects. Returns '' when the
   * number is not a valid Australian subscriber number.
   */
  auPhone(value) {
    const compact = value.replace(/[\s().-]/g, '');
    if (!/^(\+|00)?\d+$/.test(compact)) return '';

    const international = compact.replace(/^(\+61|0061|61)/, '');
    // With no country code it is a national number, so drop the trunk 0.
    const nsn = (international === compact ? compact : international).replace(/^0/, '');

    // 9 digits: 4 for mobiles, 2 / 3 / 7 / 8 for the geographic areas.
    return /^[23478]\d{8}$/.test(nsn) ? `+61${nsn}` : '';
  }

  /**
   * Posts with fetch; the page never reloads. `response.url` is the URL the
   * redirect landed on, which carries `customer_posted=true` when Shopify
   * accepted the sign-up. A rejected field comes back as this page re-rendered
   * with `form.errors` in it.
   *
   * Disabled inputs are left out of FormData, which is how an empty last name
   * stays out of the post (see `prepare()`).
   */
  async submitForm() {
    this.setBusy(true);
    this.clearError();
    this.prepare();
    this.track('wc_newsletter_submit');
    this.posting = true;

    let url = '';
    let doc = null;
    try {
      const response = await fetch(this.form.action, {
        method: 'POST',
        body: new FormData(this.form),
        headers: { Accept: 'text/html' },
      });
      url = response.url || '';
      // Read the body unless it is a challenge (solvable only up in the tab) or
      // an outright refusal. Status is not the test: Shopify re-renders a form
      // it rejected with a 4xx, and that page carries the message to show.
      if (!url.includes('/challenge') && response.status !== 403) {
        doc = new DOMParser().parseFromString(await response.text(), 'text/html');
      }
    } catch (error) {
      // Network failure, or the edge refused us outright. Same as no answer.
    }

    this.finish(url, doc);
  }

  finish(url, doc) {
    if (!this.posting) return;
    this.posting = false;

    const returned = doc ? doc.getElementById(this.form.id) : null;

    if (/[?&]customer_posted=true\b/.test(url) || returned?.querySelector('[data-signup-success]')) {
      this.showSuccess();
      return;
    }

    // This page came back, so Shopify re-rendered the form with its own
    // validation errors (e.g. a phone number it can't parse, or one already on
    // another customer). Re-open the step it rejected and say why.
    if (returned) {
      const serverError = returned.querySelector('[data-signup-error]:not([hidden])')?.textContent.trim();
      const startStep = parseInt(returned.querySelector('[data-signup-row]')?.dataset.startStep, 10) || 0;
      this.restore();
      this.setBusy(false);
      this.go(serverError ? startStep : this.index, { focus: false });
      this.showError(serverError || this.dataset.errorGeneric);
      return;
    }

    // Nothing readable: a challenge fetch cannot clear, or no answer at all.
    // Post it again the plain way so the browser can see it through.
    this.submitNatively();
  }

  /**
   * The fallback post: the same form, submitted as an ordinary navigation —
   * Dawn's newsletter mechanism. Shopify returns to this page with
   * `customer_posted=true` and the snippet renders the success message, or
   * re-renders the form carrying `form.errors`.
   */
  submitNatively() {
    this.posting = true;
    this.form.requestSubmit();
  }

  // Shopify customers have separate first/last names and a parseable phone.
  prepare() {
    const nameInput = this.fieldInput('name');
    const phoneInput = this.fieldInput('phone');
    this.original = { name: nameInput?.value, phone: phoneInput?.value };

    if (nameInput && this.lastName) {
      const [first, ...rest] = nameInput.value.split(/\s+/);
      nameInput.value = first;
      this.lastName.value = rest.join(' ');
      // Shopify discards a customer post that carries an empty last name — no
      // error, nothing created — and a one-word name ("Zohaib") leaves it
      // blank. So the field is left out of the post rather than sent empty.
      this.lastName.disabled = !this.lastName.value;
    }
    // E.164 — Shopify rejects a customer phone it cannot parse, and a bare
    // national number ("0412 345 678") is one of those.
    if (phoneInput) phoneInput.value = this.auPhone(phoneInput.value) || phoneInput.value;
  }

  // Put back what the person typed after a failed attempt.
  restore() {
    if (!this.original) return;
    const nameInput = this.fieldInput('name');
    const phoneInput = this.fieldInput('phone');
    if (nameInput) nameInput.value = this.original.name;
    if (phoneInput) phoneInput.value = this.original.phone;
    if (this.lastName) this.lastName.value = '';
  }

  fieldInput(name) {
    const step = this.steps.find((item) => item.dataset.signupStep === name);
    return step ? this.input(step) : null;
  }

  setBusy(busy) {
    this.busy = busy;
    this.classList.toggle('is-loading', busy);
    this.form.setAttribute('aria-busy', String(busy));
    this.submitButton.setAttribute('aria-disabled', String(busy));
  }

  showSuccess() {
    if (!this.successTemplate) return;
    const success = this.successTemplate.content.firstElementChild.cloneNode(true);
    this.form.replaceChildren(success);
    this.classList.remove('is-loading');
    success.focus({ preventScroll: true });
    this.track('wc_newsletter_signup');
  }

  showError(message) {
    if (!this.error || !message) return;
    this.error.textContent = message;
    this.error.hidden = false;
    const input = this.input(this.steps[this.index]);
    this.markInvalid(input);
    input.focus();
  }

  markInvalid(input) {
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', this.error.id);
  }

  clearError() {
    if (this.error) this.error.hidden = true;
    this.steps?.forEach((step) => {
      const input = this.input(step);
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    });
  }

  // The customer tag is the durable record of the source; this event is the
  // analytics hook, readable by a custom web pixel via analytics.subscribe().
  track(name) {
    try {
      window.Shopify?.analytics?.publish?.(name, { source: this.dataset.source });
    } catch (error) {
      // Analytics must never block a sign-up.
    }
  }
}

if (!customElements.get('wc-signup-form')) {
  customElements.define('wc-signup-form', WcSignupForm);
}
