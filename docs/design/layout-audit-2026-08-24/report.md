# STADEN — responsiv layoutaudit

Datum: 24 augusti 2026  
Omfattning: publik app och `/admin`, mobil 320–430 px, tablet 768–1023 px och desktop 1024–1920 px.

## Utfall

Domarstatus: **APPROVED** — inga kvarvarande verkliga P0–P3-fynd. Domaren godkände publik/admin-matriserna, mobil-, tablet- och desktopbilderna samt de implementerade reflow-, safe-area- och touchmålsfixarna. Text-only 200 % kvarstår som en evidenslucka, inte ett reproducerat fel.

Den aktuella implementationen har ingen uppmätt dokumentoverflow vid normal textstorlek i den testade matrisen. Horisontella redaktionella rails är avsiktliga och håller sin overflow lokalt i respektive komponent.

## Steg och hälsa

1. **Publik mobil — grön.** Hem, Kultur, Nöje, Mat och Profil håller 320, 360, 375, 390, 412 och 430 px utan dokumentoverflow. Header, 24 px safe-bottom-floor och fyrdelad bottennavigation ligger innanför viewporten.
2. **Tablet — grön.** Ett separat 760–1023-band ger tvåkolumniga redaktionella grids och en lugnare sektionsrubrik. Hero behåller sin fungerande 50/50-komposition.
3. **Publik desktop — grön.** 1024, 1280, 1366, 1440 och 1920 px behåller den avsiktliga fullbredds- och museikänslan utan att skapa horisontell overflow.
4. **Admin mobil — grön.** Rubriker reflowar vid 320 px, objektrader lägger åtgärder på egen rad, touchmål är minst 44 px och top/bottom safe areas reserveras.
5. **Admin desktop — grön.** Sidebaren aktiveras först vid 1024 px med en kompakt 212 px rail. Vid 1280 px återgår den till 264 px. Editorns preview är sticky men viewportbegränsad och egen-scrollbar.
6. **Kodkvalitet — grön.** ESLint, TypeScript och produktionsbygge passerar.

## Genomförda korrigeringar

- Fixade Nöjes katalogfilter som gjorde dokumentet 664 px brett på en 390 px viewport genom att ge gridbarn korrekt `min-width: 0` och sökfältet `width: 100%`.
- Tog bort adminrubrikens ärvda `nowrap` och gjorde mobilrubriker reflow-säkra.
- Flyttade adminbrytpunkt från 900 till 1024 px och minskade sidebaren till 212 px i laptop/tablet-landskap.
- Begränsade sticky preview till `100dvh - 60px` och gav den lokal scroll.
- Begränsade admineditorn till samma 1480 px maxbredd som övriga adminvyer.
- Skapade ett tabletband med två kolumner för Hem, Mat, Nöje och Kultur samt en mindre, stabil rubrikskala.
- Lade in 24 px safe-bottom-floor för publik och admin, samt safe-top för admininloggning.
- Höjde berörda filter- och ikonknappar till minst 44 px.
- Kortade Profilens mobilhero med `clamp(280px, 42svh, 390px)` och linjerade listflikarnas fullbleed-rail med sidans 22 px gutter.
- Lade `overscroll-behavior-x: contain` på horisontella redaktionella rails.

## Verifiering

- Publik grundmatris: 65 route/bredd-kombinationer, inga overflow-fel.
- Riktad regression efter tabletfix: 15 kombinationer vid 768, 834 och 1023 px, inga overflow-fel.
- Adminöversikt: 14 bredder från 320 till 1920 px, inga overflow-fel.
- Admineditor: 7 bredder från 320 till 1920 px, inga overflow-fel.
- `npm run lint`: godkänd.
- `npm run build`: godkänd, inklusive TypeScript och statisk generering av `/`, `/admin`, `/_not-found` och `/icon.svg`.

## Visuella bevis

- [Hem, 320 × 700](./23-home-320x700-final.png)
- [Kultur, 390 × 844](./25-kultur-390x844-final.png)
- [Nöje, 390 × 844](./26-noje-390x844-final.png)
- [Mat, 390 × 844](./27-mat-390x844-final.png)
- [Profil, 390 × 844](./28-profil-390x844-final.png)
- [Hem, 1366 × 768](./29-home-1366x768-final.png)
- [Admin översikt, 320 × 700](./30-admin-overview-320x700-final.png)
- [Admin översikt, 1024 × 768](./31-admin-overview-1024x768-final.png)
- [Admin översikt, 1440 × 900](./32-admin-overview-1440x900-final.png)
- [Admin editor, 320 × 700](./33-admin-editor-320x700-final.png)
- [Admin editor, 1024 × 768](./34-admin-editor-1024x768-final.png)
- [Hemdashboard, tablet 768 × 1024](./35-home-dashboard-768x1024-final.png)

## Evidensgränser

- Kontrollen använder den aktuella produktionsbuilden i Codex in-app browser, DOM-geometri och visuellt granskade screenshots.
- Ingen fysisk iPhone, Android-enhet eller Windows-PC användes i denna runda. Safe-area-reglerna är implementerade men inte hårdvarumätta.
- Text-only 200 % kunde inte muteras i in-app browserns read-only DOM. Problemområdena har statiskt åtgärdats med wrap-säkra rubriker och flex/grid `min-width: 0`, men detta är inte en full WCAG-audit.
- Ingen prestanda-, skärmläsar- eller komplett tangentbordsrevision ingår. Matvyns långa katalog är layoutstabil men kan senare vinna på virtualisering/paginering.
