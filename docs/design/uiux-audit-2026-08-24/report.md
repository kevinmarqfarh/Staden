# STADEN UI/UX audit — 24 augusti 2026

## Omfattning

Granskningen täcker den publika appens Hem, Kultur, Nöje, Mat och Profil, profilens inställningspanel samt adminytans översikt och editor. Mobil, surfplatta, desktop och en smal 240 px reflow-stress har kontrollerats.

## Bedömning före åtgärder

- Domarpoäng: 7,6/10 — blockerad.
- Styrkor: tydlig STADEN-identitet, museal/redaktionell ton, bra färg- och bildkontrast.
- Huvudproblem: platsverktyget tog över sektionsidentiteten, små funktionella texter, svag fokusindikering, klippta temakort vid smal reflow, instabil övergångsrendering, för långa standardlistor och en klippt adminrubrik.

## Genomförda åtgärder

1. Flyttade plats/GPS-funktionen efter de redaktionella huvudvalen i Kultur, Nöje och Mat.
2. Gjorde vyanimationerna fullt opaka och reducerade dem till subtil rörelse.
3. Lade robust fokusflytt till respektive vyrubrik efter navigering och en synlig `focus-within`-markering för platsvalet.
4. Höjde funktionella textstorlekar och minsta relevanta kontrollhöjder.
5. Gjorde inställningspanelen robust vid 320 och 240 px utan avstavning, rubriköverlapp eller klippta temakort.
6. Kortade Nöje- och Mat-katalogerna till fem poster från start med ett tydligt Visa fler-flöde.
7. Förenklade Profilens standardvy genom att ta bort den duplicerade listhanteraren tills en egen lista väljs.
8. Flyttade Supabase-diagnostik från den publika inställningsytan till adminansvaret.
9. Stabiliserade header, bottennavigation, maximala desktopbredder och horisontella svepytor.
10. Gjorde admineditorns titel och publiceringsstatus tydligare på mobil och desktop.
11. Korrigerade semantiken så att global header, navigation och footer ligger utanför sidans enda `main`-landmärke.

## Verifiering

- `npm run lint`: godkänd.
- `npm run build`: godkänd med statiskt genererade `/` och `/admin`.
- `git diff --check`: godkänd.
- Webbkonsol: 0 fel och 0 varningar i slutvyn.
- DOM: exakt en aktiv `data-view`, ett `main` och en site-header.
- Horisontell dokument-overflow: 0 px i kontrollerade vyer vid 240, 320, 390, 412, 768, 1440 och 1920 px.
- Navigationsklick: aktiv vy uppdateras och fokus flyttas till dess H2-rubrik.
- Visuella bevis: `final/41–50` för publika first views, `final/30–31` för inställningar, `final/51–53` för admin och `final/54` för desktopheaderns same-frame-verifiering.

## Evidensgräns

240 px-testet är en praktisk reflow-proxy, inte en fullständig certifiering av 200 % textzoom. Granskningen ersätter inte en komplett manuell WCAG-revision med flera skärmläsare och riktiga iOS/Android-enheter.

## Slutdom

APPROVED. Huvuddomare: 9,7/10. Mobil-/reflowdomare och desktop-/admindomare: APPROVED utan kvarvarande verkliga blockerare. Den återstående evidensmarginalen gäller full fysisk enhets- och WCAG-certifiering, inte ett känt layoutfel.
