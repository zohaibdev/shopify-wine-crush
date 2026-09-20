/*
 * <wc-journal-list> — the Journal listing's sort and "see more"
 * (sections/wc-main-blog.liquid).
 *
 * Every article on the page is server-rendered by Liquid. This only:
 *   - hides the cards past the first batch and reveals the next batch when
 *     "see more" is pressed;
 *   - reorders the rendered cards when the sort changes (newest / oldest,
 *     from each card's published timestamp).
 *
 * With no JavaScript nothing is hidden and the button is Shopify's next-page
 * link, so the listing works either way. Once everything on this page is
 * shown, the button hands over to that link (or goes away if there is no
 * next page).
 */
(() => {
  class WcJournalList extends HTMLElement {
    connectedCallback() {
      this.grid = this.querySelector('[data-journal-grid]');
      this.button = this.querySelector('[data-journal-more]');
      this.sort = this.querySelector('[data-journal-sort]');
      if (!this.grid) return;

      this.items = [...this.grid.querySelectorAll('[data-journal-item]')];
      this.batch = parseInt(this.dataset.batch, 10) || 12;
      this.shown = this.batch;

      if (this.button) this.button.addEventListener('click', this.onMore);
      if (this.sort) this.sort.addEventListener('change', this.onSort);

      this.apply();
    }

    disconnectedCallback() {
      if (this.button) this.button.removeEventListener('click', this.onMore);
      if (this.sort) this.sort.removeEventListener('change', this.onSort);
    }

    onMore = (event) => {
      /* Everything here is already visible: let the link go to page two. */
      if (this.shown >= this.items.length) return;

      event.preventDefault();
      const firstNew = this.items[this.shown];
      this.shown += this.batch;
      this.apply();
      /* Send the reading order (and the keyboard) to the first new card. */
      if (firstNew) {
        const link = firstNew.querySelector('a');
        if (link) link.focus({ preventScroll: true });
        firstNew.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    };

    onSort = () => {
      const oldest = this.sort.value === 'oldest';
      const sorted = [...this.items].sort((a, b) => {
        const one = Number(a.dataset.published) || 0;
        const two = Number(b.dataset.published) || 0;
        return oldest ? one - two : two - one;
      });
      /* One reflow: the fragment is filled before it touches the grid. */
      const fragment = document.createDocumentFragment();
      sorted.forEach((item) => fragment.appendChild(item));
      this.grid.appendChild(fragment);
      this.items = sorted;
      this.apply();
    };

    apply() {
      this.items.forEach((item, index) => {
        item.hidden = index >= this.shown;
      });

      if (!this.button) return;
      const more = this.shown < this.items.length;
      /* No more cards here and no next page: the control has nothing to do. */
      this.button.hidden = !more && this.button.hasAttribute('data-no-next');
    }
  }

  if (!customElements.get('wc-journal-list')) {
    customElements.define('wc-journal-list', WcJournalList);
  }
})();
