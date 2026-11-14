# Wine Crush — UI/UX layout rules

> This file was started during the Ovais round 2 fixes. The brief referred to
> `/docs/UI-UX.md` and `/docs/CONTEXT.md`, but neither existed in the theme, so
> there was nothing to update. What follows documents only the responsive rules
> this round established or changed — it is not a full account of the theme.
> Everything else continues to be documented in comments at the top of each
> `assets/wc-*.css` file, which is this theme's convention.

## Breakpoints

The theme has three bands, set in `assets/style.css`:

| Band | Width | Meaning |
| --- | --- | --- |
| Desktop | `min-width: 990px` | The 1440 artboards. Compositions are as drawn. |
| Tablet | `750px – 989px` | Sections collapse to a single column; the shared section rhythm replaces the artboard padding. |
| Phone | `max-width: 749px` | `--grid-columns: 1`, `--slides-visible: 1.3`, `--radius-band: 24px`. |

A fix for phone feedback belongs in a `max-width: 749px` block. A fix for the
stacked mobile/tablet treatment belongs in the `max-width: 989px` block the
section already uses, so tablet and phone do not diverge.

## Hero — never cap the frame against the viewport (`assets/wc-hero.css`)

`.wc-hero-section` is pulled up under the sticky header
(`margin-top: calc(var(--header-height) * -1)`), so the hero starts at the top
of the viewport.

**The frame's height comes from `aspect-ratio` alone — 1440 / 898 on desktop,
3 / 4 at ≤989, 375 / 640 at ≤749. Do not add `max-height`, `height` or any
other viewport-height term to it.**

This was tried in round 2 (`max-height: 100svh` on the wordmark layout) to pull
the wordmark above the fold on a short window, and it broke the desktop hero.
`max-height` beats `aspect-ratio`, so on any window shorter than
`width / 1.604` the frame is compressed and three things follow at once:

- the photograph re-crops, because it is `object-fit: cover` in a box that is
  now the wrong shape;
- `.wc-hero__lede` (`top: 38.42%`) and `.wc-hero__wordmark` (`top: 73.72%`) are
  positioned as *shares of the frame*, so both ride up the page;
- the wordmark, sized as `49.03%` of the hero width, keeps its width while
  everything around it moves — the composition stops matching the artboard.

Measured at 1440 × 850 the frame lost 48px and the wordmark moved up 45px; at
1512 × 819 it lost 124px and the wordmark moved up 115px.

If the wordmark has to clear the fold on a short window again, it has to be
solved without touching the frame — and note that at the four QA widths with
ordinary window heights (1024, 1280, 1366, 1440) the wordmark already sits
above the fold with the artboard frame intact.

The page heading layout (`.wc-hero--heading`, About Us) is the one exception:
it has its own `height: min(100vw / ratio, max(100svh, 480px))` rule, because
its h1 must be readable without scrolling. That rule predates all of this and
stays.

### Where the logo sits

The wordmark used to straddle the claret band at the hero's foot
(`--hero-wordmark-top: 73.72%`). It now **leads the hero**, above the opening
line (client, round 4).

`.wc-hero--wordmark` is a centred flex column, and the two elements become one
stack in the hero's own flow instead of two absolute percentage offsets — so
the gap between them is stated once and neither can land on the other, or
under the header, at any width. The block is centred vertically in the hero
(client, round 5).

Four details are load-bearing:

- They keep `position: relative`. As static elements they would lose their
  z-index and the absolutely-positioned photograph would paint over them.
- The padding states the two bands the content **cannot** use, and centring
  happens between them: `padding-top: var(--header-height)` for the sticky
  header the hero is pulled up under, and `padding-bottom: var(--band-overlap)`
  for the claret cap, which is an `::after` on this same element and therefore
  paints over anything that reaches it. Centring in the raw frame instead
  would sit the block low and let it drift under the cap.
- `justify-content: safe center`, with a plain `center` declared before it as
  the fallback for browsers that do not know the keyword. `safe` makes a frame
  too short for the stack pack from the top instead of overflowing equally and
  sliding the logo up under the header.
- No `padding-inline`. Both children already hold themselves inside the frame
  (`min(…, 88%)` and `min(449px, 78%)`), and a gutter here would cost the
  wordmark 36px of its 706px artboard width.

There is no term for an announcement bar: the hero's negative margin only
lifts it under the header, so a bar above that sits clear of the hero
entirely.

The logo is lifted by `order: -1`, not by a Liquid change, so the opening line
stays first in the document where it reads as the hero's own text.

The claret band at the foot is unchanged and is now bare — it is the page
surface rising over the hero and exists independently of the wordmark.

## Sticky columns

Two columns follow the customer on desktop. Both share the same three
requirements, and all three are load-bearing:

1. `align-self: start` — a stretched grid item is as tall as its row, so sticky
   has nothing to travel through.
2. `top: header height + the column's own gap` — so the column never sits under
   the sticky header.
3. A `max-height` of the remaining screen plus internal `overflow-y: auto` — so
   a column taller than the screen still shows its foot.

Because each column stays inside its own grid track, sticky stops at the foot of
the row and never reaches the footer. No JavaScript is involved.

### Shop filters (`assets/wc-collection.css`, `min-width: 990px`)

`.wc-collection__filters` pins at `--header-height + 18px`. Below 990px the
column is `static` and the mobile filter drawer takes over, unchanged.

### Bundle summary panel (`assets/wc-bundle-builder.css`)

`.wc-bundle-builder__layout--sticky .wc-bundle-builder__panel` pins at
`--header-height + --bundle-gap` and is capped to
`100svh - --header-height - 2 * --bundle-gap`.

Two details matter:

- The artboard's `min-height: 764px` has to be lowered to
  `min(764px, <cap>)`. `min-height` beats `max-height` in CSS, so leaving the
  floor at 764 would defeat the cap on a short window.
- `.wc-bundle-builder__slots` takes the squeeze (`flex: 0 1 auto; min-height: 0;
  overflow-y: auto`). A flex child's default `min-height: auto` refuses to
  shrink and would push the foot — subtotal and "add bundle to cart" — back off
  the panel.

`assets/wc-bundle-builder.js` scrolls an empty slot into view with
`block: 'nearest'`, not `'center'`: the list is now its own scroller inside a
pinned panel, and `'center'` would drag the page trying to centre an element the
sticky panel holds in place.

**The slot list's scrollbar** is themed to the panel: the Sorbet-50%
`--color-hairline` that rules the slot rows becomes the thumb, rounded on
`--radius-pill`, over a transparent track, 6px wide, with `--color-accent` on
hover. The list also carries `padding-inline-end: var(--space-2xs)` so the row
rules stop short of the bar instead of running under it.

The two engines are addressed separately, and the order matters. **Chromium
ignores every `::-webkit-scrollbar` rule as soon as `scrollbar-width` or
`scrollbar-color` is set to anything but `auto`** — setting both in one block
silently throws the pseudo-element styling away. So the standard properties sit
behind `@supports not selector(::-webkit-scrollbar)`, which is true in Firefox
and false in Chromium and Safari. Anything that understands neither keeps its
native scrollbar, which still scrolls. The rules are scoped to this one list;
there is no global scrollbar styling anywhere in the theme.

Below 990px the panel is `static` and leads the page, with the fixed foot bar
(`.wc-bundle-builder__bar`) carrying the count and the add button on phones.

## Product rail gaps (`assets/wc-product-tabs.css`)

The rail's two figures carry their own fallbacks:

```css
--slider-rail-gap: var(--slider-gap, 15px);
--slider-rail-visible: var(--slides-visible, 4.1);
```

and the slide takes its size from `width`, not `flex-basis`, with
`flex: 0 0 auto`. The reason is failure behaviour: if the slide width cannot be
resolved, `flex: 0 0 <invalid>` drops the whole shorthand back to `flex: 0 1
auto`, every card shrinks to share one screen, and `gap: var(--slider-gap)`
resolves to `normal` — the cards end up touching with no rail spacing at all,
which is what the client reported. With the fallbacks and `width`, the gap holds
at 15px whatever happens to the slide figure.

## Centred mobile treatments

Two sections read as one centred stack on phones. Desktop is untouched in both
cases.

| Section | Rule | Breakpoint |
| --- | --- | --- |
| `.wc-story` | Mark above the opening line via `order: -1`; lead, media, address, button and closing line all centred. | `max-width: 749px` |
| `.wc-split__heading` ("How to shop.") | `text-align: center` over the stacked panels. The negative bottom margin that tucks it over the first panel is unchanged. | `max-width: 749px` |

The brand mark is `assets/icon-wc-mark.svg`, the framed glyph lifted from
`assets/wine-crush-logo.svg` so the mark and the logo are the same artwork. It
is vector, so it stays crisp at 44px on any pixel density; Ivory is baked in
because it is referenced from an `<img>`, where `currentColor` cannot reach it.
`wc-story`'s "Brand mark" setting still accepts an upload and overrides it.

## FAQ photograph — the artwork carries its own shape (`assets/wc-faq.css`)

The merchant supplies this image already masked to the design's shape — the
current file is literally named `Ellipse_11.png`. So `.wc-faq__figure img` sets
`width` and `height: auto` and **nothing else**. It must not set
`aspect-ratio`, `object-fit` or `border-radius`.

The rule used to carry all three (`aspect-ratio: 352 / 299`,
`object-fit: cover`, `border-radius: 50%`). Against an already-elliptical PNG
that cropped the ellipse into a second, differently-proportioned box and then
rounded the result again — which is the "wrong shape" the client reported, at
both rounds. Round 2 made it worse on phones by forcing `aspect-ratio: 1`,
squeezing the ellipse into a square and cropping its sides.

The 352px width at `min(352px, 70%)` is the artboard's size and stays.

## Bundle band scatter (`assets/wc-bundle-band.css`, `max-width: 989px`)

`wc-bundle-band` serves two bands — "Build your bundle." on Home and "Good
drinks, without the carry-on." on About Us — so one rule covers both.

On desktop it is four photographs scattered at percentages of the band. Below
990px the scatter wrapper becomes `display: contents` so the figures join the
band's own two-column grid: **two staggered above the copy, one centred below
it**. Sizes keep their desktop proportions and never exceed their 1440 widths
(255 / 271 / 163); the centred one is `grid-column: 1 / -1; width: 26%`, which
is the width it already had as 52% of a half-width column. The fourth is
hidden — hidden, never removed, so every block survives in the section and on
desktop.

Round 3 cut this back to a single image at the top and round 4 restored it, so
the two-above-one-below arrangement is the one the client has signed off.
