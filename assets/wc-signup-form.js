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
 * The final step posts with fetch (no reload). Success is only shown when
 * Shopify confirms it; if Shopify asks for a human check (hCaptcha / bot
 * challenge), the form hands over to Shopify's own protected native submit.
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
    this.nativeFallback = false;

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
    // The only submit allowed through is the hand-over to Shopify's protected flow.
    if (this.nativeFallback) return;
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
      case 'phone': {
        // Permissive on formatting (spaces, dashes, dots, brackets, leading +),
        // strict only on length: E.164 allows at most 15 digits.
        const digits = value.replace(/\D/g, '');
        const shapeOk = /^\+?[\d\s().-]+$/.test(value);
        return shapeOk && digits.length >= 8 && digits.length <= 15 ? '' : this.dataset.errorPhone;
      }
      default:
        return '';
    }
  }

  async submitForm() {
    this.setBusy(true);
    this.clearError();
    this.prepare();
    this.track('wc_newsletter_submit');

    try {
      const response = await fetch(this.form.action.split('#')[0], {
        method: 'POST',
        body: new FormData(this.form),
        headers: { Accept: 'text/html' },
        credentials: 'same-origin',
      });

      // Shopify asked for a human check: let its own protected flow take over.
      if (response.status === 403 || response.status === 429 || /\/challenge\b/.test(response.url)) {
        this.submitNatively();
        return;
      }

      const html = await response.text();
      const returned = new DOMParser().parseFromString(html, 'text/html').getElementById(this.form.id);

      if (response.ok && (/[?&]customer_posted=true\b/.test(response.url) || returned?.querySelector('[data-signup-success]'))) {
        this.showSuccess();
        return;
      }

      // Shopify re-renders this form with its validation errors (e.g. a phone
      // number it can't parse, or one already on another customer).
      const serverError = returned?.querySelector('[data-signup-error]:not([hidden])')?.textContent.trim();
      const startStep = parseInt(returned?.querySelector('[data-signup-row]')?.dataset.startStep, 10) || 0;
      this.restore();
      this.setBusy(false);
      this.go(serverError ? startStep : this.index, { focus: false });
      this.showError(serverError || this.dataset.errorGeneric);
    } catch (error) {
      this.restore();
      this.setBusy(false);
      this.showError(this.dataset.errorGeneric);
    }
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
    }
    if (phoneInput) phoneInput.value = phoneInput.value.replace(/[\s().-]/g, '');
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

  submitNatively() {
    this.nativeFallback = true;
    this.submitButton.type = 'submit';
    this.form.requestSubmit(this.submitButton);
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
