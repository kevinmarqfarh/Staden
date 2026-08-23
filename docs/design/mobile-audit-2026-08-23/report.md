# STADEN — mobilgranskning 2026-08-23

## Omfattning

- Publika vyer: Hem, Kultur, Nöje, Mat och Profil.
- Redaktion: Översikt, Skriv, Objekt, Media, System samt admininloggning.
- Viewports: 320 × 700 och 390 × 844 CSS-pixlar.
- Extra reflow-stress: inställningsarket vid webbläsarens minsta tillgängliga viewport, 240 × 422.
- Metoder: två oberoende statiska agentgranskningar, geometri-/overflowmätning i den lokala produktionsbyggnaden, visuell skärmbildsgranskning, tangentbords- och fokusprov samt en separat domarrunda.

## Resultat per steg

1. Hem — godkänd. Header, innehåll och bottennav är exakt lika breda som viewporten vid 320 och 390 px.
2. Kultur — godkänd. Rubriker bryts inom kolumnen och horisontella rails är avsiktligt scrollbara utan dokumentoverflow.
3. Nöje — godkänd. Tidsdisplayen har breddsskydd; sökfältet är 44 px högt och 16 px i textstorlek på mobil.
4. Mat — godkänd. Samlingsgriden blir en kolumn under 360 px, cuisine-kort håller sin bredd och kontakt-/kartlänkar har 44 px träffyta.
5. Profil — godkänd. Gemensam 22 px-gutter, 44 px listflikar och tvåstegsbekräftelse före listborttagning.
6. Profilinställningar — godkänd. Rubrik och Supabase-hostnamn bryts; arket ryms och kan scrollas vid 240 px stresstest utan horisontell dokumentoverflow.
7. Adminnavigation — godkänd. Alla fem huvudvyer, inklusive System, finns i mobilnavet och varje knapp är 57 px hög.
8. Adminredigering — godkänd. Mobilformfält använder minst 16 px text och relevanta åtgärder minst 44 px träffyta.
9. Admininloggning — godkänd. Dialogen ryms inom 390 × 844, är internt scrollbar, låser bakgrunden, fokuserar e-post, stängs med Escape och återför fokus.
10. Safe areas — godkänd i kod. `viewport-fit=cover` och gemensamma safe-area-tokens används av header, bottennav och paneler.

## Åtgärdade fynd

- Tog bort dokumentnivåns `overflow-x: clip` som tidigare dolde reflowfel.
- Bytte fasta mobilhöjder mot minhöjd och safe-area-anpassning.
- Lade till robust brytning och `min-width: 0` på stora redaktionella rubriker och smala kort.
- Säkrade 320 px-grider och horisontella rails.
- Höjde små mobilkontroller och formulärtext för Android/iOS.
- Lade tillbaka System i adminens mobilnavigation.
- Lade till modalens fokusfälla, Escape, fokusretur, scroll-lock och inert bakgrund.
- Lade till status i text utöver färg samt liveannonsering vid adminvybyte.
- Lade till bekräftelse före listborttagning.

## Mätbevis

- Alla fem publika vyer: `documentElement.scrollWidth === innerWidth` vid 320 och 390 px.
- Alla fem adminvyer: `documentElement.scrollWidth === innerWidth` vid 390 px; System verifierad även vid 320 px.
- Publik header och bottennav: vänsterkant 0 och högerkant exakt viewportbredd.
- Adminnav: fem lika kolumner, 57 px höga vid både 320 och 390 px.
- Adminmodal: 390 × 478 inom viewporten 390 × 844.
- Nöje-sökfält: 44 px höjd, 16 px text.
- Restaurangens karta, telefon och e-post: 44 px träffyta.

## Visuella bevis

- `10-home-320x700-fixed.jpg`
- `11-kultur-320x700-fixed.jpg`
- `12-noje-320x700-fixed.jpg`
- `13-mat-320x700-fixed.jpg`
- `14-profil-320x700-fixed.jpg`
- `15-home-390x844-fixed.jpg` till `19-profil-390x844-fixed.jpg`
- `20-admin-overview-390x844-fixed.jpg`
- `24-admin-settings-390x844-fixed.jpg`
- `25-admin-auth-modal-390x844-fixed.jpg`
- `26-settings-narrow-stress-240x422-fixed.jpg`
- `27-admin-settings-320x700-fixed.jpg`

## Evidensgränser

Detta är en fokuserad mobil-, reflow- och interaktionsgranskning, inte en fullständig WCAG-certifiering eller provning på fysiska iPhone-/Android-enheter. Browserns minsta viewport blev 240 px; stresstestet är därför en aggressiv smal reflowkontroll, inte en exakt simulering av operativsystemets textzoom.

## Domare

**APPROVED.** Domaren blockerade först en P2 där heroordet “öppen.” avstavades vid 320 px. Efter att avstavningen tagits bort och ordet hållits samman på egen rad godkändes slutversionen utan kvarvarande P0, P1 eller P2.
