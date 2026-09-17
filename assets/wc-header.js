/* Wine Crush — header state, desktop mega menus, mobile drawer. */

const SCROLL_THRESHOLD = 16;
const HOVER_CLOSE_DELAY = 180;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), details > summary, [tabindex]:not([tabindex="-1"])';

function focusFirst(scope) {
  const target = Array.from(scope.querySelectorAll(FOCUSABLE)).find(
    (element) => element.offsetParent !== null
  );
  if (target) target.focus();
}

function motionDuration(element) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 0;
  const declared = getComputedStyle(element).transitionDuration.split(',')[0];
  return declared.endsWith('ms') ? parseFloat(declared) : parseFloat(declared) * 1000;
}

class WcHeader extends HTMLElement {
  connectedCallback() {
    this.triggers = Array.from(this.querySelectorAll('[data-wc-megamenu-trigger]'));
    this.openPanel = null;
    this.hoverTimer = null;
    this.ticking = false;

    this.onScroll = this.onScroll.bind(this);
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.syncScrollState();

    this.triggers.forEach((trigger) => {
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      if (!panel) return;

      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        if (this.openPanel !== panel) {
          this.open(trigger, panel, 'click');
        } else if (this.openSource === 'hover') {
          // The pointer opened it on the way in; this click adopts it rather
          // than closing a panel the user has only just revealed.
          this.openSource = 'click';
        } else {
          this.close();
        }
      });

      trigger.addEventListener('pointerenter', (event) => {
        if (event.pointerType !== 'mouse') return;
        this.cancelHoverClose();
        this.open(trigger, panel, 'hover');
      });

      [trigger, panel].forEach((element) => {
        element.addEventListener('pointerleave', (event) => {
          if (event.pointerType !== 'mouse') return;
          this.scheduleHoverClose();
        });
        element.addEventListener('pointerenter', (event) => {
          if (event.pointerType !== 'mouse') return;
          this.cancelHoverClose();
        });
      });
    });

    this.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !this.openPanel) return;
      const trigger = this.activeTrigger;
      this.close();
      if (trigger) trigger.focus();
    });

    this.addEventListener('focusout', () => {
      requestAnimationFrame(() => {
        if (this.openPanel && !this.contains(document.activeElement)) this.close();
      });
    });

    this.onDocumentPointerDown = (event) => {
      if (this.openPanel && !this.contains(event.target)) this.close();
    };
    document.addEventListener('pointerdown', this.onDocumentPointerDown);
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.onScroll);
    document.removeEventListener('pointerdown', this.onDocumentPointerDown);
    this.cancelHoverClose();
  }

  onScroll() {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      this.syncScrollState();
      this.ticking = false;
    });
  }

  syncScrollState() {
    this.classList.toggle('wc-header--scrolled', window.scrollY > SCROLL_THRESHOLD);
  }

  scheduleHoverClose() {
    this.cancelHoverClose();
    this.hoverTimer = setTimeout(() => this.close(), HOVER_CLOSE_DELAY);
  }

  cancelHoverClose() {
    if (this.hoverTimer) clearTimeout(this.hoverTimer);
    this.hoverTimer = null;
  }

  open(trigger, panel, source) {
    if (this.openPanel === panel) return;
    if (this.openPanel) this.close({ keepHeaderState: true });

    this.activeTrigger = trigger;
    this.openPanel = panel;
    this.openSource = source;
    trigger.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    // Force a style flush so the panel animates from its closed transform.
    panel.offsetHeight;
    panel.classList.add('wc-megamenu--open');
    this.classList.add('wc-header--menu-open');
  }

  close({ keepHeaderState = false } = {}) {
    this.cancelHoverClose();
    const panel = this.openPanel;
    if (!panel) return;

    this.openPanel = null;
    this.openSource = null;
    if (this.activeTrigger) this.activeTrigger.setAttribute('aria-expanded', 'false');
    this.activeTrigger = null;
    panel.classList.remove('wc-megamenu--open');
    setTimeout(() => {
      if (!panel.classList.contains('wc-megamenu--open')) panel.hidden = true;
    }, motionDuration(panel));

    if (!keepHeaderState) this.classList.remove('wc-header--menu-open');
  }
}

if (!customElements.get('wc-header')) customElements.define('wc-header', WcHeader);

/* -------------------------------------------------------------------------
   Mobile drawer
   ------------------------------------------------------------------------- */

class WcDrawer {
  constructor(root) {
    this.root = root;
    this.panel = root.querySelector('.wc-drawer__panel');
    this.backBtn = root.querySelector('[data-wc-drawer-back]');
    this.rootLevel = root.querySelector('[data-wc-drawer-level="root"]');
    this.currentLevel = this.rootLevel;
    this.opener = null;

    document.querySelectorAll('[data-wc-drawer-open]').forEach((button) => {
      button.addEventListener('click', () => this.open(button));
    });

    root.querySelectorAll('[data-wc-drawer-close]').forEach((button) => {
      button.addEventListener('click', () => this.close());
    });

    root.querySelectorAll('[data-wc-drawer-to]').forEach((button) => {
      button.addEventListener('click', () => this.showLevel(button.dataset.wcDrawerTo));
    });

    if (this.backBtn) this.backBtn.addEventListener('click', () => this.showRoot());

    root.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        this.close();
      } else if (event.key === 'Tab') {
        this.trapFocus(event);
      }
    });
  }

  open(opener) {
    this.opener = opener;
    this.root.hidden = false;
    this.root.offsetHeight;
    this.root.classList.add('wc-drawer--open');
    if (opener) opener.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    this.showRoot();
    focusFirst(this.panel);
  }

  close() {
    this.root.classList.remove('wc-drawer--open');
    if (this.opener) this.opener.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!this.root.classList.contains('wc-drawer--open')) this.root.hidden = true;
    }, motionDuration(this.panel));
    if (this.opener) this.opener.focus();
  }

  showLevel(id) {
    const next = this.root.querySelector(`[data-wc-drawer-level="${id}"]`);
    if (!next || next === this.currentLevel) return;

    next.hidden = false;
    next.classList.add('wc-drawer__level--entering');
    next.offsetHeight;
    next.classList.remove('wc-drawer__level--entering');
    this.currentLevel.classList.add('wc-drawer__level--stacked');
    this.currentLevel = next;

    if (this.backBtn) this.backBtn.hidden = false;
    focusFirst(next);
  }

  showRoot() {
    if (this.currentLevel !== this.rootLevel) {
      const leaving = this.currentLevel;
      leaving.classList.add('wc-drawer__level--entering');
      setTimeout(() => {
        if (leaving !== this.currentLevel) leaving.hidden = true;
      }, motionDuration(leaving));
    }
    this.rootLevel.classList.remove('wc-drawer__level--stacked');
    this.currentLevel = this.rootLevel;
    if (this.backBtn) this.backBtn.hidden = true;
  }

  trapFocus(event) {
    const items = Array.from(this.panel.querySelectorAll(FOCUSABLE)).filter(
      (element) => element.offsetParent !== null
    );
    if (!items.length) return;

    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}

function initDrawers(scope) {
  scope.querySelectorAll('[data-wc-drawer]').forEach((element) => new WcDrawer(element));
}

initDrawers(document);
document.addEventListener('shopify:section:load', (event) => initDrawers(event.target));
