# STADEN — LOCKED DESIGN SPEC

> Produktens aktuella north star finns i
> [produktdefinitionen](../product/product-definition.md). Nyfikenheten ska
> fortfarande kännas lugn, men framgång betyder nu att användaren hittar ett
> genomförbart val och lämnar appen för att uppleva staden.

# PART 1 — IDENTITY
## Soul

**Someone chose this, and can tell you why — now you have the room to decide for yourself.**

STADEN is the city held at arm's length like an object in a vitrine: one thing at a time, with air around it, a label that names what it is and why it is here, and no one standing behind you tapping their watch. It is a hub for the whole city — the exhibition that opens in nine days and the café that has been open since 1974 are hung in the same room, at the same size, in the same chassis, because "what happens" and "what exists" are one collection. Google Maps is an index with no opinion and no memory of taste; TripAdvisor is a ranking of other people's past, optimised for tourists who have already left; Instagram makes you a spectator of other people's evenings on a feed that structurally cannot end; Resident Advisor is excellent and deep for one subculture that already knows itself. STADEN is the opposite of all four: finite, dated, signed, and equally usable by a family in Majorna, a 63-year-old with a bus pass, and a tourist off the Landvetter bus — because a museum is the one public building in a city that is genuinely built for all of them at once. The emotion we are engineering is curiosity, never urgency: we win when a person finds one thing they did not know existed, saves it, and closes the app calm.

## Wordmark

**STADEN**, set in **Familjen Grotesk, wght 700**, all caps, shipped as SVG outlines from a single React component (`<Wordmark/>`) — never as live text, so the letterforms cannot drift when a font fails to load.

Base metrics: cap height 100 units, tracking **−0.02em** at ≥24px and **−0.005em** below 24px (tight tracking closes up on small screens and the Swedish reader loses the D/E gap first). Four optical cuts, all drawn into the outline:

1. **The A's apex is flattened** to a plateau 3% of cap height wide. S, T, D, E and N all present flat tops; a pointed A is the one glyph that breaks the word's top edge. Flattened, STADEN reads as a single milled block with one hard horizon — the museum lintel.
2. **The D's bowl is squared at its top-right corner** by a 1.5%-cap-height chamfer, and its counter is opened 4%. This is the mark quoted inside the wordmark: the D becomes a plate with one square corner, and the counter survives being flooded with ink at 16px.
3. **The E's three arms are cut to identical length**, middle arm full width — routed signage, not typographic. It is the only place the word admits it is a sign on a building.
4. **Local kerning, not global:** ST −0.01em and DE −0.01em (the word's two soft joints), N +0.006em on the right sidebearing so the final stem does not tip off its own edge at masthead scale.

**City lockup.** The wordmark never appears alone in chrome. It locks as: wordmark, then a **2px ink rule running from the wordmark's right sidebearing to both container edges (full bleed, past the gutters)**, then the city in **DM Mono 500, caps, tracking 0.04em, at 0.34× the wordmark's cap height**, right-aligned and sitting on that rule.

```
STADEN ————————————————————————————— GÖTEBORG
```

The rule bleeding past the content margin is the house device — the same full-bleed hairline that tops every object plate. The city string is the only part that changes between markets (GÖTEBORG / STOCKHOLM / MALMÖ / KØBENHAVN / BERLIN); the wordmark never does. No tagline is ever locked to the wordmark. Minimum wordmark width **88px**; below that, the mark alone.

**Header behaviour at 390px.** The sticky bar is `min-height: 56px` + `env(safe-area-inset-top)`, opaque `--ground`, 1px `--line` bottom rule — never height-locked, never translucent by default. The lockup sits at wordmark **0.9375rem cap-set (15px)**, rule, city at **0.8125rem (13px)** mono. The city half is its own `<button aria-haspopup="dialog">` with a 44×44 hit box extending the full bar height. The display-scale wordmark exists **only once**, on the IDAG masthead plate, at `--type-display`, and never returns as scroll chrome. Total identity chrome on the first viewport is capped at **25% of the visible height** — 183px of a 734px Safari viewport — because the first screen must contain an object, not a nameplate. There is no scroll-driven masthead shrink; the masthead simply scrolls away and the 56px bar stays.

**Header behaviour at 1440px.** No stretched phone. The wordmark moves into the **260px persistent left rail** at **1.75rem cap-set**, with the 2px rule spanning the rail's full width and GÖTEBORG on the rule beneath it — so the lockup reads as a plate screwed to the wall of the building rather than a logo floating in a header. Below it, the rail carries the four rooms and the visitor's collections. The IDAG masthead still prints STADEN once at `--type-display` at the top of the centre column, right-aligned to column 12 with the date plate hard left — the only place the two identities meet, and the reason a 1440px screenshot is instantly a different composition from a 390px one.

## Mark

**PLANEN** — the floor plan. A square plate divided by two off-centre walls into four unequal rooms, with one room filled solid: *this is the building, these are the four wings, you are standing in this one.*

It is not a pin, not a compass, not a location teardrop, and it has no circle and no diagonal anywhere in it — the three shapes that make every travel app's mark interchangeable.

```svg
<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="STADEN">
  <!-- active room: filled first, so the rules overprint it -->
  <rect x="14" y="4" width="14" height="14" fill="currentColor"/>
  <!-- plate -->
  <rect x="3" y="3" width="26" height="26" stroke="currentColor" stroke-width="2"/>
  <!-- north–south wall -->
  <rect x="12" y="3" width="2" height="26" fill="currentColor"/>
  <!-- east–west wall -->
  <rect x="3" y="18" width="26" height="2" fill="currentColor"/>
</svg>
```

Every painted band lands on an even coordinate and every band is 2 units wide, so the whole figure halves cleanly. The four rooms measure 8×14 (top-left), 14×14 (top-right), 8×8 (bottom-left) and 14×8 (bottom-right) — deliberately unequal, because a symmetric cross in a square is a compass rose and this is a plan.

- **16px favicon.** Scales to a 1px plate keyline, two 1px walls at x=6 and y=9, and a 7×7 solid block top-right. Every edge lands on a whole device pixel at 1x; no anti-aliasing mush, no lost stroke. Recognisable as a square with an off-centre cross and one solid quadrant, which nothing else in an app switcher looks like.
- **180×180 apple-touch-icon.** PNG, no transparency, no pre-rounded corners (iOS masks it). Ground `--ground` light-mode value, figure in `--ink`, plate scaled to 128px and optically centred at (90, 88) — 2px high, because a square reads low when centred mathematically. The **maskable 512×512** variant keeps the whole plate inside the central 341px circle; the wordmark never appears in an icon.
- **400px+ watermark.** The two walls **extend past the plate to the canvas edge and off it**, becoming the full-bleed hairlines the layout is already built from; the plate keyline drops to 10% ink, the walls to 16%, the filled room to 5%. Used behind the IDAG date plate and behind the end-of-edition plate, at 140vw, bled off two edges.

**The one live variable.** The filled room rotates to encode the current wing — top-left KULTUR, top-right NÖJEN, bottom-left MAT, bottom-right SEVÄRDHETER — and the fill takes that wing's hue. Neutral state (IDAG, collections, city switch, the icon, the favicon) is top-right in `currentColor`. Free wayfinding, one attribute, zero assets. The fill position is decorative reinforcement only: the room name in words always ships beside it.

## Typography

Three families, three voices, **hard boundaries**, and the boundary is itself a stated law: *a reader can tell at a glance which of the three is speaking.* Familjen Grotesk is the building (everything structural and every title). Literata is the curator (only sentences a human is accountable for). DM Mono is the catalogue (only what a database knows). If Literata appears in a caption or mono appears in prose, it is a bug, not a style choice.

All three self-hosted via `next/font/google` with `display: 'swap'`, `subsets: ['latin']`, `adjustFontFallback: true`, and an explicit Android-safe stack — `Arial` is removed everywhere, since it does not exist on Android and silently resolves to Roboto mid-load.

| Voice | Family | Axes / weights | Used for | Fallback stack |
|---|---|---|---|---|
| **Display / UI** | **Familjen Grotesk** (variable, wght 400–700) | 500, 600, 700; wght animated once (see Motion) | Wordmark, room names, object titles, buttons, nav labels, numerals in the notice | `'Familjen Grotesk', 'Helvetica Neue', Roboto, 'Noto Sans', sans-serif` |
| **Editorial / wall label** | **Literata** (variable, opsz 7–72, wght 200–900) | 400 + true italic, opsz 18 | The curator's sentence, the day's note, collection descriptions. Nothing else, ever. | `Literata, Georgia, 'Noto Serif', serif` |
| **Catalogue / data** | **DM Mono** (400, 500) | 500 for labels, 400 for values | Accession numbers, dates, times, prices, walk minutes, opening hours, source lines, the mechanism stamp | `'DM Mono', ui-monospace, 'Roboto Mono', monospace` |

Familjen Grotesk is chosen deliberately over Inter/Archivo/Geist: it is drawn in Sweden by Letters from Sweden, its å/ä/ö are designed rather than retrofitted, and its slightly cut terminals give the app a grotesk with a hand in it. That is an identity argument, not a taste argument, and it is not on ten thousand other sites.

**THE VW/REM LAW.** `vw` is permitted **only** in the middle term of a `clamp()`, **only** on display-class type (`--type-display`, `--type-room`, `--type-title-lg`), and **only** alongside a `rem` term in that same middle argument. Everything a person reads to make a decision — wall label, body, secondary, catalogue rail, notice, nav label, button — is **rem-only, no `vw`, no `cqi`, no exceptions**. Consequence: at iOS AA text zoom and Android 200% font scale, every functional string grows and every display string grows *with* it instead of pinning to a floor that ignores the user. A `clamp()` whose middle term is bare `vw` is a lint failure in CI. Card-internal titles additionally use `cqi` in the middle term inside a `container-type: inline-size` wrapper, so a card in the 360px right rail and a card in the 1080px gallery set correctly without a media query.

Absolute floors, enforced: **12px (0.75rem)** for decorative stamps seen once per screen and never more than four words; **13px (0.8125rem)** for any catalogue metadata; **15px (0.9375rem)** for secondary prose; **17px (1.0625rem)** for body and the wall label. Mono is never tracked past **0.06em** and never set in caps below 13px. `html { -webkit-text-size-adjust: 100% }` so Safari cannot silently inflate the rail.

```css
:root {
  font-size: 17px;                     /* 1rem = 17px; nothing functional can ship below 1rem */

  /* DISPLAY — vw permitted, always with a rem term */
  --type-display:    clamp(2.75rem, 1.9rem + 4.2vw, 6.5rem);   /* masthead, date plate */
  --type-room:       clamp(2rem,    1.5rem + 2.6vw, 3.75rem);  /* SAL header: KULTUR */
  --type-title-lg:   clamp(1.625rem,1.3rem + 1.6vw, 2.5rem);   /* detail-page object title */
  --type-title:      clamp(1.25rem, 1.05rem + 1.4cqi, 1.75rem);/* card title, container-scaled */

  /* READING — rem only, forever */
  --type-lede:       1.3125rem;   /* 22.3px — the day's note, Literata italic */
  --type-label:      1.0625rem;   /* 17px  — the wall label, Literata 400 */
  --type-body:       1.0625rem;   /* 17px  — detail prose */
  --type-secondary:  0.9375rem;   /* 15px  — captions, helper text */
  --type-catalogue:  0.8125rem;   /* 13px  — DM Mono rail, notice, source line */
  --type-micro:      0.75rem;     /* 12px  — accession number only, ≤4 words */

  /* LEADING & TRACKING */
  --lh-display: 0.92;  --tr-display: -0.025em;
  --lh-room:    0.96;  --tr-room:    -0.02em;
  --lh-title:   1.08;  --tr-title:   -0.012em;
  --lh-label:   1.55;  --tr-label:    0;
  --lh-body:    1.55;
  --lh-cat:     1.35;  --tr-cat:      0.06em;
}
```

Every display and title element carries `overflow-wrap: anywhere; hyphens: auto` with `lang="sv"` on the document, because Swedish compounds — *Världskulturmuseet*, *Universeumutställningen*, *Konsthallsutställning* — are the default case, not the edge case. Tracking is capped by size band, never global: −0.025em above 96px, −0.015em from 48–96px, −0.005em below 48px, so a 200%-zoomed headline cannot collide its own glyphs. All numerals in the catalogue rail and the notice use `font-variant-numeric: tabular-nums`.

## Colour

One loud accent against a disciplined neutral ground, four pillar hues that are structurally incapable of shouting (all held to **C ≤ 0.16**, so the accent at C 0.223 is always the most saturated object on any screen), and a dark theme that is a re-design, not an inversion.

```css
:root {
  /* LIGHT — warm chart paper, warm soft ink. Never #fff, never #000. */
  --ground:        oklch(96.4% 0.011 92);    /* page */
  --paper:         oklch(99.2% 0.005 92);    /* raised plate, sheet, fact table */
  --ink:           oklch(17.6% 0.006 88);    /* 15.6:1 on ground */
  --ink-2:         oklch(43%   0.010 84);    /*  7.4:1 — secondary prose */
  --muted:         oklch(47%   0.010 84);    /*  6.1:1 — catalogue rail floor */
  --line:          oklch(76%   0.009 84);    /*  3.2:1 — hairlines read outdoors */
  --line-strong:   var(--ink);               /* structural 2px rules */

  --accent:        oklch(65.5% 0.223 36);    /* rules, dots, fills carrying NO text */
  --accent-solid:  oklch(71.5% 0.185 48);    /* filled controls; --ink on it = 7.3:1 */
  --accent-ink:    var(--ink);
  --focus:         var(--ink);

  --kultur:        oklch(43% 0.160 300);     /* 5.2:1 */
  --nojen:         oklch(42% 0.150 252);     /* 5.3:1 */
  --mat:           oklch(43% 0.115 62);      /* 5.2:1 */
  --sevardheter:   oklch(43% 0.105 158);     /* 5.2:1 */

  --media-sat: 0.96;   --media-tint: 0.06;   /* one pipeline, two parameters */
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* … dark block, below … */ }
}
:root[data-theme="dark"] {
  /* DARK — four deliberate breaks from inversion */
  --ground:        oklch(16.5% 0.012 262);   /* 1. ground goes COOL; a warm dark reads sepia */
  --paper:         oklch(21.5% 0.014 262);   /* 2. raised is LIGHTER in both themes — a plate
                                                    darker than its ground reads as a hole */
  --paper-2:       oklch(26%   0.014 262);
  --ink:           oklch(94.5% 0.008 92);    /* warm bone; pure white halates on OLED */
  --ink-2:         oklch(75%   0.010 92);    /*  8.6:1 */
  --muted:         oklch(64%   0.010 92);    /*  5.9:1 */
  --line:          oklch(34%   0.012 262);   /* 3. hairlines are QUIETED, not inverted —
                                                    thin light lines glow on OLED */
  --line-strong:   oklch(52%   0.012 262);

  --accent:        oklch(72%   0.185 42);    /* L lifted, C pulled back to kill halation */
  --accent-solid:  oklch(76%   0.160 50);    /* --ground on it = 9.1:1 */
  --accent-ink:    var(--ground);
  --focus:         var(--ink);

  --kultur:        oklch(76% 0.120 300);     /* 7.6:1 */
  --nojen:         oklch(76% 0.110 252);     /* 7.6:1 */
  --mat:           oklch(78% 0.100 68);      /* 8.1:1 */
  --sevardheter:   oklch(76% 0.095 158);     /* 7.6:1 */

  --media-sat: 1;      --media-tint: 0.04;
}
```

Tokens are defined **complete** on bare `:root`, redefined under `@media (prefers-color-scheme: dark)` guarded as `:root:not([data-theme="light"])`, and again under `:root[data-theme="dark"]`, so the manual toggle wins in both directions. A colour whose only definition lives inside a media block is a lint failure. The toggle ships in v1 — "both themes first-class" means the user chooses, and the app never auto-switches at sunset.

**Pillar hues: measured, and what happens when they fail.**

| Pillar | Light token on `--ground` | Same token on dark `--ground` | Dark token on dark `--ground` | Dark token on `--ground` |
|---|---|---|---|---|
| KULTUR | **5.2:1** ✓ | 2.5:1 ✗ | **7.6:1** ✓ | 1.7:1 ✗ |
| NÖJEN | **5.3:1** ✓ | 2.5:1 ✗ | **7.6:1** ✓ | 1.7:1 ✗ |
| MAT | **5.2:1** ✓ | 2.5:1 ✗ | **8.1:1** ✓ | 1.6:1 ✗ |
| SEVÄRDHETER | **5.2:1** ✓ | 2.5:1 ✗ | **7.6:1** ✓ | 1.7:1 ✗ |

Cross-theme use always fails, which is the point: each pillar has two token values and is never reused across grounds. **The fallback for every failure case is the same, and it is not a colour — it is a word.** Pillar hue is permitted in exactly four places: (a) the 3px rule flush to the top edge of an object plate, (b) the caps pillar label in the catalogue rail, (c) the room threshold band, (d) the ground of a KATALOGPLATTA. The caps label ships with the hue **always**, so nothing in the product is distinguished by colour alone. Ink-flood area from a pillar hue is capped at **22% of an object plate in dark mode** (60% at noon reads as energy; the same at 23:00 on an OLED reads as aggression) and at **40% in light**.

`--accent` is **never text on `--ground`** — that pairing measures 2.86:1 and is banned by rule, not by taste. It is a fill, a 3px rule, a 6px dot, or the ground under `--ink`. Any control whose label sits on the accent uses `--accent-solid`, which clears **7.3:1** in light and **9.1:1** in dark.

**Forced colors.** `@media (forced-colors: active)`: every pillar hue, the accent and all media tints resolve to system colours; object plates gain `border: 1px solid CanvasText` so the plate boundary survives the loss of its ground; the notice's 6px "pågår nu" dot is replaced by the literal word; the KATALOGPLATTA drops its halftone and renders as `CanvasText` type on `Canvas` with a 2px `CanvasText` keyline; `forced-color-adjust: none` is applied to nothing. Under `prefers-contrast: more`, `--line` goes to `--ink`, `--muted` goes to `--ink-2`, all texture is removed, and every hairline thickens from 1px to 2px. Under `prefers-reduced-transparency: reduce`, no surface in the app is translucent — which is trivially satisfied because none is by default.

## Photography and the imageless object

**We do not process the artwork. We process the label.** Museums do not duotone the paintings. Every real photograph enters the frame as itself, full-bleed to the plate edges, `border-radius: 0` without exception, `object-fit: cover` against a smart-crop focal point stored at ingest (defaulting to `50% 38%`, because faces and signage sit high). Aspect ratio is fixed by slot, never by the source file: **3:2** in the lead plate, **4:5** in the card, **4:5 capped at 62dvh** on the detail hero. The frame's background is `--line`, so a slow load shows a flat grey block — never a white flash, never a broken-image glyph, never a layout shift, because the box is reserved whether the image arrives, arrives late, or never arrives at all.

The single house treatment is **one pipeline with two parameters, never a per-pillar branch**: `filter: contrast(1.04) saturate(var(--media-sat))` plus a pillar-hue overlay at `var(--media-tint)`. MAT sets `--media-sat: 1` and `--media-tint: 0` as a **published rule inside the system**, not a quiet exemption — food keeps its colour because desaturated food is inedible, and we say so in the design docs rather than hoping nobody notices. Dark mode adds `brightness(0.94)` and a 1px `--line` keyline around every image (grain on dark reads as banding). **No text is ever set directly on a photograph**: titles sit in a knocked-out ink bar overlapping the media's bottom edge. Credit and caption sit under the frame in DM Mono 13px: `FOTO: RÖDA STEN KONSTHALL`, or `BILD FRÅN ARRANGÖREN` when the pipeline could not verify a photographer. **No stock photography and no AI-generated imagery, ever.** If there is no real photograph, there is type.

**The ingest quality gate.** Any source image under **800px on the long edge**, or with an aspect ratio outside **0.5–2.2**, is demoted at ingest — never at render. The object gets a KATALOGPLATTA at full bleed and the real photograph appears as a **96×96 inset in the plate's bottom-right corner with a 1px keyline**. Bad source media can therefore never break a layout; the system degrades toward its own aesthetic rather than toward emptiness.

**KATALOGPLATTAN — the imageless object, and the best-looking thing in the app.**

Roughly a third of what the automation returns will have no usable photograph. That is the pipeline's biggest weakness and it becomes the house look.

Everything is **derived from the item id at ingest and stored in Supabase**, never computed in the browser — identical on a Pixel, an iPhone, a 1440px desktop, and in the Open Graph renderer, forever, byte for byte. Columns on `objects`: `plate_seed integer`, `plate_layout smallint`, `plate_font_px smallint`, `plate_breaks text[]`.

```
seed = fnv1a32(object.id)                  -- computed once, at ingest, stored
plate_layout   = (seed       ) % 6         -- one of six compositions
screen_angle   = ((seed >>  8) % 24) * 15  -- halftone rotation, 0–345°
dot_pitch      = [3, 5, 8][(seed >> 16) % 3]   -- px
crop_anchor    = ['tl','tr','bl','br'][(seed >> 24) % 4]
```

Ground is the pillar hue at the theme's capped flood area, with a `repeating-conic-gradient` dot field at `dot_pitch`, rotated to `screen_angle`, at 9% ink in light / 5% in dark. Type is knocked out in `--ground`. The six compositions:

1. **Väggtext** — title hard left over three lines, accession number hanging in the left margin outside the text column.
2. **Centrerad plakett** — title optically centred, a 2px rule above and below, catalogue rail welded to the bottom edge.
3. **Regalskylt** — title between two 6px rules that bleed off both edges.
4. **Nummerplåt** — the accession number set enormous in `--ground` at 8% opacity, the title wrapping around its right flank.
5. **Fotmarginal** — title top-aligned, two thirds of the plate left as empty ground with only the rail at the foot. This is the calm one, and it is the most museum object in the system.
6. **Diagonalstapel** — each line of the title stepped 4% of plate width from the line above, all lines left-aligned to their own baseline start.

Three laws govern it. **(1) The title is never cropped.** Decorative overflow of a string a person reads to decide is a defect, and "the full string is in the accessible name" helps a screen reader while abandoning the sighted reader it failed. `plate_font_px` and `plate_breaks` are solved at ingest against the plate's known aspect ratio so the title always fits at 100% and reflows to a taller plate at 200%; the plate has `min-height`, never fixed height. **(2) The accession number may bleed off the plate edge** — that is where the print-crop instinct is allowed to go, because it carries no meaning a reader needs. **(3) Under LUGNT LÄGE** (auto-enabled by `prefers-reduced-transparency`, `prefers-contrast: more`, or a system text size above 120%) every plate collapses to composition 1 on flat ink, halftone off, type left-aligned and uncropped, at one step up the reading scale. LUGNT LÄGE ships in v1, not v2, or the product is ageist by construction.

The same renderer draws collection covers and every Open Graph image, so a brand-new empty collection is already a designed object — which is what makes a person create a second one.

## Motion

Five motions. Museum-calm: nothing bounces, nothing springs, nothing overshoots, nothing loops forever, and nothing manufactures time pressure. Global entrance easing `cubic-bezier(0.2, 0, 0, 1)`; sheets `cubic-bezier(0.32, 0.72, 0, 1)`; anything scroll-driven is `linear`. Nothing exceeds 380ms. Every one is authored with its reduced-motion answer beside it, not bolted on afterwards, and no motion is ever the sole carrier of information.

**1. SALSBYTE — card → detail.** *Trigger:* navigating into an object. *Mechanism:* View Transitions API. `view-transition-name` on the media plate, the object title and the pillar rule. The plate expands to full bleed while the pillar rule sweeps to full width and the title travels from card size to `--type-title-lg`. **320ms** forward, **240ms** back, `cubic-bezier(0.2, 0, 0, 1)`. Back navigation plays the exact inverse — a forward transition fired on a back gesture is the loudest "this is not a real app" tell on Android, so if direction cannot be guaranteed the transition does not ship. *Reduced motion:* 120ms opacity cross-fade, no morph, no movement.

**2. HÄNGNINGEN — objects entering a room.** *Trigger:* first paint of a room. *Mechanism:* `@starting-style` animating `opacity: 0 → 1` and `clip-path: inset(0 0 8% 0) → inset(0)`, **200ms**, staggered **40ms**, hard-capped at **8 objects / 320ms total**. Reads as work being hung, not as a feed loading. *Reduced motion:* opacity only, stagger 0.

**3. VÄGGTEXTEN — the label's rule draws.** *Trigger:* an object plate entering the viewport. *Mechanism:* `animation-timeline: view()` over the plate's entry range; the 3px pillar rule animates `transform: scaleX(0) → scaleX(1)`, `transform-origin: left`, `linear`. On the same timeline and only here, the room header's name interpolates Familjen Grotesk **wght 500 → 700** — the one variable-axis motion in the product, justified because a room name gets heavier as you enter it. Zero JS scroll listeners anywhere in the app. *Reduced motion:* rules render already drawn, room name locked at wght 600.

**4. LJUSET — the daylight hairline.** *Trigger:* a data refresh, not a clock tick. *Mechanism:* a 3px rule under the catalogue rail whose `--dagsljus` fraction is written once per render from the city's sunrise/sunset, transitioning `width` over **600ms linear**. It drains across the day and is the only quietly living element in a printed system — a printed thing that moves slightly is a far better brand object than a printed thing that merely prints. It counts toward nothing and nothing is missed when it empties. It always carries its text value ("LJUS TILL 20:41") beside it. *Reduced motion:* renders at final width with no transition.

**5. ETIKETTEN — saving.** *Trigger:* tapping SPARA. *Mechanism:* the bookmark icon crosses outline → filled over **180ms**, the plate's top rule flashes `--accent` for **220ms` and settles, `aria-pressed` flips, and a toast anchored 16px above the tab bar reads `Sparad i Höstdejter · Ångra` for 2.4s. A short haptic where the Vibration API exists. No rotation, no scale overshoot, no stamp, no squash. *Reduced motion:* instant icon swap, toast fades in over 100ms, haptic unchanged.

**6. AVFÄRDEN — the outbound handoff.** *Trigger:* tapping a ticket, booking or directions action. *Mechanism:* a `<dialog>` opened with `showModal()` (so Chrome wires the Android system back button and predictive-back peek for free, and iOS's history entry closes it) rising to 40dvh, max 420px, **280ms** `cubic-bezier(0.32, 0.72, 0, 1)`. It names the destination domain in words before anyone leaves. *Reduced motion:* appears at final position with a 100ms fade.

Universal press feedback, outside the five: `:active { transform: scale(0.985); transition: transform 90ms cubic-bezier(.2,0,0,1) }`, wrapped in `@media (prefers-reduced-motion: no-preference)`, with `-webkit-tap-highlight-color: transparent` globally.

## Voice

A wall label is written by a person who has been in the room, is not selling a ticket, and has exactly one thing to tell you that you could not have worked out yourself. **25–40 words. Sentence case, never caps, never mono, never italic-for-emphasis.** It contains at least one concrete, checkable fact — a time, a price, a walk, a door, a queue, a hill. It names the awkward part, because that is what a friend who has actually been there would say. Swedish first, written by a human editor before publish; English is a real translation by a person, 10% drier, and drops the editorial "vi" entirely, because the Swedish "vi" reads as professional restraint and the English "we" curdles into preciousness within one sentence.

It never says: *upplev, missa inte, upptäck, trendigt, hetast, sista chansen, snart slutsålt, bara idag, alla pratar om.* No exclamation marks. No emoji, anywhere in the product, including empty states and push notifications. No superlatives. No adjective stacking. No question headlines. No countdown below day granularity. If the sentence could have been written without going outside, it does not publish.

**Real strings, shipping.**

*Wall labels*
1. `Åtta bord och ett kök. Boka, eller kom klockan fem och ta baren. Ingen musik, mycket ljud, och personalen säger rakt ut vad som är bra idag.`
2. `Fri entré sista helgen, och det tar tolv minuter från Brunnsparken. Gå på söndagsförmiddagen — då är de tre salarna längst in nästan tomma.`
3. `Nio minuter till fots från Stigbergstorget. Sista biten är uppför, och det är hela poängen med utsikten.`

*The day's note (Literata italic, the human hand on the page)*
4. `Regn till fyra. Vi har hängt dagen inomhus, utom en sak.`
5. `Blåsigt från väster. Bra dag för museum och långa luncher.`

*The notice — all seven distance states*
6. `>60 dagar:` **`I KALENDERN · 13 AUG`** — SR: *"Anslag. Way Out West öppnar den 13 augusti 2026, Slottsskogen."*
7. `60–15 dagar:` **`OM 6 VECKOR · 13 AUG`** — SR: *"Anslag. Way Out West öppnar om sex veckor, den 13 augusti, Slottsskogen."*
8. `14–2 dagar:` **`OM 9 DAGAR · 13 AUG`** — SR: *"Anslag. Way Out West öppnar om nio dagar, den 13 augusti, Slottsskogen."*
9. `Imorgon:` **`IMORGON · 13 AUG`** — SR: *"Anslag. Way Out West öppnar imorgon, den 13 augusti, Slottsskogen."*
10. `Idag, ej börjat:` **`IDAG · ÖPPNAR 18:00`** — SR: *"Anslag. Way Out West öppnar idag klockan 18:00, Slottsskogen."*
11. `Pågår:` **`PÅGÅR NU · TILL 15 AUG`** — SR: *"Anslag. Way Out West pågår nu, till och med den 15 augusti, Slottsskogen."*
12. `Avslutat:` **`AVSLUTAT 15 AUG`** — SR: *"Anslag. Way Out West avslutades den 15 augusti."*

The component's Swedish accessible name is **"Anslag"**, on `<section role="group" aria-labelledby>` pointing at a visually-hidden heading carrying the full sentence; the visible numeral and the mono label are `aria-hidden`, so it is read once as a sentence and never as four fragments. `aria-live` is never set — a notice must never announce itself changing. The visible dateline is wrapped in `<time datetime="2026-08-13">`. Distance is computed as a **calendar-day difference in `Europe/Stockholm`** via `Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Stockholm' })` on both dates and subtracted — never millisecond division, which is off by one on 30 March (23 hours) and 25 October (25 hours) and unreproducible in a UTC CI runner.

*The mechanism stamp*
13. `OMHÄNGD 06:40 · 212 OBJEKT · 14 NYFÖRVÄRV`
14. `Källa: pustervik.se · hämtad 06:12 · rätta uppgift`

*Empty and degraded states*
15. `Tunn dag. Fyra saker, och alla fyra är värda det.` *(fewer objects than the room's slots)*
16. `Inget som matchar just nu. Prova utan filter, eller gå till Sevärdheter — den salen är alltid öppen.` *(filter returns zero — always names a room that cannot be empty)*
17. `Ingen uppkoppling. Här är det du har sparat.` *(offline)*
18. `Samlingen är tom. Spara något du vill komma ihåg, så bygger den sig själv.` *(empty collection)*
19. `Vi hittade inget på "vasaplatsen brunch". Sök på ett ställe, en stadsdel eller en sal.` *(zero search results)*
20. `Dagens hängning är försenad. Det som står här är från igår klockan 06:40.` *(pipeline failed — we say so, we do not pretend)*
21. `Du lämnar STADEN och går till ticketmaster.se. Vi sparar objektet så du hittar tillbaka.` *(outbound handoff sheet)*
22. `Vi hade fel. Rättat 14 aug: entrén är 80 kr, inte fri.` *(a corrections entry)*
23. `Slut för idag. Nästa hängning klockan 06:40. Vill du ha mer finns hela staden i Salarna.` *(end of edition)*

## Killed and grafted

**Killed**

- **The names Pejl, Notis and Plansch.** Two independent teams landed on *Pejl*, which is the definition of the obvious answer and additionally a live Danish fintech brand. *Notis* is the OS's own word for a push notification inside a product that sends push notifications — unregistrable, un-SEO-able, requiring paid brand defence to be findable. *Plansch* survives only as a demoted internal component noun; the brand is STADEN, per the addendum, and that is not reopened.
- **Split-flap / scrambling numerals on any figure.** A number that flips through intermediate glyphs can be misread mid-flight, it is a Vestaboard pastiche, it is decoration wearing a mechanism's clothes, and it fires on precisely the content that vestibular-sensitive and cognitively-loaded users need to hold still. *(Urgency mechanic 1, retired.)*
- **The sweep line and the "12 NYA" row flash.** A live data-arrival animation makes a freshness claim a twice-daily pipeline cannot keep, and it teaches the user to watch for change. Replaced by the static `OMHÄNGD 06:40 · 212 OBJEKT · 14 NYFÖRVÄRV` stamp — same honesty, no theatre. *(Urgency mechanic 2, retired.)*
- **The mark as a countdown gauge.** A wedge encoding hours-until-next-sweep makes the logo tick. PLANEN encodes *place*, not time. *(Urgency mechanic 3, retired.)*
- **"PÅGÅR NU" derived from opening hours or a live status.** It ships only from a stored, editor-confirmed date range, because a board that says a place is open and sends a 63-year-old to a locked door is the worst failure this product can produce — every other failure happens on a screen, that one happens in the street. *(Urgency mechanic 4, retired.)*
- **Sub-day countdown granularity, and depletion language.** No hours, no minutes, no seconds, ever; "DAGAR KVAR" (depletion) becomes "OM 9 DAGAR · 13 AUG" (arrival). The countdown numeral may never exceed 25% of the largest heading on the same screen, is never in the hero, and appears on IDAG at most once. *(Urgency mechanic 5, retired.)*
- **All engagement surfaces:** likes, follower counts, comments, streaks, badges, view counters, "12 personer tittar nu", ticket-remainder counts, star ratings, flame markers, and any auto-flagging of an event by popularity. Qualification for the notice is an editorial `is_landmark` boolean set by a human, never inferred — that flag is the door growth-hack pressure walks through, and it is nailed shut. *(Urgency mechanic 6, retired.)*
- **Ordering the day by start time alone.** It was the losing spine's fatal flaw: restaurants, playgrounds, walks, museums and three-month exhibitions have opening hours or a date range, not a start, so the whole product's primary sort key exists for half the catalogue. Order is **editorial catalogue order inside a room**; time is a filter axis with a permanent **ALLTID** segment beside NU / IKVÄLL / IMORGON / HELGEN, which is what makes the permanent city a first-class citizen on the time axis rather than a bolt-on.
- **Monospace as the interface voice.** Mono marks data and nothing else. The moment it carries titles, body, navigation or section heads, the product wears the dev-tool costume of the decade and has told every non-technical user it is not for them.
- **State displayed as a code string** (`LÄGE: DEJT+UTE`). A machine's rendering of a human's evening is not a status display. Active personalisation is printed in words with a visible undo.
- **Deliberately cropped headlines** — Plansch's 8–14% overflow, Notis's cropped placards, the atlas's bleeding initials. A string a person reads to decide is never cropped; "the full string is in the accessible name" fixes it for screen readers and abandons the sighted reader it failed. Only the accession number may bleed.
- **Bodoni-as-masthead, the compass/bearing-rose mark, Geist + Geist Mono, the Archivo/Plex/Fraunces trio, and the `#ff4d1c` + halftone + fluoro-pink riso costume as a total look.** Every one is off-the-shelf; the first four are what a scaffold emits. The print instinct survives in exactly one place — the halftone screen on the KATALOGPLATTA — where it is honest ornament on a generated object, not a filter applied over a real photograph. Fixed-px misregistration is killed outright: it vanishes on desktop, breaks at 200% zoom, and renders as three different brands across 1x/2x/3x.
- **The sentence-builder as the primary filter path.** Composing "IKVÄLL, vi är TVÅ, helst INOMHUS, under 300 KR, från MAJORNA" puts a creative act between a hungry person and dinner; the pitch shipping its own "VISA SOM LISTA" escape hatch is the tell. The *kurs* output survives; the mad-libs input does not.
- **The per-pillar media branch.** "Halvton lätt" as a quiet exemption on the highest-traffic pillar is a brand law with a carve-out. One pipeline, two parameters, MAT's values published in the system.
- **Publish-blocking media gates, two editions a day, and läge-conditioned rewriting of item prose.** A gate a scraper trips most weeks gets deleted in month one; doubling publish frequency doubles staleness and halves editorial quality; nine modes rewriting every verdict is ~23,000 voice-critical strings per city per year, and the voice dies within a fortnight.
- **Em-dash and greyed placeholders in fixed slots.** A column of nothing set in tabular mono reads as broken hardware, not as honesty. Unknown fields are omitted and the slot collapses.
- **Runtime "optical fit" title sizing, and every fixed-height container around fluid type.** Both are computed at ingest or driven by `min-height`; `height: 74px` around zoomable text is why the current shell clips at 200%.

**Grafted**

- **LUGNT LÄGE** *(from Plansch)* — one switch, auto-enabled by `prefers-reduced-transparency`, `prefers-contrast: more`, or system text size above 120%, killing texture, flattening plates to left-aligned flat ink, thickening hairlines 1px → 2px and raising the reading scale one step. It detects the user instead of waiting for them to find a settings tree, it is testable in CI as a single flag, and — per NOTIS's release rule — **it ships in v1**.
- **The rem discipline as law** *(from Plansch and Pejl-atlas)* — `vw` is display-only, every readable size is rem, every clamp carries a rem term in its middle argument. It is the only statement across four pitches that guarantees iOS AA zoom and Android 200% font scale survive, and it is enforced by lint, not by goodwill.
- **The permanently-mounted time strip and the "23 dolda av läget — visa" row** *(from Pejl signal-machine)* — time gets permanent chrome at ≥44px because it is the primary axis of the product, and a filter never silently removes anything: it collapses to a visible, counted, tappable row that expands in place. Combined with the active filter printed in words, silent starvation becomes structurally impossible.
- **The fixed-position catalogue column** *(from Pejl signal-machine)* — walk time and price land on the same pixel on every row, so the eye scans one vertical column instead of zigzagging a layout. Pure legibility gain at zero brand cost, and it is what makes a tourist and a 63-year-old scan a room at the same speed.
- **The visible mechanism** *(from Pejl signal-machine, reworded to the museum register)* — `OMHÄNGD 06:40 · 212 OBJEKT · 14 NYFÖRVÄRV`, a named tappable source on every object, and a fetch timestamp. In an AI-slop era, showing and dating the machine's work is the trust argument.
- **RÄTTELSER, the public corrections desk** *(from NOTIS)* — a corrections row is a database row with a public render, and it converts the pipeline's inherent unreliability from a liability into editorial character. It is also where "rätta uppgift" finally has somewhere to land.
- **The fixed forme, downgraded from law to contract** *(from NOTIS)* — the top of IDAG is named slots with declared media requirements the automation *fills* rather than composes, so a thin Tuesday still renders a designed page and an edition can be linted and snapshot-tested before publish.
- **Six deterministic plate compositions chosen by item-id hash, and the separation-of-voices law** *(both from NOTIS)* — the first stops six imageless objects on one screen from rhyming; the second, written down as a rule rather than left as a habit, is what stops three years of contributors letting Literata leak into a caption.
- **Running accession numbers** *(from NOTIS's NR 412 and Pejl-atlas's BLAD № 214)* — every screenshot carries a number, which is how a four-week-old product looks like it has been publishing for a year. Extended the way the atlas did it: the visitor's own collections are numbered in a personal series too.
- **The ingest-time image quality gate, the omit-don't-grey rule, and the kvarter picker** *(all from Pejl-atlas)* — the best real-data engineering in the four pitches; the graceful-degradation rule that directly repairs the winning spine's worst flaw; and an eight-tile neighbourhood grid that produces real walk distances **with zero location permission ever requested**, which is what gives privacy-averse and older users the whole product instead of a hollowed-out one.
- **The terrain word on a walk line** *(from Pejl-atlas)* — "9 min till fots, uppför", "längs kajen". One string, computable, load-bearing for prams, wheelchairs and 63-year-old knees, and the cheapest piece of genuine local authorship available to us.
- **The draining daylight hairline** *(from Pejl-atlas)* — nobody in the category treats daylight as chrome. It costs nothing, it is ownable, and it gives an otherwise printed system one quietly living element without counting down to anything a person can miss.
- **The 200% zoom behaviours, verbatim** *(from Pejl-atlas)* — the catalogue rail wraps rather than truncates, fact tables collapse to a single stacked column via container query, and the sticky footer becomes static at page end so it cannot eat the viewport.
- **The wall label as a required field, the metadata rail as four fixed slots, the room threshold band, and "colour means the wing"** *(from the museum-curator judge)* — an object without a `varfor` does not publish, which is the single line that separates a curated hub from a listings page; KATEGORI / TID / PLATS / PRIS as individually-styleable slots is what makes an event and a place the same object with one different slot; and colour derived from the pillar, never authored per card, is what turns a palette into a map a returning visitor can navigate by.
- **The outbound handoff as a named component, and the print stylesheet** *(from the layout audits and Pejl-atlas)* — Dojo's documented cause of death gets a `<dialog>` that names the destination domain, saves the object first, and returns you to where you were; and a shared collection renders as a real single-page A4 with a legend, because a museum's sheet should survive being printed and taped to a fridge.

# PART 2 — ARCHITECTURE
## Navigation

**Three destinations and one control. Nothing else is ever added.**

| # | Label (SV) | EN | Route | The room it is |
|---|---|---|---|---|
| 1 | **IDAG** | Today | `/[stad]` | The entrance hall. One edition, hung twice a day. |
| 2 | **SALARNA** | The rooms | `/[stad]/salar` | The permanent collection. Four wings. |
| 3 | **SAMLINGAR** | Collections | `/samlingar` | What the visitor kept. |

**SÖK** is not a tab. It is a 44×44 control in the top bar, for two reasons that are not compromises: (a) Android's IME resizes the layout viewport and a bottom-anchored search field fights it, so search must be top-anchored anyway; (b) three tabs at 390px give each item 119px of width, and `SAMLINGAR` (9 characters at Familjen Grotesk 600, 0.8125rem = 13.81px, ~68px of advance) fits inside 119px with 25px of air on each side. At four tabs each item is 89.5px, leaving 10.7px of air, and the label starts flirting with truncation at 200% Android font scale. The label never truncates and is never icon-only — that is the older-user and tourist requirement, and it decides the item count.

**Why this beats a generic five-tab bar.** A five-tab bar is a confession that the IA was never resolved: it always contains one tab for "browse", one for "search", one for "saved", one for "profile", and one leftover that is really a feature the team could not place. STADEN has exactly three nouns — *the day*, *the city*, *mine* — and every other surface is reachable from inside one of them. Profile lives at the foot of SAMLINGAR and at `/besokaren`; the city switch lives in the lockup; the corrections desk lives at the foot of IDAG. A museum has an entrance, galleries, and the bag you carry; it does not have a fifth floor called Settings. Three destinations also means the active state is unambiguous at a glance in peripheral vision, which is what makes the mark's filled-room wayfinding legible rather than decorative.

**The mark in the bar.** Each tab item renders PLANEN at 22×22 with the filled room set to that destination's state: IDAG = top-right in `currentColor` (neutral), SALARNA = the wing you last visited (or top-right neutral at the index), SAMLINGAR = top-right neutral. The filled room is decorative reinforcement; the word is always present.

### iPhone — the floating inset capsule

```css
.stadsraden {
  position: fixed;
  left:  max(16px, env(safe-area-inset-left, 0px));
  right: max(16px, env(safe-area-inset-right, 0px));
  bottom: max(12px, calc(8px + env(safe-area-inset-bottom, 0px)));
  height: 60px;                 /* content height, not including the inset */
  border-radius: 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: color-mix(in oklch, var(--paper) 82%, transparent);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
          backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid var(--line);
  box-shadow: 0 8px 24px oklch(0% 0 0 / 0.12);
  z-index: 40;
}
@supports not (backdrop-filter: blur(1px)) { .stadsraden { background: var(--paper) } }
@media (prefers-reduced-transparency: reduce) {
  .stadsraden { background: var(--paper); backdrop-filter: none; -webkit-backdrop-filter: none }
}
@media (forced-colors: active) { .stadsraden { background: Canvas; border: 1px solid CanvasText } }
```

**Geometry at 390×844.** Capsule width = 390 − 16 − 16 = **358px**. Three items of **119.33px** each. Item internals: 9px top padding + 22px mark + 5px + 13.81px label + 10px bottom padding = 59.8 ≈ 60px. Hit box **119.33 × 60** — 2.7× the 44×44 minimum on both axes, with no gap between items because the items tile a single capsule (adjacent-target separation is satisfied by the 119px width, not by a gutter).

**Standalone portrait, 390×844 (top inset 47, bottom inset 34):** bar bottom offset = max(12, 8+34) = **42px**; the capsule's painted top edge sits at y = 844 − 42 − 60 = **742**. Content scroll containers take `padding-bottom: calc(60px + max(12px, 8px + env(safe-area-inset-bottom, 0px)) + 24px)` = **126px** in standalone, **96px** in Safari with the toolbar expanded (inset reports 0). Never bare `env()` — always the `max()` floor, because Safari's bottom inset flips between 0 and ~34 as the toolbar collapses and a bare value makes the bar jump 34px mid-scroll.

**Landscape, notched device:** left/right insets are 47px, so the capsule inset becomes 47px each side and the bar narrows to 440 − 94 = 346px in a 956×440 window — still 115px per item.

The capsule does **not** copy Liquid Glass. There is no specular edge, no inner highlight, no refraction. The entire treatment is: one 1px `--line` hairline, one soft shadow, one blur. That is deliberate — a literal Liquid Glass reproduction dates the app to one OS version and dilutes an identity built on flat ink and hairlines.

**Keyboard retraction.** `window.visualViewport` `resize` listener; when `visualViewport.height < window.innerHeight - 150`, add `.stadsraden--gomd { transform: translateY(calc(100% + 24px)) }` over 180ms `cubic-bezier(.2,0,0,1)`, wrapped in `prefers-reduced-motion: no-preference` (instant otherwise). Restored on `focusout` or when the delta closes.

### Android — the edge-to-edge bar

The floating capsule is **forbidden on Android**. A 12px bottom gap places the bar's underside inside the 24dp gesture-navigation handle strip, and the gap visibly flickers during Chrome's 56px toolbar collapse.

```css
:root[data-platform="android"] .stadsraden {
  left: 0; right: 0; bottom: 0;
  border-radius: 0;
  border: 0; border-top: 1px solid var(--line);
  box-shadow: none;
  background: var(--paper);            /* opaque — no backdrop-filter on Android */
  height: 56px;
  padding-bottom: max(env(safe-area-inset-bottom, 0px), 24px);
}
```

Total height = 56 + 24 = **80px** in gesture nav, 56 + 48 = **104px** in 3-button nav. Three `1fr` columns = **137.33px** at 412 wide, **120px** at 360, **106.67px** at 320. Active state is a Material 3 indicator pill: 32px tall, 64px wide, radius 16px, ground `color-mix(in oklch, var(--accent) 18%, transparent)`, behind the mark only — plus the label shifting Familjen Grotesk 500 → 700. Two carriers, never colour alone. Scroll containers take `padding-bottom: calc(56px + max(env(safe-area-inset-bottom,0px), 24px) + 16px)` = **96px**.

No `backdrop-filter` anywhere on Android: it drops a Pixel 8a and a 360×800 budget device below 60fps on a scrolling feed, and Android has no Reduce Transparency setting to fall back to.

**Platform detection.** `data-platform` is written server-side on `<html>` from the `Sec-CH-UA-Platform` request header (falling back to a UA regex), so there is no client flash and no layout shift. Unknown platform resolves to the Android form, because the edge-to-edge bar is correct-if-plain everywhere and the capsule is wrong-if-misapplied.

### Desktop — the rail, which is not a nav bar at all

At `(min-width: 900px) and (min-height: 620px)` the bar is removed entirely and replaced by **PLANEN**, a persistent left rail. It is not a translated tab bar: it carries the wordmark lockup as a plate screwed to the wall (Part 1), then the **four wings by name** — which the phone's three-tab bar cannot show — then the visitor's collections by name, then the city, theme and LUGNT LÄGE controls at the foot.

| Width | Rail | Contents |
|---|---|---|
| 900–1199 | **220px** | Lockup at 1.25rem cap-set, four wings, first 5 collections, foot controls |
| 1200–1599 | **260px** | Lockup at 1.75rem cap-set, four wings, all collections (own scroll), foot controls |
| ≥1600 | **260px** | As above, plus the LÄSRUM pane opens on the right |

Rail is `position: sticky; top: 0; height: 100dvh; overflow-y: auto; overscroll-behavior: contain;` with a 1px `--line` right border and its own scroll context. Rail items are 44px tall, 12px horizontal padding, label at `--type-secondary` (0.9375rem = 15.94px) Familjen Grotesk 500 → 700 when active, with a 3px pillar-hue rule flush to the item's left edge when it is a wing.

**The top bar at 390px** (Part 1, restated with the search control): `min-height: 56px`, `padding-top: env(safe-area-inset-top, 0px)`, opaque `--ground`, 1px `--line` bottom rule, `position: sticky; top: 0`. Layout: `grid-template-columns: 1fr 8px 44px`. The lockup (wordmark 0.9375rem cap-set → rule → GÖTEBORG 0.8125rem mono) occupies 298px; the city half is a `<button aria-haspopup="dialog">` whose hit box spans the full 56px bar height. The search control is a 44×44 `<a href="/sok">` with an inline 20×20 SVG. Measured widths at 390: wordmark ≈ 66px, GÖTEBORG ≈ 69px, leaving ≥163px of rule — the full-bleed hairline always reads.

---

## Home

**IDAG on iPhone 390×844, Safari portrait, visible viewport 734px (toolbars expanded), 812px (URL bar collapsed).**

Root is 17px. Computed values used below: `--type-micro` 0.75rem = **12.75px**, `--type-catalogue` 0.8125rem = **13.81px**, `--type-secondary` 0.9375rem = **15.94px**, `--type-label`/`--type-body` 1.0625rem = **18.06px**, `--type-lede` 1.3125rem = **22.31px**. `--type-display` at 390px = 1.9rem + 4.2vw = 32.30 + 16.38 = **48.68px**. `--type-title-lg` at 390px = 22.10 + 6.24 = **28.34px**. Gutter is 20px each side → **content width 350px**.

IDAG is a **fixed forme**: ten named slots with declared media and length requirements. The automation *fills* slots; it never composes a page. An edition is therefore lintable and snapshot-testable before publish, and a thin Tuesday renders a designed page rather than a collapsed one.

### The stack, top to bottom

**SLOT 0 — MASTHEADPLATTAN (identity chrome). y = 56 → 131. Height 75px.**
- 14px top padding
- `<Wordmark/>` SVG, cap-set to `--type-display` = 48.68px, full-bleed left to the gutter
- 10px
- 2px `--line-strong` full-bleed rule, bleeding past both gutters to the viewport edges
- Together with the 56px sticky bar this is **131px of identity chrome = 17.8% of 734px**, against Part 1's 25% (183px) cap. The 52px of slack is deliberate: at 200% text scale the wordmark grows to 1.9×34 + 16.38 = 81px and the block becomes 107px, total chrome 163px — still under cap without a media query.
- There is **no** scroll-driven masthead shrink. The masthead scrolls away; the 56px bar stays.

**SLOT 1 — MEKANISMRADEN (the visible mechanism + the refresh path). y = 131 → 178. Height 47px.**
- A 44px-tall `<button>` spanning the content width, `justify-content: space-between`, DM Mono 500 caps at `--type-catalogue`, `font-variant-numeric: tabular-nums`.
- Left: `OMHÄNGD 06:40 · 212 OBJEKT` (26 characters ≈ 215px at 8.29px/char). Right: `LJUS 20:41` (10 characters ≈ 83px). Total 298px in 350px.
- Tapping it re-fetches the edition. This is the mandatory refresh affordance: iOS standalone has no pull-to-refresh and no browser chrome, and Android's native pull-to-refresh is disabled by `overscroll-behavior-y: contain` on the scroller (it destroys scroll position and in-flight reads in an installed PWA). A twice-daily product needs one honest, visible, 44px way to advance the day.
- Bottom border is **LJUSET**: a 1px `--line` track with a 3px `--accent` rule over it at `width: calc(var(--dagsljus) * 100%)`, transitioning 600ms `linear` on a data refresh only. `--dagsljus` is written once per render from the city's sunrise/sunset. It counts toward nothing.
- At 200% the row wraps to two lines and grows to 88px; `min-height`, never `height`.

**SLOT 2 — DAGENS NOTIS (the human hand). y = 178 → 274. Height 96px.**
- 18px top padding, Literata 400 **italic** at `--type-lede` 22.31px, `--lh-body` 1.55 → 34.6px per line, `max-width: 34rem`, 18px bottom padding.
- At 350px width and ~10.5px average advance, ~33 characters per line. `Regn till fyra. Vi har hängt dagen inomhus, utom en sak.` = 56 characters = **2 lines** = 69.2px. Block = 18 + 69.2 + 18 = 105.2 → the slot contract caps the note at **two lines at 390px**, i.e. **≤ 66 characters**, and the slot reserves 96px with `min-height`. A three-line note is a publish-time lint failure, not a runtime overflow.
- This is the only Literata italic on the screen and the only sentence on IDAG a person wrote about *the day* rather than about an object.

**SLOT 3 — LEDPLATTAN (the first object). Media y = 274 → 534.**
- Full-bleed to the viewport edges, **3:2**, `border-radius: 0`. At 390px wide the media is **260px** tall. Background `--line` so a slow load is a flat grey block with the box already reserved — zero CLS whether the image arrives, arrives late, or never arrives.
- Media requirement declared by the slot: real photograph, ≥1200px long edge, aspect 0.5–2.2. If the edition cannot supply one, the slot renders a **KATALOGPLATTA** at the same 3:2 box — never an empty frame, never a demotion at render time.
- Credit line under the frame, DM Mono `--type-catalogue`: `FOTO: RÖDA STEN KONSTHALL`, or `BILD FRÅN ARRANGÖREN` when the photographer could not be verified.
- 3px pillar rule flush to the media's bottom edge, full-bleed. `view-transition-name: plate-<id>`.
- Then, in the gutters: 14px → accession `NR 041 · SAL KULTUR` at `--type-micro` (12.75px, `aria-hidden`) → 6px → **title** at `--type-title-lg` 28.34px, `--lh-title` 1.08 = 30.61px/line, `overflow-wrap: anywhere; hyphens: auto`. Two lines = 61.2px → 10px → **wall label**, Literata 400 at `--type-label` 18.06px, `--lh-label` 1.55 = 28.0px/line.

  **The fold, stated honestly.** At 734px the visitor sees: the identity, the mechanism and the daylight, the day's note in full, the entire photograph, the accession number, the entire title, and the **first three lines of the curator's sentence** — with the fourth line cut by the fold. That cut line is the scroll affordance; a clipped line of prose is the most reliable "there is more" signal that exists, and it costs nothing. With the URL bar collapsed (812px) the whole label (5 lines, 140px, ending at y = 785) plus the first catalogue-rail slot are visible.

  The lead slot's contract caps the label at **30 words** (Part 1's range is 25–40) precisely so five lines is the worst case at 390px.
- Below the label: 12px → **KATALOGRALEN**, four fixed slots, then the 48×48 SPARA control at the plate's bottom-right, 16px from both edges.

**SLOT 4 — TIDSREMSAN + SÄLLSKAPET (wayfinding). Two 44px rows + rules = 96px.**
- Sits *below* the first object, not above it. On IDAG the strip is **not** sticky — the first screen must contain an object, not chrome. Inside a SAL it **is** permanently mounted, sticky under the 56px bar, because that is where filtering is the work.
- Row 1, TIDSREMSAN: `NU · IKVÄLL · IMORGON · HELGEN · ALLTID`. Segmented, horizontally scrollable with `scroll-snap-type: x mandatory`, `scroll-padding-inline-start: 20px`, `overscroll-behavior-x: contain`, `touch-action: pan-x`. Each segment `min-height: 44px`, 12px horizontal padding, DM Mono 500 caps `--type-catalogue`. **ALLTID is permanent and is never removed** — that is what makes the permanent city a first-class citizen of the time axis instead of a bolt-on.
- Row 2, SÄLLSKAPET: `ALLA · MED BARN · TVÅ · VÄNNER · ENSAM · PÅ BESÖK`. Same geometry. At 390px, `ALLA` (57px) + 8 + `MED BARN` (90px) + 8 + `TVÅ` (49px) = 212px — the three most-used chips are on screen without scrolling.
- Both rails leave the leftmost 20px untouched on `touchstart` (iOS interactive-pop zone) and begin their first chip at `padding-inline-start: 20px` (Android's 24dp gesture-exclusion strip).
- When any chip is active, the active state is printed in words directly under the rows in Literata `--type-secondary`: `Visar: med barn, ikväll.` with an inline `Rensa` button. Never a code string.

**SLOT 5 — RUMMET. Four objects in the active time band, card form.**
- Single column at 390px, 20px gaps, cards 350px wide. Media 4:5 = 437.5px tall each.
- **HÄNGNINGEN** on first paint: `@starting-style` on opacity 0→1 and `clip-path: inset(0 0 8% 0)` → `inset(0)`, 200ms, 40ms stagger, hard-capped at 8 objects / 320ms.

**SLOT 6 — ANSLAGSTAVLAN. Maximum one countdown plate. ~80px.** Full spec in *Countdown*.

**SLOT 7 — DEN PERMANENTA STADEN. Three place objects, same chassis, same size.**
- Preceded by a TRÖSKEL (threshold band): 96px of ground, a 2px full-bleed `--line-strong` rule, and the band name in `--type-room` (at 390px: 25.50 + 10.14 = **35.64px**) with the pillar hue as a 3px rule under it.
- This slot can never be empty: SEVÄRDHETER and MAT have no publication dependency on the day's scrape.

**SLOT 8 — EN SAL. One wing, editor-chosen, threshold band + 2 objects + a 48px `Gå in i salen →` link.**

**SLOT 9 — SLUTPLATTAN. End of edition.**
- Full-bleed KATALOGPLATTA watermark (PLANEN at 140vw, bled off two edges, plate keyline 10% ink, walls 16%, filled room 5%).
- `Slut för idag. Nästa hängning klockan 06:40. Vill du ha mer finns hela staden i Salarna.` in Literata `--type-label`.
- Mechanism stamp repeated in full: `OMHÄNGD 06:40 · 212 OBJEKT · 14 NYFÖRVÄRV`.
- 44px rows: `Rättelser`, `Källor och licenser`, `Om STADEN`.
- Bottom padding = 126px (standalone) so the last row clears the capsule and the home indicator.

### Object budget

**Minimum 6, maximum 11 objects per edition** (1 lead + 4 room + 1 anslag + 3 permanent + 2 sal). Below 6 the edition publishes with `Tunn dag. Fyra saker, och alla fyra är värda det.` in the notis slot and slots 5 and 8 collapse rather than pad. Above 11 the surplus is not shown on IDAG — it is in SALARNA. Radical curation is the product; the ceiling is a ceiling, not a target.

### Android 360×800 — what changes

Chrome's top toolbar is 56px → **visible viewport 744px**. Content width = 360 − 40 = **320px**.

| Block | iPhone 390 | Android 360 | Why |
|---|---|---|---|
| `--type-display` | 48.68px | 32.30 + 15.12 = **47.42px** | vw term |
| Masthead height | 75px | **73px** | follows the wordmark |
| Mekanismraden | 47px | **47px** | `OMHÄNGD 06:40 · 212 OBJEKT` = 215px, `LJUS 20:41` = 83px, fits 320px |
| Dagens notis | 96px | **96px**, ~30 chars/line, still 2 lines at ≤60 chars | slot contract tightens to 60 chars below 375px |
| Lead media 3:2 | 260px | **240px** | full-bleed |
| `--type-title-lg` | 28.34px | 22.10 + 5.76 = **27.86px** | |
| Nav | 60px capsule, 42px offset | **56 + 24 = 80px** full-bleed | M3 |
| Scroll padding-bottom | 126px | **96px** | |
| Cumulative to lead-media bottom | 534px | **512px** | Android's taller viewport (744 vs 734) plus the shorter chrome buys **54px more of the wall label above the fold** — four lines instead of three |

Android's extra height is spent on content, not air: the `TRÖSKEL` band is 96px on both, but the room slot's first card top edge is guaranteed to peek by ≥64px above the fold via `min-height: min(calc(100svh - 56px - 80px), 720px)` on the lead block.

**320px floor.** Gutters become `padding-inline: clamp(16px, 5vw, 20px)` → 16px at 320, content 288px. Verified target: the card title set in `Universeumutställningen` at `--type-title` with `overflow-wrap: anywhere; hyphens: auto; lang="sv"` must not produce horizontal page scroll. That string, not lorem, is the acceptance test.

**Never `dvh` on a visible block.** `svh` for anything that must not jump when Chrome's toolbar collapses; `dvh` only on the fixed app shell and the AVFÄRDEN dialog; `lvh` nowhere.

---

## Events and places as one system

### One table, one discriminant

```sql
create type objekt_slag as enum ('handelse', 'plats');
create type sal as enum ('kultur', 'nojen', 'mat', 'sevardheter');

create table objekt (
  id             uuid primary key default gen_random_uuid(),
  stad_id        uuid not null references stader(id),
  slag           objekt_slag not null,
  sal            sal not null,
  titel          text not null,
  slug           text not null,
  accession      text not null,                 -- 'K-014', 'M-032'
  varfor         text not null check (          -- the wall label. No varfor, no publish.
                   array_length(regexp_split_to_array(btrim(varfor), '\s+'),1) between 25 and 40),
  varfor_kort    text not null check (char_length(varfor_kort) <= 90),
  kvarter        text not null references kvarter(kod),
  gangminuter    smallint,                      -- from the kvarter centroid, not from the user
  terrangord     text,                          -- 'uppför', 'längs kajen', 'jämnt'
  pris_min       integer, pris_max integer, pris_fri boolean not null default false,
  oppettider     jsonb,                         -- places only
  ar_anslag      boolean not null default false,-- editorial. Never inferred.
  datum_bekraftat boolean not null default false,
  media_id       uuid references media(id),     -- nullable, always
  plate_seed     integer not null,
  plate_layout   smallint not null,
  plate_font_px  smallint not null,
  plate_breaks   text[]   not null,
  google_place_id text,                         -- join key ONLY
  kalla_url      text not null, kalla_namn text not null, hamtad_at timestamptz not null,
  utgaende_mobilvanlig boolean,                 -- null = unchecked
  publicerad_at  timestamptz, rattad_at timestamptz
);

create table tillfallen (                       -- 0..n. Zero = a place.
  id uuid primary key, objekt_id uuid not null references objekt(id) on delete cascade,
  borjar timestamptz not null, slutar timestamptz,
  dorrar timestamptz, heldag boolean not null default false
);
```

An **event** is an object with ≥1 `tillfalle`. A **place** is an object with 0 `tillfallen` and an `oppettider` blob. Nothing else differs in the schema. There is no `events` table and no `places` table, because two tables produce two feeds glued together, and the glue is always visible.

**Fields Google may never touch.** `titel`, address, rating, review text and photo bytes are `NOT NULL`-sourced from storable origins (Göteborg & Co, OSM/Overture, Wikidata/Wikipedia, venue sites with attribution, own editorial), recorded per row in a `kalla_namn`. `google_place_id` is the only Google-derived column that persists. `koordinater` and `koordinater_hamtade_at` live in a separate `platsdata` table with a nightly job that nulls any row older than 28 days. A CI grep fails the build if a Places response field other than `place_id` is ever written to Postgres, and live enrichment fetches carry `cache: 'no-store'` with `export const dynamic = 'force-dynamic'` and a `Cache-Control: private, no-store` response header — because Next 16's default fetch caching would otherwise create the violation for you.

### What differs in presentation: exactly one slot

The card chassis, the plate size, the media aspect, the type, the pillar rule, the accession number, the wall label and the save control are **byte-identical** between an event and a place. The only difference is **KATALOGRALEN slot [2], TID**:

| | slot [1] KATEGORI | slot [2] TID | slot [3] PLATS | slot [4] PRIS |
|---|---|---|---|---|
| Event | `KULTUR` | `IKVÄLL 19:00` / `OM 9 DAGAR · 13 AUG` / `PÅGÅR NU · TILL 15 AUG` | `MAJORNA · 9 MIN, UPPFÖR` | `180 KR` |
| Place | `MAT` | `ALLTID · TIS–SÖN 11–17` | `LINNÉ · 4 MIN, JÄMNT` | `FRÅN 145 KR` |

A place is never smaller, never lower in a mixed room, never in a different colour family, and never sorted below an event. **Order inside a room is editorial catalogue order** — `position numeric`, fractional-indexed, set by the human editor. Start time is not the primary sort key anywhere in the product, because a restaurant, a playground, a walk and a three-month exhibition do not have one, and a sort key that exists for half the catalogue is not a sort key.

### How a "restauranger" browser and an "ikväll" browser end up in the same room

They both end up looking at the same object chassis in the same gallery, reached by two axes that intersect rather than fork:

- The **restauranger** visitor entered by **SAL** (`/[stad]/salar/mat`). The TIDSREMSAN above the gallery is preselected to `ALLTID`. The gallery contains every MAT object; the events among them (a supper club on Thursday, a food-hall pop-up) sit in catalogue order among the permanent restaurants, distinguished only by their TID slot reading `TORS 19:00` instead of `ALLTID · TIS–SÖN 11–17`.
- The **ikväll** visitor entered by **TID** (IDAG → TIDSREMSAN → `IKVÄLL`). The result is the same gallery chassis, now filtered to objects that are open or occurring between 17:00 and 23:59 tonight — which includes the restaurants, because a restaurant open until 23:00 *is* something happening tonight. The KATEGORI slot tells them which wing each object belongs to; the pillar rule at the plate's top edge repeats it in colour.

Both then hit the same **object page** and the same **AVFÄRD** sheet. Neither ever saw a screen the other did not have access to. The axes are `sal × tid × sällskap × kvarter`, applied as predicates over one table — never as separate products.

**The filter never silently starves.** Any predicate that removes objects renders a counted, tappable row in the gallery at the point where they were removed: `23 dolda av läget — visa`, 44px tall, expanding in place without navigation. Combined with the active filter printed in words above the gallery, invisible starvation is structurally impossible.

---

## Discovery

Discovery is a **building**, not a settings panel. There are four rooms and four axes, and the axes are printed on the wall of every room rather than hidden behind a funnel icon.

### The rooms (salar)

| Room | Swedish | Contents | Hue token |
|---|---|---|---|
| 1 | **KULTUR** | Art, theatre, museums, exhibitions, film, literature | `--kultur` |
| 2 | **NÖJEN** | Nightlife, gigs, comedy, sport, clubs, live music | `--nojen` |
| 3 | **MAT** | Restaurants, cafés, bars, food halls, street food, bakeries | `--mat` |
| 4 | **SEVÄRDHETER** | Landmarks, nature, walks, playgrounds, viewpoints, hidden gems | `--sevardheter` |

Each room is a route (`/[stad]/salar/kultur`) with a **TRÖSKEL** at the top: 96px band on mobile / 160px at ≥1200, a 2px full-bleed `--line-strong` rule, the room name at `--type-room`, and the pillar hue as a 3px rule and as the ground of the band's left 22% (light) / capped flood (dark). The room name's variable weight interpolates 500 → 700 on `animation-timeline: view()` — the one variable-axis motion in the product, justified because a room name gets heavier as you enter it. PLANEN in the tab bar and in the rail moves its filled room to match. `view-transition-name: sal-<name>` on the threshold band.

### The four axes (permanently mounted, never hidden)

1. **TIDSREMSAN** — `NU · IKVÄLL · IMORGON · HELGEN · ALLTID`. Sticky under the top bar inside a room. 44px. Time-of-day bands are computed in `Europe/Stockholm`: MORGON 05:00–10:59, DAGTID 11:00–16:59, KVÄLL 17:00–23:59, NATT 00:00–04:59 (which shows the remainder of KVÄLL plus tomorrow, pre-empted). `ALLTID` is a permanent segment.
2. **SÄLLSKAPET** — `ALLA · MED BARN · TVÅ · VÄNNER · ENSAM · PÅ BESÖK`, with two toggles on a second row inside the room: `INOMHUS/UTOMHUS` and `BILLIGT` (≤150 kr or free). These map to editorial boolean columns (`passar_barn`, `passar_par`, `passar_grupp`, `passar_ensam`, `passar_besokare`, `inomhus`), set by the human editor. There is no scoring, no model, no inference. The active selection is printed in words with a visible undo, never as a code string like `LÄGE: DEJT+UTE`.
3. **KVARTERSPLANEN** — an eight-tile grid, 2×4 on mobile, each tile 165×88px at 390px (350 − 20 gap ÷ 2 = 165). Göteborg's eight: `CENTRUM · NORDSTAN · HAGA · LINNÉ · MAJORNA · HISINGEN · GAMLESTADEN · ÖRGRYTE`. Selecting one recomputes every `gangminuter` from that kvarter's centroid node. **Geolocation efterfrågas aldrig på sidladdning.** `geolocation=(self)` är aktiverat enbart för den explicita handlingen "Använd min position"; koordinaten hålls i flikminnet och områdesvalet erbjuder full funktion utan tillstånd. Privacy-averse and older users get the whole product, not a hollowed-out one.
4. **VÄDERRADEN** — one machine mono line above the TIDSREMSAN inside a room and on IDAG: `REGN TILL 16 · 11°`. Source SMHI (open, storable, no key), fetched at 06:40 with a 12:00 top-up. When the API is down the line is **omitted entirely** — never greyed, never an em-dash, per the kill list. Weather never reorders content by itself; it sets the editor's INOMHUS/UTOMHUS default for the day, which is printed in words and undoable.

### Three visitors, taps counted

**A. Stressed parent, 08:00 Saturday, 360px Android.**
- *Tap 0:* opens the app. IDAG is already a Saturday-morning edition: the MORGON band is active, the day's note reads `Blåsigt från väster. Bra dag för museum och långa luncher.`, and the lead object is the editor's Saturday pick.
- **Tap 1:** `MED BARN` in SÄLLSKAPET (slot 4, second row, 212px of chips on screen without scrolling; the chip is at y ≈ 610 on a 744px viewport — inside the thumb arc).
- **Tap 2:** the first card in RUMMET, now a family object.
- → **2 taps.** She has an object page with hours, a price, a walk time from CENTRUM and a sentence telling her which part is annoying. A third tap saves it.

**B. 63-year-old tourist, off the Landvetter bus, iPhone, no account, LUGNT LÄGE auto-enabled by his 130% system text size.**
- **Tap 1:** `SALARNA` in the tab bar (119×60px, bottom of the screen, thumb arc).
- **Tap 2:** `SEVÄRDHETER` — one of four full-width 88px room plates, labelled in words at `--type-room`, not icons.
- **Tap 3:** the first object.
- → **3 taps.** Every plate on his path is flat ink, left-aligned, halftone off, one step up the reading scale, because LUGNT LÄGE detected him rather than waiting for him to find a settings tree. He never saw a location prompt; walk times default from CENTRUM.

**C. 26-year-old, 90 free minutes, standing in Haga.**
- **Tap 1:** `NU` in the TIDSREMSAN on IDAG (slot 4, row 1).
- **Tap 2:** the first card.
- → **2 taps.** If he wants Haga specifically: **tap 1** `NU`, **tap 2** `HAGA` in KVARTERSPLANEN (reachable from the room without navigation — it is a `<details>` disclosure inside the axis block, 44px summary row), **tap 3** the object. → **3 taps.**

**The guarantee.** Every primary feature — open an object, save it, switch room, switch time, switch neighbourhood, switch city, search, open a collection, get directions — is **≤3 taps from any of the three destinations.** This is enforced by a route-graph test in CI that walks every `<a>`/`<button>` from each tab root and fails on any primary action at depth 4.

---

## The object page

Route `/[stad]/objekt/[slug]`. One object, one wall, air around it. Zones in DOM order, which is also reading order, which is also tab order.

**Z0 — the back affordance.** The 56px bar's left slot becomes a 44×44 back control labelled with the room you came from (`← SAL KULTUR` at `--type-catalogue`). It calls `router.back()` when `history.state.key` shows an in-app origin and `router.push('/[stad]/salar/[sal]')` on a cold deep link — so a shared URL never dead-ends and never exits the app.

**Z1 — MEDIEPLATTAN.** Full-bleed, **4:5, capped at 62dvh**. At 390×844 standalone: 4:5 wants 487.5px, 62dvh = 523px → 487.5px wins. At 390×734 Safari: 62dvh = 455px → 455px wins and the media is letterboxed by cropping to the stored focal point, never by letterbox bars. Background `--line`. `object-position` from the stored focal point (default `50% 38%`). `view-transition-name: plate-<id>` — the SALSBYTE morph target. Filter: `contrast(1.04) saturate(var(--media-sat))` plus a pillar overlay at `var(--media-tint)`; MAT sets `--media-sat: 1; --media-tint: 0` as a published rule. Dark mode adds `brightness(0.94)` and a 1px `--line` keyline.
- **Missing image →** KATALOGPLATTA at the same box, composition chosen by `plate_layout`, type solved at ingest, never cropped.
- **Demoted image** (<800px long edge or aspect outside 0.5–2.2) → KATALOGPLATTA at full bleed with the real photograph as a **96×96 inset in the bottom-right corner with a 1px keyline**. Demotion happens at ingest, never at render.
- **No text is ever set on the photograph.**

**Z2 — BILDTEXTEN.** Under the frame, DM Mono 400, `--type-catalogue`: `FOTO: RÖDA STEN KONSTHALL`. Absent photographer → `BILD FRÅN ARRANGÖREN`. No image → the zone is omitted and the slot collapses; no placeholder, no em-dash.

**Z3 — SALSRULLEN.** 3px pillar-hue rule, full-bleed, flush to the media's bottom edge. `view-transition-name: rule-<id>`; sweeps to full width on SALSBYTE and draws `scaleX(0→1)` from the left on `animation-timeline: view()`.

**Z4 — ACCESSIONSRADEN.** DM Mono 500 caps `--type-micro` (12.75px), `aria-hidden`: `NR K-014 · SAL KULTUR`. It is wayfinding for the eye, not information a screen-reader user needs before the title.

**Z5 — TITELN.** `<h1>` Familjen Grotesk 700 at `--type-title-lg` (28.34px at 390, 42.5px capped at ≥1280), `--lh-title` 1.08, `--tr-title` −0.012em, `overflow-wrap: anywhere; hyphens: auto`. Never truncated, never clamped, no fixed-height parent. `view-transition-name: title-<id>`.

**Z6 — ANSLAGET.** Rendered only when `ar_anslag = true` and a confirmed occurrence exists. Full spec below.

**Z7 — VÄGGETIKETTEN.** The wall label. Literata 400, `--type-label` 18.06px, `--lh-label` 1.55, `max-width: 34rem`, colour `--ink` (never `--muted` — this is the product's most important prose). 25–40 words, sentence case, one concrete checkable fact, names the awkward part. **An object without a `varfor` cannot publish** — a `NOT NULL` column with a word-count `CHECK`, not a guideline.

**Z8 — KATALOGRALEN.** A `<dl>` of four fixed slots. **Fixed-position value column:** the `<dt>` column is 96px wide at ≤767px and the `<dd>` column starts at x = 116px on every row, so walk time and price land on the same pixel and the eye scans one vertical line. DM Mono, labels 500 caps at `--type-catalogue` in `--muted`, values 400 in `--ink`, `font-variant-numeric: tabular-nums`, `--tr-cat` 0.06em, `--lh-cat` 1.35.

| Slot | Label | Event value | Place value | Missing |
|---|---|---|---|---|
| 1 | `KATEGORI` | `KULTUR` | `MAT` | Never missing — `sal` is `NOT NULL` |
| 2 | `TID` | `TORS 13 AUG · 19:00` / anslag string | `TIS–SÖN 11–17` | **Hours unknown →** the row is omitted; the object still shows `ALLTID` in the card's slot [2] but the detail rail drops the row entirely rather than printing an em-dash |
| 3 | `PLATS` | `SLOTTSSKOGEN · MAJORNA · 9 MIN, UPPFÖR` | same | **Address unknown →** kvarter + walk survive; the street line drops. **Kvarter unknown →** the object does not publish |
| 4 | `PRIS` | `180 KR` / `FRI ENTRÉ` / `FRÅN 145 KR` | same | **Price unknown →** row omitted. Never `?`, never `–`, never "Pris ej angivet" |

**At 200% text scale the rail wraps rather than truncates:** `@container (max-width: 22rem)` (rem, so the query itself is zoom-aware — at root 34px, 22rem = 748px and a 350px rail always collapses) switches the `<dl>` to a single stacked column, label above value, 8px between pairs.

**Z9 — FAKTABORDET.** A second `<dl>` on `--paper`, 1px `--line` keyline, for what a database knows and a rail should not carry: full address, opening hours per weekday, phone, tillgänglighet (step-free entrance, accessible WC, hearing loop — from the venue's own declaration, attributed), terrain notes, and public-transit stop. Two columns at ≥20rem container width, one stacked column below. Every row is individually omitted when its field is null; the table itself is omitted when fewer than two rows survive.

**Z10 — HANDLINGARNA.** Actions, each `min-height: 48px`, full width, 12px apart, ordered by likelihood not by revenue:
1. `Spara` — `<button aria-pressed>`, ETIKETTEN motion, primary surface `--accent-solid` with `--accent-ink` (7.3:1 light / 9.1:1 dark).
2. `Köp biljett` / `Boka bord` — opens AVFÄRDEN. Rendered only when `utgaende_url` exists.
3. `Vägbeskrivning` — opens AVFÄRDEN in directions mode.
4. `Dela` — `navigator.share()` where available, copy-link fallback.

These sit in the thumb arc: on a 390×844 standalone screen the block starts no higher than y = 560 relative to the scroll position when the page is scrolled to the actions, and the SPARA control is additionally mirrored at the media plate's bottom-right so one save is always within reach.

**Z11 — KÄLLAN.** DM Mono `--type-catalogue`: `Källa: pustervik.se · hämtad 06:12 · rätta uppgift`. The domain is a real link; `rätta uppgift` is a 44px control opening the corrections form. Attribution for ODbL (OSM) and CC-BY-SA (Wikidata/Wikipedia) renders here as a required, structurally non-omittable child of the same component — the attribution slot is part of the source component, so it cannot be forgotten by a future contributor.

**Z12 — RÄTTELSEN.** When `rattad_at` is set, a plate above KÄLLAN: `Vi hade fel. Rättat 14 aug: entrén är 80 kr, inte fri.` Literata, `--ink`, 2px `--line-strong` rule above. Corrections are editorial character, not shame.

**Z13 — GRANNAR.** Three objects in the same kvarter, chosen by kvarter + pillar adjacency, never by popularity, never by a model. Heading `I samma kvarter`. Card form, horizontal rail with 78vw cards (max 320px) so the next card peeks by ~22vw.

**Z14 — footer padding** = 126px (iOS standalone) / 96px (Android).

**Print stylesheet:** `@media print` drops Z0, Z10, Z13; sets media to 90mm wide; prints Z5, Z7, Z8, Z9, Z11 on one A4 page in `--ink` on white with the accession number in the top margin.

---

## Countdown

**Component name: ANSLAGET. Swedish accessible name: "Anslag."** A notice board, not a timer. It is a rectangle with full-bleed rules; **it is never a circle, never has text locked inside a fixed-aspect shape, and never has a fixed height.**

### Qualification: what makes an event "big"

All five must hold. Any one failing removes the anslag.

1. `ar_anslag = true` — set by a human editor in the review queue. **Never inferred, never derived from ticket volume, capacity, popularity or click-through.** This flag is the door growth-hack pressure walks through, and it is nailed shut: the column has no automated writer, and a CI check fails the build if any code path outside the editor mutation writes it.
2. `slag = 'handelse'` with at least one `tillfalle` whose `borjar` is not null.
3. `datum_bekraftat = true` — an editor confirmed the date against the venue. No anslag ships from a scraped date.
4. `varfor` present (implied by the publish gate, restated because an anslag without a reason is an advertisement).
5. A venue: `plats_namn` not null.

**Concurrency cap: at most 3 anslag per city at any time.** Enforced by a deferred constraint trigger:

```sql
create or replace function anslag_tak() returns trigger language plpgsql as $$
begin
  if (select count(*) from objekt o join tillfallen t on t.objekt_id = o.id
      where o.stad_id = new.stad_id and o.ar_anslag
        and coalesce(t.slutar, t.borjar) >= now()) > 3
  then raise exception 'Max tre anslag per stad.'; end if;
  return null;
end $$;
```

Advisory guidance shown to the editor (never enforced by code): an anslag normally runs ≥2 days, or recurs annually, or occupies a city-scale venue. Advisory, because the moment capacity is a rule it becomes a growth metric.

### DST-safe day arithmetic (Europe/Stockholm)

```ts
const DAG = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Europe/Stockholm', year: 'numeric', month: '2-digit', day: '2-digit'
});
// civilDay: an integer day index in the city's civil calendar, immune to DST.
function civilDay(d: Date): number {
  const [y, m, dd] = DAG.format(d).split('-').map(Number);
  return Date.UTC(y, m - 1, dd) / 86_400_000;
}
export function avstand(nu: Date, mal: Date): number {
  return civilDay(mal) - civilDay(nu);          // calendar days, never ms division
}
```

Both instants pass through the **same city-zone formatter** before subtraction. 29→30 March 2026 is a 23-hour day and 24→25 October 2026 is a 25-hour day; millisecond division is off by one on both, twice a year, and is unreproducible in a UTC CI runner. `civilDay` returns the same integer on a Vercel edge node in UTC, on a phone in Bangkok, and in a GitHub Actions container. `avstand` is unit-tested against both 2026 transitions and against a `TZ=Asia/Bangkok` and `TZ=UTC` matrix.

`veckor = Math.round(dagar / 7)` for the 60–15 band.

### Type invariant

`--type-anslag: clamp(1.5rem, 1.25rem + 1.2vw, 2.25rem)`.

| Width | `--type-anslag` | `--type-title-lg` (largest heading on the screen) | Holds? |
|---|---|---|---|
| 320 | 21.25 + 3.84 = 25.09 | 22.10 + 5.12 = 27.22 | ✓ |
| 390 | 21.25 + 4.68 = **25.93** | 22.10 + 6.24 = **28.34** | ✓ |
| 768 | 21.25 + 9.22 = 30.47 | 22.10 + 12.29 = 34.39 | ✓ |
| 1440 | capped **38.25** | capped **42.50** | ✓ |
| 390 @ 200% text (root 34px) | floor **51.00** | floor **55.25** | ✓ |

The numeral is **never the largest glyph on any screen at any width or zoom level**, and this is provable from the clamps rather than enforced by review. The plate as a whole is capped at **25% of the first viewport's height** — 183px at 390×844 — which is the operative form of Part 1's 25% rule. (A literal "25% of the largest heading" would be 7.1px at 390px, below the 13px legibility floor; the plate-area budget is the reading that preserves both the intent and the floor, and it is recorded here so no one re-derives the 7px version.)

### Geometry

```
╔═ 2px --line-strong, full-bleed past both gutters ══════════╗
   14px
   ┌──────────────┬───────────────────────────────────────┐
   │ FIGURKOLUMN  │  TEXTKOLUMN                           │
   │ 40%, ≤132px  │  1fr                                  │
   │ numeral      │  event title, --type-title            │
   │ unit, mono   │  venue · dateline, mono               │
   └──────────────┴───────────────────────────────────────┘
   14px
╚═ 1px --line, full-bleed ═══════════════════════════════════╝
```

At 390px: 2 + 14 + max(48.6, 47.2) + 14 + 1 = **79.6px ≈ 80px**, `min-height` only. Grid gap 16px. `font-variant-numeric: tabular-nums` throughout.

### The seven bands

| Band | Figure column | Text column | Notes |
|---|---|---|---|
| **>60 d** | *collapsed* — no numeral at all | `I KALENDERN · 13 AUG` on line 1, title line 2, `SLOTTSSKOGEN` line 3 | Plate height 62px. **Never on IDAG.** Appears only in KALENDARIET and on the object page. |
| **60–15 d** | `6` at `--type-anslag`, `VECKOR` in mono below | title / `13 AUG · SLOTTSSKOGEN` | Weeks, not days — a two-digit week number is calmer than a two-digit day count |
| **14–2 d** | `9` / `DAGAR` | title / `13 AUG · SLOTTSSKOGEN` | |
| **imorgon** | the **word** `IMORGON`, Familjen Grotesk 700 at `--type-anslag`, no digit | title / `13 AUG · SLOTTSSKOGEN` | |
| **idag, ej börjat** | `IDAG` | title / `ÖPPNAR 18:00 · SLOTTSSKOGEN` | Time appears only here, only as a door time, never as a remaining duration |
| **pågår nu** | 6px `--accent` dot (`aria-hidden`) + `PÅGÅR NU` | title / `TILL 15 AUG · SLOTTSSKOGEN` | **Static dot. No pulse, no animation, ever.** Shipped only from a stored, editor-confirmed range — never from opening hours or a live status, because a board that sends a 63-year-old to a locked door is the worst failure this product can produce |
| **avslutat** | `AVSLUTAT` in `--muted` | `15 AUG` | The 2px top rule drops to 1px `--line`; the whole plate goes `--muted`. Object leaves IDAG, stays in SALARNA and in collections |

**Never** hours, minutes or seconds. **Never** "DAGAR KVAR" or any depletion phrasing — the language is arrival (`OM 9 DAGAR · 13 AUG`). Under `forced-colors: active` the 6px dot is replaced by the literal word `PÅGÅR`.

### Surfaces

| Surface | Form | Rule |
|---|---|---|
| **IDAG** | Full plate, slot 6 | **Maximum one per edition.** Never in slot 3 (the lead), never above the fold |
| **Card** (any gallery) | A single mono line in KATALOGRALEN slot [2] — `OM 9 DAGAR · 13 AUG` | Never the plate, never a badge over media |
| **Object page** | Full plate, Z6, between title and wall label | Always present when qualified |
| **KALENDARIET** (desktop ≥1200) | A 56px table row: days right-aligned tabular, title, venue, dateline | Every dated object in the next 90 days, anslag or not |
| **Collection row** | The TID slot line only | Never the plate |
| **OG image** | Rendered by the KATALOGPLATTA renderer with the band string as the sub-line | Same renderer, so a shared link is a designed object |

### 200% text zoom

Root goes to 34px. `--type-anslag` resolves to its 51px floor; the container query `@container anslag (max-width: 22rem)` is written in **rem**, so at root 34px the threshold is 748px and any mobile plate (350px) collapses to **one column: numeral above unit above title above dateline**, left-aligned, plate `min-height` growing to ~210px. Nothing clips, nothing is cropped, the plate never becomes a fixed-aspect shape. At 100% on a ≥768px container the two-column form is retained. Tested at 320px / 200% as the acceptance case.

### Accessibility

```html
<section role="group" aria-labelledby="anslag-41" class="anslag">
  <h2 id="anslag-41" class="visually-hidden">
    Anslag. Way Out West öppnar om nio dagar, den 13 augusti, Slottsskogen.
  </h2>
  <div class="anslag__figur" aria-hidden="true"><span>9</span><span>DAGAR</span></div>
  <div class="anslag__text" aria-hidden="true">
    <p class="anslag__titel">Way Out West</p>
    <p class="anslag__rad"><time datetime="2026-08-13">13 AUG</time> · SLOTTSSKOGEN</p>
  </div>
</section>
```

- Swedish accessible name: **"Anslag"**, carried by the visually-hidden `<h2>` whose text is the full sentence. The visible numeral and mono label are `aria-hidden`, so it is read **once as a sentence** and never as four fragments.
- **`aria-live` is never set anywhere in the anslag subtree.** A notice must never announce itself changing. An ESLint rule (`no-aria-live-in-anslag`) fails the build on any `aria-live` inside a file matching `Anslag*`.
- The visible dateline is always wrapped in `<time datetime>`.
- Swedish numerals are **spelled out** in the accessible sentence (`om nio dagar`, `om sex veckor`) and set as **digits** visually. Both are generated from the same `dagar` integer by one function — there is exactly one source of truth and they cannot desync.
- The seven accessible sentences, verbatim, are Part 1 strings 6–12.

---

## Lists

Collections are called **SAMLINGAR**. They are a first-class object with their own accession series, their own cover, their own URL, and their own print sheet.

### Saving

**One tap always succeeds.** Tapping SPARA on any card or object page saves immediately to the visitor's default collection `Sparat`, flips `aria-pressed`, plays ETIKETTEN (bookmark outline → filled, 180ms; plate top rule flashes `--accent` for 220ms and settles; a short haptic where the Vibration API exists), and shows a toast anchored 16px above the tab bar for 2.4s: `Sparad i Sparat · Ångra`. No rotation, no scale overshoot, no stamp.

**The picker is opt-in, not a gate.** A long-press, or the toast's collection name, opens `Spara i samling` — a `<dialog>` with the visitor's collections as 48px rows, a `Ny samling` field, and `Klart`. The first save never blocks on it.

**No account required.** A `besokare_id` UUID is minted in `localStorage` on first save and the collection lives in IndexedDB, mirrored to Supabase only when the visitor later creates an account. Saving works offline; the offline route shows `Ingen uppkoppling. Här är det du har sparat.`

### Schema and policies

```sql
create table samlingar (
  id uuid primary key default gen_random_uuid(),
  agare_user_id uuid references auth.users(id),
  agare_besokare uuid,                       -- device identity, pre-account
  titel text not null check (char_length(titel) between 1 and 60),
  anteckning text check (char_length(anteckning) <= 160),
  accession text not null,                   -- personal series: 'S-001'
  synlighet text not null default 'privat'
    check (synlighet in ('privat','lank','publik')),
  delningsnyckel text unique,                -- 22-char base58, null unless shared
  skapad_at timestamptz not null default now(),
  check (agare_user_id is not null or agare_besokare is not null)
);
create table samlingsrader (
  samling_id uuid references samlingar(id) on delete cascade,
  objekt_id  uuid references objekt(id) on delete cascade,
  position   numeric not null,               -- fractional index, manual order
  tillagd_at timestamptz not null default now(),
  primary key (samling_id, objekt_id)        -- dedupe is structural
);
```

RLS: owner-only for `select/insert/update/delete` on `samlingar` where `agare_user_id = auth.uid()`. Sharing goes through a `security definer` view `delad_samling(delningsnyckel)` that returns **only** `titel`, `anteckning`, `accession` and the joined object rows. It never returns `agare_user_id`, never `agare_besokare`, and there is no query path from a share token to the owner's other collections. `publik` differs from `lank` only in being indexable and listed on `/samlingar/publika`.

### The collection screen

- **Header plate:** the collection's KATALOGPLATTA cover (rendered by the same six-composition renderer from `fnv1a32(samling.id)` — so a brand-new empty collection is already a designed object, which is what makes a person create a second one), then `<h1>` at `--type-title-lg`, then the accession `S-003`, then the note in Literata, then a mono line `14 OBJEKT · SENAST 21 AUG`.
- **Controls row, 44px:** `Ordning` (ORDNING / SAL / KVARTER / TID), `Dela`, `Skriv ut`, `Redigera`.
- **Rows:** below 60 items, full card chassis. **At >60 items the list switches to KATALOGRAD form** — an 88px row with a 64×64 media/plate thumbnail, title at `--type-title` on one to two lines, and the four rail slots collapsed to `SAL · TID · KVARTER` on a second mono line, with the fixed-position value column preserved.
- **Virtualisation threshold: 60.** A 200-item collection renders a windowed list (`content-visibility: auto; contain-intrinsic-size: 0 88px`) with no JS virtualiser — CSS containment alone holds 200 rows at 60fps on a Pixel 8a, and it keeps Ctrl-F, screen-reader item counts and print working, which a JS virtualiser breaks. The list is a `<ol>` so AT announces `1 av 200`.
- **A 200-item list also gets a sticky 44px index rail** on the right at ≥640px: the initials of the active sort key (A–Ö, or the four room names), tap-to-jump. Below 640px the same jump is a `<select>` in the controls row.
- **Passed events never vanish.** They move to a `TIDIGARE` section at the foot with the `AVSLUTAT 15 AUG` string in `--muted`. This is the visitor's memory, not our inventory; nothing is deleted on our schedule.
- **Reorder:** drag on pointer devices; on touch, a `Flytta` mode in `Redigera` turning each row into a 48px handle with up/down controls (drag-to-reorder on a touch list fights the browser's own scroll and the system back gesture). Keyboard: `Space` to lift, arrows to move, `Space` to drop, per APG, with a polite live region announcing `Flyttad till plats 4 av 200` — the one `aria-live` in the product, and it is nowhere near an anslag.

### Sharing

`navigator.share({ title, url })` on Android and iOS; a copy-link fallback with a 2.4s toast elsewhere. The share URL is `/s/<delningsnyckel>`. The OG image is the collection's KATALOGPLATTA cover with the title and `14 OBJEKT · GÖTEBORG` set by the same renderer — so a link pasted into a group chat is already a designed object.

**Print:** `@media print` renders a collection as a real single-page A4: 2px rule masthead with `STADEN — GÖTEBORG` and the collection title, a two-column list of objects (title, TID, PLATS, PRIS, walk minutes), a legend mapping the four pillar hues to their room names in words, and the accession number plus the print date in the footer. Because a museum's sheet should survive being printed and taped to a fridge.

### Empty and edge states

| State | String |
|---|---|
| Empty collection | `Samlingen är tom. Spara något du vill komma ihåg, så bygger den sig själv.` |
| No collections at all | The screen shows a single KATALOGPLATTA titled `Sparat` (pre-created, 0 items) with the same string. There is never a zero-collections screen. |
| Offline | `Ingen uppkoppling. Här är det du har sparat.` |
| Object deleted upstream | The row remains, title struck through, mono line `Objektet finns inte kvar i katalogen.` We never silently remove a visitor's row. |
| Re-saving an object already in a collection | The button is `aria-pressed="true"`; tapping removes it, with `Borttagen ur Höstdejter · Ångra` |

---

## Outbound handoff

**AVFÄRDEN.** This is the moment that killed Dojo — the app threw users to third-party sites where booking was not mobile-optimised, and the experience collapsed at the handoff. It is a named component, not a link.

### The sheet

`<dialog class="avfard">` opened with `showModal()`. Using the native element is not a style preference: Chrome on Android wires the system back button and the predictive-back peek to it for free via `CloseWatcher`, and iOS's history entry closes it — a `<div>` overlay gets neither and exits the app on the first back gesture.

- Rises to **40dvh, max 420px**, over **280ms** `cubic-bezier(0.32, 0.72, 0, 1)`. `::backdrop` at `oklch(0% 0 0 / 0.4)`. Reduced motion: appears at final position, 100ms fade.
- `padding-bottom: max(24px, env(safe-area-inset-bottom, 0px))`.
- Focus is trapped by the element; initial focus lands on the **primary** button (not the close), because the visitor already committed by tapping.

### What we tell them, in order

1. **Heading**, Familjen Grotesk 600 at `--type-title`: `Du lämnar STADEN`
2. **Sentence**, Literata `--type-label`: `Du lämnar STADEN och går till ticketmaster.se. Vi sparar objektet så du hittar tillbaka.`
3. **Fact block**, DM Mono `--type-catalogue`, tabular:
   - `MÅL: ticketmaster.se` — the **destination domain named in words**, from the actual `URL(utgaende_url).hostname`, never from an editor-typed string, so it cannot lie.
   - `PRIS: 180 KR` — what we already know, so the partner page *confirms* rather than surprises.
   - `SIDAN ÄR INTE MOBILANPASSAD` — only when `utgaende_mobilvanlig = false`.
4. **Buttons**, each `min-height: 48px`, 12px apart:
   - `Fortsätt till ticketmaster.se` — primary, `--accent-solid`
   - `Spara och gå senare` — saves and closes; the object lands in the system collection `Påbörjade`
   - `Avbryt`

**The object is saved before the visitor leaves, always**, whichever button they press — including `Fortsätt`. That is the "so you find your way back" promise made real, and it means a lost trip is impossible.

### How they get back

- **iOS standalone:** `target="_blank" rel="noopener noreferrer"` opens the in-app browser (SFSafariViewController) with a `Klar` button that returns to STADEN with scroll position intact. Never a same-tab navigation — in standalone mode that permanently navigates the PWA away.
- **Android WebAPK:** the same attributes open a Chrome Custom Tab tinted with the manifest `theme_color`; the system back returns to the app.
- **Desktop:** new tab. At ≥1600 the LÄSRUM pane is left showing the object, so the browse position is literally still on screen behind the new tab.
- **On return** (detected via `visibilitychange` + a stored `avfard_id`), the object page shows a 44px row: `Kom du fram? Spara till en samling · Rätta uppgift` — one honest question, no rating prompt, no NPS, no modal.

### When the target is not mobile-optimised

`utgaende_mobilvanlig` is set at ingest by a headless check: does the target emit a `viewport` meta, and does it render at 390px without horizontal overflow? Small Göteborg venues frequently fail both, and a fair number publish a desktop-only PDF.

When `false`, the sheet changes:
- The mono line `SIDAN ÄR INTE MOBILANPASSAD` appears in `--ink` (not `--muted` — it is a warning, not a footnote).
- The sentence changes to: `Sidan hos pustervik.se fungerar dåligt på mobil. Du kan ringa i stället, eller spara och boka på datorn.`
- The button stack becomes four:
  - `Ring 031-12 34 56` — `tel:` link, rendered only when a phone number is stored from a permitted source. This is the single highest-value repair for a small-venue booking page, and it is the option Dojo never offered.
  - `Fortsätt ändå`
  - `Spara och boka på datorn` — saves with a flag; the collection row shows `BOKA PÅ DATORN` in the TID slot
  - `Avbryt`

### Directions

Never a `geo:` URI — it throws an app-chooser on Android and silently fails on devices with no handler.

- **Maps:** `https://www.google.com/maps/dir/?api=1&destination=<lat>,<lng>&destination_place_id=<place_id>&travelmode=transit` — the stored `place_id` as the stable join key, coordinates from the ≤28-day cache.
- **Transit (Göteborg):** a `Västtrafik` row deep-linking the journey planner, presented above Maps because it is the locally correct answer.
- The directions sheet is the same component with `MÅL: google.com/maps` and a single sentence: `Vi öppnar Kartor med Slottsskogen som mål. Du kommer tillbaka hit när du är klar.`

**Rule: there is no bare `<a>` to a third-party destination anywhere in the product.** An ESLint rule fails the build on any `<a>` with an external `href` outside the `Avfard` component, except inside `KÄLLAN`, where the domain is the visible link text and the destination is therefore already named.

---

## Search

Route `/sok`. Reached from the 44×44 control in the top bar, from any room, and from `/`.

- **The field is pinned to the TOP of the screen**, 56px below the bar, never bottom-anchored. A bottom-anchored search input is an iOS pattern that fights Android's IME resize, and with `interactiveWidget: 'resizes-content'` a Pixel 9's layout viewport drops from 915px to ~575px the moment the keyboard opens.
- Input: `min-height: 48px`, `--type-body` (18.06px — never below 16px, or iOS auto-zooms the viewport on focus), `inputmode="search"`, `enterkeyhint="search"`, `autocapitalize="off"`, `autocorrect="off"`, `spellcheck="false"`. Placeholder `Sök på plats, stadsdel eller sal`. A 44×44 clear control when non-empty.
- The tab bar retracts on `focusin` (both platforms) via the `visualViewport` rule.
- **Scopes** as a 44px segmented row under the field: `ALLT · OBJEKT · SALAR · KVARTER · SAMLINGAR`.
- **Index:** Postgres `tsvector` in the `swedish` configuration over `titel || varfor || plats_namn || kvarter`, plus `pg_trgm` on `titel` for typo tolerance (`similarity > 0.28`). Swedish compound splitting is handled by an ingest-time `titel_delar text[]` column populated from a compound splitter, so `kulturhus` finds `Världskulturmuseet`. Results ranked by `ts_rank_cd` and then by editorial `position` — never by popularity.
- **Results** render in KATALOGRAD form (88px rows), grouped by scope with 2px rules between groups. Rooms and kvarter results appear first when they match exactly, because "Haga" is almost always a navigation intent, not a text search.
- **Recents:** stored locally only, never synced without an account, cleared by a 44px `Rensa sökhistorik` row. No server-side query logging tied to an identity.
- **Zero results:** `Vi hittade inget på "vasaplatsen brunch". Sök på ett ställe, en stadsdel eller en sal.` — followed by the KVARTERSPLANEN grid and the four room plates, so the dead end is always a doorway.
- **Empty field state:** the eight kvarter tiles and the four rooms. Never a blank screen, never a list of trending searches.
- No search suggestions dropdown overlaying the results — results update in place, debounced 220ms, with `aria-live="polite"` on a visually-hidden `24 träffar` counter.

---

## Onboarding

**First 20 seconds, measured.**

- **Second 0:** the app opens on **IDAG**. There is no splash screen, no carousel, no sign-in wall, no permission prompt, no push-notification prompt, and no cookie banner — the product sets no non-essential cookies and runs no third-party analytics, so there is nothing to consent to, and that is a design decision recorded here rather than a gap.
- **Seconds 0–6:** the visitor reads the day's note and sees one full photograph, one title and the first lines of a sentence a person wrote. That is the entire value proposition delivered without a tap.
- **Seconds 6–14:** they scroll past the mechanism stamp (which tells them a machine gathered this at 06:40 and a person hung it) into four objects.
- **Seconds 14–20:** they tap SPARA on one. It works. `Sparad i Sparat · Ångra`. **No account was created, no email was requested, no modal appeared.**

**The one welcome object.** Slot 8 of the first edition a visitor ever sees is replaced by a **VÄLKOMSTPLATTA** — a KATALOGPLATTA, composition 5 (Fotmarginal, the calm one), carrying three lines in Literata:

> `Det här är dagens hängning. Tolv saker, valda av en människa, uppdaterade klockan 06:40.`
> `Spara det du gillar — det kräver inget konto.`
> `Hela staden finns i Salarna.`

Plus two 48px rows: `Byt stad` and `Läs om hur det görs`. It is an **object in the forme**, not a modal, not an overlay, not a coach mark, and not a spotlight tour. It is dismissible with a 44px `Klart` and never returns (`localStorage` flag, plus a server flag once an account exists).

**Account is requested exactly once, at the moment it becomes useful:** when the visitor taps `Dela` on a collection, or opens the app on a second device with a `?besokare=` link. The prompt is a sheet, not a wall: `Samlingen finns på den här telefonen. Vill du kunna öppna den på andra enheter?` with `Skapa konto`, `Inte nu` (fully functional), and `Logga in`. Everything except cross-device sync and public sharing works forever without one.

**Install is requested on the second session, never the first.** `beforeinstallprompt` is `preventDefault()`-ed to suppress Chrome's mini-infobar, the event is stashed, and a **72px wall-label row** — not a modal — appears at the foot of SAMLINGAR: `Lägg STADEN på hemskärmen. Då öppnas den utan webbläsare.` Dismissal is stored for 30 days; `appinstalled` removes it permanently. iOS gets the equivalent row with the Share-sheet instruction, shown only when `navigator.standalone === false` and the visitor has saved at least one object.

---

## Profile

Route `/besokaren`. Reached from a 44px row at the foot of SAMLINGAR and from the desktop rail foot. It is not a tab, because it is not a destination — it is a drawer of the building's controls.

**BESÖKAREN**, a single scrolling page of 48px rows grouped by 2px rules:

| Group | Rows |
|---|---|
| **Utseende** | `Tema` → `LJUST / MÖRKT / SYSTEM` (a 3-segment control, **ships in v1** — "both themes first-class" means the user chooses, and the app never auto-switches at sunset). `Lugnt läge` → `AUTOMATISKT / PÅ / AV`, with the mono sub-line `Automatiskt: på, för att din textstorlek är 130 %` explaining *why* it is on. `Textstorlek` → a link to the OS setting with a one-line explanation, because we do not re-implement a system control. |
| **Staden** | `Stad` → GÖTEBORG (opens the city dialog). `Kvarter` → the eight tiles, sets the default walk origin. `Språk` → `SVENSKA / ENGLISH` (sets `lang` on the subtree, not just the document). |
| **Samlingen** | `Mina samlingar` (count). `Exportera` → JSON + a printable A4. `Radera mina data` → deletes the visitor row, the collections and the local store; confirmed by a `<dialog>`, no dark pattern, no "are you sure you want to lose everything" guilt copy. |
| **Verkstaden** (the visible mechanism) | `Rättelser` → `/rattelser`, the public corrections desk: a reverse-chronological list of every `rattad_at` entry with its before/after. `Om hängningen` → `/om`, which explains machine-proposes/human-disposes in plain Swedish and prints today's stamp. `Källor och licenser` → `/kallor`, carrying the OSM/ODbL notice, the Wikidata/Wikipedia CC-BY-SA notice, Göteborg & Co attribution, and the venue-site list. This page is legally required and is therefore a route, not a footer link. |
| **Konto** | `Logga in` / the email and `Logga ut`. Nothing else — no avatar, no display name, no bio, no public profile. There is no social layer in this product and there is no surface where one could be added later without a decision. |
| **Foot** | `STADEN · GÖTEBORG · S-2026.08` version stamp, mono, `--type-micro`. |

There are no likes, follows, streaks, badges, view counts or activity feeds anywhere on this page, because there are none in the product.

---

## Desktop

Desktop is **the public face**, and it does three things a phone structurally cannot.

### The three unique jobs

1. **LÄSRUMMET (≥1600px).** A persistent 360px right pane. Clicking a card fills the pane instead of navigating, so browse position is never lost — the visitor can read eleven wall labels in a row without ever leaving the gallery. Below 1600 the same content opens as a route with a SALSBYTE view transition. The pane carries Z3–Z11 of the object page (rule, accession, title, anslag, wall label, catalogue rail, fact table, actions, source) with the media at 4:5 within 360px = 450px tall. `aria-live` is not used; the pane is a `<section aria-labelledby>` and focus moves to its heading on open, with `Esc` returning focus to the originating card.
2. **KALENDARIET (≥1200px).** Route `/[stad]/kalendarium`, and a rail entry. Every dated object in the next 90 days as a ruled table: 56px rows, 1px `--line` between, columns `DAGAR` (right-aligned, `tabular-nums`, 88px) · `DATUM` (120px) · `TITEL` (1fr) · `SAL` (140px) · `PLATS` (200px). Anslag rows carry the 2px `--line-strong` rule and the pillar hue; ordinary dated rows do not. This is a wall of the coming season that a 390px screen can only ever show one item of, and it is the single strongest argument for opening STADEN on a laptop.
3. **SAMLINGSBORDET (≥1200px).** Drag an object from the gallery onto a collection in the rail. Keyboard equivalent per APG: `Space` lifts the card, `↑↓` moves through the rail's collections with a visually-hidden `Höstdejter, 4 objekt` announcement, `Space` drops, `Esc` cancels. Pointer drag uses the HTML drag-and-drop API with a 1px `--accent` outline on the valid target and no ghost image beyond the card's own plate.

### Grid

| Tier | Query | Columns | Gutter | Margin | Rail | Pane |
|---|---|---|---|---|---|---|
| Phone | `< 640px` | 4 | 16 | 20 (16 below 360) | tab bar | — |
| Tablet | `≥ 640px and (min-height: 620px)` | 6 | 20 | 24 | tab bar | — |
| Small desktop | `≥ 900px and (min-height: 620px)` | 8 | 20 | 32 | **220px** | — |
| Desktop | `≥ 1200px and (min-height: 620px)` | 12 | 24 | 40 | **260px** | — |
| Wide | `≥ 1600px and (min-height: 620px)` | 12 | 24 | shell capped **1560px**, centred | **260px** | **360px** |

**Computed content widths.** 1024: 1024 − 220 − 64 = **740px**, column 82.5px. 1280: 1280 − 260 − 80 = **940px**, column 58.3px. 1440: 1440 − 260 − 80 = **1100px**, column 71.7px. 1920: shell 1560 centred → 1560 − 260 − 24 − 360 − 24 = **892px** content with the pane open, **1276px** with it closed.

**Card grid is a container query, not a media query:**
```css
.galleri { container-type: inline-size;
  display: grid; gap: 24px;
  grid-template-columns: repeat(auto-fill, minmax(17.5rem, 1fr)); }
```
`17.5rem` = 297.5px at the 17px root. Yields **2-up at 1024** (740px), **3-up at 1280** (940px), **3-up at 1440** (1100px), **2-up at 1920 with the pane open** (892px), **4-up at 1920 with it closed** (1276px) — automatically, and correctly when the rail or pane changes the available width. Card-internal type uses `cqi` in the clamp middle term, so a card in the 360px pane and a card in the 1276px gallery both set correctly with no breakpoint.

### Measure discipline

- Wall label and body: `max-width: 34rem` = **578px**. Never wider, at any viewport.
- The day's note (`--type-lede`): `max-width: 30rem` = 510px.
- Display type: `max-width: min(14ch, 100%)` — a real constraint at every desktop width, unlike a `10ch` cap that never binds.
- The gallery, the rules and the threshold bands run **full-bleed to the outer margin** while text stays measure-capped inside. That is the compromise: no retreat to a centred 1200px card-in-a-box, no unbounded stretch.

### Hover

`@media (hover: hover) and (pointer: fine)` only. Hover **adds**, never gates — nothing is discoverable only on hover, because that is the rule that keeps touch and desktop the same product.

| Element | Hover |
|---|---|
| Card | Media `scale(1.02)` over 320ms `cubic-bezier(0.2,0,0,1)`, `overflow: hidden` on the media box only; the pillar rule thickens 3px → 5px |
| Card title | A 1px `--accent` rule draws left-to-right under it over 260ms |
| Rail item | Ground `color-mix(in oklch, var(--ink) 6%, transparent)`, 120ms |
| Kalendarium row | Ground `--paper`, the `DAGAR` cell goes `--ink` from `--muted`, 120ms |
| Action button | `--accent-solid` lightens 4% L, 120ms |

All five collapse to their static state under `prefers-reduced-motion: reduce`.

### Keyboard focus order

1. Skip link — `Hoppa till innehåll`, first focusable, visually hidden until focused, then 16px from the top-left at `z-index: 100`, 48px tall, `--accent-solid` ground.
2. Wordmark lockup (link to `/[stad]`)
3. City button (`aria-haspopup="dialog"`)
4. Rail: the three destinations, then the four wings, then collections, then the foot controls — inside `<nav aria-label="Huvudmeny">`
5. Search field
6. `<main>`: TIDSREMSAN, SÄLLSKAPET, then the gallery in **visual order** — card title first, save control last within each card (the DOM is ordered title → label → rail → save, so tab order matches reading order and nobody reaches "Spara Way Out West" before ever meeting the title)
7. LÄSRUM pane, when open
8. `<footer role="contentinfo">`

`:focus-visible { outline: 2px solid var(--focus); outline-offset: 3px; border-radius: inherit }` where `--focus` is `--ink` in both themes and is redefined to `--ground` on any `--accent-solid` or pillar-flooded surface. Never the UA default ring. `<header role="banner">` and `<footer role="contentinfo">` sit **outside** `<main>`.

### 200% browser zoom on desktop

1280 at 200% → **640 CSS px**, 1440 → **720 CSS px**, 1920 → **960 CSS px**. These land in the 640–899 and 900–1199 tiers, which are **fully designed states**, not fallbacks: at 640–899 the rail is the bottom bar and the gallery is 2-up; at 900–1199 the 220px rail returns and the pane never appears. Nothing below 900px depends on hover.

---

## Platform rules

| | **iPhone** | **Android** |
|---|---|---|
| **Reference devices** | 390×844 (12–15 class), 440×956 (16 Pro Max) | 412×915 (Pixel 8/9), 360×800 (budget floor), **320 verified** |
| **Viewport export** | `{ width:'device-width', initialScale:1, minimumScale:1, maximumScale:5, userScalable:true, viewportFit:'cover', interactiveWidget:'resizes-content', colorScheme:'light dark', themeColor:[…] }` | identical |
| **Why `viewportFit:'cover'` is first** | Without it every `env(safe-area-inset-*)` resolves to 0 **and** standalone letterboxes the web view with theme-colour bars. Nothing else on this list works until it ships. | Without it every `env()` is 0; under Android 15+ edge-to-edge enforcement an installed WebAPK draws under the 24dp gesture handle |
| **`maximumScale`** | 5. Never 1 — it blocks pinch zoom and fails WCAG 1.4.4 | 5, same |
| **Safe areas, portrait standalone** | top **47px** (390×844) / **62px** (440×956); bottom **34px** | top commonly **0**; bottom **24px** gesture nav / **48px** 3-button |
| **Safe areas, landscape** | left **47px**, right **47px**, bottom **21px**, top 0 | left/right non-zero on cutout devices; always honoured |
| **Safe-area token layer** | `--safe-t/b/l/r: env(safe-area-inset-*, 0px)`; `--gutter-l: max(20px, var(--safe-l))`; `--gutter-r: max(20px, var(--safe-r))` — every horizontal padding in the app resolves through these, zero hardcoded edge values | identical, plus `--safe-b-floor: max(var(--safe-b), 24px)` |
| **Unstable bottom inset** | Safari reports 0 while the bottom toolbar is expanded and ~34 once collapsed → **never bare `env()`**, always `bottom: max(12px, calc(8px + env(safe-area-inset-bottom, 0px)))` | stable, but still `max(env(...), 24px)` for 3-button/gesture parity |
| **Browser chrome** | top URL bar ~52px expanded / ~44px collapsed; bottom toolbar ~44px + inset. svh↔lvh delta **78px** at 390×844, **86px** at 440×956 | top toolbar **56px**, collapses on scroll-down. That delta **is** svh↔lvh in a tab, and **0** in a WebAPK |
| **dvh policy** | `svh` for any block that must not jump; `dvh` **only** on the fixed app shell and the AVFÄRDEN dialog; `lvh` nowhere. `100svh` is never used for content blocks that also contain the anslag or a primary action | identical. Never size a visible block in `dvh` — it resizes continuously as the toolbar collapses |
| **Back semantics, depth 0** | IDAG root → back leaves the app | IDAG root → back exits the PWA, **no confirmation dialog** |
| **depth 1** | SALARNA / SAMLINGAR tab → back returns to IDAG, never exits | identical |
| **depth 2** | Object page → back returns to the originating gallery **at the same scroll offset** (`window.scrollY` persisted to `sessionStorage` keyed on `history.state.key`, restored in `popstate`) | identical |
| **depth 3** | Any sheet, filter panel, city switcher, save picker or AVFÄRD → back closes **only** the sheet. Implemented as `<dialog>` + `showModal()` | identical; Chrome wires the system back and the **predictive-back peek** via `CloseWatcher` for free. A `<div>` overlay gets neither and exits the app |
| **View-transition direction** | SALSBYTE 320ms forward / **240ms exact inverse on back**. If direction cannot be guaranteed, no transition ships — 0ms beats a wrong-direction 300ms | identical, and doubly load-bearing: a forward transition on a back gesture is the loudest "not a real app" tell on Android |
| **Edge gestures** | Leftmost **20pt** is the interactive-pop zone. Horizontal rails never `preventDefault` on `touchstart` within the leftmost 20px | **24dp inward from BOTH edges** is system-reserved and cannot be excluded from the web. Rails start at `padding-inline: 20px`; no swipe-to-dismiss anywhere; no horizontal affordance begins in either strip |
| **Rail spec** | `overflow-x:auto; scroll-snap-type:x mandatory; scroll-padding-inline-start: var(--gutter-l); overscroll-behavior-x: contain; touch-action: pan-x;` children `scroll-snap-align: start`, width `78vw` max 320px so the next card peeks by ~22vw | identical, plus every rail has a `Se alla` link into a vertical list — a carousel is never the only path to content |
| **Pull-to-refresh** | None exists in standalone → the MEKANISMRADEN 44px row is the refresh path | `overscroll-behavior-y: contain` on the scroller kills Chrome's native PTR (it reloads the document and destroys scroll position, in-flight reads and any open sheet). Same 44px row is the replacement. **Never** `overscroll-behavior-y: none` on `body` on iOS — it kills Safari's own PTR |
| **Minimum tap target** | **44×44 CSS px** (HIG), 48×48 for primary actions, **8px** minimum separation | **48×48 dp** (M3), 8dp separation. Global net: `@media (pointer: coarse) { a, button, [role="button"], input, select { min-height: 48px; min-width: 48px } }` — the app builds to 48 everywhere, so both floors are cleared by one number |
| **Thumb zone** | 390×844: easy y = 560–844, stretch 380–560, unreachable < 380. Every primary action sits below y = 560 or in the capsule | 412×915: easy y = 520–880. Same rule |
| **Install** | `manifest` + `appleWebApp: { capable:true, title:'STADEN', statusBarStyle:'black-translucent' }` + **real 180×180 PNG** `apple-touch-icon` (no transparency, no pre-rounded corners — iOS masks it; SVG is ignored). Home-screen label must be `STADEN`, never the long title, which truncates to `STADEN — Gö…` | `manifest.webmanifest`: `id:'/'` (frozen), `name:'STADEN — staden i din ficka'`, `short_name:'STADEN'`, `start_url:'/?source=pwa'`, `scope:'/'`, `display:'standalone'`, `display_override:['standalone','minimal-ui']`, `lang:'sv-SE'`, `orientation:'any'`. Icons 192 any, 512 any, **512 maskable** with all artwork inside the central 341px circle (PLANEN, never the wordmark — Samsung's circular mask amputates it). **Screenshots: ≥1 at 1080×1920 `form_factor:'narrow'` and ≥1 at 1920×1080 `'wide'`**, or Chrome downgrades the install dialog. A service worker **with a `fetch` handler** is mandatory or `beforeinstallprompt` never fires: network-first for Supabase reads, cache-first for the shell and the three woff2 files, cached `/offline` backed by the last-synced collection from IndexedDB |
| **Status bar / theme colour** | `themeColor` per colour scheme in the Viewport export + matching manifest `theme_color` | manifest `theme_color` is the install-time value; a runtime `<meta name="theme-color">` is updated by a `matchMedia('(prefers-color-scheme: dark)')` listener so the status bar tracks the active theme |
| **Fixed chrome & rubber band** | `<html>` gets an explicit `background: var(--ground)` so the overscroll area matches the page in both themes. The app shell is a non-scrolling `position: fixed` container; content scrolls in a child, so iOS never detaches the fixed capsule during rubber-band | same shell structure; no `backdrop-filter` on any scrolling surface |
| **Touch feel** | `* { -webkit-tap-highlight-color: transparent }`; interactive elements get `-webkit-touch-callout: none; user-select: none; touch-action: manipulation`; detail prose keeps `user-select: text`; `:active { transform: scale(0.985); transition: transform 90ms cubic-bezier(.2,0,0,1) }` inside `prefers-reduced-motion: no-preference` | identical, minus the `-webkit-` callout |
| **Fonts** | `next/font/google`, `display:'swap'`, `subsets:['latin']`, `adjustFontFallback: true` | identical, and **`Arial` is removed from every stack** — it does not exist on Android and silently resolves to Roboto mid-load, producing a visible reflow on the brand's own display type |
| **Hairlines** | 1px `--line` at 3.2:1 | 1px at DPR 2.625/3.0 antialiases toward invisibility; `--line` is the same token but decorative rules are **1.5px**, and `prefers-contrast: more` takes every hairline to 2px |
| **Keyboard** | tab bar retracts at `visualViewport.height < innerHeight − 150` | retracts at `< innerHeight − 120`; the IME is ~340px on a Pixel 9, dropping the layout viewport 915 → ~575 |
| **Text scaling** | `html { -webkit-text-size-adjust: 100% }` so Safari cannot silently inflate the rail; iOS AA zoom is honoured because every functional size is rem | Android 200% font scale is honoured for the same reason. This is why the rem law is enforced by lint, not goodwill |

### The breakpoint rule

**Every layout media query carries a height guard.**

```css
@media (min-width: 900px)  and (min-height: 620px) { /* rail returns */ }
@media (min-width: 1200px) and (min-height: 620px) { /* 12 col, 260px rail */ }
@media (min-width: 1600px) and (min-height: 620px) { /* LÄSRUM pane */ }

@media (max-height: 500px) {           /* landscape phone, explicitly designed */
  .masthead { display: none }          /* the 56px bar carries the identity */
  .ledplattan__media { max-height: 40svh }
  .galleri { grid-template-columns: repeat(auto-fill, minmax(17.5rem, 1fr)) }
  .stadsraden { height: 52px }
  :root { --gutter-l: max(20px, env(safe-area-inset-left, 0px)) }  /* 47px notch */
}
```

A 440×956 Pro Max in landscape is **956px wide and 440px tall**: it passes `min-width: 900px` and fails `min-height: 620px`, so it keeps the phone layout and additionally receives the `max-height: 500px` tier. A 1280×720 desktop at 200% browser zoom lands at 640×360 CSS px and does the same. There is no width at which a short viewport receives a rail, a 500px-min-height card, or a `100svh` hero — by construction, in one condition, applied uniformly.

---

## Screen list

**v1 routes.** All content routes are city-scoped; `/` reads the `stad` cookie (default `goteborg`) and redirects.

| Route | Screen | Notes |
|---|---|---|
| `/` | redirect | → `/[stad]` |
| `/[stad]` | **IDAG** | The edition. Ten-slot forme. Tab 1 |
| `/[stad]/salar` | **SALARNA** | Four room plates, 88px each, + TIDSREMSAN + KVARTERSPLANEN. Tab 2 |
| `/[stad]/salar/[sal]` | **EN SAL** | `kultur` \| `nojen` \| `mat` \| `sevardheter`. Threshold band, sticky axes, gallery, `23 dolda av läget — visa` |
| `/[stad]/objekt/[slug]` | **OBJEKTET** | Z0–Z14 |
| `/[stad]/kalendarium` | **KALENDARIET** | 90-day ruled table. Desktop-first; on mobile it is a vertical list of anslag plates |
| `/[stad]/kvarter/[kod]` | **KVARTERET** | One of eight. Gallery scoped to the kvarter, walk times recomputed |
| `/samlingar` | **SAMLINGAR** | Tab 3. Collections index + install band + profile row |
| `/samlingar/[id]` | **EN SAMLING** | Cover, rows, reorder, share, print |
| `/s/[token]` | **DELAD SAMLING** | Public read via the security-definer view. No owner identity. Own OG image |
| `/sok` | **SÖK** | Top-anchored field, five scopes |
| `/besokaren` | **BESÖKAREN** | Theme, LUGNT LÄGE, city, kvarter, language, data, account |
| `/rattelser` | **RÄTTELSER** | Public corrections desk |
| `/om` | **OM HÄNGNINGEN** | Machine proposes, human disposes, in plain Swedish. Today's stamp |
| `/kallor` | **KÄLLOR OCH LICENSER** | ODbL, CC-BY-SA, Göteborg & Co, venue list. Legally required route |
| `/offline` | **OFFLINE** | `Ingen uppkoppling. Här är det du har sparat.` Service-worker fallback |
| `/[stad]/opengraph-image` | OG | Rendered by the KATALOGPLATTA renderer |
| `/[stad]/objekt/[slug]/opengraph-image` | OG | Same renderer |
| `/samlingar/[id]/opengraph-image`, `/s/[token]/opengraph-image` | OG | Same renderer |
| `/manifest.webmanifest` | manifest | `app/manifest.ts` |
| `/sitemap.xml`, `/robots.txt` | — | `/s/[token]` excluded unless `synlighet = 'publik'` |

**Dialogs (no route of their own; `<dialog>` + `showModal()`, closed by the system back gesture):** `STADSVÄLJAREN` (city switch, ≤2 taps), `SPARA I SAMLING`, `AVFÄRDEN`, `NY SAMLING`, `RÄTTA UPPGIFT`, `RADERA MINA DATA`.

**Not in v1, and named so nobody builds them by accident:** map view, notifications, comments, ratings, following, an editor CMS UI (the editor uses the Supabase dashboard against reviewed migrations), and any second city beyond the `stader` row that makes Stockholm a data change rather than a code change.

# PART 3 — SYSTEM
## Spacing, grid and the museum rhythm

### The law that produces the air

**Type obeys the user; space does not steal from them.** Every font-size in the product is `rem` (or a `clamp()` carrying a `rem` term). Every *structural* space — gutters, gaps, room bands, plate padding, tab-bar height, safe-area maths — is authored in **px**. Consequence: at Android 200% font scale or iOS AA on a 360px device, the strings grow and the gutters do not, so the content column stays 328px instead of collapsing to 264px. The only space authored in `em` is *typographic* space — the distance between a title and its own catalogue rail, or between a wall label and its source line — because that space is a property of the type, not of the wall. This single split is what makes 200% zoom a reflow instead of an overflow, and it is lint-enforced: a `px` value inside a `font-size`, or a `rem` value inside `gap`/`padding-inline`/`--space-*`, fails CI.

### Spacing scale

A 4px base. Fourteen steps, no ad-hoc values anywhere; a raw px length outside this table in any layout property is a lint failure.

```css
:root {
  --s-1:  4px;   --s-2:  8px;   --s-3: 12px;  --s-4: 16px;
  --s-5: 20px;   --s-6: 24px;   --s-8: 32px;  --s-10: 40px;
  --s-12: 48px;  --s-16: 64px;  --s-20: 80px; --s-24: 96px;
  --s-32: 128px; --s-40: 160px;

  /* edges — the only place env() is allowed to appear */
  --safe-t: env(safe-area-inset-top, 0px);
  --safe-b: env(safe-area-inset-bottom, 0px);
  --safe-l: env(safe-area-inset-left, 0px);
  --safe-r: env(safe-area-inset-right, 0px);

  --gutter:   clamp(16px, 4.4vw, 24px);        /* 16 @320-364 · 17.2 @390 · 18.1 @412 · 24 @545+ */
  --gutter-l: max(var(--gutter), var(--safe-l));
  --gutter-r: max(var(--gutter), var(--safe-r));

  /* chrome constants — never inlined as magic numbers */
  --bar-h: 56px;                                     /* sticky top bar, content height */
  --bar-total: calc(var(--bar-h) + var(--safe-t));
  --tab-h: 56px;                                     /* nav content height, both platforms */
  --tab-inset-ios: 16px;                             /* floating capsule side inset */
  --tab-lift-ios: max(12px, calc(8px + var(--safe-b)));
  --tab-pad-android: max(var(--safe-b), 24px);       /* gesture nav 24, 3-button 48 */
  --scroll-floor: calc(var(--tab-h) + var(--tab-lift-ios) + var(--s-6));  /* 96px + inset */
}
```

`--scroll-floor` is applied as `padding-block-end` to every scroll container in the app, so the last object clears both the nav and the home indicator on every device. On Android the token resolves to `calc(56px + max(env(safe-area-inset-bottom),24px) + 16px)` = **96px in gesture nav, 120px in 3-button nav**.

### The wall law — the rule that makes the space "generous"

Three clauses, all testable:

1. **Air ≥ ink, per object.** The vertical gap above and below an object plate is never less than **1.6× the plate's own internal padding** and never less than **32px**. Plate padding is `--s-5` (20px) below 540px container width and `--s-6` (24px) above; gaps are therefore **32px mobile / 40px ≥900px**. Between rooms the gap becomes a **threshold band**: 96px (`--s-24`) mobile, 160px (`--s-40`) at ≥1200px, containing only the full-bleed 1px `--line` rule and the room name in DM Mono 13px sitting on it.

2. **The one-and-a-half rule.** On a 390×734 Safari viewport, the first object's top edge must land at **y ≤ 184px (25% of viewport)** and the second object must be *visible but incomplete*. This is why identity chrome on the first viewport is capped at 25% and why the lead plate is 3:2 (390 − 2×17.2 gutter = 355.6 wide → 237px tall), leaving 184 + 237 + label block ≈ 560px, with object 2 breaking the fold at ~592px. A room that fits two whole objects above the fold has been packed, not hung, and fails the snapshot test.

3. **The ink budget.** On any screen ≤540px wide, at most **62% of the visible pixel area may be painted** — media, flooded plate grounds, filled controls — leaving **≥38% bare `--ground`**. Enforced in CI by a Playwright screenshot that quantises the viewport and counts non-`--ground` pixels at 390×734, 360×800 and 412×915 for every route. `LUGNT LÄGE` tightens the budget to 50%.

### Mobile grid (< 640px)

Four columns. `--gutter-l/-r` outside, **12px** between columns.

| Viewport | Margin | Content | Column | 2-col span | 3-col span |
|---|---|---|---|---|---|
| 320 | 16 | 288 | 63.0 | 138.0 | 213.0 |
| 360 | 16 | 328 | 73.0 | 158.0 | 243.0 |
| 390 | 17.2 | 355.6 | 79.9 | 171.8 | 263.7 |
| 412 | 18.1 | 375.8 | 84.9 | 181.9 | 278.8 |
| 440 | 19.4 | 401.2 | 91.3 | 194.6 | 297.9 |

Object plates are **full-bleed to the gutter** (span 4) as the default; the paired 1:1 objects in the rhythm cadence take span 2 each with the 12px column gutter between them, which is the only place a 12px gap is legal. Horizontal rails: `scroll-padding-inline-start: var(--gutter-l)`, card width `min(78vw, 320px)` so the next card peeks ~22vw, `overscroll-behavior-x: contain`, `touch-action: pan-x`, and **no interactive affordance may begin within 24px of either viewport edge** (Android system back-gesture strip; iOS interactive-pop strip is 20px, so 24px covers both).

### Desktop grid (≥ 900px)

| Tier | Range | Columns | Gutter | Margin | Shell max | Rail | Content | Pane |
|---|---|---|---|---|---|---|---|---|
| A phone | <640 | 4 | 12 | `--gutter` | — | tab bar | full | — |
| B tablet | 640–899 | 6 | 20 | 24 | 860 | tab bar | full | — |
| C tablet-wide | 900–1199 | 8 | 20 | 32 | 1136 | 88px icon rail | fill | — |
| D desktop | 1200–1679 | 12 | 24 | 32 | 1372 | 260 | min(1080, shell−292) | — |
| E wide | ≥1680 | 12 | 24 | 48 | 1764 | 260 | min(1080, shell−684) | 360 |

Computed: at **1280** → shell 1216, rail 260 + gap 32 + content 924, column (924 − 11×24)/12 = **55px**. At **1440** → shell 1376, content 1084 → capped 1080, 4px to margin, column **68px**. At **1920** → shell 1764 centred (78px outer margins), content 1080, column **68px**, pane 360.

The rail is `position: sticky; top: 0; height: 100dvh; overflow-y: auto; overscroll-behavior: contain` with its own scroll context and a 1px `--line` right border. The pane at ≥1680 is where a card click lands **instead of navigating**, so browse position is never lost; below 1680 the same content is a route with a SALSBYTE view transition. The pane is the answer to "what does desktop uniquely do": a reading room where the wall stays behind you.

**Zoom mapping is a designed tier, not an accident.** 1280@200% = 640 → tier B. 1440@200% = 720 → tier B. 1920@200% = 960 → tier C. Both B and C are fully designed states with no hover dependency, which is the acceptance criterion.

There is **exactly one height-guarded media query in the product**: `@media (min-width: 900px) and (min-height: 620px)`. A 956×440 Pro Max in landscape therefore keeps the phone layout, which is what the audit measured as broken. A second rule, `@media (max-height: 500px)`, collapses the masthead to a single line and caps the lead plate at `40svh`.

### Container queries — where they are correct, and where they are not

Media queries answer **"what shell am I in?"** (rail vs tab bar, pane present, threshold band size). Container queries answer **"how wide is the box I am in?"** — every component-internal decision. Nothing about a card is ever decided by viewport width, which is why the same card is correct in the 360px pane, the 924px gallery and the 288px rail.

```css
.objekt { container: objekt / inline-size; }
```

| Name | Container width | Behaviour |
|---|---|---|
| `rad` | < 260px | List row: no media, 56px square thumb, title 2 lines, catalogue rail collapses to slots 1+2 |
| `kompakt` | 260–359 | Card: 4:5 media, title `clamp(1.25rem, 5.2cqi, 1.5rem)`, rail wraps to 2 rows |
| `standard` | 360–539 | Card: 4:5 media, title `--type-title`, rail on one row, 4 slots |
| `bred` | 540–779 | Plate: 3:2 media, wall label appears inline at `--type-label`, rail as a fixed 4-column grid |
| `galleri` | ≥ 780 | Lead plate: 3:2 media full-bleed, wall label in a 42ch column, rail right-aligned in its own 220px column |

The catalogue rail declares `container-type: inline-size` of its own and switches from `grid-auto-flow: column` to `grid-template-columns: 1fr` at `@container rail (max-width: 300px)` — which is what makes it **wrap rather than truncate** at 200% zoom (grafted rule, verbatim). The fact table on the detail page collapses from two columns to one stacked column at `@container detalj (max-width: 34rem)`.

Measure caps, absolute: body **62ch**, wall label **42ch**, day's note **34ch**, display headline **min(14ch, 100%)**. No `<br>` in any heading, ever — the audit found one and it is banned by lint.

---

## Radii, borders and surface

### The system is flat. Committed.

**There is no elevation.** No `box-shadow` on any content surface, no z-layer implied by blur, no material stack. A shadow is a claim that an object is floating above a wall, and objects in this product are *hung on* the wall. Depth is expressed by **four devices, in this priority order**:

1. **Luminance step.** `--paper` is one step lighter than `--ground` in *both* themes (light: 99.2% vs 96.4%; dark: 21.5% vs 16.5%). A raised plate is lighter. A plate darker than its ground reads as a hole, which is why the dark theme is a re-design and not an inversion.
2. **The rule.** A 1px `--line` hairline separates; a 2px `--line-strong` rule structures; a 3px pillar rule tops an object plate. Rules bleed **past the content margin to the container edge** — that full-bleed hairline is the house device and it is how the eye reads "this is a different surface" without a shadow.
3. **Bleed vs inset.** Media is full-bleed to the plate edge; type is inset by plate padding. The overlap of the knocked-out ink title bar over the media's bottom edge is the only "layer" gesture in the product, and it is a hard geometric overlap of 0 blur.
4. **Ground flood.** A KATALOGPLATTA or a room threshold band paints its ground. Flood area is capped (22% dark / 40% light of a plate) so flooding always reads as an object, never as chrome.

**Two shadows exist in the entire product**, both structural and both on non-content chrome:

```css
--shadow-tab: 0 8px 24px oklch(0% 0 0 / 0.12);   /* iOS floating capsule only */
--shadow-sheet: 0 -2px 32px oklch(0% 0 0 / 0.16); /* <dialog> AVFÄRDEN, above the scrim */
```

Both are removed under `prefers-contrast: more` and replaced by a 2px `--ink` keyline. The Android bottom nav is edge-to-edge and full-bleed and gets **no shadow at all** — it gets a 1px `--line` top rule, because a floating capsule with a bottom gap sits inside Android's 24dp gesture strip and flickers during Chrome's 56px toolbar collapse.

### Radii

```css
:root {
  --r-0:       0;      /* plates, cards, media, sheets, inputs, buttons, KATALOGPLATTA */
  --r-hair:    2px;    /* focus-ring corner only, so the ring is not a hard square on a hard square */
  --r-capsule: 28px;   /* iOS floating tab bar shell — the ONLY component with this token */
  --r-pill:    999px;  /* time-strip segments and the kvarter chips */
}
```

`border-radius: 0` is the default on `*` in the reset. Media has **`border-radius: 0` without exception** — a rounded photograph is a filter applied to someone else's picture. The save control is a **square 44×44 hit box with a square 24×24 bookmark glyph**, not a circle, precisely because the circular top-right save button is the Airbnb/Pinterest tell the critique named.

### Borders

```css
--bw-hair:   1px;   /* separators, media keyline in dark, plate boundary in forced-colors */
--bw-rule:   2px;   /* structural rules, wordmark lockup rule, plate keylines under high contrast */
--bw-pillar: 3px;   /* the pillar rule flush to an object plate's top edge */
--bw-band:   6px;   /* KATALOGPLATTA composition 3 only */
--bw-focus:  2px;   /* focus ring, offset 3px */
```

Under `@media (prefers-contrast: more)` every `--bw-hair` becomes `2px` and `--line` resolves to `--ink`. Under `@media (forced-colors: active)` every object plate gains `border: 1px solid CanvasText` so the plate boundary survives the loss of its ground, and all four pillar hues, `--accent` and every media tint resolve to system colours. On dark, every photograph carries a 1px `--line` keyline because grain on a dark ground reads as banding.

Hairlines are `1px` CSS, which is 2.625 device px on a Pixel and 3.0 on a Samsung — visible. The failure the audit measured was not thinness but *alpha*: `--line` at 3.2:1 against `--ground` in light and a quieted `oklch(34% 0.012 262)` in dark are the shipping values, and a hairline below 3:1 is a lint failure because the visible grid is the layout.

**No translucency by default anywhere.** The iOS tab bar is the single element permitted a translucent ground, wrapped in `@supports (backdrop-filter: blur(1px))`, with an opaque `--paper` fallback under `@media (prefers-reduced-transparency: reduce)` and on Android unconditionally (`backdrop-filter` on a scrolling feed drops a 360×800 budget device below 60fps and Android has no Reduce Transparency setting to fall back to). This makes `prefers-reduced-transparency` trivially satisfiable, which is the point.

---

## Component inventory

Format per entry: **spec** → **states** → **min target** → **200% behaviour**. "200%" means both browser page zoom and OS text scale (Android 200%, iOS AA maximum), tested at 360px and 320px width.

### 1. OBJEKTPLATTA — the object card (7 variants, one chassis)

One chassis, one DOM, five container-driven sizes plus two authored variants. Structure, in DOM order (which is also tab order and reading order): pillar rule (3px) → media frame or KATALOGPLATTA → knocked-out ink title bar overlapping the media bottom edge → wall label → catalogue rail (4 slots) → save control → accession number (`aria-hidden`) → source line. The whole plate is a link via the stretched-link pattern (`a::after { inset: 0; z-index: 1 }`); the save control is a sibling `<button>` at `z-index: 2`.

- **v1 `lead`** — the room's first object. Media 3:2, full-bleed to gutter, wall label in full, rail on one row.
- **v2 `standard`** — media 4:5, wall label clamped to 3 lines with no fade gradient (a fade over text is a crop; we cut on a line box and the full string is on the detail page).
- **v3 `parad`** — 1:1 media, two per row at span-2, wall label suppressed, rail slots 1+2 only. Used once per 5-object cadence.
- **v4 `landskap`** — 3:2, full-bleed, used as cadence position 4.
- **v5 `etikettkort`** — no media, no ground, 96px of air; the breathing object. Title + wall label + rail only.
- **v6 `rad`** — list row: 56×56 thumb (or a 56px KATALOGPLATTA crop), title 2 lines, rail slots 2+4 right-aligned in a fixed 88px column. Used in collections and search results.
- **v7 `handelse` vs `plats`** — **identical chassis, identical size, identical weight.** The *only* difference in the entire system is catalogue rail slot [2]: `OM 9 DAGAR · 13 AUG` versus `ALLTID ÖPPET · TIS–SÖN 11–17`. Places are never smaller, never sorted below events in a mixed room, never given a different ground. This is how addendum §1 becomes real rather than asserted.

**States (all variants):** rest · pressed (`scale(0.985)`, 90ms) · focus-visible (2px `--focus`, 3px offset, `--r-hair`) · saved (save control filled, `aria-pressed=true`) · media-loading (grey `--line` box, reserved) · media-absent (KATALOGPLATTA) · media-demoted (KATALOGPLATTA + 96×96 inset of the real photo) · label-missing (**unpublishable** — a build error, not a UI state) · price-unknown (slot 4 omitted, rail collapses) · ended (rail slot 2 reads `AVSLUTAT 15 AUG` in `--muted`; plate stays readable, moves to *Tidigare* after 30 days) · cancelled (`INSTÄLLT` in slot 2, `--accent` 3px rule replaced by a 3px `--muted` rule) · corrected (a 13px mono `RÄTTAD 14 AUG` line under the source line, linking to the corrections desk) · offline-cached (source line reads `SPARAD 06:40`) · pane-active on desktop (2px `--line-strong` left edge).

**Min target:** whole plate ≥ 96px tall and ≥ 44×44 by construction; save control 48×48 (44 visual, expanded by a transparent `::after { inset: -2px }`), bottom-right of the plate, 16px from both edges, 8px minimum clear of any other target.

**200%:** the plate has `min-height`, never `height`, never `aspect-ratio` on the plate itself — `aspect-ratio` lives only on the media frame, so text growth grows the plate downward. Title carries `overflow-wrap: anywhere; hyphens: auto`. Rail wraps to 2–4 rows. `parad` un-pairs to full width below `@container (max-width: 260px)`. Verified against *Universeumutställningen* at 320px/200%: title reflows to 5 lines at 30.6px, plate grows from 380px to 604px, zero overflow, zero horizontal page scroll.

### 2. ANSLAG — the countdown, seven distance bands

`<section role="group" aria-labelledby>` pointing at a visually-hidden `<h2>` carrying the full Swedish sentence. Visible numeral and mono label are `aria-hidden`. Swedish accessible-component name: **"Anslag"**. Never `aria-live`. Visible dateline wrapped in `<time datetime="2026-08-13">`.

**Qualification for "big":** `objects.is_landmark = true`, set by a human with role `redaktor` only (column `landmark_set_by` NOT NULL when true, enforced by trigger), AND the object has ≥1 confirmed occurrence, AND a `varfor`, AND a venue. **Maximum 3 concurrent `is_landmark` objects per city**, enforced by a partial unique-count trigger. Never inferred from popularity, ticket volume, capacity or clicks — there is no popularity column in the schema to infer from.

**Placement:** IDAG — at most **one**, in a `SNART` strip placed *below* the first curated section, never in the masthead. Card — catalogue rail slot [2], one 13px mono line, never a badge over media. Detail — a two-line plate directly under the title, above the wall label. Collection rows — right-aligned 88px column. **Never in a saved list's hero, never on the home masthead.** Hard cap: the numeral's font-size never exceeds **25% of the largest heading on the same screen** and never exceeds **3rem (51px)** absolute.

Distance is a **calendar-day difference in `Europe/Stockholm`**: `Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Stockholm', year:'numeric', month:'2-digit', day:'2-digit' })` formatted on both dates, parsed to `Date.UTC(y,m,d)`, subtracted, divided by 86 400 000. Never raw millisecond division — 30 Mar 2026 is 23 hours and 25 Oct 2026 is 25 hours, and the naïve form is off by one twice a year and unreproducible in a UTC CI runner. The band is computed **on the server per request** and re-derived on the client only at `visibilitychange`, never on a timer.

| Band | Visible form | Type | Rule/dot | SR sentence |
|---|---|---|---|---|
| **>60 d** | `I KALENDERN · 13 AUG` | Mono 13px, tracking 0.06em | 1px `--line` above | *Anslag. Way Out West öppnar den 13 augusti 2026, Slottsskogen.* |
| **60–15 d** | `OM 6 VECKOR · 13 AUG` | Mono 13px; weeks, not days | 1px `--line` | *…öppnar om sex veckor, den 13 augusti, Slottsskogen.* |
| **14–2 d** | `OM 9 DAGAR · 13 AUG` | Numeral Familjen Grotesk 600 at `clamp(1.75rem, 1.4rem+1.1vw, 2.5rem)`, tabular-nums; rest mono 13px | 2px `--line-strong` above | *…öppnar om nio dagar, den 13 augusti, Slottsskogen.* |
| **Imorgon** | `IMORGON · 13 AUG` | Word replaces numeral, mono 13px caps | 2px rule | *…öppnar imorgon, den 13 augusti, Slottsskogen.* |
| **Idag, ej börjat** | `IDAG · ÖPPNAR 18:00` | Mono 13px | 3px pillar rule | *…öppnar idag klockan 18:00, Slottsskogen.* |
| **Pågår** | `● PÅGÅR NU · TILL 15 AUG` | Mono 13px; 6px `--accent` dot, `aria-hidden`, **static, never pulsing** | 3px `--accent` rule | *…pågår nu, till och med den 15 augusti, Slottsskogen.* |
| **Avslutat** | `AVSLUTAT 15 AUG` | Mono 13px in `--muted` | 1px `--line` | *…avslutades den 15 augusti.* |

`PÅGÅR NU` ships **only** from a stored, editor-confirmed occurrence range — never from opening hours, never from a live status. Under `forced-colors: active` the 6px dot is replaced by the literal word `PÅGÅR`. No sub-day granularity exists anywhere in the codebase: the formatter has no hours/minutes/seconds branch to reach.

**Min target:** the plate is not itself interactive on IDAG (it is a label, and its object is the link beneath it); on the detail page it is inert. Where it appears inside a card it inherits the card's stretched link. If a variant ever becomes tappable it takes 48×48.

**200%:** at `@container anslag (max-width: 380px)` the numeral moves **above** the mono line (`flex-direction: column`, `align-items: start`) instead of beside it; the container is `min-height`, never fixed; at 320px/200% the band `14–2 d` renders numeral 42.5px over two mono lines totalling 118px tall, no clip. No circle, no `border-radius`, no absolute positioning anywhere in the component — that is what made the audited version overflow at three digits.

### 3. VÄGGETIKETT — the wall label

The curator's sentence. Literata 400, `--type-label` (17px/1.55), colour `--ink` (never `--muted`), max 42ch, 25–40 words, sentence case. Required field: **an object without a `varfor` cannot be published** (DB check + publish trigger). On cards: 3 line boxes, cut on a line box, no fade. On detail: full, directly under the title and the anslag, above every other metadata. Its attribution slot is welded to it — source line in DM Mono 13px beneath — so licence credit is structurally impossible to omit.

**States:** rest · clamped (card) · full (detail) · English (`lang="en"` on the subtree, 10% drier, no editorial "vi") · corrected (a `RÄTTAD` mono line appended, linking to RÄTTELSER) · never-empty (there is no empty state; absence blocks publish).

**Min target:** non-interactive; the source line's "rätta uppgift" link is 44×44.

**200%:** grows to 34px/1.55, measure recalculates in ch so it stays 42ch, card clamp goes from 3 lines to 2 lines at `@container (max-width: 300px)` so the plate does not become a wall of text on a phone at maximum scale.

### 4. SALSHUVUD — the room header

The threshold. Full-bleed 96px band (mobile) / 160px (≥1200px) of bare `--ground`, a full-bleed 1px `--line` rule, the room name in Familjen Grotesk at `--type-room` sitting on the rule, the PLANEN mark at 24px with the wing quadrant filled in that wing's hue, and the wing name in words beside it (colour is never the sole carrier). Below it, the mechanism stamp: `OMHÄNGD 06:40 · 212 OBJEKT · 14 NYFÖRVÄRV`.

**States:** rest · entering (VÄGGTEXTEN: wght 500→700 on `animation-timeline: view()`, the only variable-axis motion in the product) · reduced-motion (locked at wght 600, rule pre-drawn) · sticky-collapsed on desktop (name only, 20px, in the 56px bar) · filtered (a second line: `FILTRERAT: IKVÄLL · UTOMHUS · under 300 kr` in words, with a 44px `Rensa` control) · empty room (never occurs for SEVÄRDHETER by design; other rooms fall back to the tunn-dag empty state).

**Min target:** the room name is not a control; the wing chips in the rail are 48×44 each with 8px separation.

**200%:** `--type-room` grows with its rem term to 68px at 200%; band `min-height` grows; tracking drops from −0.02em to −0.005em via the size-band tracking rule so glyphs cannot collide.

### 5. SPARA — the save control (ETIKETTEN)

Square 44×44 visual, 48×48 hit box, bottom-right of the plate 16px from both edges — **inside the thumb arc of the card being read**, which is the whole reason it is not at the top. Inline 24×24 SVG bookmark, outline → filled over 180ms; plate top rule flashes `--accent` 220ms and settles; `aria-pressed` flips; toast anchored 16px above the nav reads `Sparad i Höstdejter · Ångra` for 2.4s with a 48px-tall Ångra target. Short `navigator.vibrate(8)` where available. No rotation, no scale overshoot, no stamp.

**First save** opens the SPARA I LISTA sheet: existing lists as 56px rows, a `Ny lista` field, and `Hoppa över` which saves to the auto-created `Sparat` list — so one tap always succeeds and flow is never broken. Subsequent saves go straight to the last-used list.

**States:** unsaved · saving (optimistic: filled immediately, 250ms grace) · saved · save-failed (icon reverts, toast `Kunde inte spara. Försök igen.` with a 48px Försök igen) · offline (queued to IndexedDB, toast `Sparas när du är uppkopplad`, icon filled with a 1px dashed keyline) · signed-out (opens the auth sheet; the object is held in `sessionStorage` and saved after auth) · pressed · focus-visible · disabled (never — a disabled save does not exist).

**200%:** the icon does not scale (it is a 24px SVG, not type); the hit box stays 48×48; the toast becomes two lines and its `min-height` grows from 48px to 88px; the toast never covers the nav because it is anchored above it.

### 6. SAMLINGSKORT — the list card

A collection rendered as a plate. Cover is drawn by the **same KATALOGPLATTA renderer** from `lists.cover_seed`, so a brand-new empty collection is already a designed object. Title in Familjen Grotesk 600, description in Literata italic, personal accession in mono (`S-004`), item count in mono, and a 4-up mosaic of member object plates once ≥4 items exist.

**States:** empty (cover only + `Samlingen är tom. Spara något du vill komma ihåg, så bygger den sig själv.`) · 1–3 items (cover + stacked rail) · 4+ (mosaic) · private (default) · link-shared (a 13px mono `DELAD MED LÄNK` line + a 48px `Kopiera länk` and `Sluta dela`) · public · owner view (reorder handles, 48×48, keyboard-operable via `ArrowUp/Down` with an `aria-live="polite"` position announcement) · visitor view (no reorder, no save-into) · contains-past-items (a `Tidigare` sub-section, items greyed to `--ink-2` but readable, never removed) · printing (A4 single page with a legend).

**Min target:** row 56px tall, reorder handle 48×48, share control 48×48.

**200%:** mosaic collapses to a single column at `@container (max-width: 300px)`; the count and accession move to their own line; the sticky footer of the list view **becomes static at page end** so it cannot eat the viewport (grafted rule, verbatim).

### 7. TIDSREMSA + SALSVÄLJARE + KVARTERSVÄLJARE — filter and wayfinding

**TIDSREMSA** — permanently mounted, never a hidden drawer. A single horizontal row of five pill segments: `ALLTID · NU · IKVÄLL · IMORGON · HELGEN`. `ALLTID` is permanent and first, which is what makes the permanent city a first-class citizen of the time axis. Row height **48px**, segments ≥64×44 with 8px separation, `role="radiogroup" aria-label="Tid"`. Sticky under the 56px bar on room routes.

**SALSVÄLJARE** — the four wings as chips, each carrying its PLANEN quadrant, its hue and **its name in words**.

**KVARTERSVÄLJARE** — an 8-tile neighbourhood grid (Centrum, Vasastan, Linné, Majorna, Haga, Örgryte, Hisingen, Norr om älven), each tile 2 columns wide × 72px tall. Selecting one produces distances without location permission. A separate opt-in action may use the device position; `next.config.ts` limits geolocation to `self`, and the coordinate is never persisted. Distances are computed from the selected/device point and the object's stored coordinate.

**The starvation rule:** a filter never silently removes anything. Objects excluded by the active filter collapse into a single visible counted row: `23 dolda av läget — visa`, 48px tall, which expands **in place**. The active filter is printed in words in the SALSHUVUD with a visible `Rensa`.

**States:** none active (default = `ALLTID`) · one active · multiple active · zero results (the filter row shows `0 kvar` and the empty state names a room that cannot be empty) · loading (segments disabled 200ms max, never a spinner) · overflowing (the row scrolls horizontally with `scroll-snap-type: x proximity`, never wraps to two rows on mobile) · keyboard (arrow keys move within the radiogroup, Home/End jump).

**200%:** the pill row scrolls rather than wrapping; at `@container (max-width: 300px)` the kvarter grid drops from 4×2 to 2×4; segment `min-height` grows from 44px to 60px and the strip's own height token grows with it.

### 8. AVFÄRDEN — the outbound interstitial

The component that fixes Dojo's documented cause of death. A native `<dialog>` opened with `showModal()` — so Chrome Android wires the system back button and predictive-back peek for free via CloseWatcher, and iOS's history entry closes it. Rises to **40dvh, max 420px**, 280ms `cubic-bezier(0.32, 0.72, 0, 1)`.

Content: the departure sentence — `Du lämnar STADEN och går till ticketmaster.se. Vi sparar objektet så du hittar tillbaka.` — the **destination domain named in words**, the price we already know so the partner page confirms rather than surprises, and at most three rows at 48px each: **Fortsätt** (`target="_blank" rel="noopener noreferrer"` → Chrome Custom Tab on Android tinted with the manifest `theme_color`, SFSafariViewController on iOS, both of which return to STADEN), **Spara till lista i stället**, **Avbryt**. Directions use `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}&travelmode=transit` — never a `geo:` URI, which throws an app-chooser on Android and silently fails where nothing handles it.

**The object is saved before the user leaves**, unconditionally, to a system list `Påbörjade`. That is the return path.

**States:** ticket · booking · venue site · directions · programme PDF · **destination flagged not mobile-optimised** (`object_links.mobile_ok = false` → a `--muted` mono line `Extern sida, kan vara svår på mobil` and the directions row is promoted above it) · link dead (`http_status >= 400` at last check → the row is replaced by `Länken svarar inte. Vi har rapporterat det.` and a `Vägbeskrivning` row) · offline (rows disabled, `Ingen uppkoppling. Objektet är sparat.`).

**Min target:** every row 48px, 8px separation, the close affordance 48×48, plus dismiss on backdrop click and Escape.

**200%:** `max-block-size: 90dvh; overflow-y: auto; overscroll-behavior: contain`; rows grow to `min-height: 64px`; the departure sentence reflows and the dialog scrolls internally rather than clipping.

### 9. TOMT LÄGE — empty states

One component, six authored strings, all shipping (Part 1, §Voice, strings 15–19, 23). Structure: a KATALOGPLATTA composition 5 (*Fotmarginal* — the calm one) carrying the message in Literata 17px, plus exactly one 48px action, plus never an illustration and never an emoji.

**States:** thin day (`Tunn dag. Fyra saker, och alla fyra är värda det.` — no action) · filter returns zero (`…Prova utan filter, eller gå till Sevärdheter — den salen är alltid öppen.` + two 48px actions) · zero search results (`Vi hittade inget på "vasaplatsen brunch"…` + `Rensa sökningen`) · empty collection (`Samlingen är tom…` + `Utforska Salarna`) · no collections yet · end of edition (`Slut för idag. Nästa hängning klockan 06:40…` + `Gå till Salarna`).

**Min target:** the single action 48px tall, ≥120px wide.
**200%:** plate is `min-height` and grows; the message never truncates; action wraps to two lines and the plate grows with it.

### 10. SKELETT — the loading state

**Not a shimmer.** A shimmer is motion that carries no information and loops forever, which the motion law forbids. The skeleton is the **reserved box**: media frame at its declared aspect ratio filled with flat `--line`; title bar as two flat `--line` rectangles at the title's exact line-box height; rail as four flat rectangles at 13px height. No animation, no gradient, no pulse. Because every box is reserved from the schema (`object_media.width/height` are NOT NULL), the skeleton and the loaded object occupy **identical geometry**, so CLS from loading is 0 by construction.

**States:** initial route load (server-rendered skeleton via `loading.tsx`, ≤3 plates) · pagination (2 plates appended) · media pending inside a loaded plate (grey box only; title, label and rail are already real, because they came from Postgres in the same server render) · slow (>3s: a 13px mono line `Hämtar…` appears under the bar — text, not a spinner) · timed out (→ error state).

**Min target:** none (inert, `aria-hidden="true"`, with a single visually-hidden `<p role="status">Laddar innehåll</p>`).
**200%:** boxes are sized from the same rem line-boxes as the real type, so they grow identically.

### 11. FEL — the error state

Route-level `error.tsx` and a per-plate inline variant. Never a stack trace, never an error code as the headline. Copy names what failed and what still works: `Vi kunde inte hämta Salarna just nu. Det du har sparat fungerar fortfarande.` Two 48px actions: `Försök igen` and `Gå till Sparat`. A 13px mono technical line at the foot for support: `FEL 503 · 14:22 · idag/kultur`.

**States:** route error · plate-level error (the plate renders as a KATALOGPLATTA with the title from cache and a mono `KUNDE INTE HÄMTAS` in slot 2) · **stale edition** (`Dagens hängning är försenad. Det som står här är från igår klockan 06:40.` — a full-bleed 1px-ruled band above the first object; we say so, we do not pretend) · auth error · rate-limited · 404 (`Objektet finns inte längre. Här är salen det stod i.`).

**Min target:** actions 48px.
**200%:** band grows, technical mono line wraps rather than truncating.

### 12. OFFLINE

Detected by `navigator.onLine` plus a failed fetch, never by `onLine` alone. A persistent 40px band under the 56px bar: `Ingen uppkoppling. Här är det du har sparat.` Navigation is reduced to the collections tab and any cached object detail; the tab bar's other destinations get `aria-disabled="true"` and a 13px mono `Kräver uppkoppling`. Saves are queued to IndexedDB and flushed on `online`.

**States:** offline with cache · offline with empty cache (`Ingen uppkoppling och inget sparat än.`) · reconnecting (band changes to `Återansluter…`) · reconnected (band shows `Uppkopplad igen · Uppdatera` for 6s with a 48px action, then removes itself) · queued writes pending (a mono count in the band: `2 sparningar väntar`).

**Min target:** band actions 48px; the band is never a toast and never auto-dismisses while offline.
**200%:** band becomes two lines, `min-height` grows, content below shifts by the band's real height (measured with a `ResizeObserver` writing `--offline-band-h`), so nothing is covered.

### 13. KATALOGPLATTA — the imageless object

Fully specified in Part 1. Implementation contract: `plate_seed`, `plate_layout`, `plate_font_px`, `plate_breaks` are computed **at ingest and stored**, so the plate is byte-identical on a Pixel, an iPhone, a 1440px desktop and in the Open Graph renderer, forever. The halftone is a `repeating-conic-gradient` at `dot_pitch` px rotated to `screen_angle`, 9% ink light / 5% dark. Ground is the pillar hue at the theme's capped flood area (40% light / 22% dark). Type knocked out in `--ground`.

**States:** the six compositions (Väggtext, Centrerad plakett, Regalskylt, Nummerplåt, Fotmarginal, Diagonalstapel) · demoted-media variant (full-bleed plate + 96×96 inset of the real photo, bottom-right, 1px keyline) · **LUGNT LÄGE** (collapses to composition 1 on flat ink, halftone off, type left-aligned, one step up the reading scale) · forced-colors (halftone dropped, `CanvasText` type on `Canvas`, 2px `CanvasText` keyline) · collection cover · Open Graph 1200×630 · print (halftone renders as a 45° 65lpi screen at 300dpi, or flat ink if the print stylesheet detects no colour).

**Min target:** inherits the plate's stretched link.
**200%:** the title is **never cropped** — `plate_font_px` and `plate_breaks` were solved at ingest against the plate's aspect ratio, the plate has `min-height` and no fixed height, so at 200% it reflows to a taller plate. Only the accession number may bleed off the edge.

### 14. Chrome and utility components

| Component | Spec | States | Target | 200% |
|---|---|---|---|---|
| **HUVUDRAD** (sticky bar) | `min-height: 56px + --safe-t`, opaque `--ground`, 1px bottom rule, wordmark lockup left, city button right | rest · scrolled (rule appears) · offline (band below) · LUGNT | city button 44×44 spanning full bar height | `min-height`, grows; wordmark stays SVG so it never reflows |
| **STADSRADEN** (nav) | iOS: floating capsule, 3 items + search, inset 16, lift `max(12px, 8px+safe-b)`, radius 28, `--shadow-tab`. Android: full-bleed, no gap, no radius, no shadow, `padding-bottom: max(safe-b, 24px)`, M3 32px indicator pill | rest · active · pressed · focus · keyboard-open (retracts on `visualViewport.height < innerHeight − 150`, 180ms) · offline (2 items disabled) | 56×56 hit, 48×48 visual, labels **always visible** at 0.8125rem | labels wrap to 2 lines, bar `min-height` grows to 72px, `--scroll-floor` recomputed from a `ResizeObserver` |
| **KATALOGSKENA** (metadata rail) | `<dl>` of 4 fixed slots — KATEGORI / TID / PLATS / PRIS — DM Mono 13px, tracking 0.06em, `·` separators as `aria-hidden` spans, fixed-position columns so walk time and price land on the same pixel on every row | all present · any slot absent (**slot omits and collapses — never an em-dash, never a greyed placeholder**) · wrapped (2–4 rows) · complete with only slots 1+3 | inert | wraps rather than truncates (grafted rule, verbatim) |
| **MEKANISMSTÄMPEL** | `OMHÄNGD 06:40 · 212 OBJEKT · 14 NYFÖRVÄRV`, mono 13px, static | fresh · stale (yesterday's time + the stale band) · failed run | tappable → RÄTTELSER/källor, 44px | wraps to 2 lines |
| **DAGSLJUSET** | 3px rule under the rail, `--dagsljus` written once per render from `city_daylight`, `width` transitions 600ms linear; always carries `LJUS TILL 20:41` beside it | day · night (rule at 0, text `LJUS FRÅN 07:12`) · reduced-motion (final width, no transition) · data missing (component omitted entirely) | inert | text grows, rule height fixed at 3px |
| **RÄTTELSER** | Public corrections desk: a route of dated rows, `Vi hade fel. Rättat 14 aug: entrén är 80 kr, inte fri.` | empty (`Inga rättelser än.`) · list · linked-from-object | rows 56px | rows grow |
| **STADSVÄLJARE** | `<dialog>` from the city button, city list + search, ≤2 taps | 1 city (Göteborg only — shows a `Fler städer kommer` note, no fake options) · n cities · switching (route change with a View Transition) | rows 56px | dialog scrolls internally |
| **TEMAVÄLJARE** | Three-state control: `System · Ljus · Mörk`, writing `data-theme` + `localStorage`, applied by a blocking inline script before paint (no flash) | system · light · dark | 48×44 segments | segments grow |
| **INSTALLATIONSBAND** | Android: `beforeinstallprompt` captured, `preventDefault()`, surfaced as a 72px wall-label row at the foot of the collections screen, **on the second session only**, dismissal stored 30 days, removed on `appinstalled`. iOS: a static A2HS instruction row, same geometry | hidden · offered · dismissed · installed | 48px action | row grows |
| **UPPDATERA** | Standalone has no pull-to-refresh, so a persistent 44px mono line under the bar: `UPPDATERAD 07:14 · Uppdatera`. Plus a custom 72px-overscroll pull on the IDAG scroller | idle · pulling · refreshing · just-refreshed (6s) · failed | 44px | line wraps |
| **HOPPA TILL INNEHÅLL** | First focusable element, `Hoppa till innehåll`, visually hidden until focused, then 16px from top-left, z-index 100 | hidden · focused | 48px | grows |
| **UTSKRIFT** | Print stylesheet: a shared collection renders as one A4 page — objects as rows, wall labels in full, a legend of the four wings, the accession series, and the STADEN lockup; no nav, no images beyond 240px, halftone flattened | — | — | — |

---

## Supabase schema

Ships as reviewed SQL in `supabase/migrations/`. Nine files. `search_path` is pinned on every function; every table has RLS enabled explicitly, including the ones that are world-readable.

### 0001_extensions_and_types.sql

```sql
create extension if not exists pgcrypto;
create extension if not exists citext;
create extension if not exists pg_trgm;
create extension if not exists unaccent;
create extension if not exists postgis;

create type pillar          as enum ('kultur','nojen','mat','sevardheter');
create type object_kind     as enum ('handelse','plats');
create type curation_state  as enum ('forslag','under_granskning','publicerad','avvisad','arkiverad');
-- NOTE: there is deliberately NO 'google' member. A Google-sourced field is
-- unrepresentable in this database, which is how the legal constraint is enforced.
create type source_kind     as enum ('goteborg_co','osm','overture','wikidata','wikipedia',
                                     'venue','redaktion','anvandare');
create type licence_kind    as enum ('odbl-1.0','cc-by-sa-4.0','cc-by-4.0','cc0-1.0',
                                     'proprietar_med_tillstand','redaktionell');
create type media_role      as enum ('lead','galleri','miniatyr');
create type link_kind       as enum ('biljett','bord','hemsida','program','karta','ljud');
create type price_kind      as enum ('gratis','fast','fran','intervall','okand');
create type list_visibility as enum ('privat','lank','publik');
create type terrain_kind    as enum ('platt','uppfor','nedfor','trappor','kaj','grus','skog');
create type occurrence_state as enum ('planerad','installd','flyttad','slutsald');
create type run_state       as enum ('kord','delvis','misslyckad');
create type candidate_state as enum ('ny','matchad','duplikat','avvisad','befordrad');
create type app_role        as enum ('besokare','redaktor','admin');
```

### 0002_geography.sql

```sql
create table cities (
  id            uuid primary key default gen_random_uuid(),
  slug          citext not null unique,                 -- 'goteborg'
  name_sv       text   not null,
  name_en       text   not null,
  country_code  char(2) not null,
  timezone      text   not null default 'Europe/Stockholm',
  locale_primary text  not null default 'sv-SE',
  centroid      geography(Point,4326) not null,
  bbox          geography(Polygon,4326) not null,
  wordmark_city text   not null,                        -- 'GÖTEBORG' for the lockup
  is_live       boolean not null default false,
  created_at    timestamptz not null default now()
);

create table districts (                                 -- kvarter, the 8 tiles
  id         uuid primary key default gen_random_uuid(),
  city_id    uuid not null references cities(id) on delete cascade,
  slug       citext not null,
  name_sv    text not null,
  name_en    text,
  centroid   geography(Point,4326) not null,
  sort_order smallint not null,
  unique (city_id, slug),
  unique (city_id, sort_order)
);
create index districts_city_idx on districts (city_id, sort_order);

create table transit_anchors (                           -- 'Brunnsparken', 'Stigbergstorget'
  id       uuid primary key default gen_random_uuid(),
  city_id  uuid not null references cities(id) on delete cascade,
  name     text not null,
  kind     text not null check (kind in ('hallplats','torg','station')),
  geo      geography(Point,4326) not null,
  unique (city_id, name)
);

create table city_daylight (                             -- LJUSET, precomputed 400 days ahead
  city_id uuid not null references cities(id) on delete cascade,
  day     date not null,
  sunrise timestamptz not null,
  sunset  timestamptz not null,
  primary key (city_id, day)
);
```

### 0003_sources_and_provenance.sql

```sql
create table sources (
  id                  uuid primary key default gen_random_uuid(),
  city_id             uuid references cities(id) on delete cascade,  -- NULL = global (wikidata)
  kind                source_kind not null,
  name                text not null,
  base_url            text,
  licence             licence_kind not null,
  attribution_text    text not null,      -- rendered verbatim under every object it fills
  attribution_url     text,
  terms_url           text,
  poll_cron           text,               -- '40 6 * * *'
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  unique (city_id, kind, name)
);

create table field_provenance (
  id           bigint generated always as identity primary key,
  object_id    uuid not null references objects(id) on delete cascade,
  field_name   text not null,             -- 'title','varfor','geo','address_line','hours','price'
  source_id    uuid not null references sources(id) on delete restrict,
  source_ref   text,                      -- OSM 'node/240...', wikidata 'Q1234', URL
  fetched_at   timestamptz not null,
  licence      licence_kind not null,
  attribution_required boolean not null,
  unique (object_id, field_name)
);
create index field_provenance_source_idx on field_provenance (source_id);
```

Every persisted, human-visible field on `objects` must have a `field_provenance` row before `curation` may reach `publicerad`; a trigger enforces it against a hardcoded list of eight field names. Because `source_kind` has no `google` member, a Google-derived value cannot be given provenance and therefore cannot be published.

### 0004_objects.sql — the supertype

**Polymorphism strategy: single-table supertype with a `kind` discriminant plus an optional child table.** One `objects` table holds everything both a `handelse` and a `plats` share — which, in this product, is nearly everything: title, wall label, pillar, district, geo, walk time, terrain, price, media, links, accession, plate seed. Time is the *only* real difference, so it lives in a child table (`object_occurrences`) that events have ≥1 of and places have 0 of, and a second child (`object_hours`) that places have and events usually do not. This is what makes "one coherent system without one feeling bolted onto the other" a schema fact rather than a design aspiration: the card chassis reads one row, and slot [2] of the catalogue rail reads whichever child exists. Class-table inheritance was rejected because it forces a join on the hottest read path and makes a mixed room a `UNION`; JSONB blobs were rejected because they cannot be constrained or indexed.

```sql
create table objects (
  id             uuid primary key default gen_random_uuid(),
  city_id        uuid not null references cities(id) on delete restrict,
  kind           object_kind not null,
  pillar         pillar not null,
  slug           citext not null,
  accession      text not null,                       -- 'K-0142'

  title          text not null check (char_length(title) between 2 and 120),
  title_en       text,
  subtitle       text,
  varfor         text not null,                       -- THE WALL LABEL
  varfor_en      text,
  varfor_author  source_kind not null default 'redaktion',
  body           text,
  body_en        text,

  district_id    uuid references districts(id) on delete set null,
  venue_name     text,
  address_line   text,                                -- never from Google (see provenance)
  geo            geography(Point,4326),
  walk_anchor_id uuid references transit_anchors(id) on delete set null,
  walk_minutes   smallint check (walk_minutes between 0 and 90),
  walk_terrain   terrain_kind,

  price_kind     price_kind not null default 'okand',
  price_min_ore  integer check (price_min_ore >= 0),
  price_max_ore  integer check (price_max_ore >= 0),
  price_note     text,

  is_landmark    boolean not null default false,
  landmark_by    uuid references profiles(id) on delete set null,
  landmark_at    timestamptz,

  curation       curation_state not null default 'forslag',
  published_at   timestamptz,
  archived_at    timestamptz,

  plate_seed     integer  not null,
  plate_layout   smallint not null check (plate_layout between 0 and 5),
  plate_font_px  smallint not null check (plate_font_px between 18 and 96),
  plate_breaks   text[]   not null default '{}',

  google_place_id text,                                -- the ONLY Google field, join key only

  search_tsv     tsvector generated always as (
                   setweight(to_tsvector('swedish', coalesce(title,'')), 'A') ||
                   setweight(to_tsvector('swedish', coalesce(venue_name,'')), 'B') ||
                   setweight(to_tsvector('swedish', coalesce(varfor,'')), 'C')
                 ) stored,

  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  constraint varfor_wordcount check (
    array_length(regexp_split_to_array(btrim(varfor), '\s+'), 1) between 25 and 40),
  constraint price_range check (
    price_max_ore is null or price_min_ore is null or price_max_ore >= price_min_ore),
  constraint landmark_is_human check (
    is_landmark = false or (landmark_by is not null and landmark_at is not null)),
  constraint published_has_time check (
    curation <> 'publicerad' or published_at is not null)
);

create unique index objects_city_slug      on objects (city_id, slug);
create unique index objects_city_accession on objects (city_id, accession);
create index objects_room_idx   on objects (city_id, pillar, curation, published_at desc);
create index objects_geo_idx    on objects using gist (geo);
create index objects_search_idx on objects using gin (search_tsv);
create index objects_title_trgm on objects using gin (title gin_trgm_ops);
create index objects_landmark_idx on objects (city_id, published_at)
  where is_landmark and curation = 'publicerad';
comment on column objects.google_place_id is
  'Google Maps Platform: place_id may be stored indefinitely. NOTHING ELSE from Places may be persisted here or anywhere.';
```

Trigger `enforce_max_three_landmarks(city_id)` raises if a fourth concurrent `is_landmark` object would be published. Trigger `enforce_publish_ready(object)` raises unless: `varfor` present and `varfor_author = 'redaktion'`; `pillar`, `district_id`, `price_kind` set; provenance rows exist for every persisted visible field; and, for `kind = 'handelse'`, at least one `object_occurrences` row exists.

```sql
create table object_occurrences (
  id           uuid primary key default gen_random_uuid(),
  object_id    uuid not null references objects(id) on delete cascade,
  starts_at    timestamptz not null,
  ends_at      timestamptz,
  all_day      boolean not null default false,
  door_time    time,
  state        occurrence_state not null default 'planerad',
  rrule        text,
  note         text,
  constraint ends_after_starts check (ends_at is null or ends_at >= starts_at)
);
create index occ_object_idx on object_occurrences (object_id, starts_at);
create index occ_window_idx on object_occurrences (starts_at, ends_at);

create table object_hours (
  id         uuid primary key default gen_random_uuid(),
  object_id  uuid not null references objects(id) on delete cascade,
  weekday    smallint not null check (weekday between 0 and 6),
  opens      time,
  closes     time,
  is_closed  boolean not null default false,
  valid_from date,
  valid_to   date,
  note       text,
  constraint hours_present check (is_closed or (opens is not null and closes is not null)),
  unique (object_id, weekday, valid_from, opens)
);

create table object_media (
  id            uuid primary key default gen_random_uuid(),
  object_id     uuid not null references objects(id) on delete cascade,
  role          media_role not null default 'lead',
  storage_path  text not null,                     -- Supabase Storage, bucket 'objekt'
  width         integer not null check (width  > 0),
  height        integer not null check (height > 0),
  bytes         integer,
  mime          text not null,
  focal_x       numeric(4,3) not null default 0.500,
  focal_y       numeric(4,3) not null default 0.380,
  photographer  text,
  credit_line   text not null,                     -- 'FOTO: RÖDA STEN KONSTHALL' | 'BILD FRÅN ARRANGÖREN'
  licence       licence_kind not null,
  source_url    text,
  gate_passed   boolean not null,
  demoted_reason text,
  sort          smallint not null default 0,
  created_at    timestamptz not null default now(),
  constraint gate_is_deterministic check (
    gate_passed = (greatest(width,height) >= 800
                   and (width::numeric / height) between 0.5 and 2.2))
);
create index media_object_idx on object_media (object_id, role, sort);

create table object_links (
  id         uuid primary key default gen_random_uuid(),
  object_id  uuid not null references objects(id) on delete cascade,
  kind       link_kind not null,
  url        text not null,
  domain     text not null,                        -- named in AVFÄRDEN, computed at write
  label_sv   text,
  label_en   text,
  mobile_ok  boolean,                              -- NULL = unchecked
  http_status smallint,
  checked_at timestamptz,
  unique (object_id, kind, url)
);
create index links_object_idx on object_links (object_id, kind);
```

### 0005_editions.sql

```sql
create table editions (
  id            uuid primary key default gen_random_uuid(),
  city_id       uuid not null references cities(id) on delete cascade,
  edition_date  date not null,
  hung_at       timestamptz not null,              -- 06:40 local
  label         text not null,                     -- '06:40'
  note_sv       text,                              -- the day's note, Literata italic
  note_en       text,
  weather_code  smallint,
  weather_note  text,
  object_count  integer not null default 0,
  new_count     integer not null default 0,
  status        text not null default 'utkast'
                check (status in ('utkast','publicerad','forsenad')),
  unique (city_id, edition_date)
);

create table edition_slots (                       -- the fixed forme: named slots the machine FILLS
  edition_id uuid not null references editions(id) on delete cascade,
  slot_key   text not null,                        -- 'lead','snart','morgon_1'…'kvall_3'
  position   smallint not null,
  object_id  uuid references objects(id) on delete set null,
  primary key (edition_id, slot_key)
);
create index edition_slots_object_idx on edition_slots (object_id);
```

### 0006_ingestion.sql

```sql
create table ingestion_runs (
  id             uuid primary key default gen_random_uuid(),
  city_id        uuid not null references cities(id) on delete cascade,
  started_at     timestamptz not null default now(),
  finished_at    timestamptz,
  status         run_state not null default 'kord',
  trigger        text not null default 'cron' check (trigger in ('cron','manuell','omkorning')),
  pipeline_version text not null,
  sources_attempted uuid[] not null default '{}',
  sources_failed    uuid[] not null default '{}',
  candidates_in     integer not null default 0,
  candidates_new    integer not null default 0,
  candidates_matched integer not null default 0,
  candidates_duplicate integer not null default 0,
  error_text     text
);
create index runs_city_idx on ingestion_runs (city_id, started_at desc);

create table ingest_candidates (
  id            uuid primary key default gen_random_uuid(),
  run_id        uuid not null references ingestion_runs(id) on delete cascade,
  city_id       uuid not null references cities(id) on delete cascade,
  source_id     uuid not null references sources(id) on delete restrict,
  source_uid    text not null,
  identity_hash text not null,
  payload       jsonb not null,
  proposed_object_id uuid references objects(id) on delete set null,
  match_score   numeric(4,3),
  duplicate_of  uuid references ingest_candidates(id) on delete set null,
  state         candidate_state not null default 'ny',
  reviewed_by   uuid references profiles(id) on delete set null,
  reviewed_at   timestamptz,
  reject_reason text,
  created_at    timestamptz not null default now(),
  unique (run_id, source_id, source_uid)
);
create index cand_identity_idx on ingest_candidates (city_id, identity_hash);
create index cand_queue_idx    on ingest_candidates (city_id, state, created_at);

create table editorial_actions (
  id        bigint generated always as identity primary key,
  actor_id  uuid not null references profiles(id) on delete restrict,
  object_id uuid references objects(id) on delete set null,
  candidate_id uuid references ingest_candidates(id) on delete set null,
  action    text not null,                         -- 'befordra','avvisa','redigera','flagga_landmark'
  before    jsonb,
  after     jsonb,
  at        timestamptz not null default now()
);
create index editorial_actions_object_idx on editorial_actions (object_id, at desc);

create table corrections (                          -- RÄTTELSER, the public desk
  id          uuid primary key default gen_random_uuid(),
  object_id   uuid not null references objects(id) on delete cascade,
  city_id     uuid not null references cities(id) on delete cascade,
  field_name  text,
  text_sv     text not null,
  text_en     text,
  reported_by uuid references profiles(id) on delete set null,
  handled_by  uuid not null references profiles(id) on delete restrict,
  published_at timestamptz not null default now(),
  is_visible  boolean not null default true
);
create index corrections_city_idx on corrections (city_id, published_at desc);
```

### 0007_google_cache.sql — the only table that touches Google

```sql
create table google_place_cache (
  place_id          text primary key,
  object_id         uuid references objects(id) on delete set null,
  lat               double precision,
  lng               double precision,
  coords_fetched_at timestamptz,
  created_at        timestamptz not null default now()
);
create index gpc_object_idx on google_place_cache (object_id);
create index gpc_expiry_idx on google_place_cache (coords_fetched_at)
  where coords_fetched_at is not null;

create view google_place_cache_valid as
  select place_id, object_id, lat, lng, coords_fetched_at
  from google_place_cache
  where coords_fetched_at > now() - interval '30 days';

comment on table google_place_cache is
  'Google Maps Platform 2026 terms: place_id may be retained indefinitely; lat/lng may be
   cached for at most 30 days. NO other Places field may ever appear in this table or any other.';
```

A `pg_cron` job at 03:20 daily runs `update google_place_cache set lat = null, lng = null, coords_fetched_at = null where coords_fetched_at < now() - interval '28 days';` — a two-day margin so expiry is enforced by machinery, never by memory. **Application code reads `google_place_cache_valid`, never the base table.** The base table is not exposed to PostgREST at all.

### 0008_visitors.sql

```sql
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  handle        citext unique,
  display_name  text,
  role          app_role not null default 'besokare',
  city_id       uuid references cities(id) on delete set null,
  locale        text not null default 'sv' check (locale in ('sv','en')),
  theme         text not null default 'system' check (theme in ('system','ljus','mork')),
  lugnt_lage    boolean not null default false,
  list_counter  integer not null default 0,        -- personal accession series S-001…
  created_at    timestamptz not null default now()
);

create table lists (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references profiles(id) on delete cascade,
  city_id     uuid references cities(id) on delete set null,
  title       text not null check (char_length(title) between 1 and 60),
  description text check (char_length(description) <= 280),
  accession   text not null,                       -- 'S-004'
  cover_seed  integer not null,
  visibility  list_visibility not null default 'privat',
  share_token text unique,
  is_system   boolean not null default false,      -- 'Sparat', 'Påbörjade'
  item_count  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint share_token_required check (visibility = 'privat' or share_token is not null)
);
create unique index lists_owner_title on lists (owner_id, lower(title));
create unique index lists_owner_accession on lists (owner_id, accession);
create index lists_share_idx on lists (share_token) where share_token is not null;

create table list_items (
  id        uuid primary key default gen_random_uuid(),
  list_id   uuid not null references lists(id) on delete cascade,
  object_id uuid not null references objects(id) on delete cascade,
  position  numeric not null,                      -- fractional index, reorder without rewrites
  note      text check (char_length(note) <= 280),
  added_at  timestamptz not null default now(),
  unique (list_id, object_id)                      -- dedupe: saving twice is idempotent
);
create index list_items_order_idx on list_items (list_id, position);
```

A trigger on `profiles` insert creates the system list `Sparat` (`accession = 'S-001'`, `is_system = true`, undeletable, unrenameable). `item_count` is maintained by an `after insert/delete` trigger. Reorder writes a single `position` value between neighbours (`(prev+next)/2`), rebalancing the whole list only when the gap falls below `1e-6`. A 200-item list is fetched with keyset pagination on `(position, id)`, page size 40; there is no virtualization below 200 items and `content-visibility: auto` with `contain-intrinsic-size: 0 380px` above it. A saved event whose occurrence has passed **stays in the list**, moves to a `Tidigare` section after 30 days, and is never deleted — disappearance is the urgency mechanic we removed.

**There is no `views`, `likes`, `followers`, `saves_count`, `popularity`, `trending_score` or `rating` column anywhere in this schema.** Their absence is deliberate and is the structural guarantee behind "no engagement surfaces": a growth mechanic cannot be added later without a migration that a human has to sign.

### RLS policy intent, table by table

RLS is enabled on **every** table. Two helper functions, both `security definer` with `set search_path = public`: `auth_role()` returns the caller's `profiles.role`; `is_editor()` returns `auth_role() in ('redaktor','admin')`.

| Table | anon (public site) | authenticated visitor | redaktor | service_role |
|---|---|---|---|---|
| `cities`, `districts`, `transit_anchors`, `city_daylight` | SELECT where `is_live` | same | same | all |
| `sources` | SELECT (attribution must be renderable) | SELECT | SELECT | all |
| `objects` | **SELECT only where `curation = 'publicerad' and archived_at is null`** | same | SELECT all rows in their city; UPDATE all columns except `is_landmark`; UPDATE `is_landmark` only via `rpc_set_landmark()` which writes `landmark_by/at` and runs the 3-per-city check | all |
| `object_occurrences`, `object_hours`, `object_media`, `object_links` | SELECT where parent object is published | same | full CRUD on their city | all |
| `field_provenance` | SELECT where parent published (attribution is public by law) | same | INSERT/UPDATE | all |
| `editions`, `edition_slots` | SELECT where `status = 'publicerad'` | same | full | all |
| `ingestion_runs` | **none** | none | SELECT | INSERT/UPDATE |
| `ingest_candidates` | **none** | none | SELECT + UPDATE(`state`,`reviewed_*`,`reject_reason`) in their city | INSERT |
| `editorial_actions` | none | none | SELECT own city; INSERT via trigger only | all |
| `corrections` | SELECT where `is_visible` | SELECT; INSERT a *report* into a separate `correction_reports` queue, never into `corrections` | full | all |
| `google_place_cache` | **not exposed to PostgREST at all** (revoked from `anon`, `authenticated`) | none | none | all; read path is the `_valid` view via an Edge Function |
| `profiles` | none | SELECT/UPDATE `where id = auth.uid()`; SELECT `display_name, handle` of a list owner **only** when that list is shared | same | all |
| `lists` | SELECT where `visibility = 'publik'`, or where `visibility = 'lank'` **and** the request carries the exact `share_token` (matched inside the policy, never returned in a listing) | full CRUD `where owner_id = auth.uid()`; SELECT shared lists | same as visitor | all |
| `list_items` | SELECT where the parent list is publicly readable by the same rule | full CRUD where the parent list is owned | same | all |

Anon can read the whole published catalogue and nothing else — no drafts, no candidates, no runs, no profiles, no private lists, no Google cache. A link-shared list leaks the owner's `display_name` **only if the owner set one**; `handle` is never exposed for `visibility = 'lank'`. The daily automation authenticates as `service_role` from a Vercel Cron route with the key in a server-only env var; the browser never sees it and no client bundle imports the service client (enforced by an ESLint rule banning `SUPABASE_SERVICE_ROLE_KEY` outside `src/server/**`).

### Fields that may never be persisted from Google Maps Platform

Under the 2026 Google Maps Platform terms, `place_id` may be stored indefinitely and latitude/longitude may be cached for at most 30 days. **Everything else has no caching exception.** The following must never be written to Postgres, to Supabase Storage, to a Next.js data cache, to an ISR/`use cache` boundary, to a CDN cache, to a log line, to an Open Graph image, or to a client-side persistent store:

- `displayName` / `name` (Places display name)
- `formattedAddress`, `shortFormattedAddress`, `addressComponents`, `adrFormatAddress`
- `rating`, `userRatingCount`
- `reviews` — and every sub-field: `authorAttribution`, `text`, `originalText`, `publishTime`, `relativePublishTimeDescription`, `rating`
- `photos`, `photo.name` / `photo_reference`, any bytes fetched from the Place Photos endpoint, and `photo.authorAttributions`
- `editorialSummary`, `generativeSummary`, `reviewSummary`
- `regularOpeningHours`, `currentOpeningHours`, `secondaryOpeningHours`, `utcOffsetMinutes`
- `priceLevel`, `priceRange`
- `websiteUri`, `nationalPhoneNumber`, `internationalPhoneNumber`
- `businessStatus`, `plusCode`, `types` / `primaryType` / `primaryTypeDisplayName` (as stored labels)
- `location.latitude` / `location.longitude` **beyond 30 days** — permitted only in `google_place_cache` with `coords_fetched_at`, purged at day 28
- `viewport`, `iconMaskBaseUri`, `iconBackgroundColor`, `accessibilityOptions`, `parkingOptions`, `paymentOptions`, `allowsDogs`, `goodForChildren` and every other boolean attribute

**Consequences that are already designed in:** the object card is complete with zero Google fields — its name, address, hours, price and photo all come from Göteborg & Co, OSM/Overture, Wikidata, the venue with attribution, or our own editorial. Any live Places enrichment is fetched **at render time only**, in a Route Handler marked `export const dynamic = 'force-dynamic'` with `fetch(..., { cache: 'no-store' })` and a response header of `Cache-Control: private, no-store, max-age=0`, rendered client-side into a slot that is `aria-hidden` until it arrives and reserves zero layout (it is additive, never load-bearing). CI enforces three greps that fail the build: (1) any of the field names above appearing in a `.sql` file or a Supabase insert/update payload type; (2) `SUPABASE_SERVICE_ROLE_KEY` outside `src/server/**`; (3) a `fetch` to `places.googleapis.com` without `cache: 'no-store'`.

---

## Daily automation contract

Runs at **06:10 Europe/Stockholm** (hang published 06:40) and optionally **16:10** as a *supplement only* — the second run may add and correct, never re-hang. Vercel Cron → a Node route → Supabase `service_role`. Machine proposes; human disposes.

### The emitted document

One JSON document per run, written to Storage (`runs/{city}/{run_id}.json`) for audit and posted to `ingest_candidates`. Top level:

```jsonc
{
  "run": {
    "run_id": "0193f2b1-…",              // uuid, NOT NULL
    "city_slug": "goteborg",             // NOT NULL
    "pipeline_version": "3.2.0",         // NOT NULL, semver
    "started_at": "2026-08-23T04:10:02Z",// NOT NULL, ISO 8601 UTC
    "finished_at": "2026-08-23T04:16:41Z",// NOT NULL on completion
    "trigger": "cron",                   // NOT NULL: cron | manuell | omkorning
    "sources_attempted": ["goteborg_co","osm_overpass","wikidata","pustervik","roda_sten"],
    "sources_failed": ["roda_sten"],     // NOT NULL, may be []
    "counts": { "in": 418, "new": 37, "matched": 351, "duplicate": 26, "rejected": 4 },
    "error_text": null                   // NULLABLE
  },
  "candidates": [ /* … */ ]
}
```

### A candidate, field by field

| Field | Type | Null? | Notes |
|---|---|---|---|
| `source_uid` | string | **no** | The source's own stable id. Together with `source` it is the primary identity. |
| `source` | enum | **no** | `goteborg_co \| osm \| overture \| wikidata \| wikipedia \| venue \| redaktion` |
| `source_url` | string | yes | Rendered as the tappable source line. |
| `fetched_at` | ISO 8601 | **no** | Rendered in the source line: `hämtad 06:12`. |
| `licence` | enum | **no** | Drives the attribution string. |
| `identity_hash` | hex(64) | **no** | See dedupe below. |
| `kind` | `handelse\|plats` | **no** | Determines whether occurrences are required. |
| `pillar` | enum | yes | NULL → the object cannot publish; editor must set. |
| `title` | string | **no** | 2–120 chars, source-normalised (trim, collapse whitespace, strip trailing venue name). |
| `title_en` | string | yes | Only if the source publishes one; never machine-translated. |
| `subtitle` | string | yes | |
| `varfor_draft` | string | yes | **The machine may draft, never publish.** Stored on the candidate, copied into `objects.varfor` only after a human edits and sets `varfor_author='redaktion'`. |
| `body` | string | yes | Detail prose. |
| `venue_name` | string | yes | |
| `address_line` | string | yes | Must originate from OSM/Overture/venue/editorial. |
| `district_slug` | string | yes | Machine guesses from `geo` ∈ district polygon; editor confirms. |
| `geo` | `{lat,lng}` | yes | Non-Google only. |
| `geo_source` | enum | conditional | **NOT NULL when `geo` is present.** |
| `walk` | `{anchor,minutes,terrain}` | yes | `minutes` computed from OSM routing; `terrain` from OSM `incline`/`surface`/`steps`, else NULL. |
| `occurrences[]` | array | conditional | **Required non-empty when `kind='handelse'`.** Each: `starts_at` (**no**), `ends_at` (yes), `all_day` (**no**), `door_time` (yes), `state` (**no**, default `planerad`), `rrule` (yes). All timestamps ISO 8601 **with offset**, never naïve local. |
| `hours[]` | array | yes | `{weekday, opens, closes, is_closed, valid_from, valid_to}`. Never from Google. |
| `price` | object | **no** | `{kind, min_ore, max_ore, note}`; `kind` defaults to `okand`. |
| `media[]` | array | yes | Each: `url` (**no**), `width` (**no**), `height` (**no**), `mime` (**no**), `bytes` (yes), `photographer` (yes), `credit_line` (**no**), `licence` (**no**), `focal` (yes → default `{0.5,0.38}`). Items failing the gate are still emitted with `gate_passed:false` and a `demoted_reason`, so the editor sees what was rejected. |
| `links[]` | array | yes | `{kind, url, label_sv, mobile_ok}`; `mobile_ok` is NULL until a headless check runs. |
| `external_ids` | object | yes | `{osm:"way/123", wikidata:"Q1234", google_place_id:"ChIJ…"}` — `google_place_id` is the only Google value permitted anywhere in this document. |
| `provenance[]` | array | **no** | `[{field_name, source, source_ref, fetched_at, licence}]` — one entry per persisted visible field. A candidate whose `provenance` does not cover `title` is rejected by the loader before it reaches a human. |
| `confidence` | 0.000–1.000 | **no** | Machine score. Used to **order the editor's queue only**. It is never stored on `objects` and never influences what a visitor sees. |
| `notes_for_editor` | string | yes | e.g. `"Datum bara i löptext — kontrollera."` |

Any field not listed is dropped by the loader with a warning; unknown keys never reach `payload`.

### Identity and dedupe across runs

Three keys, applied in order. The first that hits wins; nothing below 0.62 similarity is ever auto-merged.

1. **Source identity** — `(source_id, source_uid)`. Exact. Handles ~85% of re-runs: the same Göteborg & Co event on day 2 matches itself and becomes an *update*, not a new candidate.
2. **External identity** — `osm_type:osm_id`, `wikidata_qid`, or `google_place_id`. Exact. This is what lets the same museum arrive from Wikidata on Monday and from its own site on Tuesday and be recognised as one object.
3. **Identity hash** — deterministic, computed by the pipeline and stored:
   - events: `sha256( lower(unaccent(title_norm)) || '|' || venue_key || '|' || start_local_date )` where `title_norm` strips leading articles and trailing `" – Göteborg"`-style suffixes, `venue_key` is the OSM id if known else geohash-7 of `geo` else `lower(unaccent(venue_name))`, and `start_local_date` is the `Europe/Stockholm` calendar date.
   - places: `sha256( 'plats|' || coalesce(osm_id, wikidata_qid, geohash7) || '|' || lower(unaccent(title_norm)) )`.
4. **Fuzzy candidate merge (never automatic)** — if none of the above hit, the loader looks for an existing object with `similarity(title, candidate.title) >= 0.62` **and** `ST_DWithin(geo, candidate.geo, 120)` **and**, for events, the same `start_local_date`. A hit sets `state = 'matchad'` with `proposed_object_id` and `match_score`, and lands in the editor's queue as *"möjlig dubblett"* with a side-by-side diff. It is never merged without a click.

Re-running the same day is idempotent: `unique (run_id, source_id, source_uid)` prevents intra-run duplicates, and the three identity keys prevent cross-run ones. A source that disappears from a feed does **not** delete its object; it sets `objects.archived_at` after 3 consecutive absent runs, and archived objects stay readable in *Tidigare*.

### Machine-proposed → human-approved

```
forslag ──(editor opens)──► under_granskning ──(publish gate passes)──► publicerad
   │                              │
   └──(avvisa + reason)───────────┴──────────────────────────────► avvisad
publicerad ──(3 absent runs, or editor)──► arkiverad
```

**The publish gate**, all of which must pass — enforced in the database by trigger, not in the UI:

1. `varfor` present, 25–40 words, `varfor_author = 'redaktion'`. *An object without a wall label does not publish.*
2. `pillar`, `district_id`, `price_kind` set.
3. `kind = 'handelse'` → ≥1 occurrence with `starts_at`.
4. A `field_provenance` row for every persisted visible field.
5. Media either passes the ingest gate or is explicitly demoted with a reason; a KATALOGPLATTA is always available because `plate_seed`/`plate_layout`/`plate_font_px`/`plate_breaks` are computed at candidate load.
6. `accession` allocated from the city+pillar sequence.
7. `is_landmark`, if set, carries `landmark_by` and passes the 3-per-city check.

Every transition writes an `editorial_actions` row with `before`/`after` JSONB. The editor's queue is ordered by `confidence desc`, then `starts_at asc`. Target: an editor clears a 37-new-candidate day in under 25 minutes, because the machine has already drafted the wall label and the human's job is to correct it, name the awkward part, and press publish.

### Degradation, field by field — what the UI does when it is missing

| Missing | UI behaviour |
|---|---|
| `media` (none, or all gated out) | KATALOGPLATTA at full bleed. This is the house look, not a fallback. |
| `media` present but demoted | KATALOGPLATTA + the real photo as a 96×96 inset with a 1px keyline, bottom-right. |
| `photographer` | Credit line reads `BILD FRÅN ARRANGÖREN`. Never blank, never omitted. |
| `price` | Rail slot [4] **omits and the rail collapses**. Never an em-dash, never `Pris okänt`. |
| `walk_minutes` | The walk line is omitted; the district name still renders in slot [3]. |
| `walk_terrain` | The terrain word is dropped; `"9 min till fots"` without `", uppför"`. |
| `district_id` | Slot [3] falls back to `venue_name`; if that is also absent the object cannot publish. |
| `geo` | Directions row is removed from AVFÄRDEN; the Maps deep link is replaced by an address search. The card is otherwise complete. |
| `ends_at` on an occurrence | Anslag renders the opening band only (`IDAG · ÖPPNAR 18:00`), never a `PÅGÅR NU` with an open end. |
| `hours` on a `plats` | Rail slot [2] reads `ALLTID` with no day range; never a fabricated schedule. |
| `links` | AVFÄRDEN offers only `Vägbeskrivning` and `Spara till lista`. No dead "Boka" row. |
| `title_en` / `varfor_en` | The English surface serves the Swedish string with `lang="sv"` on that subtree, so a screen reader pronounces it correctly. We never machine-translate a wall label. |
| `body` | The detail page shows title, anslag, wall label, rail, source. That is a complete page. |
| whole edition (run failed) | Yesterday's edition renders with the stale band: `Dagens hängning är försenad. Det som står här är från igår klockan 06:40.` |
| a room returns < its slot count | The thin-day empty state; the forme's unfilled slots collapse rather than rendering placeholders. |

### Sources

| Source | Kind | Licence / attribution | Cadence | Fills |
|---|---|---|---|---|
| **Göteborg & Co open event API** | `goteborg_co` | Per their terms; `Källa: Göteborg & Co` | 06:10 + 16:10 | events, occurrences, venue, links, some media |
| **OpenStreetMap (Overpass) / Overture Places** | `osm` / `overture` | **ODbL 1.0 — attribution required**, `© OpenStreetMap-bidragsgivare` in the source line and on the about route | weekly full, daily diff | places, geo, address, opening hours, terrain (`incline`,`surface`,`steps`), venue type |
| **Wikidata / Wikipedia** | `wikidata` / `wikipedia` | CC0 / **CC BY-SA 4.0 — attribution + share-alike**, `Text från Wikipedia (CC BY-SA 4.0)` | weekly | sights, landmarks, founding dates, architect, Commons media where licence permits |
| **Venue sites** (pustervik.se, rodasten.com, goteborgsoperan.se, …) | `venue` | `proprietar_med_tillstand` — per-venue written permission, recorded in `sources.terms_url`; `Källa: pustervik.se · hämtad 06:12` | daily | programme, ticket links, press images |
| **Own editorial** | `redaktion` | `redaktionell` | continuous | **every `varfor`**, the day's note, corrections, `is_landmark`, ordering, kvarter assignment |
| **Google Places** | *(no enum member)* | — | render-time only | `place_id` as a join key; live hours/rating displayed but never stored; Maps deep links |

Attribution is rendered from `sources.attribution_text` joined through `field_provenance`, so an object filled from OSM structurally cannot render without `© OpenStreetMap-bidragsgivare`. There is no code path that renders an object without its source line.

---

## Performance and resilience budget

### Targets (p75, field data, `next/third-parties` none installed)

| Metric | Target | Hard fail |
|---|---|---|
| **LCP** — `/idag`, 4G (9 Mbps, 170ms RTT), Moto G Power class | **≤ 1.8s** | 2.5s |
| **LCP** — Slow 4G (1.6 Mbps, 300ms RTT) | ≤ 3.2s | 4.0s |
| **CLS** | **0.00** target, ≤ 0.02 accepted | 0.05 |
| **INP** | **≤ 120ms**, save-tap ≤ 80ms | 200ms |
| **TTFB** (Vercel edge, Supabase eu-north-1) | ≤ 220ms | 600ms |
| **FCP** | ≤ 1.2s | 1.8s |
| Lighthouse mobile Performance | ≥ 95 | 90 |

CLS is 0.00 by construction, not by tuning: every media frame has a declared `aspect-ratio` and `object_media.width/height` are NOT NULL; the KATALOGPLATTA is `min-height` with an ingest-solved font size; fonts ship with `adjustFontFallback: true` so the fallback metrics match; the anslag, the rail and the wall label are all server-rendered from Postgres in the first HTML; and the only late-arriving content in the product — live Google hours — renders into a slot that is `position: absolute` inside an already-reserved 24px line box.

### JavaScript budget

| Route | First Load JS (gzip) | Hard cap |
|---|---|---|
| `/[stad]/idag` | **≤ 78 KB** | 90 KB |
| `/[stad]/salar/[sal]` | ≤ 78 KB | 90 KB |
| `/objekt/[slug]` | ≤ 82 KB | 95 KB |
| `/listor/*` | ≤ 96 KB | 110 KB |
| Shared framework chunk | ≤ 62 KB | 70 KB |

Enforced by `size-limit` in CI on every PR; a 3 KB regression fails the build. **No animation library, no state library, no UI kit, no date library, no icon package.** Dates are `Intl` only. Icons are inline SVG in the component that uses them. `@supabase/supabase-js` is imported **only** in server code; the browser talks to Route Handlers, so the client bundle carries no Supabase SDK at all (~34 KB saved) and no anon key is shipped for the read path.

Motion is CSS-only: View Transitions, `@starting-style`, `animation-timeline: view()`. **Zero JS scroll listeners exist in the product.** The five motions cost 0 KB.

### Server vs client

| Rendered on the server (RSC, no JS shipped) | Client component (`'use client'`) |
|---|---|
| Every object plate, wall label, catalogue rail, accession, source line, attribution | Save control (`aria-pressed`, optimistic write) |
| ANSLAG in all seven bands, including the day-difference computation | Theme toggle (reads `localStorage`) |
| Room headers, threshold bands, mechanism stamp, day's note | AVFÄRDEN `<dialog>` open/close |
| KATALOGPLATTA (server-rendered SVG/CSS from stored seed) | Time strip / kvarter picker (URL-state, `router.replace` with `scroll: false`) |
| Editions, forme slots, collections, search results | Offline band, install band, refresh control |
| Daylight fraction (written once per render) | Toast |
| Open Graph images (`ImageResponse`, same plate renderer) | Reorder handles in a collection |

`/idag` and the room routes use Next 16 Cache Components: the shell and the edition are `use cache` with `cacheLife` of **20 minutes** and a `cacheTag('edition:goteborg:2026-08-23')` invalidated by `updateTag` at the end of a publish. Anything touching a signed-in visitor's lists is outside the cached boundary and streams in via `<Suspense>`. Anything touching Google is `dynamic = 'force-dynamic'` + `cache: 'no-store'` + `Cache-Control: private, no-store` — the caching default is the terms violation, so it is disabled explicitly and grepped for in CI.

### Images

- Source uploads land in Supabase Storage; delivery is `next/image` with `formats: ['image/avif','image/webp']`, quality **72** (AVIF) / 80 (WebP).
- `deviceSizes: [360, 390, 412, 640, 828, 1080, 1200, 1620]`, `imageSizes: [96, 128, 256, 384]` — the 96 entry exists for the demoted-media inset.
- The lead plate carries `priority` and `fetchPriority="high"`; **exactly one image per route may be priority.** Everything below the fold is `loading="lazy"` + `decoding="async"`.
- Byte budget per image: lead 3:2 at 828w ≤ **58 KB** AVIF; card 4:5 at 412w ≤ **34 KB**; thumb 96px ≤ **6 KB**. A route's total image weight above the fold is capped at **160 KB**.
- **No LQIP, no blur-up, no dominant-colour placeholder.** The frame's background is flat `--line` and the box is reserved, so a slow load shows a grey block that becomes a photograph — no flash, no double paint, no decode cost for a throwaway image.
- Fonts: three families, `latin` subset only, `woff2`, self-hosted through `next/font/google`, preloaded — Familjen Grotesk variable ~31 KB, Literata variable ~44 KB, DM Mono 400+500 ~19 KB = **~94 KB total**, all `font-display: swap` with metric-matched fallbacks. `Arial` appears in no stack.

### On a 3G connection (1.6 Mbps / 300ms RTT / 400ms TTFB)

The document streams. HTML for `/idag` above the fold is **≤ 22 KB gzip** and contains the masthead, the day's note, the anslag and the first two object plates as real text — because the wall label, the title, the rail and the countdown all come from Postgres in the first flush, the page is **readable and useful before a single image or a single byte of JS arrives** (~1.1s to first meaningful paint). Fonts swap in at ~2.4s with no reflow. Images arrive progressively; the grey reserved boxes never move. The save control is hydrated last and, until it is, it is a real `<button>` inside a `<form>` that posts to a Route Handler — so saving works with JS disabled or not-yet-arrived. Nothing in the product requires JS to read.

### Offline

A service worker with a real `fetch` handler (required for `beforeinstallprompt` to ever fire on Android):

- **App shell** — cache-first, versioned by build id: HTML shell, CSS, the three font files, the PLANEN icons. ~140 KB.
- **Edition + rooms** — stale-while-revalidate, 24h max age, so a re-open in a tunnel shows this morning's hang instantly.
- **Object details** — network-first with a 3s timeout, then cache. Cap **60 objects LRU**.
- **Media** — cache-first, cap **40 MB** LRU, evicted oldest-first.
- **Saved collections** — mirrored to IndexedDB on every change; the collections route is fully functional offline, which is what makes `Ingen uppkoppling. Här är det du har sparat.` a true sentence.
- **Writes offline** — queued in IndexedDB and flushed via Background Sync where available, on `online` otherwise. Saves are idempotent (`unique (list_id, object_id)`), so a double flush is harmless.
- `/offline` is a precached route rendering the offline state.

`overscroll-behavior-y: contain` on `body` kills Chrome's destructive pull-to-refresh (which in a PWA reloads the document and destroys scroll position and open sheets); the explicit `UPPDATERAD 07:14 · Uppdatera` control replaces it. `overscroll-behavior-x: contain` on every horizontal rail.

### Resilience

- Supabase read fails → the SWR cache serves; if empty, the route error state with the stale band.
- Ingestion run fails → `editions.status = 'forsenad'`, yesterday's edition serves, the stale band appears, and an alert fires. The product **says so** rather than pretending.
- A source fails → `sources_failed` records it, other sources still publish, and the mechanism stamp's `NYFÖRVÄRV` count reflects reality.
- Google enrichment fails or is rate-limited → the slot simply never appears. Nothing on any screen depends on it.
- `next.config.ts` uses `Permissions-Policy: camera=(), microphone=(), geolocation=(self)`. No prompt appears on load: the user must press "Använd min position". Denied, unavailable and timeout states keep the manual area picker fully functional. Device coordinates remain in module memory only and are not written to storage, URL, analytics or Supabase by the current UI.

---

## Accessibility contract

Every number below is a CI gate (axe-core + Playwright + a custom contrast/target linter), not a guideline.

### Targets and geometry

- **44×44 CSS px absolute minimum** on every interactive element (Apple HIG); **48×48** on the save control, nav items, city button, time-strip segments and every action in a sheet (Material 3). **8px minimum** between adjacent targets. Visual size may be smaller than the hit box; the hit box is expanded with a transparent `::after { inset: -Npx }`, never by adding visible padding that breaks the rhythm.
- A global safety net under `@media (pointer: coarse)`: `a, button, [role="button"], input, select, summary { min-block-size: 48px }`.
- **Any primary feature in ≤3 taps** from any room. Measured: save = 1; open a room = 1; switch city = 2; create a list and save into it = 3; share a list = 3; reach a saved object = 2.
- No hover dependency anywhere. `@media (hover: hover) and (pointer: fine)` may **add** affordances on desktop; it may never gate content or actions.

### Contrast (measured, not asserted)

- Body, wall label, titles: `--ink` on `--ground` = **15.6:1** light, **14.9:1** dark.
- Secondary prose `--ink-2` = **7.4:1** / **8.6:1**. Catalogue rail floor `--muted` = **6.1:1** / **5.9:1**.
- Hairlines `--line` = **3.2:1** — a separator below 3:1 is a lint failure, because the visible grid *is* the layout.
- Pillar hues: 5.2–5.3:1 light, 7.6–8.1:1 dark, each on its own theme's ground only. Cross-theme use fails and is prevented by having two token values per pillar.
- `--accent` is **never text on `--ground`** (2.86:1). Controls with a label on the accent use `--accent-solid`: **7.3:1** light, **9.1:1** dark.
- **Nothing in the product is distinguished by colour alone.** Every pillar hue ships with its caps label in words; the `PÅGÅR NU` dot ships with the words; the PLANEN quadrant ships with the room name.

### Zoom and text scale

- **200% browser zoom at 360px width** (= 180 CSS px layout viewport) is a tested state on every route. Acceptance test string: **`Universeumutställningen`** in a card title, `Världskulturmuseet` in a room header. Zero horizontal page scroll, zero clipped strings, zero overlapping glyphs.
- **Android 200% font scale and iOS AA maximum** are tested independently of zoom, because only `rem` responds. Every functional string is `rem`-only; every display string carries a `rem` term in its `clamp()` middle argument. A `clamp()` whose middle term is bare `vw` is a CI failure.
- `html { -webkit-text-size-adjust: 100% }`; `maximumScale: 5`, `userScalable: true` — pinch zoom is never blocked.
- **No fixed heights around type.** `min-height` only, everywhere. `aspect-ratio` appears on media frames only, never on a plate or a card.
- Tracking is capped by size band (−0.025em >96px, −0.015em 48–96px, −0.005em <48px) so a 200%-scaled headline cannot collide its own glyphs. `overflow-wrap: anywhere; hyphens: auto` with `lang="sv"` on every display and title element — Swedish compounds are the default case.
- The sticky footer in a collection **becomes static at page end** so it cannot eat the viewport at 200%.

### Focus

```css
:focus-visible {
  outline: var(--bw-focus) solid var(--focus);
  outline-offset: 3px;
  border-radius: var(--r-hair);
}
```

`--focus` is `--ink` in light and `--ink` (warm bone) in dark — never the accent, because a focus ring on an accent ground must not vanish. On a pillar-flooded KATALOGPLATTA the ring switches to `--ground` via a `--focus` override on that surface. The UA default ring is never relied on. Focus is never removed, only restyled. `:focus-visible` is present on **every** interactive element including the stretched card link, the reorder handles and the dialog close.

Focus order equals DOM order equals reading order on every component. Desktop order: skip link → wordmark → city button → rail nav → time strip → main content → pane → footer. A `<dialog>` traps focus natively and returns it to the invoking element on close.

### Motion, transparency, contrast, forced colors

- `@media (prefers-reduced-motion: reduce)`: every one of the five motions has its reduced answer authored beside it (opacity-only, 100–120ms, no movement, no morph, rules pre-drawn, room name locked at wght 600, daylight rule at final width). The press-scale is wrapped in `no-preference`. **No motion is ever the sole carrier of information.**
- `@media (prefers-reduced-transparency: reduce)`: no surface in the app is translucent. Trivially satisfied — only the iOS tab bar is ever translucent and it takes an opaque fallback.
- `@media (prefers-contrast: more)`: `--line → --ink`, `--muted → --ink-2`, all texture removed, every hairline 1px → 2px, both shadows replaced by 2px keylines.
- `@media (forced-colors: active)`: pillar hues, accent and media tints resolve to system colours; object plates gain `border: 1px solid CanvasText`; the 6px `PÅGÅR NU` dot is replaced by the literal word; the KATALOGPLATTA drops its halftone and renders `CanvasText` on `Canvas` with a 2px `CanvasText` keyline; `forced-color-adjust: none` is applied to **nothing**.
- **LUGNT LÄGE** auto-enables on `prefers-reduced-transparency`, `prefers-contrast: more`, or a detected system text size above 120% (measured by comparing a 1rem probe against 17px), and is also a manual switch. It flattens every plate to composition 1 on flat ink, kills the halftone, thickens hairlines, and raises the reading scale one step. **It ships in v1**, or the product is ageist by construction.

### Semantics and Swedish screen-reader naming

`<html lang="sv">`; any English subtree carries `lang="en"` on the subtree, never a document swap. Landmarks: `<header>` (banner) and `<footer>` (contentinfo) outside `<main>`; `<nav aria-label="Salarna">` for the tab bar / rail; `<nav aria-label="Innehållsförteckning">` for the time strip. A skip link, **`Hoppa till innehåll`**, is the first focusable element. Rooms are `<section aria-labelledby>` with a real `<h2>`. Object collections are `<ul>/<li>` so AT announces the item count — which matters most in exactly the two cases the brief flags: a 4-item day and a 200-item list.

| Component | Swedish accessible name / pattern |
|---|---|
| **ANSLAG** (countdown) | `role="group"` + `aria-labelledby` → visually-hidden `<h2>`: *"Anslag. Way Out West öppnar om nio dagar, den 13 augusti, Slottsskogen."* Numeral and mono label `aria-hidden="true"`. Visible dateline in `<time datetime="2026-08-13">`. **No `aria-live`, ever.** |
| **Object plate** | The link's accessible name is the title alone. The wall label follows as text; the rail is a `<dl>` announced as a description list. Accession number `aria-hidden="true"` — it is visual wayfinding, not information a screen-reader user needs before the title. |
| **SPARA** | `<button aria-pressed="false">` with `aria-label="Spara Röda Sten Konsthall"` → on save, `aria-pressed="true"` and label `"Sparad i Höstdejter. Ta bort Röda Sten Konsthall"`. Toast is `role="status"` (polite), never `alert`. |
| **PLANEN mark** | `role="img" aria-label="STADEN"` on the neutral mark; inside a room header it is `aria-hidden` because the room name is already read. |
| **Wing chip** | `"Kultur, 42 objekt"` — never the colour. |
| **TIDSREMSA** | `role="radiogroup" aria-label="Tid"`; options `Alltid`, `Nu`, `Ikväll`, `Imorgon`, `I helgen`, with `aria-checked`. |
| **KVARTERSVÄLJARE** | `role="radiogroup" aria-label="Kvarter"`; each tile `"Majorna, 12 minuter till fots"`. |
| **AVFÄRDEN** | `<dialog aria-labelledby>` → `<h2>Du lämnar STADEN</h2>`; the action is `"Fortsätt till ticketmaster.se, öppnas i ny flik"`. |
| **Hidden-by-filter row** | `<button>` named `"Visa 23 dolda objekt"`, `aria-expanded`. |
| **Daylight hairline** | The rule is `aria-hidden`; the text `"Ljus till 20:41"` carries it. |
| **Mechanism stamp** | `"Omhängd 06:40. 212 objekt, 14 nyförvärv. Visa källor."` |
| **Offline band** | `role="status"`, announced once on transition, never repeatedly. |
| **Reorder handle** | `"Flytta Röda Sten Konsthall. Använd piltangenter."` + an `aria-live="polite"` position announcement: *"Position 3 av 12."* |
| **Theme toggle** | `role="radiogroup" aria-label="Tema"`: `System`, `Ljus`, `Mörk`. |

### Platform behaviours that are accessibility, not polish

- **Back semantics, one row per depth, implemented and tested:** (0) IDAG root → back exits, no confirmation. (1) another room or collections → back returns to IDAG, never exits. (2) object detail → back returns to the originating room **at the same scroll offset** (`window.scrollY` persisted to `sessionStorage` keyed on `history.state.key`, restored in `popstate`). (3) any sheet, filter panel, city switcher, save picker or AVFÄRDEN → back closes **only** the sheet, via native `<dialog>` + `showModal()` so Chrome Android wires the system back button and predictive-back peek through CloseWatcher.
- **View transitions are direction-aware or absent.** SALSBYTE plays 320ms forward, 240ms reverse on `popstate`. A forward transition fired on a back gesture is the loudest "this is not a real app" tell on Android; if direction cannot be guaranteed, no transition ships.
- **Keyboard retraction:** the nav hides at `visualViewport.height < innerHeight − 150` (iOS) / `− 120` (Android) over 180ms and restores on blur, with `interactiveWidget: 'resizes-content'` in the viewport export. Search inputs are pinned to the **top** of the search screen.
- **`viewportFit: 'cover'`** is mandatory — without it every `env(safe-area-inset-*)` in the stylesheet is 0 and the entire safe-area layer is a no-op.
- **Standalone refresh:** a persistent 44px `UPPDATERAD 07:14 · Uppdatera` control, because iOS standalone has no pull-to-refresh and no reload chrome, and the automation writes twice a day.
- **Touch feel without webbiness:** `-webkit-tap-highlight-color: transparent` globally; `-webkit-touch-callout: none; user-select: none; touch-action: manipulation` on cards, nav and buttons; `user-select: text` preserved on all prose. Long-pressing a headline must not offer Copy/Look Up/Translate.
- **The 24px edge rule:** no horizontal-swipe affordance may begin within 24px of either viewport edge, on any screen, because Android reserves that strip for the system back gesture and a web page cannot register gesture-exclusion rects. Every rail is also reachable without gesture: each one carries a `Se alla` link into a vertical list.
- **Print:** a shared collection prints as one A4 page with wall labels in full, a four-wing legend, accession numbers and the lockup — because a museum's sheet should survive being printed and taped to a fridge, and because a printable page is the most robust accessible format there is.
