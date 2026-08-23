# STADEN design QA

## Comparison target

- Source visual truth:
  - `/var/folders/48/mp9c9xhn0678qr8jl943_tjr0000gn/T/codex-clipboard-e8e48884-32ba-4c47-b430-e09706f84b55.png`
  - `/var/folders/48/mp9c9xhn0678qr8jl943_tjr0000gn/T/codex-clipboard-9155a64c-0a27-42d8-b105-54cfa0740815.png`
- Rendered implementation: `http://127.0.0.1:4173`
- Implementation screenshots:
  - `docs/design/qa/staden-blue-mobile.jpg`
  - `docs/design/qa/staden-theme-settings-mobile.jpg`
  - `docs/design/qa/staden-food-mobile.jpg`
  - `docs/design/qa/staden-desktop.jpg`
  - `docs/design/qa/staden-food-desktop.jpg`
- Viewports: 390 × 844 CSS px (mobile), 1280 × 720 CSS px (desktop hero) and 1440 × 1000 CSS px (desktop food grid).
- Pixel dimensions match those CSS viewports at device pixel ratio 1. The supplied references are taller full-page mood targets, so the comparison was limited to the shared above-the-fold visual language, restaurant discovery and the settings state rather than asserted as a pixel-for-pixel page clone.
- State: signed out, Göteborg, Blå timmen selected, two locally saved objects, cultural-event filter returned to Alla.

## Full-view comparison evidence

Both supplied references and the latest 390 × 844 implementation captures were opened together in one comparison input. The implementation preserves the reference system's warm paper ground, black editorial typography, condensed display rhythm, sparse mono metadata, square edges, high-contrast blue signal color, large cultural photography and strong mobile reading order. The new restaurant bank uses the same museum-label rhythm. Desktop keeps the system in a two-column editorial composition without changing the mobile-first hierarchy.

The source screens are concept references, while the implementation is the existing STADEN culture feed. Copy, event ordering and navigation therefore differ intentionally. No claim of literal screen cloning is made.

## Focused region comparison evidence

`docs/design/qa/staden-theme-settings-mobile.jpg` and `staden-food-mobile.jpg` were inspected at 390 × 844. They confirm three clearly differentiated theme previews, visible selected state, real outline icons, readable labels, a reachable close control, separate Supabase connection status and a responsive restaurant discovery entry point. The panel stays inside the viewport and scrolls independently when needed.

## Required fidelity surfaces

- Fonts and typography: condensed display, editorial serif and mono metadata reproduce the key reference hierarchy. Weight, wrapping and line height remain legible at 390 px. Theme previews communicate the typographic change before selection.
- Spacing and layout rhythm: 18–22 px mobile gutters, thin rules and square cards match the museum/editorial cadence. Header actions remain reachable and the modal has safe-area bottom padding.
- Colors and visual tokens: Ateljé uses warm paper, black and signal orange; Blå timmen uses warm off-white, black and electric blue. Semantic foreground colors preserve contrast on both signal colors.
- Image quality and asset fidelity: the hero is a project-local 1536 × 1024 generated editorial photograph with a responsive `next/image` crop. No placeholder, emoji, handcrafted SVG or CSS illustration substitutes for the cultural image or icons.
- Copy and content: Swedish culture and restaurant copy is source-backed and specific to Göteborg. Theme and Supabase labels are concise and accurately scope the health check.

## Findings

- No actionable P0, P1 or P2 differences were found for the requested theme integration.
- [P3] The reference concepts include a persistent bottom navigation and explicit time tabs. The current feed uses category filters and a compact header because those destination screens do not exist yet. Adding inert bottom navigation now would reduce usability; defer it until Sök, Kalender and Sparat have working views.
- [P3] The reference wordmark is more aggressively condensed. The current wordmark remains deliberately compact so the saved count and settings control fit at 320–390 px without collision.

## Interaction and runtime evidence

- Theme selection updates `data-theme` and persists after reload.
- Category filter shows Alla (32) and Musik (6) and returns to Alla.
- Restaurant search for `bao` returned only 14m² Bao; Bara nya returned 13 entries after the query was cleared.
- Saving 14m² Bao updated the combined saved-object count to 2.
- Settings opens/closes, makes the background inert, traps Tab/Shift+Tab and returns focus to the trigger.
- Supabase Auth health returned HTTP 200 using only the `sb_publishable_` key. The result explicitly does not claim that database access, RLS or Auth policies are verified.
- Browser console check: no errors or warnings.

## Comparison history

- Iteration 1: formal side-by-side comparison of both supplied references against the rendered Blå timmen mobile state.
- Iteration 2: repeated the same-input comparison after the culture catalog expanded to 32 entries and the 32-entry restaurant explorer landed. Updated all screenshots, corrected contrast/focus treatment and retained no open P0/P1/P2 visual findings.

## Open questions

- Bottom navigation should be introduced when the corresponding discovery, search, calendar and saved views are implemented.
- The final event taxonomy and city-switcher behavior require product/data decisions, not visual correction.

## Implementation checklist

- [x] Ateljé, STADEN Original and Blå timmen themes.
- [x] System-driven dark variants for all three themes.
- [x] Theme persistence.
- [x] Mobile and desktop responsive review.
- [x] Functional filters and saved state.
- [x] Restaurant search, cuisine/price/new filters and source links.
- [x] Supabase connection status in Settings.
- [x] Real icon library and project-local editorial media.

final result: passed
