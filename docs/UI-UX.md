# Wine Crush — UI/UX System

Extracted from Figma: `Wine Crush Website (Copy)` — file `aHXTROQq2Is1ltbfU5UdUy`.

Reference frames:

| Frame | Node ID | Size |
| --- | --- | --- |
| Home (desktop) | `10084:45` (alias `10055:348`) | 1440 × 7393 |
| Header — transparent / unscrolled | `10084:148` | 1372 × 28 @ (34, 15) |
| Header — sticky / scrolled | `10008:339` | 1440 × 57 |
| Menu Dropdown — Shop | `10075:2364` (panel `10075:2425`) | 1440 × 512 panel |
| Menu Dropdown — Info | `10075:2000` (panel `10075:2284`) | 1440 × 512 panel |
| Coming Soon Page | `10036:30` (file `zHDSJoUnvvQwNeM1p2IWLH`) | 1440 × 884 — see § 9 |
| Shop (collection page) | `10008:35` (file `zHDSJoUnvvQwNeM1p2IWLH`) | 1440 × 3748 — see § 10 |
| Product Template | `10050:30` (file `zHDSJoUnvvQwNeM1p2IWLH`) | 1440 × 3079 — see § 11 |
| Cart Popup (reference screenshot `10071:557`) | `10071:439` | 472 × 963 at 1440 — see § 12 |
| About Us | `10058:642` (file `jQF089DRFRk40Wk3K24jMV`) | 1440 × 5453 — see § 14 |
| Shipping & FAQs | `10058:711` (file `jQF089DRFRk40Wk3K24jMV`) | 1440 × 2019 — see § 15 |
| Build Your Bundle | `10072:1173` (file `jQF089DRFRk40Wk3K24jMV`) | 1440 × 3572 — see § 16 |
| Journal (listing) | `10047:175` (file `jQF089DRFRk40Wk3K24jMV`) | 1440 × 3895 — see § 17 |
| Journal article | `10053:93` (file `jQF089DRFRk40Wk3K24jMV`) | 1440 × 4089 — see § 17 |

All measurements below are taken at the **1440px desktop artboard**. Mobile values are derived — see [Responsive UX](#responsive-ux) and the note in `CONTEXT.md` about the absence of mobile artboards.

---

## 1. Typography

### Font families

| Token | Family | Weight | Source |
| --- | --- | --- | --- |
| `--font-display` | **Dahlia**, Medium Condensed | 500 | Self-hosted — `assets/dahlia.woff2`, `assets/dahlia.woff` |
| `--font-body` | **IBM Plex Mono**, Regular | 400 | Webfont (see `CONTEXT.md` § font loading) |

IBM Plex Mono is the paragraph font in Figma and therefore becomes the **global body font**. Dahlia is used exclusively for large display headings — it never appears below 62px.

### Display scale — Dahlia

| Style | Size | Line height | Case | Colour | Usage |
| --- | --- | --- | --- | --- | --- |
| Display XL | 150px | 1.0 | sentence | Ochre | "Build your bundle." |
| Display L | 120px | 0.95 | UPPERCASE | Deep Claret | "5% off / for life" |
| Display M | 62px | 1.0 | sentence | Ivory / Sorbet | Hero statement, journal intro |

Dahlia headings use **no letter-spacing adjustment** and sit tight to the baseline (`leading-none` in the source). Display L is the only style with an explicit 0.95 leading and hard line breaks.

### Body scale — IBM Plex Mono

| Style | Size | Line height | Case | Usage |
| --- | --- | --- | --- | --- |
| Body L | 18px | 1.42 | sentence | Brand story paragraphs |
| Tab / Eyebrow | 18px | normal | UPPERCASE | Product tabs, "pick your six · pick your price" |
| Blog title | 16px | normal | UPPERCASE | Journal card headings |
| Button | 14px | normal | UPPERCASE | All pill button labels |
| Hero lede | 14px | normal | UPPERCASE | Hero intro paragraph |
| Contact | 14px | normal | sentence | Footer email + address |
| Nav | 13px | normal | UPPERCASE | Header navigation |
| Body S | 12px | 1.42 | sentence | Section descriptions (bundle, membership) |
| Product meta | 12px | normal | UPPERCASE | Product title + price |
| Footer nav | 12px | normal | UPPERCASE | Footer pill links |
| Legal | 11px | normal | UPPERCASE | Responsible-service / licence text |
| Caption | 10px | normal | UPPERCASE | Blog date pill, copyright row |

Notes:
- Only two text styles are **not** uppercase: the Dahlia display headings and the sentence-case body paragraphs (12px / 18px) plus the footer contact block.
- Line height is Figma `normal` (≈1.2 for IBM Plex Mono) for all single-line labels; multi-line paragraphs use **1.42**.
- No custom letter-spacing is applied anywhere in the design; IBM Plex Mono's natural monospace tracking carries the look.

---

## 2. Colours

### Named Figma styles

| Token | Name | Hex |
| --- | --- | --- |
| `--color-claret` | Deep Claret | `#481111` |
| `--color-ivory` | Ivory | `#F4E7D4` |
| `--color-ochre` | Ochre | `#9A7331` |
| `--color-crimson` | Crimson | `#6A111E` |
| `--color-sorbet` | Sorbet | `#F8CC8A` |
| `--color-coral` | Coral | `#EE3D40` |

### Semantic assignment

| Role | Value |
| --- | --- |
| Page background | Deep Claret `#481111` |
| Light surface (bundle band, footer) | Ivory `#F4E7D4` |
| Product card surface | Crimson `#6A111E` |
| Membership accent panel | Coral `#EE3D40` |
| Membership inner panel | Sorbet `#F8CC8A` |
| Text on dark | Ivory `#F4E7D4` |
| Text on light | Deep Claret `#481111` |
| Footer text on light | Crimson `#6A111E` |
| Journal accent (headings, pills, buttons) | Sorbet `#F8CC8A` |
| Display heading on ivory | Ochre `#9A7331` |
| Legal / fine print on ivory | Ochre `#9A7331` |
| Muted text — inactive tab | `rgba(244, 231, 212, 0.66)` |
| Muted text — product price | `rgba(244, 231, 212, 0.75)` |
| Border (on dark) | Ivory `#F4E7D4`, 1px |
| Border (on light) | Deep Claret `#481111` / Crimson `#6A111E`, 1px |
| Border (journal) | Sorbet `#F8CC8A`, 1px |

### Image overlays

| Context | Overlay |
| --- | --- |
| Hero image/video | `rgba(0, 0, 0, 0.30)` |
| Journal card (light image) | `rgba(0, 0, 0, 0.20)` |
| Journal card (mid image) | `rgba(0, 0, 0, 0.31)` |
| Journal card (bright image) | `rgba(0, 0, 0, 0.35)` |

Overlay opacity is tuned per-image in Figma. Implemented as a per-block setting with `0.30` default so the merchant can rebalance for their own photography.

### Header / mega menu surfaces

| State | Background |
| --- | --- |
| Header, home, unscrolled | Transparent (background rect is hidden in Figma) |
| Header, scrolled / sticky | Deep Claret `#481111` |
| Header, mega menu open | Deep Claret `#481111` — the bar is painted over the panel |
| Mega menu panel | Coral `#EE3D40`, 1440 × 512, anchored at y0 |
| Mega menu scrim | `rgba(0, 0, 0, .3)` over the whole viewport |

---

## 3. Buttons

Every button in the design is the same primitive: a **1px outlined pill**, transparent fill, uppercase IBM Plex Mono label, `border-radius: 37px`. There is no filled/solid button anywhere in the home page design.

### Size scale

| Size | Height | H-padding | Font | Example | Measured width |
| --- | --- | --- | --- | --- | --- |
| `xs` | 19px | 8px | 10px | Blog date pill | 59px |
| `sm` | 25px | 10px | 12px | Footer nav links | 48–141px (fit) |
| `nav` | 27px | 11px | 13px | Header "shop +" | 75px |
| `md` (default) | 30px | 19px | 14px | "explore all", "get picking", "our journal" | 130px |
| `md` wide | 30px | 19px | 14px | "join the crush" / "get directions" | 153 / 152px (fit) |
| `md` compact | 30px | 11px | 14px | "add +" (home card) | 68px |
| `card` | 26px | 10px | 13px | "add +" (collection card) | 61px |

### Colour variants

| Variant | Border | Text | Context |
| --- | --- | --- | --- |
| Ivory (default on dark) | `#F4E7D4` | `#F4E7D4` | Hero, product section, story |
| Claret (on light) | `#481111` | `#481111` | Bundle band, membership panel |
| Crimson (footer) | `#6A111E` | `#6A111E` | Footer nav pills |
| Sorbet (journal) | `#F8CC8A` | `#F8CC8A` | Journal date pills, "our journal" |

### Interaction

Hover states are not specified in the Figma file. Established convention (documented as an implementation decision in `CONTEXT.md`):

- **Hover / focus:** fill inverts — background becomes the border colour, label becomes the surrounding surface colour.
- **Transition:** `background-color 200ms ease, color 200ms ease, border-color 200ms ease`.
- **Focus-visible:** 2px offset outline in the current border colour (never removed).
- Honours `prefers-reduced-motion`.

---

## 4. Layout & grid

### Container

| Token | Value |
| --- | --- |
| Artboard width | 1440px |
| Page gutter (desktop) | **18px** |
| Content width (desktop) | **1404px** |
| Max content width | 1404px, centred |

Verified against the journal grid: `18 + (4 × 339) + (3 × 16) = 1422`, leaving an 18px right gutter — symmetric. The membership panel is likewise exactly 1404px wide.

The 18px gutter is unusually tight, which is intentional — the design is near-full-bleed. On viewports wider than 1440 the container caps at 1404px and centres, so the gutters grow rather than the content.

### Grids

| Grid | Columns | Item width | Gap |
| --- | --- | --- | --- |
| Journal / image grid | 4 | 339px | 16px |
| Product slider | ~4.2 visible | 331px | 15px |
| Product tabs | inline row | fit | 54px |

The product row is a **slider**, not a static grid: 4 cards of 331px + 3 gaps of 15px = 1369px inside a 1404px container, leaving a ~35px peek of the next card. A next/prev arrow control sits at the right edge (52px rule + two 13×13 chevrons).

### Radii

| Token | Value | Usage |
| --- | --- | --- |
| `--radius-band` | 39px (top corners only) | Full-bleed section bands |
| `--radius-panel` | 20px | Membership panels |
| `--radius-card` | 10px | Product, journal, decorative images |
| `--radius-pill` | 37px | All buttons |

### Section spacing

Full-bleed colour bands are 1440px wide with a **39px top radius** and overlap the preceding section by 129px, creating the layered "card stack" effect:

| Band | Top | Height | Colour |
| --- | --- | --- | --- |
| Claret over hero | 769 | 129 | `#481111` |
| Ivory (bundle) | 2228 | 1350 | `#F4E7D4` |
| Claret over bundle | 3449 | 129 | `#481111` |
| Ivory (footer) | 6936 | 457 | `#F4E7D4` |

Vertical rhythm between content blocks (measured):

| Gap | Value |
| --- | --- |
| Band overlap | 129px |
| Section padding (band top → first content) | 74–84px |
| Content → CTA button | 84px |
| CTA → next band | 162px |
| Grid → following heading | 102px |
| Paragraph → button | 116px |

Implemented as a spacing scale: `4, 8, 15, 16, 18, 20, 24, 30, 39, 56, 74, 84, 102, 129, 162`. Sections take `padding-block` from tokens rather than ad-hoc margins.

### Shadows

None. The design uses no drop shadows anywhere — depth comes entirely from the overlapping rounded bands and colour contrast.

---

## 5. Section anatomy (desktop y-coordinates)

| # | Section | Range | Key specs |
| --- | --- | --- | --- |
| 1 | Hero | 0–898 | Full-bleed image/video 1440×898, `rgba(0,0,0,.3)` overlay. Lede 14px @ y345 (w 449, centred). Logo 706×174 @ y662, centred, straddles the band edge. |
| 2 | Hero statement | 1042 | Dahlia 62px, w 598, centred, Ivory |
| 3 | Product tabs | 1339 | 18px uppercase, 54px gap, centred; active = Ivory + underline, inactive = Ivory @ 66% |
| 4 | Product slider | 1417–1952 | Card 331×434 @ y1518 (Crimson, r10); bottle image 324×485 @ y1417 overhangs the card top by 101px. Title 12px @ y1908, price 12px @ y1886, "add +" pill 68×30 @ y1910 |
| 5 | Explore CTA | 2036 | 130×30 pill, centred |
| 6 | Build your bundle | 2228–3578 | Ivory band. Eyebrow @ y2620 (18px, 5px dot separators). Display 150px @ y2669. Body 12px/1.42 w477 centred @ y2893. CTA 130×30 @ y2970. Four decorative images (255×337, 271×257, 163×169 ×2) scattered at r10 |
| 7 | Journal grid | 3604–4102 | 4 × 339×498 cards, r10, gap 16. Date pill 59×19 @ y3991, title 16px Sorbet @ y4023 |
| 8 | Journal intro | 4204 | Dahlia 62px Sorbet, w 833, left-aligned at gutter. "our journal" pill right-aligned @ y4356 |
| 9 | Membership | 4617–5403 | Coral 1324×682 r20 @ y4617; Sorbet 1404×759 r20 @ y4644 layered over it; image 715×759 fills the right half. "5% OFF / FOR LIFE" 120px @ y4813, body w346 @ y5089, CTA 153×30 @ y5205 |
| 10 | Brand story | 5559–6243 | Left text 18px/1.42 w412; right text 18px/1.42 w300 right-aligned @ y6139; circular image (462×423, rotated −30°) centred @ y5716; brand icon 44×61 top-right; address + "get directions" pill 152×30 bottom-left |
| 11 | Image grid | 6387–6885 | Same geometry as the journal grid |
| 12 | Footer | 6936–7393 | Ivory band r39. Nav pills 25px @ y6966. Social icons 31×31 @ y7028. Contact 14px @ y7069/7092. Logo 438×108 @ y7164. Legal 11px w1248 @ y7315. Copyright row 10px @ y7364 |

---

## 6. Header & mega menu

### Header — unscrolled (home only)

- Content band 1372 × 28, inset 34px from the left, 15px from the top.
- Background rectangle is **hidden** in Figma → fully transparent over the hero.
- **No logo.** The logo only exists in the hero body at this stage.
- Left: "shop +" inside a 75 × 27 outlined pill.
- Right cluster: "journal" (x1105), "info +" (x1196), "account" (x1280), cart circle 28 × 28 (x1378).
- Nav type: 13px IBM Plex Mono uppercase, Ivory.

### Header — scrolled / sticky

- Full-bleed 1440 × 58, solid Deep Claret: 15px + 15px around the 28px content band.
- Logo appears centred: 122 × 30 at (659, 14) — 1px proud of the 28px band top and bottom, so it is held to the band's height and must not be allowed to open the bar past 58. Every section that tucks under the header is positioned off that 58.
- Same nav items, same positions.

The logo reveal is the defining interaction: hidden at scroll 0 on the home page, fading/sliding in as the header becomes sticky. On all non-home templates the header starts in the scrolled state.

**The bar is Coral on every page** (Figma 10008:339 Shop, 10075:1873 About Us), with a 0.7px Ivory rule along its foot (`.wc-header--page`, tokens `--color-header-bg-page` / `--color-header-rule-page`; the rule is an inset shadow, so the bar stays 58). Home keeps its transparent state over the hero and takes the same Coral bar the moment it sticks or a mega menu opens (client, 2026-09-28 — it used to resolve to Claret, which made home the odd page out).

**Shop button.** The trigger is the pill primitive (`.wc-button.wc-button--nav`): 1px Ivory border, r37, 27 tall, 13px caps — the artboard's 75 × 27 pill. `.wc-header__link` resets `border` for plain links only (`:not(.wc-button)`); a blanket reset there sits later in the cascade than `.wc-button` and flattened the pill.

**Shop is a link as well as a trigger.** With a destination set on the block it renders as an `<a>` carrying `aria-haspopup` / `aria-expanded`: a mouse opens the panel on the way in and the click follows the link, a touch opens on the first tap and follows on the second, and keyboard focus opens it (Escape closes). Without a destination it stays a plain disclosure button.

**Mega menu column titles are links.** Each column resolves, in order: the column's own link setting, else the collection whose handle matches the menu's, else plain text — so nothing is hardcoded and nothing links to nowhere. In the drawer the title is a link inside the summary row and the rest of the row still opens the children (`assets/wc-header.js` stops the toggle when the link itself is tapped).

**Cart circle and count.** The circle is the artboard's 28 x 28 with a 16px trolley (`icon-wc-cart.svg`, viewBox 24); it flips to Ivory on Claret on hover. The artboard never draws a non-empty cart, so the count chip is the theme's own: 15px, Claret on Ivory, 10px digits, pinned -4/-4, ringed in `--header-surface` (the bar's current colour) so it clears the circle's stroke, and `transparent` on the floating home header where there is no bar. It is Claret rather than Coral because the bar itself is Coral — a Coral chip vanished into it. `99+` above 99. The link's contents come from `snippets/wc-cart-icon.liquid`, which `sections/cart-icon-bubble.liquid` also renders, because the cart JS writes that section back into the header after every cart change.

**Link treatment** (`.wc-underline`, in `style.css`). The artboards draw no underline, so links are bare at rest and the line is **drawn from the left on hover and focus** — `::after`, `scaleX(0) → 1`, `transform-origin: left`, 200ms, no layout shift. `.wc-underline--rest` adds a quiet Ivory-18% rule at rest and is used only where the affordance must survive without a pointer: the mega menu's column titles and their drawer rows.

### Mega menus

Both panels are **1440 × 512 Coral** — not claret — and are anchored at **y0**, the very top of the viewport, with the header bar painted *over* them. They are not hung below the bar. The panel therefore slides out of its own height (`translateY(-100%)` → `0`) so it appears to drop from behind a header that never moves, and the panel's own top padding is what clears the 58px bar. Bottom corners are square: coral still reaches x0 on the last painted row of both renders.

Behind the panel, a **`rgba(0, 0, 0, .3)`** scrim covers the whole viewport. Differencing the two menu artboards against the un-scrimmed hero gives a flat 0.70× with a zero intercept, so this is plain black at 30%, not a tint of any brand colour.

Panel gutter is **34px**, not the page's 18 — content runs x34…x1406.

Type in both panels, read back through IBM Plex Mono's 0.6em advance:

| Role | Size | Evidence |
| --- | --- | --- |
| Panel heading ("Shop", "Info") | 30px, display face | — |
| Column title / link | 14px | "Cabernet Sauvignon" is 152 / 18 = 8.44 |
| Info body copy | 16px | longest line 289 / 30 = 9.63 |

Both panel images carry an **8px** corner radius (the corner bites 4px into the coral, which is `r − sqrt(2r − 1)`).

**Shop** (`10075:2364`) — heading at (34, 101), then four link columns plus a promo card:

| Column | Sample children |
| --- | --- |
| whites + | — |
| reds + | Pinot Noir, Shiraz, Cabernet… |
| Beer + | Lager, Pale Ale, IPA… |
| beyond + | Spirits, Liqueurs, Aperitifs… |

Column titles all sit on y247; link lists all start on y290 with a 21px pitch. The four column starts (34 / 319 / 599 / 815) are **not** on a uniform pitch — the gaps between content boxes are 125 / 128 / 148, i.e. hand placement against auto-width text. Reproduced as max-content columns on a single 131px gap, which is the value whose worst column start is closest (within 9px).

Promo card (1071, 232) 335 × 241, flush to the 34px right gutter, with the standard `wc-button` centred on it in both axes; image `wine-crush-shop-menu.png` (landscape).

**Info** (`10075:2000`) — the shop panel mirrored: portrait on the **left**, copy on the right.

- Portrait `wine-crush-info.png` at (34, 77) 293 × 402.
- Right column left-aligned on **x1105** — the left edge of the header's right-hand nav group ("journal"), *not* under the "info +" trigger at x1197.
- Content is paragraph-then-button, twice; it is not a heading followed by a list of buttons.
- Body copy is held to a **30ch** measure (288px) rather than the 301px column, because the artboard's widest line is exactly 30 characters and the extra 13px would pull one more word onto every line and lose the drawn breaks.

| Anchor | Box |
| --- | --- |
| "Info" heading | 1105, 101 |
| body 1 (4 lines, 17px pitch) | 1105, 178 · 289 × 68 |
| button "about us" | 1105, 262 · 107 × 30 |
| body 2 (3 lines) | 1105, 337 · 289 × 51 |
| button "shipping & faq's" | 1105, 405 · 172 × 30 |

Below 1280 the panels keep their shape but stop holding the artboard's absolute offsets: the four columns carry merchant link text, so they wrap rather than push the promo card off the gutter.

---

## 7. Responsive UX

The Figma file contains **no mobile or tablet artboards** — every frame is 1440px wide. The rules below are a derived system, not extracted values, and are recorded as an implementation decision in `CONTEXT.md`.

### Breakpoints

| Name | Range |
| --- | --- |
| Mobile | ≤ 749px |
| Tablet | 750–989px |
| Desktop | ≥ 990px |

Dawn's existing 750px / 990px breakpoints are reused rather than introducing a competing set.

### Gutters & container

| Viewport | Gutter | Container |
| --- | --- | --- |
| Mobile | 18px | fluid |
| Tablet | 18px | fluid |
| Desktop | 18px | fluid to 1404px, then capped and centred |

The 18px gutter is constant across breakpoints — it already reads as a mobile-scale margin, so it needs no reduction.

### Type scaling

Display type is fluid via `clamp()`, anchored to the Figma value at 1440px:

| Style | Mobile | Desktop |
| --- | --- | --- |
| Display XL | 56px | 150px |
| Display L | 52px | 120px |
| Display M | 32px | 62px |
| Body L | 15px | 18px |
| Tab / Eyebrow | 14px | 18px |
| Blog title | 14px | 16px |
| Button | 13px | 14px |
| Nav | 13px | 13px |
| Body S | 12px | 12px |

Body copy at 12–14px does not scale down further — it is already at the accessibility floor.

### Layout behaviour

| Section | Tablet | Mobile |
| --- | --- | --- |
| Hero | Full-bleed, min-height 70vh | Full-bleed, min-height 80vh; logo scales to ~60% |
| Product slider | 2.4 cards visible | 1.3 cards visible, free-swipe |
| Product tabs | Horizontal scroll if overflowing | Horizontal scroll, no wrap, edge-fade |
| Journal / image grid | 2 columns | 1.2-card horizontal slider |
| Bundle band | Photos move into a 2-column collage around the copy (§ 13) | Same collage |
| Membership | Panels stack — image above, content below | Same, image 16:9 crop |
| Brand story | Circular image centred, text stacks | Text stacks, circular image scales to 70vw |
| Footer | Nav pills wrap to 2 rows | Nav pills wrap, centred |
| Band radius | 39px | 24px |

### Navigation behaviour

| Viewport | Behaviour |
| --- | --- |
| Desktop (≥ 990px) | Hover/click opens the full-width slide-down mega menu |
| Tablet & mobile (< 990px) | Hamburger opens a full-height drawer; "Shop" and "Info" push a second-level drawer with a back affordance |

The mobile drawer is a **push/slide stack**, not a shrunken mega menu — see `CONTEXT.md` § mobile drawer architecture.

### Motion

| Interaction | Spec |
| --- | --- |
| Mega menu open | `transform: translateY()` + opacity, 320ms `cubic-bezier(.22,.61,.36,1)` |
| Header background transition | `background-color` 240ms ease |
| Sticky logo reveal | opacity + 8px translateY, 240ms ease |
| Drawer slide | 280ms `cubic-bezier(.22,.61,.36,1)` |
| Button hover | 200ms ease |

All motion is suppressed under `prefers-reduced-motion: reduce`, falling back to instant state changes.

---

## 8. Icons

Icons are taken from the Figma exports and the existing `wine-crush-` assets. No icon library is introduced.

| Icon | Spec |
| --- | --- |
| Cart | 16 × 16 glyph inside a 28 × 28 outlined circle |
| Slider next/prev | 52px rule + 13 × 13 chevron |
| Bullet separator | 5 × 5 filled circle |
| Brand mark | 44 × 61 (story section) |
| Social | 31 × 31 (Instagram, Facebook) — sourced from Dawn's social settings |
| Primary logo | 706 × 174 (hero), 438 × 108 (footer), 122 × 30 (sticky header) |

Logo assets available: `wine-crush-logo.svg` (vector — used at both header and hero scale), `wine-crush-logo-lg.png`, `wine-crush-logo-dark.png`.

---

## 9. Sign-up form & Coming Soon

Extracted from Figma **`10036:30` "Coming Soon Page"** in file **`zHDSJoUnvvQwNeM1p2IWLH`** ("Wine Crush"): https://www.figma.com/design/zHDSJoUnvvQwNeM1p2IWLH/Wine-Crush?node-id=10036-30. The older copy (`aHXTROQq2Is1ltbfU5UdUy`) denies access to this node, so use this file key. There is no mobile artboard; mobile values are derived (marked).

### Node map

| Node | Name | Box (x, y, w × h) |
| --- | --- | --- |
| `10036:30` | Coming Soon Page (frame) | 0, 0, 1440 × 884, fill Crimson `#6A111E` |
| `10036:148` | Background photo | 0, 0, 1440 × 884; image drawn at 111.73% × 101.58%, offset −3.69% x; `rgba(0,0,0,.37)` overlay → `assets/wine-crush-coming-soon.jpg` |
| `10036:150` | Secondary Logo_Winecrush_Ivory (stacked wordmark) | 589, 342, 262 × 199 → `assets/wine-crush-logo-secondary.svg` (fill → `currentColor`) |
| `10036:160` | "coming" | 459, 430, 65 × 23 |
| `10036:162` | "soon" | 916, 430, 44 × 23 |
| `10036:163` | Description | 503, 665, 435 × 54, centred |
| `10068:411` | Form group | 608, 744, 224 × 30 |
| `10036:168` | Input pill | 608, 744, 181 × 30 |
| `10036:167` | Placeholder "name" | 682, 750 (centred in the pill) |
| `10036:170` | Button pill | 800, 744, 32 × 30 |
| `10036:171` | "right-up" icon (PNG in Figma) | 806, 748, 21 × 21 → redrawn as `assets/icon-wc-arrow-up-right.svg` (`currentColor`) |

### Page layout

- No header or footer: the frame is a standalone page. `layout/theme.liquid` skips both section groups on `page.coming-soon`.
- The logo's centre (342 + 199/2 = 441.5) is the frame's vertical centre (884/2), so the page is a `1fr / auto / 1fr` grid at `100svh` with the masthead in the middle track.
- "coming" ends 65px before the logo (589 − 524) and "soon" starts 65px after it (916 − 851); both are vertically centred on it (430 + 23/2 = 441.5).
- Description starts 124px below the logo (665 − 541). Form starts 25px below the description (744 − 719).

### Typography

| Element | Font | Size / leading | Case | Colour |
| --- | --- | --- | --- | --- |
| coming / soon | IBM Plex Mono **SemiBold 600** (registered in `style.css` for this) | 18px / normal (23px box) — `--text-tab` | UPPER | Ivory |
| Description | IBM Plex Mono Regular | 14px / normal — `.wc-lede` | UPPER | Ivory |
| Placeholder | IBM Plex Mono Regular | 14px — `--text-lede` | UPPER | Ivory (full ink, not muted) |

The 435px measure is what breaks the default copy after "BEYOND," and "OPENING", as drawn.

### Form component (`snippets/wc-signup-form.liquid`)

| Part | Desktop / tablet | Mobile ≤ 749 (derived) |
| --- | --- | --- |
| Input pill | 181 × 30, 1px border, r37, text centred | 240 × 44 (shrinks to fit its container), 16px text (no iOS zoom) |
| Button pill | 32 × 30, 1px border, r37 | 46 × 44 |
| Icon | 21 × 21 ↗ | 24 × 24 |
| Gap | 11px | 11px |
| Error (not in Figma) | Body S, centred, hangs 8px below the row, max 440px; out of flow, so it never moves the page | same |
| Loading (not in Figma) | row at 60% opacity, arrow drifts 2px up-right on a 900ms loop | same |
| Success (not in Figma) | `.wc-lede` 14px caps, replaces the form | same |

- No visible labels, step counter or Back control, because the design has none. Each input has a visually hidden `<label>` (the placeholder text), step status goes to a visually hidden `aria-live` line ("Step 2 of 3"), and the icon button's `aria-label` switches between the Next and Submit labels.
- Step change: the new field fades in over 240ms (none under reduced motion). Backspace in an empty field returns to the previous step.
- Hover / focus on the button: fill inverts, per the site's button convention (§ 3).

### Variants

Only the ink changes; geometry, type, spacing and behaviour are shared.

| Variant | Used by | Stroke, text, placeholder, focus, error | Fill | Hover / focus (button) |
| --- | --- | --- | --- | --- |
| `wc-signup--light` | Coming Soon, over the darkened photo (as drawn in `10036:30`) | Ivory `#F4E7D4` | transparent | Ivory fill, Claret arrow |
| `wc-signup--dark` | 5% off panel (Sorbet surface, Claret page) | Deep Claret `#481111`, the panel's heading/copy ink and the colour of the "join the crush" pill it replaces (`10055:493`, 153 × 30, 1px, r37) | transparent | Claret fill, Sorbet arrow |

The dark variant is deliberately not an inversion: it is the Coming Soon component redrawn in the 5% off panel's own ink, so it reads as that panel's CTA. Invalid fields double their stroke (inset 1px) rather than change colour, which would fail contrast on Sorbet.

### Responsive (measured live, no horizontal overflow at any width)

| Viewport | Logo | Flank gaps | Input | Button |
| --- | --- | --- | --- | --- |
| 1440 × 884 | (589, 343) 262 × 199 | 65 / 65 | (608, 745) 181 × 30 | (800, 745) 32 × 30 |
| 1366 / 1280 / 1024 / 768 | 262 wide, centred on the viewport midline | 65 / 65 | 181 × 30 | 32 × 30 |
| 430 | 198 wide (46vw) | 18 / 18 | 240 × 44 | 46 × 44 |
| 390 | 179 | 18 / 18 | 240 × 44 | 46 × 44 |
| 375 | 173 | 18 / 18 | 240 × 44 | 46 × 44 |

Mobile keeps "coming · logo · soon" on one row, because that row is the design; the logo gives up width to make room. The bundled photo is positioned at `31.5% 0` on desktop (reproducing the artboard crop) and `48% 0` on mobile, so the same bottles sit behind the logo. Merchant images use their Shopify focal point instead.

### 5% off form, measured (dev)

| Viewport | Input | Button | Row span | Panel content box |
| --- | --- | --- | --- | --- |
| 1440 | 181 × 30 | 32 × 30 | 236–460 | 88–608 |
| 1366 | 181 × 30 | 32 × 30 | 218–442 | 84–576 |
| 1280 | 181 × 30 | 32 × 30 | 198–422 | 80–540 |
| 1024 | 181 × 30 | 32 × 30 | 137–361 | 67–431 |
| 768 | 181 × 30 | 32 × 30 | 265–489 | 18–735 |
| 430 | 240 × 44 | 46 × 44 | 67–364 | 18–412 |
| 390 | 237 × 44 | 46 × 44 | 48–342 | 18–372 |
| 375 | 222 × 44 | 46 × 44 | 48–327 | 18–357 (pill shrinks to fit) |

---

## 10. Collection page

Figma **`10008:35` "Shop"** (1440 × 3748) in file `zHDSJoUnvvQwNeM1p2IWLH`. Desktop only; no mobile artboard (mobile values are derived and marked).

### Node map

| Node | What | Box (x, y, w × h) |
| --- | --- | --- |
| `10008:339` | Header (sticky) | 0, 0, 1440 × 57, **Coral `#EE3D40`** in this frame (see `CONTEXT.md` open question 8) |
| `10075:2520` | Collection nav | 280–1161 × 174, 62 tall |
| `10033:698` / `:697` / `:699` | Filter labels "varietal +", "price +", "region +" | x34; y418 / 445 / 472 |
| `10033:680` | Product card (Group 111, first of 16) | 237, 400, 285 × 434 |
| `10033:497` | Card fill | Crimson `#6A111E`, r10 |
| `10033:501` | Card photo | 244, 411, 272 × 409, cover |
| `10033:505` | Title | 254, 418, w 180 (wraps) |
| `10033:509` | Price | 254, 804 |
| `10033:517` / `:513` | "add +" pill / label | 447, 794, 61 × 26 / text at 458 |
| `10058:578` | 5% off panel (the home section again) | coral lip y2343, sorbet 18, 2370, 1404 × 759 |
| `10072:663` | Footer | 0, 3291, 1440 × 457 |

### Layout (1440)

```
header 58 ─┐
           116  nav (Dahlia 62, centred row, 76px gaps)          y174
           164
 x34 filters │ x237 ── 4 × 285 cards, 15px gaps ── x1422          y400
             │ rows at a 449px pitch (434 + 15)
           189  sorbet panel (coral lip 27px above it)            grid end + 189
           162  footer                                            panel end + 162
```

| Measure | Value | Source |
| --- | --- | --- |
| Header → nav text box | 116 (`padding_top`) | 174 − 58 |
| Nav box → grid | 164 (`padding_bottom`) | 400 − 236 |
| Filter column | 204px + 15 gap, content inset 16 (x34) | 237 − 18 − 15 |
| Filter labels → grid top | 18 | 418 − 400 |
| Grid | 4 × 285, 15 gap both ways | 537 − 522; 849 − 834 |
| Grid → 5% off sorbet panel | 189 (membership `padding_top` 188 on this template) | 2370 − 2181 |
| 5% off → footer | 162 (membership `padding_bottom`) | 3291 − 3129 |

### Collection nav

Dahlia Medium Condensed 62px (`.wc-display-m`), leading 1, Ivory. Current = full Ivory, underlined (`text-decoration-thickness` / `text-underline-position: from-font`, as Figma's "decoration-from-font"). Others = `--color-muted` (Ivory 66%). Hover = full Ivory. Gap `clamp(24px, 5.28vw, 76px)` (76 at 1440). The row never wraps: centred while it fits, scrolls horizontally from the first item when it doesn't (≤ 390px).

### Filter column

| Element | Style |
| --- | --- |
| Group label ("VARIETAL +") | IBM Plex Mono 14px caps (`--text-lede`), 18px line, 27px pitch. Closed = 66% Ivory; open, active or hover = Ivory + underline (from-font). Active groups show "(n)". |
| Values (derived; Figma draws no open state) | 12px caps (`--text-meta`), 8px apart, 12px below the label; a 10 × 10 1px box (r2) that fills when checked; the count right-aligned at 66%; zero-count values at 40% and disabled. Swatch filters draw a 12px dot. |
| Price (derived) | Two 30px outlined pill fields ("From", "To") with the currency symbol. |
| Active filters (derived) | 25px outlined pills, 10px caps, "×"; hover inverts; "Remove all" 10px caps link. |

### Product card (collection)

Same component as the home slider (`wc-product-card`, `layout: 'grid'`). 285 × 434 Crimson, r10; padding 18 / 14 / 14 / 17; the photo is inset 11 / 6 / 14 / 7 (cover) behind the text. Title 12px caps Ivory, 180px measure, top-left. Price 12px caps Ivory 75% (`--color-muted-strong`), bottom-left. "add +" = `.wc-button--card`: 26px tall, 13px label, 10px inset (61px wide), bottom-right. Whole card links to the product; the pill adds to cart.

### Not drawn in Figma (derived, in the Wine Crush language)

- **Sort** — not in the design, so no sort UI. An incoming `sort_by` is preserved through filtering.
- **Result count** — not drawn; kept as a visually hidden live region ("11 of 12 products").
- **Pagination** — 16 products fill the artboard; with more, numbered pages: 14px, current = 30px outlined circle, prev/next = the product slider's 52px arrow.
- **Empty state** — "No products found" in Display M + a "Remove all" pill, centred.
- **Mobile / tablet (< 990)** — the column becomes a "filter +" pill above the grid that opens a full-height Claret drawer from the left (min(420px, 100%), 280ms, scrim `--overlay-menu`): header "Filter" + live count + ✕, all groups expanded, pinned "Apply" pill.

### Responsive (measured live)

| Width | Grid | Card | Filters | Nav |
| --- | --- | --- | --- | --- |
| 1440 | 4 col | 285 × 434 (281 with a 15px classic scrollbar) | column | 62px, fits |
| 1366 | 4 | 263 × 400 | column | fits |
| 1280 | 4 | 241 × 367 | column | fits |
| 1024 | 3 | 241 × 367 | column | fits |
| 768 | 3 | 229 × 349 | drawer | fits |
| 430 | 2 | 190 × 289 | drawer | fits |
| 390 | 2 | 170 × 258 | drawer | scrolls |
| 375 | 2 | 162 × 247 | drawer | scrolls |

Card ratio (285 : 434) and the 61 × 26 pill hold at every width; no horizontal overflow anywhere.

---

## 11. Product page

Figma **`10050:30` "Product Template"** (1440 × 3079), file `zHDSJoUnvvQwNeM1p2IWLH`. The header in this frame is Coral, like the Shop frame (open question 8 in `CONTEXT.md`).

| Element | Node | Spec (1440) |
| --- | --- | --- |
| Photograph | `10060:37` | 607 × 909 from y0 (under the header), x799…1406 — 34px off the right edge. Built as a 607 × 851 box below the 58px bar, `contain`, bottom-aligned, so other pack-shot ratios never crop. |
| Tags | `10071:561` / `:564` | y165: 19px Sorbet outlined pills, 10px caps, label 12px in, 8px apart — varieties then region |
| Title | `10060:39` | Dahlia 80 / 1, Ivory, 516 measure, y198 (`--text-display-product`, 44px min) |
| Price | `10065:48` | 22px caps, y377 |
| Add to cart | `10060:42` | 153 × 31 pill, 16px label, 14px in (`.wc-button--lg`), y455. Quantity stepper (not drawn) sits after it. |
| "Why we love it:" | `10065:51` | Dahlia 24 / 1.05, Sorbet, y548 |
| Description | `10071:559` | 18 / 1.05, 499 measure, y587 |
| Spec table | `10065:49`… | 504 wide, 24px rows between 1px Ivory rules (first at y687), 12px caps; values from x198 (142px label column) |
| Rating | `10066:70`–`:74` | 13px stars on a 13px pitch, the fifth cut (4.5) |
| "you may also like:" | `10066:104` | 18px caps centred, y947; then the home product slider (331 × 434 cards) |
| 5% off | `10066:106` | sorbet panel 206px under the cards; footer 162px after it |

Variant picker (not drawn): Dawn's picker restyled — legend 12px caps muted, values 25px outlined pills (filled Ivory when selected, struck at 40% when unavailable); dropdown style is a 30px outlined pill select.

Measured live at 1440: tags y165 · title (56, 198) 516 × 160 · price y377 · button y455 × 31 · heading y548 · copy y587 · table y687.

Below 990 (derived): the photograph moves above the copy, capped at 70% of the viewport height; 18px gutters.

---

## 12. Cart drawer

Figma `10071:439` "Cart Popup" is the Reserve Cellar cart (screenshot `10071:557`) placed **472px wide** at the right of the 1440 artboard, with the brief "copy the exact cart popup functionality… age verification exactly like reserve cellars". **The drawer is built to that frame as drawn** — its own palette and face, not the site's (client, 2026-09-19: "Cart Drawer still is not as per design").

### Palette and face — the site's own

The drawer is Figma `10071:439`'s **geometry** in the **site's palette** (client, 2026-09-28: it has to read as the same theme as the rest of Wine Crush). Nothing in it is particular to the component:

| Part | Token |
| --- | --- |
| Panel | `--color-page` (Claret) |
| Type | `--color-text` (Ivory), `--font-body` (IBM Plex Mono) |
| Secondary type | `--color-muted` (Ivory 66%) |
| Promo box, saved cards, product media | `--color-surface-card` (Crimson) |
| Rules, switch tracks | `--color-divider` (Ivory 18%) — the nav drawer's divider |
| Delivery progress | `--color-surface-accent` (Coral) |
| Errors | `--color-accent` (Sorbet) |
| Buttons, pills | the shared `.wc-button` primitive |

Product titles are caps, as on the cards and the cart page. There are no drawer-only colour or font settings any more — the earlier "Drawer style" group was removed, so the brand palette drives it like everything else.

### Geometry (measured off the frame at 1440; phones use the reference's own 1× values)

| | Desktop (1440) | Phones |
| --- | --- | --- |
| Panel | 472 incl. a 1px rule, right edge | viewport − 62px |
| Header ("close cart") | 47 + 1px rule, 20px inset | 42, 16 |
| Gutter / row padding / image↔copy | 30 | 24 |
| Promo box | 58 tall, r8, 15 / 19 centred; links underlined | same, 14 / 19 |
| Progress bar | 5px, r3, 10 below the box | same |
| Product image | 102 × 126, square corners, `contain` | 82 × 100 |
| Title / "$x each" / line total | 16 | 15 |
| Quantity pill | 80 × 26, r-pill, − n + | same |
| Subtotal | caps 10 tracked + 22px amount, right | 20px amount |
| Switches | 34 × 20, 16px knob, 16px label, right-aligned row | wraps to two rows below ≈ 380px |
| Date of birth | 16 label, three 41px underlined selects 10 apart | same |
| Confirmation | 13px checkbox + 16 / 20 statement | same |
| Actions | "continue shopping" left; checkout pill 50 tall, r25 | pill 44 tall |
| Every tracked caps run | 10px / 0.16em — "close cart", "subtotal", "continue shopping", "checkout" (cap height 7 on the frame) | same |

- **Motion.** `cart-drawer.js` only toggles `.active`, so the panel animates both ways from CSS: 280ms `--cart-motion` / `--cart-ease` on the transform, the same on the scrim's opacity, and `visibility` held by `transition: visibility 0s linear var(--cart-motion)` so the panel stays on screen until the slide-out ends (it used to vanish on the first frame). `.active` sets `transition-delay: 0s` so opening is immediate. Reduced motion collapses `--cart-motion` to 1ms (`cart-drawer.js` traps focus on a `transitionend`, so one must remain).
- **Scrim.** `--overlay-menu` (black 30%), and it needs an explicit `display: block`: base.css hides every empty `div`, so without it there was no scrim and no click-outside-to-close.
- **Scrollbar.** The scrolling body uses `scrollbar-width: thin` with `scrollbar-color: <25% tint> transparent` (brightening to the 50% rule on hover), plus `::-webkit-scrollbar` at 4px for older Safari; the gift/notes textareas match. Windows reserves ~10px for it; macOS overlay scrollbars take none.
- The circles' arrow is the site arrow reversed; its 1.5 stroke on a 52-unit box is thickened to 6 so it reads solid at 10–12px.
- **No remove link and no taxes line**, as the reference: `data-min` is emitted as 0 for the standard minimum of 1, so "−" at 1 removes the line through Dawn's own quantity flow. A variant with a real minimum above 1 cannot step to 0 and keeps a remove link.
- Gift / notes: switch reveals a textarea (r8) and a full-width confirm pill; once saved the text shows as a 15%-tint card that reopens for editing. "Add delivery notes" needs Dawn's Theme settings › Cart › "Enable cart note" (now on).
- Empty: "Your cart is empty" (24px) + "continue shopping" pill, centred.

---

## 13. Mobile & tablet system (fix pass)

There are still **no mobile artboards** (re-checked: all 16 page frames are 1440/1560). The values below are derived from each desktop composition and replace earlier ones where noted.

| Area | Rule |
| --- | --- |
| Band cap (hero + capped bands) | `--band-overlap: clamp(48px, 8.96vw, 129px)` — 129 at 1440, 48 on phones (was a fixed 129 that covered the last 129px of short mobile bands) |
| Header bar < 990 | burger · logo · cart only; every nav link lives in the drawer |
| Nav drawer head | back · logo · close on the header's grid; wordmark 24px tall, exactly where the header shows it |
| Nav drawer rows | one rule for every equivalent row: 15px top/bottom, 0 sides, 18px text caps, 1px Ivory-18% divider — 51px rows at x18 on every level |
| Hero < 990 | 3:4 (tablet) / 375:640 (phones, ≈ 80% of the viewport); lede top 36% / 30%; wordmark 78vw, bottom-anchored `calc(--band-overlap − 7.4vw)` so 38.5% of it sits below the band edge, as at 1440 (67 of 174) |
| Home product card | image box fixed 324:485 (`contain`, bottom-aligned, lifted 20.82% of its own height = the 101px overhang); `padding-top: calc(116.02% − 16px)` reserves the bottle; 331:434 is a minimum — narrow cards grow |
| Collection card | ≥ 280px card: the Figma overlay (title over the photo's top, photo inset 11/6/14/7). < 280px: the photo takes its own row between title and price (`@container wc-card`) |
| Build your bundle < 990 (was < 750; widened with About Us, § 14) | the band becomes a 2-column grid; the four photographs join it (`display: contents` scatter): 78% / 82% (+74 down) above the copy, 52% / 52% below, each capped at its 1440 width (255 / 271 / 163 / 163); full opacity, desktop rotation; bottom padding = rhythm + `--band-overlap` |
| Footer logo | base `min(438px, 70%)` at every width (was 100% on phones); the vector wordmark as a Crimson CSS mask (sharp at any density) |

Measured (live, headless Chrome at exact widths): no horizontal overflow at 1440 / 1366 / 1280 / 1024 / 768 / 430 / 390 / 375; hero wordmark 38–39% below the band at every width; no product-card text over its image; bundle CTA clear of the cap at every width.

---

## 14. About Us page

Figma `10058:642` "About Us" (file `jQF089DRFRk40Wk3K24jMV`), 1440 × 5453. Template `templates/page.about-us.json`. Built from existing sections — only "How to shop." is new.

### Node map

| Band | Nodes | y (1440) | Built with |
| --- | --- | --- | --- |
| Header | `10075:1872` (Coral bar, 0.7px Ivory rule) | 0–57 | global header — Coral on every page but home (`.wc-header--page`) |
| Hero photo, 25% overlay | `10067:241` | 0–898 | `wc-hero`, layout **Page heading** |
| Eyebrow "about wine crush" 18px caps Sorbet | `10067:246` | 656 | hero `eyebrow` |
| Title, Dahlia 110 Ivory, one line 954 wide | `10067:244` | 698–808 | hero `heading` → the page `h1` |
| Claret cap r39 | `10067:242` | 769–898 | hero's `::after` (`--band-overlap`) |
| Intro heading Dahlia 62, w441, 2 lines | `10067:248` | 1174 | `wc-bundle-band` (Claret, no cap), heading size **m**, width 450 |
| Intro body 16/1.42, w595, 2 paragraphs + blank line | `10067:250` | 1365 | body size **m** (`62ch`) |
| Scatter 255×337 / 271×257 / 163×169 ×2, r10 | `10067:251`–`254` | 1465 / 917 / 986 / 1660 | figure blocks, same x/width as the home bundle; y 53.09 / 1.78 / 8.24 / 71.35 % |
| "How to shop." Dahlia 120, lh .95, x40 | `10067:261` | 1967 (overlaps panels 5px) | `wc-split-panels` (new) |
| Panels 702×717 each in a 1404 row, r20 outer, 0.7px Ivory, overlays 60% / 40% | `10067:266`, `10067:259` (Sorbet `10067:258` fully covered) | 2076–2793 | panel blocks |
| Panel title 62 → 23 → 12/1.42 w346 → 23 → 30px pill | `10067:267/263/264`, `10067:271/269/270` | 2340 / 2425 / 2499 | centred in each panel |
| Journal cards 4 × 339×498 | `10067:277`–`295` | 3040–3538 | `wc-card-grid` (blog), as home |
| "For the curious…" 62 Sorbet w833 + "our journal" pill | `10067:285–287` | 3640 / 3792 | `wc-statement` start/accent, as home |
| Closing photo 1440×999, 25% overlay | `10067:363` | 4133–5132 | `wc-statement`, background **Image**, tucked |
| Icon 44×61 Ivory | `10068:366` | 4409 | statement `icon` |
| Statement Dahlia 62 w598 | `10068:364` | 4498 | statement heading |
| Footer (rises 136px over the photo) | `10072:1003` | 4996–5453 | global footer; overlap = `--band-overlap` (129) |

### Built at 1440 (measured live)

eyebrow 656 · h1 698 · intro heading 1176 · body 1367 (8 lines, as Figma) · scatter 1467 / 917 / 986 / 1662 · "How to shop." 1969 · panels 2078 (702 × 717; title 2342, copy 2427, pill 2501) · cards 3041 · journal intro 3641 · closing 4135 (icon 4410, heading 4501) · footer 5005 · page 5463. Every anchor is within 2px of Figma; the footer starts 7px lower because it overlaps 129 (`--band-overlap`) instead of 136, which is the 10px page-height difference.

### New tokens / options

- `--text-display-page: clamp(44px, 7.64vw, 110px)` — the page-hero title.
- `--text-body-m: clamp(14px, 1.12vw, 16px)` + `.wc-body-m` — long-form 16px copy.
- Hero `layout` (wordmark | heading), `eyebrow`, `heading` (blank → page title). The heading layout never grows past the viewport — `height: min(100vw / ratio, max(100svh, 480px))` — so the title is always in the first screen (it is at y698–808 on the 898px artboard, below the fold on 800px-tall laptops). Title block is bottom-anchored at `--band-overlap − 0.355 × size`, so 39 of its 110px sit below the band edge at every width; wraps (balanced) and grows upwards on phones.
- Bundle band `heading_size` (xl | m), `heading_width`, `body_size` (s: 12px/477 | m: 16px/62ch). Claret bands get an Ivory heading. `p + p` gets one blank line.
- Statement `icon`, `background` (none | image), `background_image`, `overlay_opacity`, `tuck_under`. With an image: min-height 1440:999 (≥ 560px below 990), copy centred in the visible part and lifted by `padding_bottom`; `padding_top` becomes the space above the image; tucked = the next band (footer) rises `--band-overlap` over the foot.
- Placeholder art until the merchant picks images: `wine-crush-about-hero.jpg` (Figma crop of `10067:241`), `wine-crush-about-closing.jpg`, `wine-crush-about-shop-online.jpg`, `wine-crush-about-shop-in-store.jpg`.

### Responsive (derived — no mobile artboard)

| Width | Behaviour |
| --- | --- |
| ≥ 990 | artboard composition, fluid type |
| 750–989 | hero 3:4; intro photos move into the collage (2 above, 2 below the copy); panels stay 2-up, min-height 60vw; closing photo ≥ 560px |
| < 750 | hero 375:640, title on two balanced lines; panels stack (outer radii top / bottom, min-height 118vw); card grid is the home rail |

No horizontal overflow at 1440 / 1366 / 1280 / 1024 / 768 / 430 / 390 / 375.

---

## 15. Shipping & FAQs page

Figma `10058:711`, 1440 × 2019. Template `templates/page.shipping-faq.json`, one new section `wc-faq`. Everything is centred in the container; there is no hero.

| Element | Node | y (1440) | Spec |
| --- | --- | --- | --- |
| Eyebrow "the finer details" | `10066:200` | 234 | 18px caps Sorbet |
| Heading | `10066:199` | 286–410 | Dahlia 62, 500px measure, two lines, Ivory. The page's `h1` (blank → page title) |
| Question column | `10066:203`–`231` | 514–802 | 504 wide, centred (x468); nine rows on a 32px pitch (6 + 18 + 6 + rule) between **2px Sorbet-50% rules** (`--color-hairline`); label **14 / 18 Ivory**; **Ivory** 18px "+" 12px inside the column's right edge |
| Footnote | `10066:240` | 906 | 14 / 18, 380px measure, centred |
| Photograph | `10066:136` | 1099 | 352 × 299 ellipse (`border-radius: 50%`, `cover`) |
| Footer | `10072:1088` | 1562 | global |

- Rows are native `<details>` / `<summary>`: they open with no JavaScript, and answers are 14 / 1.42 in `--color-muted-strong`.
- `<wc-accordion>` (`assets/wc-faq.js`) tweens the answer's height over 280ms `--ease-out-soft` (open: set `[open]`, then 0 → measured height; close: current height → 0, then drop `[open]`). A click mid-animation reverses from wherever the row is. The marker follows `.is-open` / `.is-closing`, because a closing row is still `[open]`; with reduced motion, or no Web Animations, the native jump stands. The design shows every row closed and draws no answers, so each answer is the merchant's text on its own block.
- Built at 1440 (measured live): eyebrow 235 · heading 287 · column 515–804 · footnote 908 · photograph 1101 · footer 1564 · page 2022 (Figma 2019) — every anchor within 3px.
- Responsive (derived): below 990 the artboard gaps give way to the shared rhythm; the 504 column and the 380 footnote become full-width inside the gutters and the circle is `min(352px, 70%)`. No horizontal overflow at 1440 / 1366 / 1280 / 1024 / 768 / 430 / 390 / 375.

---

## 16. Bundle builder (Build Your Bundle)

**The bottles on offer belong to the pack, not the product** (client, 2026-09-29): every variant carries its own `custom.bundle_products` alongside its `custom.bundle_bottles_quantity`. Each pack's list is rendered once and hidden until that pack is chosen, so switching packs needs no request; choosing a pack clears the selection, because the lists are independent.

Figma `10072:1173`, 1440 × 3572. The product template for **Bundle Packs** (`templates/product.bundle-packs.json` → `sections/wc-bundle-builder.liquid`), then the membership band and the footer.

### Node map

| Element | Node | y (1440) | Spec |
| --- | --- | --- | --- |
| Eyebrow | `10072:1471` | 199 | 18px caps with 5px dots — the bundle band's eyebrow |
| Heading | `10072:1470` | 248 | Dahlia 150 (`wc-display-xl`), centred. The page's `h1` |
| Arrow | `10075:1606` | 468 | 26 × 52 — the site arrow turned a quarter-turn |
| Card grid | `10074:1478`… | 589 | 285 × 434 Crimson cards, r10, 3 up with 15px gutters (885 wide) |
| Card internals | `10074:1479`–`:1485` | — | photo inset 7 / 11 (272 × 409), title 12px caps on a 180 measure at +17 / +18, price at +404, "add +" 61 × 26 at +210 / +394 |
| Panel | `10074:1552` | 589 | 504 × 764, Crimson, r10, 15px right of the grid; inset 24 (18 above the title) |
| "Your Bundle:" | `10074:1559` | 607 | Dahlia 40 |
| Pack hint | `10075:1608` | 666 | **12px** caps, Sorbet 66% (`--color-accent-muted`) |
| Pack buttons | `10074:1563`–`:1571` | 695 | three 147 × 70, r10, 10 apart: **14px** count over a **22px mono** price (measured off the glyph runs — the price is IBM Plex Mono, not the display face). Chosen = Coral fill; the others are 1px Ivory outlines |
| Bottles hint | `10075:1610` | 788 | as the pack hint |
| Slot rows | `10075:1573`–`:1592` | 818–1140 | 2px Sorbet-50% rules; 44 tall empty ("select to add", Ivory 66%), 73 filled with a 46 × 69 thumb; index at +34, thumb +66, title +112 |
| Subtotal | `10075:1599` | 1272 | **14px** caps, right |
| Add bundle | `10075:1595` | 1299 | 219 × 31 large pill, right |
| Membership | `10072:1377` | 2167 | the existing 5% off band |

### Built at 1440 (measured live)

eyebrow 200 · heading 249 · arrow 468 · first card (18, 589) 285 × 434 · card title (+17, +18), price +404, "add +" (+210, +394) 61 × 26 · panel (918, 589) 504 × 764 · title 607 · hints 666 / 790 · packs 695 (145 × 70) · slots 820 · subtotal 1272 · CTA 1298 · membership 2169 · page 3548 (Figma 3572). Every anchor within 2px.

### Responsive (derived — no mobile artboard)

The cards stay **three across for the whole desktop range**, as drawn; the panel gives up width instead of the grid giving up a column (`--bundle-panel-width: clamp(330px, 35.9%, 504px)` — 504 of the artboard's 1404 container). Each card is a container query (`container: wc-card`), so a narrow one falls back to the collection card's stacked layout.

| Width | Columns × card | Panel |
| --- | --- | --- |
| 1440 | 3 × 285 (the artboard) | 504, sticky under the header |
| 1366 / 1280 | 3 × 269 / 251 | 477 / 447, sticky |
| 1024 | 3 × 196 | 355, sticky |
| 768 | 2 × 359 | full width, above the cards |
| 430 / 390 / 375 | 1 × 394 / 354 / 339 | full width, above the cards, plus the phone summary bar |

The phone bar (count + add, fixed to the foot, safe-area padded) is **not in Figma** — there is no mobile artboard and the panel scrolls away above nine-plus cards. It submits the panel's own form (`form="…"`), so there is still one form and one cart path. Theme setting: "Show a summary bar at the foot of small screens".

No horizontal overflow at 1440 / 1366 / 1280 / 1024 / 768 / 430 / 390 / 375.

---

## 17. Journal — listing and article

Two frames, and the brief's node ids are the other way round: **`10047:175` "Journal" is the listing** (1440 × 3895) and **`10053:93` "Journal Template" is the article** (1440 × 4089). Both run on Shopify's blog (`blogs/journal`).

### Listing (`sections/wc-main-blog.liquid`)

| Element | Node | y (1440) | Spec |
| --- | --- | --- | --- |
| "journal" pill | `10071:571` | 186 | 59 × 19, 10px caps Sorbet, Sorbet hairline — the card's date pill standing alone |
| Eyebrow | `10053:34` | 234 | 18px caps Sorbet |
| Heading | `10052:30` | 286 | Dahlia 62 on a 598 measure, three lines (greedy wrap, no balancing), centred. The page's `h1` |
| Sort | `10053:88` + `10055:215` | 538 | "sort by" 14px caps Ivory-66% with a 7px chevron |
| Cards | `10053:39`… | 646 | the shared 339 × 498 card, four across, 16px gutters, three rows |
| "see more" | `10071:438` | 2269 | 130 × 30 pill, centred |
| Membership / footer | `10058:588` / `10072:833` | 2490 / 3438 | the existing bands |

Measured live at 1440: pill 186 · eyebrow 239 · heading 286 · sort 542 · grid 645 · card 339 × 498 — every anchor within 1px.

### Article (`sections/wc-main-article.liquid`)

| Element | Node | y (1440) | Spec |
| --- | --- | --- | --- |
| "back to journal" | `10055:220` | 116 | 14px caps with a chevron, 19px inside the gutter |
| Date pill | `10055:232` | 269 | as the listing's pill |
| Title | `10055:227` | 310 | Dahlia 80 / 80 (`--text-display-product`) on a 677 measure, centred. The `h1` |
| Featured image | `10055:217` | 541 | 254 × 333, r10, `cover`, centred |
| Body | `10055:233` | 945 | 15 / 23 on a 551 measure, paragraphs one line (23px) apart, left-aligned in the centred column |
| "Crowd Favourites" | `10055:266` | 1721 | Dahlia 120 in **Coral**, centred — `wc-product-tabs` with a heading and its tab strip hidden |
| Product slider | `10055:241`… | 1859 | the home slider's 331 × 434 cards |
| Membership / footer | `10058:615` / `10072:918` | 2684 / 3632 | the existing bands |

Measured live at 1440: back 119 · pill 268 · title 309 (680 × 160) · image 540 (254 × 333) · body 944 (551 × 575 — the artboard's height exactly) · "Crowd Favourites" 1719 · page 4055 (Figma 4089).

The body is Shopify's own HTML, styled rather than rebuilt: headings (Dahlia), lists (Sorbet markers), links (underlined, Sorbet on hover), blockquotes (Sorbet rule), tables, `hr`, and images/video/iframes bounded to the column at r10 with their own proportions kept.

### Responsive (derived — no mobile artboard)

| Width | Listing | Article |
| --- | --- | --- |
| ≥ 990 | 4 cards across, artboard gaps | 551 body, 254 image |
| 768 | 2 across (358 cards) | unchanged measures inside the gutters |
| ≤ 749 | 1 across — at 375 the card is the artboard's own 339 × 498 | body full width, image `min(254px, 70%)` |

No horizontal overflow at 1440 / 1366 / 1280 / 1024 / 768 / 430 / 390 / 375.

---

## 18. Shopify's own pages (cart, page, policy, search, 404)

These have no artboard. They are built from the design system so they read as Wine Crush pages, with Shopify's content and behaviour untouched.

### The editorial treatment — `assets/wc-editorial.css`

One long-form implementation, shared by everything whose body the merchant writes:

| Class | Used by |
| --- | --- |
| `.wc-rte` | the Journal article body, page content, and anything else rendering `{{ … }}` HTML |
| `.wc-page` / `.wc-page__title` / `.wc-page__content` | the default page, 404 and search headers |
| `.shopify-policy__container` / `__title` / `__body` | Shopify's policy pages, which it renders itself with no section to hook into |

Type is the article artboard's: 15 / 23 on a 680px measure (551 on the article), paragraphs 23px apart, headings in Dahlia (62 / 32 / 24), Sorbet list markers, underlined links, Sorbet-ruled quotes, media bounded to the column at r10. Merchant copy wraps anywhere, so an address or URL can never push the page sideways.

### Pages

| Page | Section | Notes |
| --- | --- | --- |
| Cart | `wc-main-cart-items` + `wc-main-cart-footer` | Claret page, Crimson rows at r10 carrying the drawer's geometry (103 × 126 media, 30px gutters); the summary panel (472px, right) holds the subtotal, the gift / delivery switches and the age gate, then the checkout pill. Dawn's `cart.js` contract is kept exactly (`#main-cart-items`, `#main-cart-footer`, `.js-contents`, `#Quantity-N`, `#Subtotal`, `#checkout`). Rows fold to media + details with the controls and total beneath below 750. |
| Page / Contact | `wc-main-page` (+ `wc-contact`) | Centred title with the editorial body. The contact form uses the shared field style: caps label, underlined input, pill submit. |
| Policies | none (Shopify's own markup) | Styled through `.shopify-policy__*`; content stays Shopify-managed. |
| Search | `wc-main-search` | Centred field and count, then results in the collection grid — products use the collection card, articles the Journal card, pages a plain card — with the collection's pagination. |
| 404 | `wc-main-404` | Caption, display heading, one pill back to the collection. |

### Shared form style — `assets/wc-form.css`

`.wc-field` (caps label, underlined input, 40px), `.wc-field__input--area` (bordered, r8), `.wc-form__submit` (the large pill). Two columns above 750, stacked below.

