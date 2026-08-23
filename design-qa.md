# STADEN design QA

## Comparison target

- Source visual truth:
  - `/var/folders/48/mp9c9xhn0678qr8jl943_tjr0000gn/T/codex-clipboard-e8e48884-32ba-4c47-b430-e09706f84b55.png`
  - `/var/folders/48/mp9c9xhn0678qr8jl943_tjr0000gn/T/codex-clipboard-9155a64c-0a27-42d8-b105-54cfa0740815.png`
  - `docs/design/qa/staden-home-dashboard-desktop.png` (admin visual-system target)
  - `docs/design/qa/staden-home-dashboard-mobile.png` (admin mobile target)
- Rendered implementation: `http://127.0.0.1:4173` and `http://127.0.0.1:4173/admin`
- Implementation screenshots:
  - `docs/design/qa/staden-blue-mobile.jpg`
  - `docs/design/qa/staden-theme-settings-mobile.jpg`
  - `docs/design/qa/staden-food-mobile.jpg`
  - `docs/design/qa/staden-desktop.jpg`
  - `docs/design/qa/staden-food-desktop.jpg`
  - `docs/design/qa/staden-navigation-mobile.jpg`
  - `docs/design/qa/staden-food-editorial-mobile.jpg`
  - `docs/design/qa/staden-food-editorial-desktop.jpg`
  - `docs/design/qa/staden-saved-pocket-mobile.jpg`
  - `docs/design/qa/staden-food-directory-mobile.png`
  - `docs/design/qa/staden-kultur-before-mobile.png`
  - `docs/design/qa/staden-kultur-dashboard-mobile.png`
  - `docs/design/qa/staden-kultur-picks-mobile.png`
  - `docs/design/qa/staden-kultur-categories-mobile.png`
  - `docs/design/qa/staden-kultur-catalog-mobile.png`
  - `docs/design/qa/staden-kultur-dashboard-desktop.png`
  - `docs/design/qa/staden-home-before-mobile.png`
  - `docs/design/qa/staden-home-dashboard-mobile.png`
  - `docs/design/qa/staden-home-overview-mobile.png`
  - `docs/design/qa/staden-home-cards-mobile.png`
  - `docs/design/qa/staden-separated-culture-mobile.png`
  - `docs/design/qa/staden-home-dashboard-desktop.png`
  - `docs/design/qa/staden-admin-overview-desktop.png`
  - `docs/design/qa/staden-admin-editor-desktop.png`
  - `docs/design/qa/staden-admin-overview-mobile.png`
  - `docs/design/qa/staden-admin-editor-mobile.png`
  - `docs/design/qa/staden-profile-source-navigation-mobile.png`
  - `docs/design/qa/staden-profile-source-settings-mobile.png`
  - `docs/design/qa/staden-profile-page-mobile.png`
  - `docs/design/qa/staden-profile-lists-mobile.png`
  - `docs/design/qa/staden-profile-settings-mobile.png`
  - `docs/design/qa/staden-profile-page-desktop.png`
- Viewports: 390 × 844 CSS px (primary mobile), 320 × 700 and 412 × 915 CSS px (responsive mobile bounds), 1280 × 720 CSS px (desktop hero) and 1440 × 1000 CSS px (desktop dashboard/grid).
- Pixel dimensions match those CSS viewports at device pixel ratio 1. The supplied references are taller full-page mood targets, so the comparison was limited to the shared above-the-fold visual language, restaurant discovery and the settings state rather than asserted as a pixel-for-pixel page clone.
- State: signed out, Göteborg, Blå timmen selected, two locally saved objects, cultural-event filter returned to Alla. Admin was tested in its explicitly labelled localhost preview mode with publication disabled until an authenticated Supabase admin role is present.

## Full-view comparison evidence

Both supplied references and the latest 390 × 844 mobile and 1440 × 1000 desktop captures were opened together in one comparison input. The implementation preserves the reference system's editorial typography, condensed display rhythm, sparse mono metadata, square edges, high-contrast signal color, large cultural photography and strong mobile reading order. The verified state uses Blå timmen in system dark mode; Ateljé and STADEN Original retain the warmer paper-led alternatives. The restaurant bank and editorial guides use the same museum-label rhythm. Desktop expands the guide feed to three columns without changing the mobile-first hierarchy.

The Kultur redesign was also compared in one input against the captured pre-change mobile state. It keeps the established STADEN identity while replacing the undifferentiated long feed with a clear museum-like sequence: citywide festivals, five editorial choices, visual category rooms and an optional catalog. Separate mobile captures verify the five-card rail, the two-column category blocks and the five-result default catalog state; the desktop capture verifies two festival columns and five dashboard cards on one row.

The navigation restructure was compared in one input using the captured pre-change home view, the final 390 × 844 home first-view, the home overview, a direct Kultur view and the 1440 × 1000 home dashboard. The hero composition, cultural image, typography, color tokens, sticky header and bottom navigation remain visually continuous. The new first-view adds an explicit 83/25/999 Kultur–Nöje–Mat summary, while the deeper overview uses three clearly differentiated editorial cards instead of extending the old single-page feed.

The `/admin` overview was compared in one input against `staden-home-dashboard-desktop.png` at the same 1440 × 1000 viewport, and the two mobile first views were compared together at 390 × 844. The admin workspace intentionally changes the public header into a persistent editorial rail, but preserves the black ground, warm paper, blue signal, oversized sans/serif pairing, mono labels, square modules and thin-rule rhythm. The information density increases only inside the editor, where the form and article preview become a two-column desktop composition and a single readable mobile flow.

The new Profil destination was compared in one input with the captured 390 × 844 pre-change Mat/navigation view. The deliberate changes are visible and contained: GÖTEBORG/57.7089° N and the global settings button are removed, STADEN is centered, and the saved counter remains at the right edge. Profil continues the same Blå timmen typography, thin-rule spacing, square controls and four-item bottom navigation while introducing a dedicated museum-like list-management surface. A separate 1440 × 1000 capture confirms that the desktop navigation stays left-aligned while the wordmark is mathematically centered in the viewport.

The source screens are concept references, while the implementation is the existing STADEN culture feed. Copy, event ordering and navigation therefore differ intentionally. No claim of literal screen cloning is made.

## Focused region comparison evidence

`docs/design/qa/staden-theme-settings-mobile.jpg`, `staden-navigation-mobile.jpg`, `staden-food-editorial-mobile.jpg`, `staden-food-directory-mobile.png` and `staden-saved-pocket-mobile.jpg` were inspected at 390 × 844. They confirm three clearly differentiated theme previews, visible selected and active states, real outline icons, readable labels, reachable close controls, separate Supabase connection status, a persistent four-item bottom navigation, responsive restaurant discovery at full catalog scale and a functional saved-list surface. Both dialogs stay inside the viewport, isolate the background and scroll independently when needed.

For the home architecture, `staden-home-dashboard-mobile.png` confirms that all three main functions are visible in the first viewport without displacing the established hero image. `staden-home-overview-mobile.png` confirms the horizontal editorial rail and `staden-separated-culture-mobile.png` confirms that a main destination renders alone rather than as a scroll target inside the home page. The festival strip was inspected separately after its mobile action row was corrected.

For admin, `staden-admin-editor-desktop.png` was inspected as the focused high-density region. It confirms visible form labels, a bounded status/publish cluster, real toolbar icons, a project-local 3:2 image, readable live article typography and selected-object management without horizontal collision. `staden-admin-editor-mobile.png` confirms that the same controls stack in reading order and that the four-item admin navigation remains reachable.

For Profil, `staden-profile-source-settings-mobile.png` and `staden-profile-settings-mobile.png` were opened together at the same 390 × 844 pixels. The settings sheet preserves its typography, theme cards, Supabase state and close control exactly while the obscured global header now contains only the centered wordmark and saved count. `staden-profile-lists-mobile.png` was inspected as the focused management state; it confirms visible create, filter, rename, delete, assignment and saved-item removal affordances. Density normalization was unnecessary because all mobile source and implementation captures are 390 × 844 at the same CSS viewport and browser density.

## Required fidelity surfaces

- Fonts and typography: condensed display, editorial serif and mono metadata reproduce the key reference hierarchy. Weight, wrapping and line height remain legible at 390 px. Theme previews communicate the typographic change before selection.
- Spacing and layout rhythm: 18–22 px mobile gutters, thin rules and square cards match the museum/editorial cadence. Header actions remain reachable and the modal has safe-area bottom padding.
- Colors and visual tokens: Ateljé uses warm paper, black and signal orange; Blå timmen uses warm off-white, black and electric blue. Semantic foreground colors preserve contrast on both signal colors.
- Image quality and asset fidelity: the hero is a project-local 1536 × 1024 generated editorial photograph with a responsive `next/image` crop. No placeholder, emoji, handcrafted SVG or CSS illustration substitutes for the cultural image or icons.
- Copy and content: Swedish culture and restaurant copy is source-backed and specific to Göteborg. Theme and Supabase labels are concise and accurately scope the health check.
- Admin typography and copy: the admin overview repeats the public product's optical hierarchy while editor labels use smaller mono text for precision. Swedish labels clearly distinguish local draft saving, review status and Supabase publication.
- Admin spacing and tokens: the 264 px desktop rail, 44–56 px canvas gutters, paper editor surface and fixed mobile navigation map directly to the established square-card system. No new radius or shadow language was introduced.
- Admin media: the article preview and media bank reuse project-local editorial images through `next/image`; upload validation accepts only JPEG, PNG, WebP and AVIF up to 5 MB and requires alt text before saving.

## Findings

- No actionable P0, P1 or P2 differences were found for the requested navigation, cuisine-first Mat flow or editorial guide integration.
- Final independent judge pass: approved after the full 999-entry catalog, 60-card render limit, source confidence copy and closed-entry exclusion were re-audited.
- [P3] The mobile navigation intentionally maps to the product pillars Kultur, Nöje, Mat and Profil instead of copying the reference's generic Upptäck/Sök/Kalender/Sparat taxonomy. Each item has a working destination or dialog, so the control is not decorative.
- [P3] The reference wordmark is more aggressively condensed. The current wordmark remains deliberately compact so the saved count and settings control fit at 320–390 px without collision.
- No actionable P0, P1 or P2 findings remain for the separated Home/Kultur/Nöje/Mat architecture. The earlier mobile festival-strip collision was corrected before the final comparison.
- No actionable P0, P1 or P2 findings remain for `/admin`. The production publication control is intentionally disabled without an authenticated `app_metadata.role = admin`; this is a security state, not a visual defect.
- No actionable P0, P1 or P2 findings remain for Profil. The larger empty field between the editorial heading and list tools is intentional museum-like pacing and still leaves the start of `Mina listor` visible in the first 390 × 844 viewport.

## Interaction and runtime evidence

- Theme selection updates `data-theme` and persists after reload.
- Category filter shows Alla (32) and Musik (6) and returns to Alla.
- Mat exposes 999 active/unknown-status restaurants across 23 cuisine categories and 111 areas: 89 editorial entries plus 910 OpenStreetMap directory entries. Two explicitly closed directory entries are excluded before filtering or rendering.
- Cuisine and price filters combine. Selecting Asiatiskt returned 31 places, Asiatiskt + Hög narrowed to 1, and the result heading moved into view; price selections remain active when a curated guide is opened.
- The unfiltered result surface renders 60 cards at a time with an explicit load-more control, so the 999-entry catalog does not inflate the initial DOM or mobile layout.
- The rooftop guide returned exactly 5 tagged places. The guide CTA scrolls to the filtered restaurant bank and preserves price-filter composition.
- Three redaktionella guides are present: Takbarerna i Göteborg, Matplatser för barnfamiljen and Första dejtenvibbar.
- The header bookmark opens Fickan with the combined saved-object count. Named lists can be created, assigned, filtered and deleted; closing restores focus to the trigger.
- Kultur, Nöje and Mat update `aria-current` and scroll to the correct section. Nöje landed with its heading at 93 px below the sticky header at 390 × 844.
- Profil opens Settings, makes the background inert, traps Tab/Shift+Tab and returns focus to the bottom-navigation trigger on close.
- Supabase Auth health returned HTTP 200 using only the `sb_publishable_` key. The result explicitly does not claim that database access, RLS or Auth policies are verified.
- Browser console check: no errors or warnings.
- No horizontal overflow was found at 390 px or 1440 px; the mobile bottom navigation is hidden on desktop.
- Kultur opens as a dashboard with two citywide festival highlights, exactly five editorial cards and ten category blocks. The catalog is absent from the initial DOM until requested.
- Selecting Festival opens the catalog at `Visar 5 av 7 evenemang`; `Visa alla 7` expands to seven and changes to `Visa fem utvalda`.
- Switching to Museum resets the limited state and returned `Visar 5 av 34 evenemang`. Closing the catalog removes it; `Visa hela kulturkalendern` reopens Alla at `Visar 5 av 83 evenemang`.
- At 390 × 844 the festival cards, horizontal five-card rail and two-column category grid stay within the viewport. At 1440 × 1000 the festival grid has two columns and both the dashboard and category grid have five columns.
- STADEN now opens `#hem`, carries `aria-current="page"` and restores the general dashboard from Kultur, Nöje or Mat. The bottom navigation intentionally has no selected item on Home.
- Home exposes three first-view shortcuts: Kultur 83, Nöje 25 and Mat 999. All three updated the hash, document title, active navigation and rendered view correctly.
- Direct `#kultur`, `#noje` and `#mat` loads each rendered exactly one matching main section at scroll position 0. Browser Back restored the previous view and active state.
- The Nöje CTA still deep-links to Kultur with Musik active and `Visar 5 av 8 evenemang`. Mat still renders its 60-entry initial result batch after being separated.
- No horizontal overflow was found in Home, Kultur, Nöje or Mat at 320, 390, 412 or 1440 px. Header actions remained inside the viewport at both tested mobile bounds.
- `/admin` rendered as a static Next.js route and exposed five working desktop destinations: Översikt, Redaktion, Objektbank, Media and Inställningar. Mobile exposes the four primary destinations in a persistent bottom navigation.
- The editor updated its live article heading while typing, rendered headings, emphasis, quotes and lists without HTML injection, and retained the edited title after a full page reload.
- Unified object search covered 1,082 current culture and restaurant objects. `Göteborg Jazz Festival` and `Moon Thai Kitchen` were found, added, reflected in selected state and counted in the article preview.
- Local draft saving produced the visible confirmation `Utkastet sparades lokalt i den här webbläsaren.` Publication stayed disabled in localhost preview mode.
- Desktop screenshots were captured at 1440 × 1000 and mobile screenshots at 390 × 844, both at device pixel ratio 1. Browser console checks returned no errors or warnings.
- The Supabase editorial schema and optimized RLS follow-up were applied to the linked project. An anonymous REST select returned an empty allowed result, Supabase schema lint returned no errors, and cloud writes remain unavailable without the server-controlled admin claim.
- Direct `#profil` loads render the dedicated page with the combined saved count, document title `STADEN — Profil` and `aria-current="location"` on the bottom navigation. Returning to Mat and back to Profil updates both hash and active state correctly.
- The profile gear is the only settings trigger: exactly one `Öppna inställningar` button exists on Profil and zero buttons exist in the site header. The settings dialog opens, closes and restores focus to the profile gear.
- A list was created as `Sensommarkväll`, renamed to `Göteborgskväll`, assigned the saved `14m² Bao` restaurant and filtered to one visible object. The shared header counter also reads the saved restaurant on direct Profil loads without requiring Mat to mount first.
- `GÖTEBORG 57.7089° N` is absent from the rendered header. At 1440 px, the wordmark center is 720 px, matching the viewport center. No console entries or horizontal overflow were found at 390 or 1440 px.

## Comparison history

- Iteration 1: formal side-by-side comparison of both supplied references against the rendered Blå timmen mobile state.
- Iteration 2: repeated the same-input comparison after the culture catalog expanded to 32 entries and the 32-entry restaurant explorer landed. Updated all screenshots, corrected contrast/focus treatment and retained no open P0/P1/P2 visual findings.
- Iteration 3: repeated the same-input comparison after the cuisine index, combined price filtering, three editorial Mat guides, a real Nöje destination and the mobile four-item navigation landed.
- Iteration 4: repeated the comparison after desktop navigation, result-focus feedback, pure price ranges, scoped confidence labels and the complete Fickan/list flow landed.
- Iteration 5: audited the late OSM municipality import, excluded two explicitly closed businesses, verified 999 searchable entries with a 60-card render limit, and added a catalog-scale mobile screenshot. No P0/P1/P2 visual finding remained.
- Iteration 6: redesigned Kultur as a bounded dashboard with citywide festival highlights, five editorial starting points, ten visual category rooms and a progressive five-result catalog. Repeated mobile and desktop visual comparison, corrected the festival card's mobile min-content overflow and reverified all primary interactions. No P0/P1/P2 visual finding remained.
- Iteration 7: replaced the long single-page architecture with hash-synced Home, Kultur, Nöje and Mat views and added a general STADEN dashboard. The first pass found a P2 overlap between the mobile festival title and its action label; the strip was changed to a one-column mobile flow with a separate bordered action row. Final mobile/desktop comparison and 320/412 px boundary checks show no remaining collision or overflow.
- Iteration 8: added `/admin` as a separate editorial workspace grounded in the final Home dashboard. Same-input desktop and mobile comparisons found no P0/P1/P2 drift. Focused editor review verified typography, form density, media crop, live preview, object ordering and responsive stacking. No visual fixes were required after the first comparison.
- Iteration 9: replaced the Profil-to-settings shortcut with a dedicated Profil page, moved the sole settings trigger into that page, centered STADEN and removed the coordinate stamp. Same-input mobile comparisons covered the previous navigation, the final profile first view and the unchanged settings sheet; a focused list-management state and 1440 × 1000 desktop view were also verified. The browser pass exposed one stale header-count issue on direct Profil loads; the count was moved to a shared `useSyncExternalStore` subscription, rebuilt and reverified. No P0/P1/P2 visual findings remain.

## Open questions

- The final event taxonomy and city-switcher behavior require product/data decisions, not visual correction.
- A real production login still needs a Supabase Auth user whose server-controlled `app_metadata.role` is set to `admin`; the UI and RLS model are otherwise in place.

## Implementation checklist

- [x] Ateljé, STADEN Original and Blå timmen themes.
- [x] System-driven dark variants for all three themes.
- [x] Theme persistence.
- [x] Mobile and desktop responsive review.
- [x] Functional filters and saved state.
- [x] Restaurant search, cuisine/price/new filters and source links.
- [x] Cuisine-first default grouping and combined cuisine/price filtering.
- [x] Three functional editorial Mat guides with dedicated 3:2 media.
- [x] Persistent mobile bottom navigation with working Kultur, Nöje, Mat and Profil destinations.
- [x] Bounded Kultur dashboard with citywide festival highlights and five editorial choices.
- [x] Ten visual Kultur category blocks with a progressive five-result catalog and show-all state.
- [x] STADEN home view with first-view Kultur/Nöje/Mat counts and a three-card editorial overview.
- [x] Separately rendered, direct-linkable Home, Kultur, Nöje and Mat views with working browser history.
- [x] Fickan with named lists, assignment, filtering, removal and focus-safe dialogs.
- [x] Dedicated Profil page with list creation, rename, assignment, filtering, deletion and the sole settings trigger.
- [x] Centered STADEN wordmark with the coordinate stamp and global settings control removed.
- [x] Supabase connection status in Settings.
- [x] Real icon library and project-local editorial media.
- [x] Separate `/admin` route with overview, editor, object bank, media and settings.
- [x] Markdown toolbar, live article preview, image upload validation and ordered object selections.
- [x] Local draft persistence plus Supabase-ready draft loading, publishing and media upload.
- [x] Applied editorial tables, explicit grants, admin-claim RLS, storage policies and indexed policy/foreign-key access paths.

final result: passed
