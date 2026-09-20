# Wine Crush — Development Context

Persistent development context for the Wine Crush Shopify build. Update this file whenever an implementation decision is made.

---

## 1. Project

| | |
| --- | --- |
| **Project** | Wine Crush — neighbourhood bottle shop, Graceville QLD |
| **Platform** | Shopify |
| **Base theme** | Dawn |
| **Design source of truth** | Figma — [Wine Crush Website (Copy)](https://www.figma.com/design/aHXTROQq2Is1ltbfU5UdUy/Wine-Crush-Website--Copy-?node-id=10084-45) |
| **File key** | `aHXTROQq2Is1ltbfU5UdUy` |
| **Design system doc** | [`docs/UI-UX.md`](./UI-UX.md) |

### Current scope

Only the following are in scope for this phase:

1. Home / landing page
2. Header
3. Desktop mega menu (Shop + Info)
4. Mobile mega menu / drawer behaviour
5. Coming Soon page + shared newsletter sign-up (see § 22)
6. Collection page (see § 23)

Explicitly **out of scope**: product template, cart, journal/blog templates, about us, shipping & FAQs, build-your-bundle page. These exist in Figma but must not be implemented yet.

### Figma node reference

| Frame | Node ID |
| --- | --- |
| Home (desktop) | `10084:45` (alias `10055:348`) |
| Header — unscrolled | `10084:148` |
| Header — sticky | `10008:339` |
| Menu Dropdown — Shop | `10075:2364` |
| Menu Dropdown — Info | `10075:2000` |
| Shop (collection page) | `10008:35` — file `zHDSJoUnvvQwNeM1p2IWLH`; node map in `UI-UX.md` § 10 |
| Coming Soon Page | `10036:30` — **file `zHDSJoUnvvQwNeM1p2IWLH`** ([link](https://www.figma.com/design/zHDSJoUnvvQwNeM1p2IWLH/Wine-Crush?node-id=10036-30)); the older copy above denies access to it. Full node map in `UI-UX.md` § 9. |

---

## 2. Priority order

1. Figma design
2. Existing `wine-crush-` assets
3. Shopify / Dawn best practices
4. Accessibility & performance best practices

Generic Dawn styling never takes priority over the Figma design.

---

## 3. Assets

All provided assets are already in `assets/` and use the `wine-crush-` prefix. **Reuse them — do not duplicate or download replacements.**

| Asset | Use |
| --- | --- |
| `wine-crush-hero.jpg` | Hero fallback image |
| `wine-crush-logo.svg` / `wine-crush-logo-lg.png` | Primary logo (sticky header / hero + footer) |
| `wine-crush-logo-dark.png` | Logo on light surfaces |
| `wine-crush-bottle-1..4.png` | Product card bottle imagery |
| `wine-crush-blog-1..4.jpg` | Journal card imagery |
| `wine-crush-build-your-bundle-1..4.{jpg,png}` | Bundle band decorative images |
| `wine-crush-5-off-for-life.jpg` | Membership panel image |
| `wine-crush-direction-image.png` | Brand story circular image |
| `wine-crush-shop-menu.png` | Shop mega menu promo (landscape) |
| `wine-crush-info.png` | Info mega menu promo (portrait) |
| `dahlia.woff2` / `dahlia.woff` | Display font |

**Naming convention for anything new:** `wine-crush-<section>-<descriptor>.<ext>`.

Assets shipped as `wine-crush-` files are **defaults only** — every image must still be replaceable through a section or block setting.

---

## 4. Global CSS

Global design system lives in **`assets/style.css`** (provided, currently empty). It defines the `:root` variable system — typography, colours, spacing, layout, buttons, borders, transitions — per `UI-UX.md`.

Rules:
- Reusable values are defined **once** in `style.css` as CSS variables.
- Section-specific CSS goes in a per-section stylesheet loaded by that section, and consumes the global variables. Values are not redeclared.
- Dawn's `base.css` is left intact; `style.css` loads after it and overrides where the Figma design differs.
- No CSS preprocessor, no Tailwind, no utility framework.

---

## 5. Fonts

| Font | Loading strategy |
| --- | --- |
| **Dahlia** (display) | Self-hosted `@font-face` from `assets/dahlia.woff2` with `.woff` fallback, `font-display: swap`, preloaded in `theme.liquid` |
| **IBM Plex Mono** (body) | Self-hosted `@font-face` from `assets/IBMPlexMono.woff2`, same strategy |

Dawn's `type_body_font` / `type_header_font` theme settings are **not** used to drive these two families — Shopify's font picker cannot supply either. The settings remain in the schema (so Dawn internals don't break) but `style.css` overrides `--font-body` / `--font-heading` with the self-hosted stacks.

IBM Plex Mono (SIL OFL 1.1) was supplied in all seven weights. Only **Regular (400)** and **Bold (700)** are registered in `style.css` — the design uses Regular exclusively, and Bold exists only so `<strong>` isn't synthesised. The remaining weight files are left in `assets/` unused rather than deleted.

Both `dahlia.woff2` and `IBMPlexMono.woff2` are preloaded in `theme.liquid`.

---

## 6. Dynamic content requirements

**No homepage content is hardcoded in Liquid.** Every string, image, link, and collection is driven by section settings, blocks, or Shopify objects. The merchant must be able to run the whole home page from **Online Store → Themes → Customize** without touching code.

This applies to text, images, video, links, buttons, products, collections, tags, blogs, menus, mega menus, and footer content.

Section settings are written for a non-technical merchant: plain labels, sensible defaults, no exposed technical toggles.

---

## 7. Section architecture

Home page sections, each a standalone section file with its own schema, assembled in `templates/index.json`:

| Section | Purpose | Key settings |
| --- | --- | --- |
| `wc-hero` | Full-bleed hero | Media type (image/video), image, video, overlay opacity, lede text, wordmark width, height |
| `wc-statement` | Centred or left display line | Heading, size, body, alignment, max width, CTA |
| `wc-product-tabs` | Tabbed product slider | Tab blocks (collection or tag source), products to show, CTA button |
| `wc-bundle-band` | "Build your bundle" band | Eyebrow items, heading, body, CTA, up to 4 scattered `figure` blocks |
| `wc-card-grid` | Journal row **and** image row | Source (blog \| blocks), blog picker, item count, date toggle |
| `wc-membership` | 5% off for life panel | Heading, body, image, `signup_*` form settings (the sign-up replaced the CTA link) |
| `wc-story` | Brand story | Lead text, closing text, circular image + rotation, address, directions CTA |
| `wc-footer` | Footer | Menu, social toggle, contact, logo, legal, policies toggle |
| `wc-collection-nav` | Collection links row (collection template) | "All products" + "Collection" blocks (picker, label), paddings |
| `wc-main-collection` | Collection grid + filters | Products per page, add label, show filters, bottom padding |
| `wc-coming-soon` | Coming Soon page (`templates/page.coming-soon.json`) | Background image + overlay (37%), logo + width (262), left/right flank text, description, `signup_*` form settings |

`wc-statement` appears twice on the home page (the hero statement and the journal intro) and `wc-card-grid` twice (journal, image row), which is why the page has twelve rows but only nine section files.

`wc-footer` replaces Dawn's footer in `footer-group.json`; Dawn's `footer.liquid` stays on disk untouched. Social icons still come from Dawn's own social settings via its `social-icons.liquid` snippet.

### Reusable snippets

- `wc-product-card.liquid` — the one product card (home slider; `layout: 'grid'` on the collection page), wrapping Dawn's `<product-form>`; styles in `assets/wc-product-card.css`
- `wc-header-nav-item.liquid` — a single header nav entry, shared by the desktop bar and the drawer
- `wc-facets.liquid` / `wc-facet-values.liquid` — Search & Discovery filters in Wine Crush markup, driven by Dawn's `facets.js` (see § 23)
- `wc-signup-form.liquid` — the multi-step newsletter sign-up, shared by `wc-coming-soon` and `wc-membership` (see § 22)

The button is a **CSS primitive** (`.wc-button` plus size and colour modifiers in `style.css`), not a snippet — it is only ever an `<a>` or `<button>` with a class, so a snippet would add indirection without removing repetition. Icons are Dawn's existing `icon-*.svg` assets rendered inline, so no icon-lookup snippet was needed either.

---

## 8. Header architecture

Custom `sections/wc-header.liquid` replaces Dawn's `header.liquid` in `header-group.json`. Dawn's `header.liquid` is **left on disk untouched** so it can be reverted or referenced.

Structure:

```
wc-header
 ├── logo (Shopify logo setting, hidden until scrolled on home)
 ├── primary nav (blocks)
 │    ├── Shop Mega Menu   (block type)
 │    ├── Info Mega Menu   (block type)
 │    └── Link             (block type — simple link, e.g. "journal")
 ├── account link
 └── cart icon + count
```

Menu labels and links come from Shopify navigation objects and block settings. Nothing is hardcoded.

### Logo scroll behaviour

Requirement: on the **home page only**, the logo is hidden at scroll position 0 and appears when the header becomes sticky.

Implementation:
- The Shopify section wrapper `.wc-header-section` is `position: sticky; top: 0` at all times — it never changes from static to fixed, so there is no layout jump. Sticky works here because section-group members are direct children of `<body>`.
- A rAF-throttled, passive `scroll` listener toggles `.wc-header--scrolled` past 16px. A sentinel + `IntersectionObserver` was the first choice but is not viable: any sentinel rendered inside the section is itself carried along by the sticky wrapper and so never leaves the viewport.
- The logo is always in the DOM (so it occupies its box) and transitions `opacity` + `translateY(8px)`, keeping the header height constant at both states. Its box is pinned to `--header-row-height` (28px) while the image itself is the artboard's 30px, so the wordmark overflows the band by 1px top and bottom rather than opening the bar — see decision #35.
- The transparent/logo-hidden state is opt-in via `.wc-header--transparent`, added by Liquid only when `template.name == 'index'`. Every other template renders solid with the logo visible and needs no JS. The selector is `.wc-header--transparent:not(.wc-header--scrolled):not(.wc-header--menu-open)`, so opening a mega menu also resolves the header to its solid surface without extra JS state.

The header is **58px in both states** (28px content band + 15px padding top and bottom), which is what keeps the transition jump-free. It is also load-bearing well beyond the header: every section below is positioned off it, and the measured 7393px document height depends on it, so nothing inside the bar may be allowed to grow it.

---

## 9. Mega menu architecture

Two distinct block types on `wc-header`, because the Shop and Info panels have genuinely different structures.

### Shop Mega Menu block

Four menu fields — the merchant assigns a Shopify navigation menu to each:

| Setting | Type |
| --- | --- |
| `label` | text (nav trigger label, e.g. "shop") |
| `heading` | text (panel heading, "Shop") |
| `menu_1` … `menu_4` | `link_list` |
| `promo_image` | image_picker |
| `promo_heading` | text |
| `promo_link` | url |

Each `link_list` renders as a column: the menu title is the column heading, its child links are the column items. Column headings and links are never hardcoded.

### Info Mega Menu block

Deliberately **not** a copy of the Shop fields. The artboard is the shop panel mirrored — portrait image on the left, copy on the right — and the copy is **paragraph-then-button, twice**, not a heading followed by a list of buttons. So the block carries three repeating text/button items rather than a `link_list`:

| Setting | Type |
| --- | --- |
| `label` | text |
| `heading` | text (panel heading, "Info") |
| `promo_image` | image_picker (the left-hand portrait) |
| `item_1…3_text` | richtext |
| `item_1…3_label` | text (button label) |
| `item_1…3_url` | url |

The same three items feed the mobile drawer's Info level, so there is still one data source and two presentations.

> A `link_list` was the original design here and was removed. Because Shopify's stored section-group settings win over schema defaults, `sections/header-group.json` had to be migrated by hand at the same time — dropping the dead `menu` / `body` keys and writing the item copy in. Changing a block's schema is never enough on its own.

### Desktop behaviour

- Panel is 1440 × 512 **Coral**, full-bleed, anchored at **y0** — the top of the viewport, with the header bar painted over it. It does *not* hang below the bar; the panel's own top padding is what clears the 58px header.
- A `rgba(0, 0, 0, .3)` scrim covers the whole viewport behind the panel. It is a deliberately empty `div`, so it needs an explicit `display: block` at a specificity above (0,1,1) to defeat Dawn's `div:empty { display: none }` in `base.css`. The same reset is why the membership coral backdrop is a `::before`.
- Opens on hover **and** on click/keyboard activation (click is the accessible path; hover is the polish).
- Slides down: `transform: translateY(-100%) → 0` plus opacity, 320ms `cubic-bezier(.22,.61,.36,1)`. Because the panel is anchored at y0, it slides out of its own height and so appears to drop from behind a header that never moves. CSS-driven — JS only toggles a class and manages ARIA.
- The header background transitions from transparent to Deep Claret over 240ms so header and panel merge into one surface.
- Stacking is carried by `.wc-header-section` (`position: sticky; z-index: 4`); the panel and scrim only need z-indices relative to each other.
- Only one panel open at a time. Closes on `Escape`, on outside click, and on focus leaving the panel.
- `aria-expanded` on the trigger, `aria-hidden` on the panel, focus trapped within the open panel, first link focused on keyboard open.

---

## 10. Mobile drawer architecture

**Decision:** the mobile navigation is a purpose-built two-level drawer, not a reflowed mega menu.

```
Mobile header → hamburger
   └── Level 1 drawer
         ├── Shop   →  Level 2: Shop drawer (Menu 1–4 as accordions)
         ├── Info   →  Level 2: Info drawer (the block's three text/button items)
         ├── Journal
         └── Account
```

- Level 2 slides in over level 1 (`translateX(100%) → 0`), 280ms, with a back button returning to level 1.
- The same `link_list` settings feed both desktop columns and mobile accordions — one data source, two presentations.
- Drawer is `role="dialog"` `aria-modal="true"`, traps focus, closes on `Escape` and on backdrop tap, and restores focus to the hamburger on close.
- Body scroll is locked while open.
- Built by extending Dawn's existing `header-drawer.liquid` details/summary pattern rather than introducing a new drawer library.

---

## 11. Hero requirements

Merchant chooses **image or video** via a `media_type` setting.

Video behaviour: autoplay, muted, loop, `playsinline`, no controls, `preload="metadata"`, and a `poster` set from the fallback image. If no video is selected — or the browser refuses to play it — the image renders instead. The video never blocks first paint.

Uses Shopify's native `video` setting type (not an external URL) so the merchant picks from their own library, with `image_picker` for the fallback/poster.

---

## 12. Product tab requirements

The product section's tabs are dynamic blocks. Each tab block sets its own source:

| Setting | Options |
| --- | --- |
| `title` | text |
| `source` | `collection` \| `tag` |
| `collection` | collection picker (used when source = collection) |
| `tag` | text (used when source = tag) |
| `products_to_show` | range |

Products are queried from Shopify — never hardcoded. Tag-sourced tabs query a base collection filtered by tag.

Tabs are rendered as an ARIA tablist (`role="tablist"` / `role="tab"` / `role="tabpanel"`) with arrow-key navigation. All panels render server-side; switching is a class toggle, so there is no fetch latency and it works without JS.

---

## 13. Product slider

Vanilla CSS scroll-snap slider — **no Swiper, no third-party library**.

- `scroll-snap-type: x mandatory` on the track, `scroll-snap-align: start` on cards.
- Native touch/swipe support comes free; momentum scrolling is the browser's.
- Prev/next arrows call `scrollBy()`. Arrows match the Figma control (52px rule + 13×13 chevron) and are hidden when the track doesn't overflow.
- Slides visible: 4.2 desktop / 2.4 tablet / 1.3 mobile, driven by CSS custom properties.
- Scrollbar hidden, keyboard-accessible, `aria-label` on controls.

No pagination dots — the design doesn't show any.

---

## 14. Blog requirements

Fully dynamic from Shopify blog/article data. Merchant configures blog, article count, heading, intro text, and CTA. Card shows the article image, published date (formatted as `mmm 'yy` per Figma), and title. Nothing hardcoded.

---

## 15. Footer requirements

All footer content is configurable: nav pills come from a `link_list`, contact details and legal text from settings, logo from an image setting.

**Social icons use Dawn's existing social settings** (`settings.social_instagram_link` etc.) and Dawn's `social-icons.liquid` snippet — no separate hardcoded social URLs.

---

## 16. Theme customizer strategy

Exposed globally via `settings_schema.json`:
- The six brand colours, as a Wine Crush colour scheme group
- Button style (radius, border width)
- Section spacing scale multiplier

Dawn's native colour-scheme system is reused rather than replaced — the Wine Crush palette is added as schemes so existing Dawn sections keep working. Shopify's existing settings are used wherever they fit; nothing is duplicated.

---

## 17. Responsive requirements

Breakpoints reuse Dawn's: mobile ≤ 749px, tablet 750–989px, desktop ≥ 990px.

Must be verified at: **1440, 1280, 1024, 768, 430, 390, 375**.

Layouts are built per-breakpoint, not scaled-down desktop. See `UI-UX.md` § 7 for the per-section behaviour table.

---

## 18. Accessibility requirements

- Semantic HTML; one `h1` per page; no heading levels skipped.
- Buttons for actions, links for navigation.
- All images carry meaningful `alt` (merchant-editable); decorative images get `alt=""`.
- Full keyboard operation of nav, mega menus, drawer, tabs, and slider.
- Visible `:focus-visible` styles everywhere — never removed.
- Correct ARIA on menus, drawer, tabs, and slider controls.
- Hero video is muted and decorative, marked `aria-hidden` with the meaningful content in text.
- `prefers-reduced-motion: reduce` disables all transitions and pauses the hero video.
- Text contrast verified against WCAG AA — note Ochre `#9A7331` on Ivory `#F4E7D4` is a known low-contrast pairing used for fine print in the design; body-size text uses Crimson instead.

---

## 19. Performance requirements

- Shopify `image_url` + `srcset` + `sizes` for every image; `loading="lazy"` below the fold, `fetchpriority="high"` on the hero.
- Section CSS loaded per-section; no monolithic bundle.
- Vanilla JS only, `defer`ed, no framework, no jQuery, no slider library.
- Hero video `preload="metadata"` with a poster so it never blocks render.
- Fonts preloaded, `font-display: swap`.

---

## 20. Code quality rules

- Liquid + JSON templates + section schema + blocks + snippets.
- Vanilla JS; no new dependencies without first proving the theme can't do it.
- Dawn architecture is **not** rewritten. Custom work lives in new `wc-` prefixed sections/snippets/assets.
- Before modifying a Dawn component: understand it, try to reuse it, extend rather than replace.

---

## 21. Implementation decisions log

Decisions made where Figma was silent or ambiguous. Each records the reasoning so it can be revisited.

| # | Decision | Reasoning |
| --- | --- | --- |
| 1 | **Mobile & tablet layouts are derived, not extracted.** | The Figma file contains **no artboard narrower than 1440px** — verified across all 16 top-level frames. Every responsive value in `UI-UX.md` § 7 is an inference from the desktop design, following the established patterns. ⚠️ **Needs design sign-off before this phase can be called complete.** |
| 2 | Container = 1404px with 18px gutters, capped and centred above 1440px. | Derived from the journal grid (`18 + 4×339 + 3×16 = 1422`, symmetric 18px right gutter) and confirmed by the 1404px membership panel. Not a generic `max-width: 1200px`. |
| 3 | Product row is a slider, not a static grid. | 4 cards × 331 + 3 gaps × 15 = 1369 inside a 1404 container leaves a ~35px peek, and Figma includes a next-arrow control (52px rule + chevrons) at the right edge. |
| 4 | Button hover = inverted fill (border colour becomes background). | Figma specifies no hover state. Inversion is the least invented option for an outline-only button system and preserves contrast in every colour variant. |
| 5 | Slider is CSS scroll-snap, not Swiper. | Brief § 27 requires proving existing capability is insufficient first. Scroll-snap gives touch, momentum, and keyboard support natively at zero dependency cost. |
| 6 | Both fonts are self-hosted. | Neither Dahlia (commercial, supplied as `.woff2`) nor IBM Plex Mono is available in Shopify's font picker, so `type_body_font` / `type_header_font` cannot drive them. |
| 7 | Sticky header uses `position: sticky` + a rAF-throttled passive scroll listener. | Sticky avoids the layout jump caused by switching `static → fixed`. `IntersectionObserver` was rejected because a sentinel rendered inside the section is carried by the sticky wrapper and never intersects. Logo stays in the DOM and animates opacity so header height is constant. |
| 8 | Overlay opacity is a per-block setting defaulting to 0.30. | Figma tunes overlay per image (0.20 / 0.31 / 0.35); a fixed value would break with merchant photography. |
| 9 | Tab panels all render server-side. | Switching is a class toggle rather than a fetch — no latency, and the content is present without JS. |
| 10 | Dawn's `header.liquid` and `footer.liquid` are left on disk. | `wc-header.liquid` is swapped in via `header-group.json` instead, so the Dawn original stays available for reference and rollback. |
| 11 | The announcement bar was removed from `header-group.json`. | The Figma design has none, and it would push the header off the hero overlay. The merchant can re-add it from the customizer at any time, so no capability is lost. |
| 12 | `sections/cart-icon-bubble.liquid` was rewritten with `wc-` classes. | It is the render target of the Section Rendering API when the cart updates; leaving Dawn's classes would strip the header cart's styling after the first add-to-cart. |
| 13 | Mega menus open on hover *and* click, and close on Escape / outside click / focus-out. | Hover alone is inaccessible to keyboard and touch users; click alone loses the expected desktop feel. Hover is gated on `pointerType === 'mouse'` so touch devices only get the click path. |
| 14 | Drawer level 2 uses native `<details>` accordions for the Shop columns. | Gives keyboard support, correct semantics, and a no-JS fallback for free. Only the level transition itself needs script. |
| 15 | The header bar measures 58px, not the 57px in Figma. | 15px block padding plus the tallest control (the 28px cart circle) is 58. Forcing 57 would mean a 27px cart, which is off-spec in the other direction. The height is identical in both scroll states, which is what matters for the jump-free transition. |
| 16 | A static HTML harness lives at `.claude/harness/index.html`, scoped to the header only. | Lets the header be rendered and measured in a real browser without a connected Shopify store. `.claude/` is not one of the directories `shopify theme push` uploads, so it never ships. It is deliberately **not** extended to the page sections — those are authored directly as Liquid, so a mirrored HTML copy would be a second source of truth that drifts. Serve it with the `harness` config in `.claude/launch.json`. |
| 17 | `assets/wine-crush-logo-lg.svg` was renamed to `.png`. | The supplied file is PNG data (706×174) carrying an `.svg` extension. Both the browser and Shopify's CDN serve MIME by extension, so it was delivered as `image/svg+xml` and failed to parse — the hero wordmark rendered as broken-image alt text. The hero's built-in fallback now points at the genuine vector `wine-crush-logo.svg`. |
| 18 | `--slides-visible: 4.1` rather than the 4.2 first estimated. | Solving `(1404 − 3×15) / n = 331` gives 4.1, which reproduces the design's 331px card and its 35px peek of the fifth card exactly. 4.2 was an eyeball figure and left the card a few px short. |
| 19 | The bottle overhang is `padding-top: calc(var(--slide-width) * 0.3051)`, not a bare percentage. | The overhang must stay proportional to the card at every viewport. A percentage padding resolves against the **containing block's** inline size — never the element's own — so `padding-top: 30.51%` on a flex item, measured off the 331px card, was resolving against the 1404px track and overshooting roughly fourfold. Factoring the slide width out into `--slide-width` makes the flex basis and the overhang derive from the same figure, which is what the percentage was meant to express. The media is then pulled up `-23.27%` of the card. |
| 20 | Tag-sourced tabs iterate `collections.all.products` and `break` at the limit. | Shopify cannot filter by tag server-side outside a collection template — `collections.all` has no tag-filtered handle. Walking the list and counting matches is the only Liquid-native option that avoids a client-side fetch. Merchants who need large tag sets should use a smart collection instead. |
| 21 | One `wc-card-grid` section serves both the journal row and the image row. | The two rows are geometrically identical (4 × 339 × 498, 16px gap); only the data source differs. A `source` select (`blog` \| `blocks`) covers both, rather than shipping two near-duplicate sections the merchant has to tell apart. |
| 22 | The membership backdrop is a second absolutely-positioned panel, not a border or shadow. | Figma shows a 1324px accent panel offset 27px above a 1404px panel — an outline or box-shadow cannot reproduce the asymmetric vertical offset. Both are expressed as percentages of the container (94.3%) so the pairing survives resizing. |
| 23 | `wc-footer.liquid` replaces Dawn's footer via `footer-group.json`. | Same reasoning as decision #10 for the header — Dawn's `footer.liquid` stays on disk for reference and rollback. The nav `aria-label` needed a new `accessibility.footer_menu` key in `locales/en.default.json`; no existing Dawn key described a footer nav landmark. |
| 24 | Customizer settings live in a **"Wine Crush" group**, not in Dawn's colour-scheme system. | Dawn's schemes are per-section pairings of background/text/button colours. The Wine Crush design is a single fixed palette applied semantically (Ochre is *always* the on-light heading colour), so six named brand colours match the design's own vocabulary and are far easier for the merchant to reason about. Dawn's schemes are left intact so stock Dawn sections keep working. |
| 25 | The palette is re-emitted as an inline `{% style %}` block in `theme.liquid`, immediately after `style.css`. | Asset CSS is static and cannot read `settings.*`. Only the six brand colours, the gutter and the border width are restated — every other token in `style.css` derives from those, so the whole system follows from a handful of lines. `--color-muted` / `--color-muted-strong` are the exception: they are Ivory at reduced alpha, so they are recomputed with `color_modify: 'alpha'` rather than inherited. |
| 26 | Responsive behaviour is carried by **token overrides**, not per-section media queries. | `--grid-columns`, `--slides-visible`, `--radius-band` and `--section-spacing-desktop` are restated once in `style.css` at the two breakpoints, so a section only needs its own media query when its *structure* changes (the story image leaving the backdrop, the membership panel unstacking). Every merchant-set section padding collapses to `--section-spacing-desktop` at ≤ 989px, which itself steps 8xl → 102px → 74px; without this the 392px bundle padding would fill a phone screen. |
| 27 | Section CTAs carry **no size modifier** — the bare `.wc-button` *is* the design's `md` default. | A static audit found every section CTA emitting `wc-button--sm`, rendering at 25px/12px instead of the design's 30px/14px. The footer nav was one step small too (`xs` where § 6 specifies `sm`), and the product card's "add +" used `xs` rather than `compact`. The base primitive already matched `md`, so the fix was to remove the modifiers rather than add CSS. The `+` needs no rule of its own: `.wc-button` is `inline-flex` with an 8px gap, which is exactly the spacing in the 68px artboard measurement. |
| 28 | The type scale is authored in **px, not rem**. | Dawn sets the document root to 62.5% — `font-size: calc(var(--font-body-scale) * 62.5%)` in `layout/theme.liquid:257` — so the root computes to 10px. Every `rem` written against a Figma measurement was silently resolving to 62.5% of it: body text rendered at **7.5px instead of 12px**, and the hero display line topped out at 93.75px instead of 150px. Rewriting the scale in px makes the tokens mean what they say regardless of what the root does, and keeps `--font-body-scale` free for the merchant without dragging the Wine Crush scale with it. The `clamp()` viewport terms are unaffected — `vw` never depended on the root. |
| 29 | Every `range` setting is cut to **at most 101 steps**, even where a finer grid would be friendlier. | Shopify rejects any section whose schema has `(max − min) / step > 101`, and `theme check` does not report it — the section is silently refused at upload, so `templates/index.json` then fails with the misleading *"Section type does not refer to an existing section file"*. Four sections were affected. Bounds were re-cut rather than steps coarsened blindly, so every design default still lands exactly on its grid (Shopify separately rejects any saved value that does not). The hero wordmark range is the clearest case: it was briefly snapped to 700 to fit a grid, which broke the Figma measurement, so the range was re-cut to 600–800 / 2 to keep 706 reachable. |
| 30 | No decorative element is a deliberately-empty `<div>`. | Dawn's `base.css` ships `a:empty, ul:empty, div:empty, section:empty … { display: none }`, which silently removed the hero's claret band, the membership backdrop and the mobile drawer's tap-to-close overlay. The two purely decorative ones became `::before` / `::after` pseudo-elements. The drawer backdrop had to stay a real element because it carries `data-wc-drawer-close`, so it is selected as `.wc-drawer .wc-drawer__backdrop` — `div:empty` has specificity (0,1,1) and a single class cannot outrank it. The mega-menu scrim later hit the same reset and took the same route (`.wc-header > .wc-header__scrim`); it is worth checking any new decorative element against this rule before assuming a layout bug. |
| 33 | The mega menu panel is anchored at **y0**, not below the header. | Both artboards draw a 1440×512 coral rectangle starting at the top of the viewport with the header bar painted *over* it. Hanging the panel off `top: 100%` produced a visually similar result but put the panel's top edge 58px low and made the header and panel two surfaces rather than one. Anchoring at y0 also makes the slide read correctly: the panel translates out of its own height and appears to drop from behind a bar that never moves. |
| 34 | Mega menu columns are **max-content on a single 131px gap**, not a four-track grid. | The artboard's column starts (34 / 319 / 599 / 815) are not on a uniform pitch — the gaps between content boxes are 125 / 128 / 148 — because they are hand-placed against auto-width text. Fixed tracks would fight that, and the column titles are merchant `link_list` content whose widths are unknowable at author time. 131px is the single gap whose worst column start is closest to the artboard (within 9px). |
| 35 | The header wordmark is held to the 28px content band even though it is 30px tall. | Figma frame `10055:448` is 1372×28 and the wordmark is drawn at 122×30, i.e. 1px proud top and bottom against a cart circle that runs y15…y43. Letting the image size the row pushed the bar to 60px and shifted the entire page down 2px, breaking every downstream anchor. The band height is now a token (`--header-row-height`) and the wordmark overflows it, which is what the artboard actually shows. |
| 31 | `clamp()` viewport coefficients slightly **exceed** the exact design ratio. | At 1440px, `1vw = 14.4px`, so the mathematically-correct `8.33vw` yields 119.95px and never engages the 120px cap — the type lands a fraction under spec at precisely the width the design was drawn for. Rounding each coefficient up by one hundredth (`8.34vw`, `1.12vw`, `0.98vw`) makes the max bind at 1440 while leaving the scaling behaviour below it unchanged. |
| 32 | Sections fall back to bundled onboarding content when the store has no data. | The catalog, blog and navigation menus are all empty on a fresh install, which collapsed the product slider, both card grids and the drawer's level 2 to nothing — the layout could not be reviewed in the theme editor, and the design read as "not built". The product card and card grid now render the bundled `wine-crush-bottle-*` / `wine-crush-blog-*` art with `onboarding.*` strings when their source is empty, and the two mega-menu link lists default to `main-menu` and `footer`, the handles Shopify guarantees on every store. All of it is superseded the moment real content exists. |

| 36 | Product-card **image is its own `<a href="{{ product.url }}">`**, not an extension of the title overlay. | The title link's `::after { inset: 0 }` was meant to cover the card, but its containing block is `.wc-product-card__info` (position: relative, needed for stacking over the bottle), so it only ever covered the text strip, and the bottle overhangs the card top anyway. The media wrapper became an anchor with `tabindex="-1"` (the title link is the keyboard/SR path to the same URL), `aria-label` = product title, and `draggable="false"` so a mouse drag on the rail isn't a link drag. |
| 37 | Product-card **Add** fixed by adding Dawn's `loading-spinner` snippet, not by new cart code. | `product-form.js` calls `this.querySelector('.loading__spinner').classList.remove('hidden')` straight after `preventDefault()`. The card had no spinner, so every click threw and nothing was posted. With the spinner (and a `.product-form__error-message-wrapper` inside `<product-form>`), Dawn's own AJAX add, cart-drawer render and `cart-icon-bubble` refresh all run unchanged. The form only renders when `product.available and variant.available`; otherwise the existing "sold out" caption shows. Variant = `product.selected_or_first_available_variant`. |
| 38 | Newsletter sign-up posts through Shopify's **native `customer` form**, not AJAX. | It is the mechanism Dawn's newsletter already uses, so there is no second pipeline, and it keeps Shopify's bot challenge (hCaptcha) working. The cost is a page reload on the final step; success and server errors are rendered by Liquid (`form.posted_successfully?` / `form.errors`) and the JS re-opens the step whose field failed. |
| 39 | Both placements use one component: Coming Soon = `light` (Ivory UI), 5% off = `dark` (Deep Claret UI). | Coming Soon is drawn in Ivory over a darkened photo. The 5% off panel is Sorbet `#F8CC8A` on the Claret page (verified against the current file, node `10058:577`), so the same component takes the panel's own Deep Claret ink, the ink of the "join the crush" pill it replaces. Only the ink tokens differ; geometry and behaviour are shared. See #44 for the naming. |
| 40 | The Coming Soon page is **standalone**: `layout/theme.liquid` skips the header and footer groups when `template.name == 'page' and template.suffix == 'coming-soon'`. | Figma `10036:30` is a 1440 × 884 frame with no header or footer. A layout-level conditional was chosen over (a) CSS-hiding a header that still renders and still runs its scripts, and (b) a second layout file duplicating ~450 lines of `theme.liquid`. Every other page is unaffected. |
| 41 | The ↗ icon is a hand-drawn `currentColor` SVG, not the Figma PNG. | Figma ships `right-up 1` as a 512px Ivory PNG, which cannot turn Claret in the 5% off panel. The redraw uses the PNG's own geometry (42/512 stroke, 171→363 bar, 149→341 upright, 45° diagonal). The stacked wordmark's `#F3E7D4` fill was likewise swapped to `currentColor`, and its `clip-path` (equal to the viewBox) removed so inlining it cannot collide on ids. |
| 43 | Form steps never fire `submit`; the final step posts with `fetch` and falls back to Shopify's protected native submit only on a challenge. | Shopify's injected form-protection script natively re-submits any `/contact` customer form on its first `submit` event, ignoring `defaultPrevented`, which made step 1 post a half-filled form. Stopping only stray submits at the form keeps that script, and hCaptcha, fully in charge of every real native submission. `fetch` gives the no-reload success state the brief asks for, and success is only shown on Shopify's confirmation. See § 22. |
| 44 | Variants are named by **UI**, not surface: `light` = Ivory UI (Coming Soon), `dark` = Deep Claret UI (5% off). | Matches the brief's vocabulary ("Coming Soon → Light, 5% Off → Dark"). The 5% off panel keeps its Figma Sorbet surface; "dark" describes the form's ink, which is the panel's own CTA colour. |
| 45 | Collection filters **reuse Dawn's `facets.js` unmodified** behind Wine Crush markup, not a new filter script. | The brief requires Search & Discovery + native URLs + history + section rendering; `facets.js` already does all of it, with a response cache. Matching its DOM contract (§ 23) gave the Figma UI with zero new filtering JS. |
| 46 | New sections (`wc-collection-nav`, `wc-main-collection`) instead of restyling Dawn's `main-collection-product-grid` + `facets.liquid`. | Dawn's markup carries its own heading, sort, count, chevrons and three layouts; bending it to "VARIETAL +" would be a pile of overrides. Dawn's files stay on disk untouched (like the header/footer, #10/#23). |
| 47 | One product card with a `layout: 'grid'` modifier, not a second card. | Same data, links, `<product-form>` and add-to-cart fixes as the home slider; only placement differs (CSS grid areas over `display: contents` wrappers). The card CSS moved to `wc-product-card.css` so both sections share it; the home card measures identically after the move. |
| 48 | No sort UI, no visible count; both still work. | Neither is drawn. `sort_by` is preserved through filtering; the count is a visually hidden live region so screen readers hear results change (and `facets.js` requires it). |
| 49 | Grid is 4 columns ≥ 1200, 3 at 750–1199, 2 below; filters become a drawer below 990. | No mobile artboard exists. Holding 4 columns at 1024 would shrink cards to 181px; 3 keeps them ≥ 229px. 990 is Dawn's desktop breakpoint, already used by the header. |
| 50 | The 5% off section is reused on the collection template with collection-specific padding (188 / 162). | The frame repeats it verbatim (`10058:578`). The template has its own copy of the section settings (same `five-percent-off` tag), so spacing can match this frame without touching the home page. |
| 51 | Product page reuses Dawn's `product-info` / `variant-selects` / `product-form` / `quantity-input` unchanged; the section passes **itself** as the picker snippet's `block`. | Variant switching, price/button updates and AJAX add are Dawn's; `picker_type` / `swatch_shape` are section settings so the snippet needs no fork. The quantity input deliberately isn't `.quantity__input` (that class makes `product-info.js` run Dawn's cart-rules refresh, which needs markup this design lacks). |
| 52 | Metafields are read from their real types: `custom.varieties` / `custom.profile` = `list.metaobject_reference` (fields `variety_item` / `profile_item`), `custom.region` = `metaobject_reference` (`region_item`). An entry with an empty field falls back to its handle unless the handle is Shopify's auto `<type>-xxxxxxxx`. | Read from the live store. One profile entry (handle `peach`) has an empty `profile_item`; the fallback keeps "Peach" in the list. The field keys are the metaobject definitions' schema, not content. |
| 53 | Cart drawer = Wine Crush markup on Dawn's cart JS (`cart-drawer.js`, `cart.js`); the snippet must load `cart.js` itself, as Dawn's did. | `cart-drawer.js` defines `<cart-drawer-items>` as `extends CartItems`, which lives in `cart.js`. Without it the element is never defined: opening the drawer throws (`dispatchViewEvent is not a function`) and quantity/remove silently do nothing. Found in QA and fixed. |
| 54 | Age verification is client-side but not cosmetic: a capture-phase guard on every checkout route (button, `/checkout` links, form submit) validates the gate's inputs, or — with no gate on the page — the DOB and confirmation saved on the cart. Express checkout is hidden on `/cart` while the gate is on. | Hiding or deleting the gate cannot unlock checkout (tested). The DOB and confirmation are saved as cart attributes, so they are on every order. **Limitation:** a theme cannot stop someone typing `/checkout` into the address bar; hard enforcement needs a checkout-level age check (a Shopify checkout app). |
| 55 | The mobile header bar hides every `.wc-header__link` below 990, not a list of types. | The old rule hid the left nav, account and mega triggers, so plain link blocks ("journal") leaked into the phone bar. Journal stays in the drawer's first level (shop · journal · info · account — the desktop order). |
| 56 | `--band-overlap` is fluid. | The 129px cap is a 1440 measurement; fixed, it covered the last 129px of every short mobile band (the bundle's CTA was invisible). Fixing the token fixed every capped band at once. |
| 57 | Home card overlap fixed geometrically, not with z-index. | The fixed 331:434 card bottom-aligned its copy while the bottle scaled with the width, so narrow cards' three-line titles climbed into the bottle; `height: auto` also let any image ratio set the height. The bottle box is now a fixed 324:485 and its space is reserved in the flow. |
| 58 | The collection card switches layout on **its own width** (container query, 280px). | The Figma overlay only clears the bottle when the title is two lines (285px card); cards are narrower at 1366 and below as well as on phones. The card, not the viewport, is the right condition. |
| 59 | Mobile drawer focus opens on the first menu row. | The head now starts with the logo link; focusing it on open would land keyboard users on "home". |
| 60 | About Us is assembled from existing sections, extended with options, plus one new section. | Hero (page-heading layout), Bundle band (intro with scatter — same four photo sizes as the bundle), Card grid and Statement (journal) already matched the frame; only the split "How to shop." panels had no equivalent. New options default to the old behaviour, so Home is unchanged (re-measured). |
| 61 | Body measure in `ch` for the 16px intro (`62ch`). | Figma fits 62 mono cells in its 595px box (595.2px); a 595px CSS box wraps at 61 and added a ninth line that pushed the rest of the page 19px down. IBM Plex Mono's 0.6em advance makes `62ch` the artboard wrap at every fluid size. |
| 62 | The bundle collage now starts below 990, not 750, on every bundle band. | At 768 the About intro's copy leaves ~120px margins for 85–145px scattered photos, so they sat on the text; Home's bundle crowded the same way. No tablet artboard exists; the collage is the existing phone answer. Photos are capped at their 1440 widths. |
| 63 | The closing photo runs under the footer by pulling the footer up (`tuck_under` → negative bottom margin of `--band-overlap`) rather than giving the footer a page-specific rule. | The footer is global and in its own group; the section that wants to be overlapped opts in. |
| 64 | Page-hero title is the page's `h1`; the heading setting falls back to the page title. | One `h1` per page and the merchant can rename the page without touching the section. |
| 65 | Non-home header is Coral (`--color-header-bg-page`) with a 0.7px Ivory rule drawn as an inset shadow. | Client instruction, matching Figma 10008:339 / 10075:1873. A shadow, not a border, keeps the bar at `--header-height`, so nothing below it moves. |
| 66 | The page-heading hero is capped at the viewport height: `min(ratio height, max(100svh, 480px))`. | Client: the About title must be visible without scrolling. At 1440 × 898 it sat at y698–808, below the fold on common laptops (1440 × 800, 1366 × 768, 1280 × 720). Capping keeps the band and title, anchored to the hero's foot, inside the first screen; tall screens still get the artboard ratio. Measured title bottoms: 710 / 800, 683 / 768, 640 / 720, 575 / 768, 976 / 1024, 608 / 667 (375 phone). |
| 67 | The cart drawer is built to the Reserve Cellar reference **as drawn** — black panel, grotesk, reference geometry — instead of being translated into the Wine Crush language. | Client, 2026-09-19: "Cart Drawer still is not as per design". The first build kept Claret / IBM Plex Mono / caps, which is why it read as a different cart. Palette and font are theme settings, so the drawer can be re-tuned without code. |
| 68 | Inside the panel the site's semantic tokens are re-pointed at the cart tokens rather than every rule being restated. | The switches, age gate and pill buttons are shared with `/cart`; re-pointing keeps one set of rules and leaves the `/cart` gate on the site palette. |
| 69 | Inter is the drawer face. | The reference is a Neue-Haas-style grotesk; Shopify retired its Monotype fonts (`neue_haas_unica_n4` now resolves to Instrument Sans) and invalid handles 500 the page. Of the library faces tested (Instrument Sans, Inter, Figtree), Inter reproduces the reference's line breaks exactly. |
| 70 | No remove link: `data-min` is emitted as 0 when the variant's minimum is 1, so "−" at 1 removes the line. | The reference has no remove control. Dawn's `cart.js` refuses any quantity below `data-min`, so with the rule's own 1 the line could never reach 0 (verified: it silently did nothing). Variants with a minimum above 1 keep a link, since they cannot step to 0. |
| 71 | FAQ rows are native `<details>`. | No JavaScript, keyboard and screen-reader behaviour for free, and each answer stays a merchant-editable block. |
| 72 | FAQ answers ship with bracketed placeholders for anything that is policy. | The design draws no answers. Writing delivery times, fees or returns terms would be inventing policy; the design's own footnote uses "[email address]", so the same convention marks what the client must supply. |
| 73 | The drawer's tracked caps are one style: 10px / 0.16em. | Measured off the frame (cap height 7px); the first pass used 11px / 0.14em, which is what read as "typography mismatch". Subtotal 22px, not 24, by the same measurement. |
| 74 | FAQ rules are 2px Sorbet-50%, labels 14px Ivory, the "+" Ivory. | Re-measured on the native-resolution frame: the first pass used `--text-blog-title` (16px at 1440), a muted "+" and a 1px Ivory-25% rule. `--color-hairline` is now Sorbet 50%. |
| 75 | The drawer animates both ways from CSS, with `visibility` delayed by the motion duration on close. | `cart-drawer.js` only toggles `.active`; `visibility` cannot tween, so the panel was hidden on the first frame of the close and appeared to vanish. |
| 76 | The scrim needs an explicit `display: block`. | base.css hides every empty `div` (the same trap as the hero band, decision earlier). The scrim never painted: no dimming, and clicking outside did not close the drawer — found while fixing the close animation. |
| 77 | FAQ rows animate through a `<wc-accordion>` custom element rather than CSS alone. | `details` has no open/close transition, and the CSS-only route (`::details-content` + `interpolate-size`) is Chromium-only today. The element is progressive: no JS, or reduced motion, leaves the native behaviour intact. |
| 78 | The bundle page is a product template on the bundle product itself (`templates/product.bundle-packs.json`), not a page or a new cart system. | The thing being bought *is* the Bundle Packs product; its variants are the packs. Assigning a template leaves every other product on the normal template. |
| 79 | The bottle count comes only from `custom.bundle_bottles_quantity`; a variant without it is not offered. | The brief forbids parsing the variant title, and guessing a limit would let a wrong bundle reach the cart. A variant with no count is skipped, and if none survive the section renders its notice and logs why. |
| 80 | Adding goes through Dawn's `<product-form>`, with the chosen bottles written into it as `properties[…]` inputs. | Reuses the theme's AJAX add, error handling, section re-render and cart drawer — no second cart path. The properties are in the POST body, so they persist into the drawer, cart, checkout and order; nothing lives only in JS. |
| 81 | Validation runs in a capture-phase listener on `<wc-bundle-builder>`, not only by disabling the button. | Capture on the ancestor runs before `product-form.js`'s own submit listener, so an incomplete bundle never reaches the cart even if the button state is stale or a click is scripted. |
| 82 | Switching to a smaller pack keeps the selections and asks the customer to remove the extras (the rows stay, flagged Coral). | The brief: never silently drop someone's choices. The add button stays blocked until the count matches. |
| 83 | One property per bottle ("Bottle 1"… ), named from a section setting. | Readable in the drawer, on the order and in the packing slip, and each slot stays addressable. Two bundles with different bottles are different line items, which is what Shopify does with differing properties. |
| 84 | The card grid is `auto-fill` with a 270px floor rather than a breakpoint ladder. | The panel is fixed-width, so the room for cards changes at every viewport; the floor keeps the card above the width where its own container query restyles it. |
| 85 | The whole card toggles the selection and nothing on it navigates (select mode in `wc-product-card.liquid`). | The brief's §17: mid-selection navigation would lose the bundle. The toggle is a real `<button aria-pressed>` with an accessible name that flips between "Add … to your bundle" and "Remove … from your bundle". |
| 86 | Panel type is measured off the glyph runs, not the Figma text-node boxes. | The node boxes made the hint look 16px and the pack price look like 29px Dahlia; the runs give 12px, 14px and a **22px IBM Plex Mono** price (the artboard's price is mono, not the display face), with a 14px subtotal. First pass used the box widths and read as a different design. |
| 87 | Three card columns across the whole desktop range; the panel flexes (clamp 330–504 at 35.9%). | Client: "Products in 3 columns". The earlier auto-fill grid dropped to two at 1366 and below to keep cards above their container-query width; holding three columns and shrinking the panel keeps the artboard's composition at every desktop size. |
| 88 | The two Journal frames are the reverse of the brief's ids: `10047:175` is the **listing**, `10053:93` the **article**. | Read from the frames themselves (`10053:93` holds "back to journal", one title, a body and a product slider). Built to what each frame actually is. |
| 89 | The card is a shared snippet (`snippets/wc-article-card.liquid`) rendered by both the grids and the listing. | The home, About Us and Journal frames draw the same 339 × 498 card; one snippet means a card change lands everywhere. `wc-card-grid.liquid` now renders it too. |
| 90 | Card titles are uppercase and dates read "oct ‘26". | Every artboard sets them that way. The card had no `text-transform` and used the locale's `abbreviated_date` ("SEP 19, 2026"), which only became visible once real articles appeared. |
| 91 | "see more" reveals the next batch of already-rendered cards, and hands over to Shopify's next-page link at the end. | The frame shows one button, not numbered pagination. Every article on the page is server-rendered, so with no JavaScript they are all visible and the button is simply the next-page link — no API loader, and sorting stays consistent with what is on the page. |
| 92 | Sorting is client-side over the rendered cards. | Shopify's Liquid cannot read query parameters, so a server-side sort is not possible on a blog; with the page size at 50 the sort covers the whole journal in practice. The control is a real `<select>` lying invisibly over the label, so the resting state reads exactly "sort by ⌄" while keeping a focusable, announced control. |
| 93 | The article body is styled, never rebuilt. | `{{ article.content }}` is the merchant's HTML; `.wc-article__content` styles headings, lists, links, quotes, tables, rules and media so any normal post renders in the Wine Crush language. |
| 94 | The article's "Crowd Favourites" is the existing product slider with a heading, not a new section. | `wc-product-tabs` gained an optional display heading (Coral Dahlia 120) and a switch to hide the tab strip — the frame shows the home slider under a heading. |
| 95 | The blog handle is `journal`, not `news`. | `/blogs/news` 404s; the home and About Us card grids pointed at it, so both rendered placeholder cards. Fixed in `templates/index.json` and `page.about-us.json` — the home journal row now shows the real articles. |
| 96 | Shopify's own pages are built as Wine Crush sections on the **default** templates, not as duplicates. | The QA brief asks for defaults. `cart.json`, `page.json`, `page.contact.json`, `search.json`, `404.json`, `blog.json` and `article.json` now point at `wc-*` sections; the `blog.journal` / `article.journal` duplicates were deleted so there is one place to edit. |
| 97 | Policies are styled through Shopify's own classes, with no template. | Shopify renders policy pages itself (`.shopify-policy__container/__title/__body`) with no section to hook into; `assets/wc-editorial.css` is loaded globally so those classes are covered. Content stays Shopify-managed. |
| 98 | One editorial implementation (`.wc-rte`) for every merchant-written body. | The article, pages and policies had (or would have had) three copies of the same long-form rules. The article now carries `.wc-rte` and keeps only its own measure. |
| 99 | Merchant copy wraps anywhere (`overflow-wrap: anywhere`). | A long token in the privacy policy pushed the page 24px wide at 320. The fix belongs to editorial content, not to a per-page override. |
| 100 | The cart page keeps Dawn's `cart.js` contract rather than a new cart script. | Quantity, remove, section re-render, error handling and the drawer all keep working; only the markup and styling are the theme's. `cart.js` is loaded once (the drawer already loads it) — loading it again re-declared its classes and threw. |
| 101 | The product card's price is Ivory 75% on **both** card types. | Sampled off both artboards (slider card in 10053:93, grid card in 10072:1173); the slider card was full Ivory. Fixed on the shared component, not per page. |
| 102 | The drawer row divider and the Coming Soon scrim are tokens, not literals. | `--color-divider` (Ivory 18%) joins the emitted brand tokens; the scrim uses `rgb(0 0 0 / …)` so no stray hex remains in the wc CSS. |
| 42 | The Coming Soon form has **no visible labels, counter or Back control**. | None exist in the artboard. Accessibility is carried by visually hidden labels, a visually hidden `aria-live` step line and a per-step `aria-label` on the icon button. Backspace in an empty field steps back, so an earlier answer can still be corrected without inventing UI. |

### Open questions for the client

1. **Mobile designs** — decision #1 above. Are mobile/tablet artboards coming, or should the derived system be signed off as-is?
2. **IBM Plex Mono** — confirm self-hosting the OFL webfont is acceptable (see § 5).
3. **Hero video** — no video asset has been supplied; `wine-crush-hero.jpg` is the current fallback.
4. **Footer navigation is one item short.** The design has six pills (`shop`, `build your bundle`, `journal`, `about us`, `shipping & FAQ's`, `account`, spanning x428…x1012); the store's footer menu has five. "build your bundle" is a Shopify menu entry, so per brief § 20 it must be added to the store's own footer menu rather than hardcoded in the theme.
5. **Social links** — `settings.social_facebook_link` and `settings.social_instagram_link` are still `"#"`. Figma shows Instagram and Facebook only.
6. **Product tags** — the `staples` and `bestsellers` tabs point at product tags that may not exist in the catalogue yet.
7. **Phone collisions** — Shopify rejects a customer whose phone already belongs to another customer ("Phone has already been taken"), which blocks the whole sign-up. Decide whether phone should stay required.
8. ~~**Header colour on Shop and Product frames.**~~ **Resolved 2026-09-19** (client: "except the home page add background on header as per design"): every page but home now has the Coral bar with a 0.7px Ivory rule (decision #65). Home keeps transparent → Claret on scroll.
9. **Mobile designs are still absent** — every mobile value (including the cart drawer on phones) is derived; see `UI-UX.md` § 13. Sign-off or artboards needed.
10. **Variant picker / multi-image gallery untested with real data** — no product has more than one variant or image.
11. **About Us page needs creating in the admin.** Add a page (e.g. "About Us", handle `about-us`) and assign the `about-us` template; the footer's "about us" pill then needs linking to it in the footer menu. Previewed via `?view=about-us` until then.
12. **About Us placeholder imagery.** The four intro photos reuse the home bundle images (the Figma frame uses one placeholder photo four times); the hero, panel and closing photos are Figma exports bundled as theme assets. Replace from the theme editor.
13. ~~**Header colour on About Us**~~ — resolved with question 8.
14. **FAQ answers and the shipping policy.** Every answer in `page.shipping-faq.json` that states policy is a bracketed placeholder (delivery areas, rates, dispatch times, click-and-collect, returns, the damage window, membership exclusions, and the contact address the design also leaves as "[email address]"). These need the client's real terms before launch.
15. **Shipping & FAQs page needs creating in the admin** — add a page (e.g. "Shipping & FAQ's", handle `shipping-faq`), assign the `shipping-faq` template and point the footer pill at it. Same for About Us (question 11).
16. **Cart drawer font.** Inter stands in for the reference's grotesk because Shopify retired the Monotype library. If the client wants the exact face, it needs licensing and self-hosting like Dahlia.
17. **Assign the bundle template in the admin.** Products › Bundle Packs › Theme template → `bundle-packs`. Until then it previews at `/products/bundle-packs?view=bundle-packs`. The footer's "build your bundle" pill also needs pointing at the product.
18. **Bundle copy still says "six".** The panel hint ("Now pick the bottles that belong in your six") and the eyebrow ("pick your six") are the artboard's, but the packs are 6 / 9 / 12. Both are section settings — confirm the wording the client wants for the 9 and 12 packs.
19. **No bundle product is currently out of stock**, so the sold-out card state was verified by simulating it (the card renders "sold out", the click is refused with a message). Worth re-checking against a real out-of-stock bottle.
20. **Assign the Journal templates in the admin.** Content › Blog posts › Manage → set the `journal` blog's theme template to **journal**, and each article's template to **journal** (Shopify offers it per article). Until then `/blogs/journal` renders Dawn's stock blog template; preview with `?view=journal`. The defaults (`blog.json`, `article.json`) were left untouched, as the brief asked.
21. **The article frame shows no related articles** — it ends with a product slider ("Crowd Favourites", currently the `all` collection). Confirm which collection should feed it, or whether related *articles* are wanted instead.
22. **Three admin actions still gate live pages**: create the About Us page (handle `about-us`, template `about-us`), create the Shipping & FAQ's page (handle `shipping-faq`, template `shipping-faq`), and set the Bundle Packs product's template to `bundle-packs`. Until then those URLs 404 or fall back to the default product page; all three preview with `?view=…`.
23. **No announcement bar, search drawer or wishlist exists** in the designs or the theme, so none was built. Search is a page (`/search`), reachable directly or from the nav.

### Verification status

Every section has now been measured in a real browser at 1440 against the native-resolution artboard renders in `.figma-ref/`. **Total document height is 7393px, matching the Figma frame exactly.**

| Section | Result |
| --- | --- |
| Hero | Exact — image 1440×898, lede (496, 345) 449 wide, wordmark 706×174 at 662 |
| Header | Exact — bar 58, pill (34,15) 75×27, journal x1105, info x1197, account x1280, cart (1378,15) 28×28, wordmark (659,14) 122×30 |
| Mega menu — Shop | Heading y101, titles y247, lists y290 @ 21px pitch, promo card (1071,232) 335×241 and its CTA (1131,338) 214×30 all exact; column starts within 9px (see decision #34) |
| Mega menu — Info | Exact — portrait (34,77) 293×402, heading y101, bodies y178 / y337, buttons y262 and (1105,405) 172×30; line breaks match the artboard |
| Statement 1 | (420, 1042) 600×186 vs 421/598 — within 2px |
| Product tabs | Tab labels x504/688/817 y1338; cards (18,1517) 331×434; images (21,1416) 324×485; "add +" (266,1910) 68×30 and "explore all" (655,2036) 130×30 both exact |
| Bundle band | Body (482,2893) 477×51 and CTA (655,2970) 130×30 exact; eyebrow within 1px |
| Journal grid | Exact — 18 / 373 / 728 / 1083 at y3604, 339×498 |
| Statement 2 | (18, 4204) 830×186 vs 833 wide; CTA y4360 vs 4356 (see residuals) |
| Membership | Exact — sorbet panel (18,4644) 1404×759, coral backdrop (58,4617) 1324×682, heading (89,4812) 525×228, body (178,5088) 346×68 |
| Story | Exact — photograph (543,5777) 355×301 page-centred, closing (1077,6139) 300×104 |
| Image grid | Exact — (18, 6387) 339×498 |
| Footer | Exact — social 31×31 at x686/x723, logo (501,7164) 438×108, legal (96,7315) 1248×28, base row x583/x711/x785. Nav is 5 pills where Figma has 6 — see open question #4 |

Responsive QA is complete at all eight mandated widths (1440 / 1366 / 1280 / 1024 / 768 / 430 / 390 / 375). `scrollWidth === clientWidth` at every one, so there is no horizontal overflow anywhere. The only elements that report as wider than the viewport are Dawn's off-canvas cart drawer and the intentional `overflow-x: auto` + `scroll-snap` carousels.

**Accepted residuals.** Two anchors sit 4–6px low: the statement-2 CTA and the story's address stack. Both come from CSS aligning box bottoms where Figma aligns ink bottoms. Correcting them would take negative margins, which brief § 31 forbids, so they are left as-is deliberately.

---

## 22. Newsletter sign-up (Coming Soon + 5% off)

One reusable component, two placements. Only the variant (ink) and the source tag differ; markup, steps, validation, submission, success state and tracking are shared.

```
snippets/wc-signup-form.liquid  +  assets/wc-signup-form.js  +  assets/wc-signup-form.css
        │
        ├── variant: light  (Ivory UI over the photo)   source: coming-soon-page   → sections/wc-coming-soon.liquid
        └── variant: dark   (Deep Claret UI)            source: five-percent-off   → sections/wc-membership.liquid
```

### Files

| File | Role |
| --- | --- |
| `templates/page.coming-soon.json` | Dedicated page template. Assign it in **Online Store → Pages → Theme template: coming-soon** (the live page is `/pages/coming-soon`). `page.json` is untouched. |
| `sections/wc-coming-soon.liquid` + `assets/wc-coming-soon.css` | The Coming Soon section. Owns the page's only `h1`. |
| `sections/wc-membership.liquid` | 5% off panel; renders the form in its old CTA slot. |
| `snippets/wc-signup-form.liquid` | The one form implementation. Params: `id` (section.id), `config` (the calling section's settings), `variant` (`light` or `dark`). |
| `assets/wc-signup-form.js` | `<wc-signup-form>` custom element: per-instance step state, validation, fetch submission, success/error states, analytics event. |
| `assets/wc-signup-form.css` | Component styles; the two variants swap three ink tokens only. |
| `layout/theme.liquid` | Skips the header and footer groups on the Coming Soon template (decision #40). |
| `assets/wine-crush-coming-soon.jpg`, `wine-crush-logo-secondary.svg`, `icon-wc-arrow-up-right.svg` | Figma assets: background (resized to 2200px, 511 KB), stacked wordmark, ↗ icon. |
| `locales/en.default.json` → `newsletter.*` | Validation messages, generic error, "Step N of 3" (translatable, not merchant settings). |

Both sections expose the **same `signup_*` setting ids** (`signup_tag`, `signup_{name,email,phone}_placeholder`, `signup_next_label`, `signup_submit_label`, `signup_success`), which is what lets the snippet take `section.settings` whole. The placeholders are the only visible labels (the design has no others); the two button labels are the icon button's accessible names.

### Root cause of the "form not working" bug (fixed)

Shopify injects a storefront form-protection script into every page. It listens for `submit` **on the document** and, for any `customer` form posting to `/contact` without a `form_key`, calls `preventDefault()` and then **`form.submit()` natively, without checking `event.defaultPrevented`**. The first version advanced steps inside a `submit` handler, so pressing ↗ or Enter on **step 1** also made Shopify POST the half-filled form (name only, no email) and navigate away. Separately, the `theme dev` proxy (127.0.0.1:9292) answers every `/contact` POST with a **403 Cloudflare "Verifying your connection"** page, so no sign-up can complete there regardless of theme code.

Fix: with JS, steps never fire `submit`. The ↗ is switched to `type="button"`, Enter is handled on the inputs, and any stray `submit` is stopped at the form (`preventDefault` + `stopPropagation`) and routed into the step logic. Shopify's protection is **not** disabled (`data-nocaptcha` is not used).

### Data flow

1. **Steps 1–2** — ↗ / Enter validates the visible field and reveals the next. Nothing is posted. All values stay in the one `<form>`, so Backspace (empty field) or a server error can return to an earlier step with its value intact.
2. **Step 3** — re-validates all three, then `prepare()` splits the name and normalises the phone, and the form is posted with `fetch(POST /contact, FormData)`. The button gets `aria-disabled`, the form `aria-busy`, and the host `.is-loading`; clicks while busy are ignored (a triple click produced exactly one request in testing).
3. **Response:**
   - **Success** — the response URL has `customer_posted=true`, or the returned page renders this form (same id) in its success state. The success `<template>` (merchant copy) replaces the form and takes focus, and `wc_newsletter_signup` is published. No reload. Success is never shown without Shopify's confirmation.
   - **Shopify validation error** (e.g. "Phone has already been taken") — read from this form's `[data-signup-error]` in the returned HTML. The form re-opens on the offending step (`data-start-step`), restores what the person typed, and re-enables.
   - **403 / 429 / `/challenge`** — Shopify wants a human check (this store has hCaptcha on customer forms; `h-captcha-response` is in the payload). The form hands over to **Shopify's own protected native submit** (`requestSubmit`). That is the one case that reloads; Shopify returns to the page with `customer_posted=true` and Liquid renders the success state.
   - **Network failure / anything else** — the generic error is shown, values are restored and the button re-enables.

Fields sent (Shopify's customer-form structure, as Dawn's newsletter uses — the email field is `contact[email]`, not `customer[email]`):

| Field | Source |
| --- | --- |
| `form_type=customer`, `utf8` | Shopify `form` tag |
| `contact[tags]` | `newsletter,<signup_tag>` |
| `contact[first_name]` / `contact[last_name]` | the name, split on the first space |
| `contact[email]` | the email |
| `contact[phone]` | the phone with spaces, brackets, dashes and dots removed (e.g. `+447700900123`) |
| `h-captcha-response` | added by Shopify's protection when hCaptcha is bound |

Shopify creates or updates the customer with these and subscribes the email to marketing because of the `newsletter` tag. No metafields, notes or third-party integration are involved (none exist in the theme). Shopify rejects a phone that already belongs to another customer; that surfaces as the step-3 error above.

### Validation

Name: non-empty. Email: browser `type=email` check plus a dot in the domain. Phone: digits, spaces, `()-.` and a leading `+`, 8–15 digits (E.164 max), so international numbers pass. Errors are the Wine Crush Body S line under the row (no browser bubbles: the form is `novalidate`), with `aria-invalid` + `aria-describedby` on the field and `role="alert"` on the message. The message is absolutely positioned, so showing it never shifts the page (see `UI-UX.md` § 9).

### Initialisation and multiple instances

Each `<wc-signup-form>` initialises itself in `connectedCallback` and queries only inside itself (`data-signup-*` hooks). Ids derive from `section.id`, so they are unique per section. This covers first load, the theme editor's section re-render (tested by swapping the section for a fresh copy from the Section Rendering API) and two instances on one page (tested with both forms on the home page: separate step, value and error state). A guard stops a moved element initialising twice, and `customElements.get` stops a second definition if the snippet renders twice.

### Tracking / source identifiers

The project had no tracking layer (no Klaviyo, no dataLayer), so the source rides on Shopify's existing **customer tag** mechanism, the same `contact[tags]` Dawn uses. The source is passed into the component from the calling section, not duplicated logic:

| Placement | `data-form-variant` | Tags written to the customer / `data-form-source` |
| --- | --- | --- |
| Coming Soon page | `light` | `newsletter, coming-soon-page` |
| 5% off section | `dark` | `newsletter, five-percent-off` |

- The second tag is the `signup_tag` setting (handleized), editable per section.
- Filter in **Customers → Tagged with**. This is the durable record.
- The component also calls `Shopify.analytics.publish('wc_newsletter_submit' | 'wc_newsletter_signup', { source })`; subscribe from a custom web pixel if needed. Use the tag for counts.

### 5% off integration

`wc-membership` renders the snippet with `variant: 'dark'` in the old CTA slot (`.wc-membership__cta`, a 440px-max wrapper; the 224px form centres in it and the pill shrinks on narrow panels). The panel itself is unchanged and still matches Figma (Sorbet panel on the Claret page, Deep Claret type; re-checked in `zHDSJoUnvvQwNeM1p2IWLH` node `10058:577`). The dark form takes the ink of the "join the crush" pill it replaces (`10055:493`). The old `button_label` / `button_link` settings were removed from the schema **and** from `templates/index.json` (stored values win over schema defaults).

### Verification (dev, 127.0.0.1:9292)

- **Both forms, real taps and keys at 375:** empty name → error; Enter advances; empty and invalid email → error; typing clears the error; Backspace on an empty phone → back to email with its value; empty and invalid phone → error; a UK number is accepted. Throughout: **zero `submit` events reached the document and zero requests were sent** before the final step.
- **Final step, simulated responses:** network failure → generic error with values restored; a Shopify error ("Phone has already been taken") → shown on the phone step; success → one request despite a triple click, busy state while in flight, success message replaces the form and takes focus.
- **Final step, real:** one `fetch` POST with the payload above reached `/contact` and got the dev proxy's 403, then the protected native hand-over (also 403 on the proxy). No customer is created on dev.
- **Responsive:** both variants at 1440, 1366, 1280, 1024, 768, 430, 390 and 375: no horizontal overflow, row and error inside their containers, no layout shift when an error appears.
- **Theme editor re-render and two instances:** as above; unique ids; no console errors.

**Still to verify on the real storefront** (password-protected, so not reachable from here): one real sign-up per placement from the storefront preview URL, then check the customer record (name, phone, tags, email marketing status) in the admin.

Product tabs (earlier task): image click goes to the correct `/products/…` URL (desktop hit-test and a real tap at 375); Add posts `/cart/add` with the card's variant id, cart 0 → 1, drawer opens, bubble updates, no console errors; the cart-error path was checked through Dawn's real `product-form.js` in a static harness.

---

## 23. Collection page

```
                 templates/collection.json
                           │
   wc-collection-nav ── wc-main-collection ── wc-membership (5% off, same as home)
                           │
          ┌────────────────┴────────────────┐
   Products: Liquid, server-rendered     Filters: Search & Discovery
   collection.products in {% paginate %}   collection.filters → wc-facets
   pagination = normal page loads          AJAX via Dawn's assets/facets.js
          └────────────────┬────────────────┘
                 wc-product-card (layout: 'grid')
```

**Initial products = Shopify/Liquid server-rendered. Filters = AJAX/dynamic.** No product is ever fetched client-side: no `/products.json`, no Storefront or Admin API, no infinite scroll. The only AJAX is Dawn's facets flow, which re-requests this same section (`?section_id=…&filter.…`) and swaps parts of it.

### Files

| File | Role |
| --- | --- |
| `templates/collection.json` | `nav` → `main` → `membership`. Dawn's `main-collection-banner` / `main-collection-product-grid` stay on disk, unused. |
| `sections/wc-collection-nav.liquid` | The "Shop All · Whites · Reds · Beer · Beyond" row. Blocks: **All products** (→ `routes.all_products_collection_url`) and **Collection** (collection picker + optional label). Current item = `collection.handle` match → `.is-current` + `aria-current="page"`. Also renders the page's visually hidden `h1` (the collection title). |
| `sections/wc-main-collection.liquid` | `paginate collection.products` (16 per page, setting), the filter column, `#ProductCount`, `#ProductGridContainer`, the grid, numbered pagination and the empty state. Loads `facets.js` and `product-form.js`. |
| `snippets/wc-facets.liquid` | Wine Crush filter markup (desktop column + mobile drawer + active pills) built from `collection.filters`, shaped to Dawn's `facets.js` contract. |
| `snippets/wc-facet-values.liquid` | One filter's values, shared by column and drawer: checkboxes for list/boolean (swatch dot when the filter's presentation is swatch), Dawn's `<price-range>` for price. |
| `snippets/wc-product-card.liquid` + `assets/wc-product-card.css` | The one product card. `layout: 'grid'` = collection card. Card CSS was moved out of `wc-product-tabs.css` so both sections load one shared file. |
| `assets/wc-collection.css` | Nav, layout, grid, filters, drawer, pagination, empty state. |
| `assets/style.css` | `.wc-button--card` + `--button-height-card` / `--button-padding-inline-card`. |

### Collection links

The store's handles are `whites`, **`reds`** (not "red"), `beer`, `beyond`; "Shop All" is the automatic `/collections/all`. Nothing is hardcoded: each link is a block with a collection picker (template values are the handles), so the merchant can rename, reorder or re-point them in the customizer. All five return 200 and mark themselves current.

### Search & Discovery integration

Filters are whatever Search & Discovery returns in `collection.filters`; no filter name, value or metafield is written in the theme, and nothing was created in Shopify. Configured today (read from the live store): **Varietal** (`filter.p.m.custom.varieties`, metaobject values), **Price** (`filter.v.price.gte/lte`), **Availability** (`filter.v.availability`), **Region** (`filter.p.m.custom.region`, metaobject values). Figma shows three labels; Availability renders too because it is configured. Changing filters in Search & Discovery needs no theme change.

### AJAX filtering (Dawn's `assets/facets.js`, unmodified)

`wc-facets` satisfies the script's DOM contract, so its URL building, fetch, response cache, `pushState`/`popstate` and focus handling are all reused as-is:

| Contract | Wine Crush markup |
| --- | --- |
| `<facet-filters-form>` › `form#FacetFiltersForm` (desktop), `form#FacetFiltersFormMobile` (inside `<menu-drawer>`) | column and drawer forms |
| `.js-filter[id]` per filter, re-rendered by id | `details#Details-<param>-<section>` (column), `div#Details-<param>-mobile-<section>` (drawer) |
| `.facets__summary`, `.facets-wrap`, `.mobile-facets__list` | label, values fieldset — the group being used is refreshed in place, so it stays open and focus returns to the checkbox |
| `.active-facets-desktop` / `.active-facets-mobile`, `<facet-remove>` + `url_to_remove` | removable pills + "Remove all" |
| `.mobile-facets__open`, `.mobile-facets__count` | "filter + (n)" toggle, drawer count |
| `#ProductGridContainer › .collection`, `#product-grid[data-id]` (also when empty), `#ProductCount[data-product-count]` | grid, empty state, visually hidden live count |
| `.facets-container[data-template=collection][data-collection-id|handle]` | Shopify standard events |

Flow: tick → 800ms debounce → one `GET ?section_id=…&filter…` → grid, count, groups, pills swapped → `history.pushState` with Shopify's native params (e.g. `?filter.p.m.custom.varieties=gid://shopify/Metaobject/…&filter.v.availability=1`). Back/forward re-render from the cache (no request). Refresh and shared URLs work because the page is server-rendered from the same params. Dawn also leaves empty `filter.v.price.gte=&…lte=` params in the URL; harmless, Shopify ignores them.

**Dawn gotchas handled:**
- `facets.js` swaps a group's innerHTML but keeps the element, so the open state lives on `<details open>` (kept) and the active style on the summary (re-rendered).
- `facets.js` calls `#FacetFiltersFormMobile.closest('menu-drawer').bindEvents()` on every render, so the drawer must exist whenever filters do.
- `menu-drawer` traps focus inside any nested `<details>` it opens, so drawer groups are always-expanded `div.js-filter`, not accordions.
- `menu-drawer` binds every `<button>` inside to "close submenu"; the ✕ and Apply also click the drawer summary (Dawn's own pattern) so its body-scroll lock is released.
- **Price clamp:** `<price-range>` clamps with `Number()`, which reads Dawn's `money_without_currency` output "1,250.00" as `NaN`, so out-of-range amounts were never clamped (a Dawn bug too). `wc-facet-values` strips the thousands separator from `data-min/max` and `value`; the visible placeholder keeps the shop format. This assumes a comma thousands separator (the shop's AUD format).

### Product loading and pagination

`{% paginate collection.products by section.settings.products_per_page %}` (16 = the artboard's 4 × 4). Page links are ordinary `<a>`s to `?page=n` (full server render) and carry the active filter params; changing a filter restarts at page 1 because `facets.js` builds the URL from the form. Sorting has no UI (not in Figma); an incoming `sort_by` is kept as a hidden input so filtering preserves it.

### Verification (dev, 127.0.0.1:9292)

- All five nav links: 200, correct current state, `aria-current`, h1.
- Initial grid server-rendered (12 products, no XHR); layout at 1440 matches the frame (nav y174, labels y418/445/472, first card 237, 400; photo 244, 411; title 254, 418; pill 61 × 26; panel +189; footer +162).
- Varietal → Availability → remove Varietal via pill → Back → Forward: one section request per change, no page reload, grid 12 → 11 → 11 → 12, live count, group counts, pills, "filter + (n)", URL, and history all correct; Back/Forward served from cache.
- Price ≥ 100 → 6 products; ≥ 99999 → clamps to 1250 (after the fix); an unmatched price → empty state; "Remove all" → 12.
- `?sort_by=price-descending` survives filtering and stays sorted.
- Pagination (tested at 8 per page, restored to 16): page 2 is a full server load; filtering from page 2 restarts at page 1 with filter-aware page links.
- Mobile drawer at 375 with real taps: opens (scroll lock, focus inside, `aria-expanded`), a tick updates grid, drawer count, pills and toggle count, ✕ closes and restores focus and scroll.
- Add to cart from the grid: correct variant, cart drawer opens.
- All eight widths: see `UI-UX.md` § 10; no horizontal overflow. No theme console errors (the console shows Shopify's own `shop.app` CSP notices on the dev proxy).

---

## 24. Product page

`templates/product.json`: `main` (`sections/wc-main-product.liquid`) → `related` (`sections/wc-related-products.liquid`) → `membership` (5% off, padding 188 / 162). Dawn's `main-product` / `related-products` stay on disk.

- **Data:** title, price (+ compare-at, unit price), media, description, availability, variants — all from the product. Tags and the spec table from `custom.varieties`, `custom.profile`, `custom.region` (decision #52); "size" from a Size / Volume / Bottle size option when present; empty rows and the tag row are omitted.
- **Rating:** `snippets/wc-rating.liquid`, static (section setting, default 4.5). Replace with `{% render 'wc-rating', value: <review data> %}`.
- **Variants:** Dawn's picker (hidden when `has_only_default_variant`); `product-info.js` swaps price, button and picker and updates the URL; `wc-product-gallery` follows the variant's featured image via Dawn's `variantChange` event. **No product in the store has more than one variant or image yet, so the picker and image switching are untested against real data** — add a two-size test product to verify.
- **Add to cart:** Dawn `product-form` (loading state, duplicate-submit guard, sold-out/unavailable states, cart drawer).
- **Related:** Dawn `<product-recommendations>` (Shopify recommendations, fetched near the viewport) rendering the home slider (`wc-product-tabs` element) and card.

## 25. Cart drawer and age verification

Files: `snippets/wc-cart-drawer.liquid` (in `layout/theme.liquid` and `sections/cart-drawer.liquid`; Dawn's `cart-drawer.liquid` stays on disk), `snippets/wc-cart-extras.liquid` + `wc-cart-extra-panel.liquid`, `snippets/wc-age-gate.liquid`, `assets/wc-cart-drawer.css` (replaces `component-cart-drawer.css`), `assets/wc-cart.js` (site-wide). Design basis: `UI-UX.md` § 12.

- **Cart AJAX:** Dawn's, unchanged — add (`product-form.js` → `renderContents`), quantity / remove (`cart.js` → `/cart/change` → re-render of `.drawer__inner`), cart bubble. The markup keeps Dawn's ids and elements (listed in the snippet header).
- **Gift message** → cart attribute `Gift message`; **delivery notes** → `cart.note` (shown when Dawn's "Enable cart note" is on). Saved via `/cart/update.js`; Liquid pre-fills from the cart, so re-renders and reloads keep them.
- **Age verification** (`<wc-age-gate>` + guard, decision #54): date of birth ≥ `wc_age_gate_min_age` and the confirmation checkbox; saved as cart attributes `Date of birth` (YYYY-MM-DD) and `Age confirmed` (`yes`). Also on `/cart` (`sections/main-cart-footer.liquid`).
- **Theme settings** — group "Wine Crush — Cart": `wc_cart_message` (richtext, `[threshold]`), `wc_cart_free_shipping_threshold`, `wc_cart_gift_enabled` + labels, `wc_cart_note_*` labels, `wc_age_gate_enabled`, `wc_age_gate_min_age`, `wc_age_gate_dob_label`, `wc_age_gate_confirm_text`, `wc_age_gate_required`, `wc_age_gate_underage`. Reused Dawn setting: `show_cart_note`. UI strings: `locales/en.default.json` → `wc_cart.*`.

Verified live (dev store, headless Chrome with the real cart): quantity + → subtotal and bubble update; remove; empty state; gift message saved to the cart and shown as a card; gate — empty → "Required field" ×2 and focus to day; under 18 → under-age message; gate **deleted from the DOM** → button, `/checkout` link and form submit all blocked; valid → proceeds to `/checkout`; values survive a quantity re-render and a full reload. No console errors.

## 26. Mobile / Figma QA fix pass

Nine reported issues, each fixed at its cause (decisions #53–#59, `UI-UX.md` § 13):

| # | Issue | Cause → fix |
| --- | --- | --- |
| 1 | Journal in the mobile menu bar | Mobile hide rule listed types and missed link blocks → hide every nav link < 990 (drawer keeps Journal) |
| 2 | Uneven drawer rows | `<button>` rows kept UA inline padding; Info rows used the accordion sub-list (8px gap, 15px padding) → one row rule, `.wc-drawer__list` |
| 3 | No drawer logo | Head had only back/close → back · logo · close on the header grid |
| 4 | Card text over image | Fixed-ratio card + width-scaled bottle + free image height → fixed image box, reserved flow space; collection card container query |
| 5 | Mobile sections | Fixed 129px band cap over short bands; hero/bundle/footer causes below → fluid `--band-overlap` |
| 6 | Build your bundle | 1440 %-scatter landing on the copy, 35% "texture" → mobile collage grid, CTA cleared |
| 7 | Footer logo | 100% width override; 1× PNG → base 70%, vector mask |
| 8 | Hero | Strip-like 375:560 frame, top-anchored wordmark off the band → 375:640, bottom-anchored straddle |
| 9 | Cart drawer | Measured against the reference × Figma scale (§ 12); `cart.js` not loaded (functional bug) |

Testing tool: the in-app browser's screenshots were unreliable (and headless Chrome clamps windows to ≈ 500px), so layouts were captured with a small zero-dependency Chrome DevTools Protocol script using true device-metrics emulation at each exact width (scratchpad only; not in the theme).

Desktop unchanged at 1440 against the recorded anchors (hero wordmark y662, first card (18, 1517) 331 × 434, bundle CTA (655, 2970), journal (18, 3604), membership (18, 4644)). The page is 7px shorter than the documented 7393 — traced to the image-grid section (`wc-card-grid` marquee), whose files carried uncommitted changes from before this work and were not modified here.

---

## 27. About Us page

Figma `10058:642` (file `jQF089DRFRk40Wk3K24jMV`); node map and measurements in `UI-UX.md` § 14. Decisions #60–#64.

The same request re-linked the cart drawer (`10071:439`): the frame in the new file is unchanged (one Reserve Cellar screenshot, `10071:557`), and the built drawer (§ 25, `UI-UX.md` § 12) already follows it. No drawer changes were needed.

### Files

| File | Change |
| --- | --- |
| `templates/page.about-us.json` | new — hero · intro · how_to_shop · journal_grid · journal_intro · closing |
| `sections/wc-split-panels.liquid`, `assets/wc-split-panels.css` | new — heading + up to two photo panels (image, overlay, title, rich text, pill) |
| `sections/wc-hero.liquid`, `assets/wc-hero.css` | `layout` / `eyebrow` / `heading`; per-layout placeholder art |
| `sections/wc-bundle-band.liquid`, `assets/wc-bundle-band.css` | `heading_size`, `heading_width`, `body_size`; Claret heading colour; collage < 990; mobile cap padding only when capped |
| `sections/wc-statement.liquid`, `assets/wc-statement.css` | `icon`, image background, overlay, `tuck_under` |
| `assets/style.css` | `--text-display-page`, `--text-body-m`, `.wc-body-m` |
| `assets/wine-crush-about-*.jpg` | placeholder photos (hero 2400w crop of the Figma fill, closing 2400w, panels 735w) |

### Verification (dev, `?view=about-us`)

No Liquid errors; no horizontal overflow at 1440 / 1366 / 1280 / 1024 / 768 / 430 / 390 / 375; 1440 anchors within 2px of Figma except the footer (7px, overlap 129 vs 136). Home re-measured at 1440: bundle band 2228, heading 2669, body 2893 — unchanged.

---

## 28. Cart drawer rebuilt to the reference + Shipping & FAQs page

Decisions #67–#72. `UI-UX.md` § 12 (drawer) and § 15 (FAQ).

### Cart drawer

Rebuilt against Figma `10071:439` as drawn: black panel, Inter, reference geometry and controls. Colours and font are theme settings (Wine Crush — Cart › Drawer style), and inside the panel the site tokens are re-pointed at them.

| File | Change |
| --- | --- |
| `assets/wc-cart-drawer.css` | rewritten visual layer (mechanics unchanged) |
| `snippets/wc-cart-drawer.liquid` | `data-min` 0 for standard lines, remove link only for minimums > 1, no taxes line, `wc_cart.checkout` label |
| `config/settings_schema.json` | Drawer style: font + 4 colours; "Date of Birth" label |
| `config/settings_data.json` | Dawn's `show_cart_note` on (the reference's "Add delivery notes" switch) |
| `layout/theme.liquid` | `--color-cart-*`, `--font-cart`, the font's `@font-face`, `--color-hairline` |
| `locales/en.default.json` | `wc_cart.checkout`; DOB placeholders "Day" / "Year" (were DD / YYYY) |

Verified on dev at 1440 with one line in the cart: layout matches the reference within ~4px at every block; "+" 1 → 2, "−" 2 → 1, "−" at 1 removes the line and the empty state appears; checkout with an empty gate is blocked with "Required field" on both fields. Phones (390): the panel is 328 wide and the two switches wrap to their own rows.

### Shipping & FAQs

New `sections/wc-faq.liquid` + `assets/wc-faq.css` + `templates/page.shipping-faq.json` (nine questions from the frame). Anchors within 3px at 1440; no overflow at any width.

### Follow-up pass (client review)

Three reported issues, all fixed at the cause (decisions #73–#77):

| Issue | Cause → fix |
| --- | --- |
| FAQ typography / colours / borders off | Row type was `--text-blog-title` (16px), the "+" muted and rules 1px Ivory-25% → re-measured on the native frame: 14 / 18 Ivory labels, Ivory "+" 12px inside the right edge, 2px Sorbet-50% rules, 32px pitch kept |
| FAQ accordion jumps | `details` does not animate → `<wc-accordion>` (`assets/wc-faq.js`) tweens the answer height, 280ms, reversible mid-flight, no-JS and reduced-motion safe |
| Cart typography / colours off | Caps were 11px / 0.14em and the subtotal 24px → one 10px / 0.16em caps style and a 22px subtotal, DOB values sat 6px low → seated on the rule. Colours were already right (sampled: text `#F2F2EB`, secondary `#B4B3A0` at every label) |
| Cart closes instantly | `visibility` cannot tween and `cart-drawer.js` only toggles `.active` → `transition: visibility 0s linear var(--cart-motion)`, `.active` resets the delay. Found in passing: the scrim was `display: none` from base.css's empty-div rule, so there was no dimming and no click-outside-to-close |
| Default-looking scrollbar | `scrollbar-width: thin` + `scrollbar-color` in the drawer's palette (hover brightens to the rule tint), `::-webkit-scrollbar` 4px fallback, textareas matched |

Re-verified after the changes: drawer plus / minus / minus-at-1 removal / empty state / blocked checkout on an empty gate all still pass; slide-out measured frame by frame (0 → 472px over ~280ms, hidden only after); scrim fades 1 → 0 and click-outside closes; FAQ rows animate at 1024 / 768 / 390 / 375 with no overflow.

---

## 29. Bundle builder (Build Your Bundle)

Figma `10072:1173`; geometry in `UI-UX.md` § 16. Decisions #78–#85.

### Data — all of it from Shopify

| What | Source |
| --- | --- |
| The product | `bundle-packs` (id 9311292129418), template `product.bundle-packs.json` |
| Packs | the product's own variants — read live: Six Bottles $100, Nine Bottles $150, Twelve Bottles $200 |
| Bottles per pack | variant metafield **`custom.bundle_bottles_quantity`** (6 / 9 / 12 on the live store). A variant without it is never offered |
| Bottles on offer | product metafield **`custom.bundle_products`** (a product list — nine products today) |
| Card content | each product's own title, featured image, price and availability |
| Pack price / subtotal | the variant's price (`money`) |

Nothing is hardcoded: no ids, handles, titles, images, prices, counts or availability.

### Files

| File | Role |
| --- | --- |
| `templates/product.bundle-packs.json` | builder + membership band |
| `sections/wc-bundle-builder.liquid` | heading, card grid, panel, the `<product-form>`, the phone bar, the misconfigured notice, and the `wcBundleStrings` bridge |
| `assets/wc-bundle-builder.css` | the artboard's geometry |
| `assets/wc-bundle-builder.js` | `<wc-bundle-builder>`: selection state, slots, counter, properties, validation |
| `snippets/wc-product-card.liquid` | new `mode: 'select'` — same grid card, a toggle instead of a cart form, nothing navigates |
| `assets/wc-product-card.css` | the select toggle takes the card's "add" cell |
| `locales/en.default.json` | `wc_bundle.*` (the JS strings use `[count]` / `[total]` / `[title]`, like the cart's delivery message) |
| `assets/style.css`, `layout/theme.liquid` | `--color-accent-muted` (Sorbet 66%) |

### Behaviour

One ordered list of chosen product ids is the state; the slots, counter, subtotal, card buttons, message and the form's properties all render from it. Selecting is delegated from the element (one listener, not one per card). At the limit the unchosen cards dim and refuse with "That is all 6 bottles. Remove one to swap it for another."; deselect and re-select work. Switching pack updates the hidden variant id, the price, the limit and the rows, and keeps the selections.

`custom.bundle_products` empty, or no variant with a bottle count → no builder: a neutral notice for the customer and a `console.warn` naming the missing metafield.

### Verification (dev, `?view=bundle-packs`)

- **Data:** 9 cards from the metafield, packs 6/9/12 with $100/$150/$200 from the variants and their metafields.
- **Selection:** 6 of 6 fills the slots and enables the CTA; a 7th is refused; deselect → 5/6 and the CTA blocks again; swap works.
- **Switching:** → 9 bottles re-renders 9 rows, "Select 3 more…", subtotal $150, hidden variant id 50246128926858; → back to 6 with 7 chosen keeps all 7, flags the extra row and says "Remove 1 bottle to fit the 6-bottle pack."
- **Cart:** incomplete submit adds nothing and does not navigate; a complete one adds variant 50246128894090 at $100 with `Bottle 1…6` properties, opens the drawer and shows each bottle under the line. A double click still produces one line. A second, different bundle is its own line (9-pack, $150, 9 properties).
- **Sold out:** simulated on a card — the click is refused with "… is sold out just now." and it cannot enter the bundle.
- **Keyboard / AT:** the toggle is focusable, `aria-pressed` flips, and its accessible name changes between "Add … to your bundle" and "Remove …".
- **Type (re-measured against the frame):** eyebrow, card title/price/pill, panel title, hints, pack count and price, slot rows, subtotal and CTA all match the artboard's glyph runs within ~1px; colours sampled equal (Ivory, Sorbet 66% hints, Ivory-66% empty slots, Coral chosen pack, 2px Sorbet-50% rules, 1px Ivory pack outline).
- **Layout:** 1440 matches the artboard within 2px; three card columns down to 1024; no horizontal overflow at 1440 / 1366 / 1280 / 1024 / 768 / 430 / 390 / 375; one `h1`; no console errors.

---

## 30. Journal — listing and article

Figma `10047:175` (listing) and `10053:93` (article); geometry in `UI-UX.md` § 17. Decisions #88–#95.

### Architecture

```
Journal (menu) → /blogs/journal → templates/blog.journal.json → wc-main-blog
                                → an article → article.journal.json → wc-main-article
```

Content is Shopify's, end to end: `blog.articles` on the listing, `article.title` / `.published_at` / `.image` / `.content` on the detail page. Nothing editorial is in the theme. The blog is `journal` (4 posts today).

### Files

| File | Role |
| --- | --- |
| `sections/wc-main-blog.liquid` | listing: pill, eyebrow, heading, sort, the card grid, "see more" |
| `sections/wc-main-article.liquid` | article: back link, date, title, featured image, the merchant's body, optional author/tags |
| `snippets/wc-article-card.liquid` | the shared 339 × 498 card (listing + home + About Us) |
| `assets/wc-journal.css` | both pages, including the body's element styles |
| `assets/wc-journal.js` | `<wc-journal-list>`: batch reveal and sort |
| `templates/blog.journal.json` | listing + membership band |
| `templates/article.journal.json` | article + "Crowd Favourites" slider + membership band |
| `sections/wc-product-tabs.liquid` / `.css` | new `heading` + `show_tabs` settings (the article's slider) |
| `sections/wc-card-grid.liquid` | now renders the shared card snippet |
| `assets/wc-card-grid.css` | card titles uppercase |
| `locales/en.default.json` | `wc_journal.*` |
| `templates/index.json`, `page.about-us.json` | blog handle `news` → `journal` |

### Behaviour

- **Pagination / see more:** `{% paginate blog.articles by 50 %}`; the script hides everything past the batch (12) and reveals the next batch per press, moving focus to the first new card. At the end of the page the button is Shopify's `paginate.next.url`, or hides when there is no next page. No JavaScript: all cards visible, button = next page.
- **Sort:** newest / oldest over the rendered cards, from each card's `data-published` timestamp.
- **Related content:** the frame has none; the article ends with the product slider.
- **SEO / semantics:** one `h1` per page (listing heading, article title), `<article>` around the post, `<time datetime>` on every date, Dawn's JSON-LD and metadata untouched.

### Verification (dev, `?view=journal`)

- **Listing:** pill 186 · eyebrow 239 · heading 286 · sort 542 · grid 645 · card 339 × 498 — within 1px of the frame. 4 real articles from the blog, titles and dates from Shopify.
- **See more / sort (tested with the batch at 2):** 2 → 4 → the button hides; newest→oldest flips the first card from "The Bottle You Bring…" to "What to Drink…", and the batch limit survives the re-sort.
- **Article:** back 119 · pill 268 · title 309 (680 × 160) · image 540 (254 × 333) · body 944 (551 × 575, the artboard's exact height, 15 / 23) · "Crowd Favourites" 1719 · page 4055 (Figma 4089).
- **Responsive:** listing 4 / 2 / 1 columns (at 375 the card is the artboard's 339 × 498); article keeps its 551 measure to 768 and goes full width below. No horizontal overflow at 1440 / 1366 / 1280 / 1024 / 768 / 430 / 390 / 375.
- **No regressions:** home, About Us, the default blog and article templates all still render (200), and the home journal row now shows real posts.

---

## 31. Full-site QA pass

Decisions #96–#102.

### Tooling

`scratchpad/qa-sweep.mjs` — one headless Chrome, every page × every width, reporting horizontal overflow (with the offending elements), section overlap, console errors, broken images and missing translations. Run: `node qa-sweep.mjs --widths 320,375,430,768,1024,1280,1366,1440`. `qa-type.mjs` is the same harness printing computed type/colour for the shared components, which is how the card price mismatch was found.

### What the sweep covers

12 pages (home, collection, product, bundle, journal, article, cart, contact, search, policy, 404, coming soon) at 320 / 375 / 430 / 768 / 1024 / 1280 / 1366 / 1440 — 96 page loads. Result after the fixes: **no horizontal overflow, no section overlap, no console errors, no broken images, no missing translations** anywhere. The only reported overlap is the home page's transparent header over the hero, which is the design.

### Fixed in this pass

| # | Issue | Fix |
| --- | --- | --- |
| P0 | `cart.js` loaded twice on the cart page → "CartRemoveButton has already been declared" | The section only loads it when the drawer is off |
| P1 | 24px horizontal overflow at 320 on the privacy policy | `overflow-wrap: anywhere` on merchant copy |
| P1 | Cart, page, contact, search, 404 and policies were untouched Dawn | New Wine Crush sections and default templates (`UI-UX.md` § 18) |
| P2 | Product card price was full Ivory on the slider card | Ivory 75% on the shared component, as both artboards draw it |
| P2 | Journal card titles were sentence case, dates read "SEP 19, 2026" | Uppercase, and "sep ‘26" as drawn (shared card snippet) |
| P2 | `TRANSLATION MISSING` on the cart subtotal and the 404 caption | Correct locale keys |
| P3 | Stray `#000` and an inline Ivory-18% rgba in the wc CSS | `rgb(0 0 0 / …)` and the new `--color-divider` token |

### Functional regression (all passing)

Home: marquee runs, product tabs switch, card add-to-cart opens the drawer with the item. Collection: filters re-render the grid and push the filter URL. Product: quantity, add to cart, drawer. Cart page: quantity up/down, subtotal, the age gate blocks checkout. Bundle: selection, limits, pack switching, properties into the cart. Journal: sort and "see more". Coming Soon form: 3 steps, empty and invalid input blocked, name → email → phone. Mobile nav: opens, focuses the first row, closes.

### Theme Editor

Every script is a custom element (`customElements.define`), so a section re-render re-initialises it and no listener is bound twice; `wc-header.js` additionally listens for `shopify:section:load`. The new sections carry no JavaScript.

