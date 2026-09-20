/*
 * <wc-accordion> — smooth open/close for the FAQ's native <details> rows
 * (sections/wc-faq.liquid).
 *
 * The markup works on its own: without this script the rows still open, they
 * just jump. Here the summary's click is taken over so the answer's height can
 * be tweened, which <details> does not do by itself:
 *   open  — set [open] first (so the answer has a height to measure), then
 *           animate 0 → that height
 *   close — animate the current height → 0, then drop [open]
 * The "+" marker follows .is-open / .is-closing, because a closing row is
 * still [open] until its animation finishes.
 *
 * Keyboard works unchanged: Enter and Space on a summary fire a click.
 */
(() => {
  const DURATION = 280;
  const EASING = 'cubic-bezier(0.22, 0.61, 0.36, 1)';

  class WcAccordion extends HTMLElement {
    connectedCallback() {
      this.addEventListener('click', this.onClick);
    }

    disconnectedCallback() {
      this.removeEventListener('click', this.onClick);
    }

    get reducedMotion() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    onClick = (event) => {
      const summary = event.target.closest('summary');
      if (!summary || !this.contains(summary)) return;

      const details = summary.parentElement;
      const answer = details.querySelector('.wc-faq__answer');
      // No answer to reveal, or motion is not wanted: let <details> do it.
      if (!answer || this.reducedMotion || typeof answer.animate !== 'function') return;

      event.preventDefault();
      details.open ? this.collapse(details, answer) : this.expand(details, answer);
    };

    expand(details, answer) {
      this.stop(answer);
      details.open = true;
      details.classList.add('is-open');
      details.classList.remove('is-closing');
      this.run(answer, 0, answer.scrollHeight);
    }

    collapse(details, answer) {
      const from = answer.getBoundingClientRect().height;
      this.stop(answer);
      details.classList.add('is-closing');
      details.classList.remove('is-open');
      const animation = this.run(answer, from, 0);
      animation.addEventListener('finish', () => {
        details.open = false;
        details.classList.remove('is-closing');
      });
    }

    /* A second click mid-animation starts from wherever the row is now. */
    stop(answer) {
      if (answer.wcAnimation) {
        answer.wcAnimation.cancel();
        answer.wcAnimation = null;
      }
    }

    run(answer, from, to) {
      const animation = answer.animate(
        { height: [`${from}px`, `${to}px`], opacity: [from ? 1 : 0, to ? 1 : 0] },
        { duration: DURATION, easing: EASING }
      );
      answer.wcAnimation = animation;
      animation.addEventListener('finish', () => {
        if (answer.wcAnimation === animation) answer.wcAnimation = null;
      });
      return animation;
    }
  }

  if (!customElements.get('wc-accordion')) {
    customElements.define('wc-accordion', WcAccordion);
  }
})();
