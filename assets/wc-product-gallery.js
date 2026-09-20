/**
 * Product media viewer — sections/wc-main-product.liquid.
 * One image shows at a time; thumbnails (rendered only when there is more than
 * one image) switch it, and a variant change shows that variant's featured
 * image. The variant hook is Dawn's own `variantChange` pub/sub event, which
 * product-info.js publishes after it has re-rendered the section.
 */
if (!customElements.get('wc-product-gallery')) {
  customElements.define(
    'wc-product-gallery',
    class WcProductGallery extends HTMLElement {
      connectedCallback() {
        this.addEventListener('click', (event) => {
          const thumb = event.target.closest('.wc-product__thumb');
          if (thumb) this.show(thumb.dataset.mediaId);
        });

        if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
          this.unsubscribe = subscribe(PUB_SUB_EVENTS.variantChange, ({ data }) => {
            if (data?.sectionId !== this.dataset.section) return;
            const mediaId = data.variant?.featured_media?.id;
            if (mediaId) this.show(String(mediaId));
          });
        }
      }

      disconnectedCallback() {
        this.unsubscribe?.();
      }

      show(mediaId) {
        const target = this.querySelector(`.wc-product__slide[data-media-id="${mediaId}"]`);
        if (!target) return;

        this.querySelectorAll('.wc-product__slide').forEach((slide) => {
          const active = slide === target;
          slide.hidden = !active;
          slide.classList.toggle('is-active', active);
        });
        this.querySelectorAll('.wc-product__thumb').forEach((thumb) => {
          if (thumb.dataset.mediaId === mediaId) thumb.setAttribute('aria-current', 'true');
          else thumb.removeAttribute('aria-current');
        });
      }
    }
  );
}
