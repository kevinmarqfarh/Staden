# STADEN — en redaktion att ta med sig

Designplan och visuellt beslutsunderlag, 22 september 2026.

## Målet

Besökaren ska hitta ett intressant och begripligt förslag på första skärmen, kunna kontrollera om det passar och enkelt spara det. STADEN behåller sitt redaktionella, lite råa uttryck men prioriterar vardagsanvändning framför en stor presentationsyta.

Denna leverans är en designförhandstitt. Bilderna visar föreslagen form och informationshierarki, inte färdig eller användartestad funktionalitet. Befintlig app ersätts först i implementationen.

## Underlag och research

- [DOJO: historisk App Store-listning](https://apps.apple.com/th/app/dojo-city-discovery/id894065287): dagliga redaktionella urval inom restauranger, barer, kultur och nattliv samt transportintegrationer. Historiskt produktunderlag, inte ett påstående att tjänsten fungerar idag.
- [Econsultancy: jämförelse av DOJO, YPlan och Fever, 2016](https://econsultancy.com/yplan-dojo-or-fever-which-london-events-app-offers-the-best-ux/): dokumenterade upptäcktsflöden och praktisk information. Delar om bokningsflödet är motsägelsefulla och används därför inte som krav.
- [DICE: komma igång](https://dicefm.zendesk.com/hc/en-gb/articles/22365422759313-Getting-started-with-DICE): personliga evenemangsförslag och sparade evenemang. Lärdom för STADEN: tydlig väg från intresse till nästa handling, utan att bygga egen biljettförsäljning.
- [Mapstr](https://en.mapstr.com/): spara och organisera platser. Lärdom: återfinning ska vara huvuduppgiften i Sparat, administration sekundär.
- [W3C: WCAG 2.2 target size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): miniminivån har undantag och är inte detsamma som vårt högre designmål på minst 44 × 44 CSS-pixlar för primära tryckytor.

Researchen är en jämförelse av produktmönster, inte en representativ användarundersökning. Rekommendationerna nedan är våra designbedömningar.

## Vad som hindrar användningen idag

Den aktuella appen öppnades lokalt och granskades på dator och vid 390 × 844. På mobil ligger rubrik och introduktion fram till cirka y=512, katalogsiffror runt y=555–630 och bilden börjar runt y=680. Ingen konkret rekommendation med titel och praktiska uppgifter syns före bottennavigationen.

Kodgranskningen bekräftar ytterligare friktion:

1. Startsidan finns bakom ordmärket och sparat bakom Profil, trots att båda är centrala uppgifter.
2. Kultur, Nöje och Mat har olika sätt att nå kategorier och resultat. Besökaren behöver lära om.
3. Rekommendationsmotorn kräver många val av känsla, situation och livsrytm innan den visar ett första förslag.
4. Listor blandar återfinning, administration och loggbok.
5. Stora ytor och upprepade presentationsrubriker skjuter praktiskt innehåll långt ned.

## Föreslagen struktur och varför

| Del | Ändring | Varför |
| --- | --- | --- |
| Navigation | Idag / Utforska / Sparat / Profil | Namnger fyra användaruppgifter. Startsidan och det sparade får egna synliga destinationer. |
| Kultur, Nöje, Mat | Tre omedelbart synliga kategoriingångar på Idag och i Utforska | Bevarar de välbekanta huvudområdena utan att gömma dem i en meny. |
| Idag | Kompakt masthead, kort rubrik, ett huvudval och två redaktionella guider | Något användbart på första skärmen. Inget fullskärmshögt introduktionsblock. |
| Utforska | Samma sök- och filterstruktur för alla områden | Kunskapen från en kategori går att använda i nästa. |
| Sparat | Alla sparade objekt först, sökning och listväljare intill | Man kan återfinna ett sparat ställe utan att först välja eller administrera en lista. |
| Profil | Preferenser, loggbok och inställningar | Personliga inställningar konkurrerar inte med upptäckt eller listinnehåll. |

Idag är redaktionens ingång. Utforska är den fullständiga katalogen. Sparat är användarens egna urval. Samma namn och destinationer används på dator och mobil.

## Skärm för skärm

### Idag

- STADEN i en kompakt topp med Göteborg och en tydligt tillgänglig sökknapp.
- Kort redaktionell rubrik, till exempel ”Lite mer Göteborg.”
- Synliga ingångar till Kultur, Nöje och Mat.
- En tidsväljare vid urvalets rubrik: Idag / I helgen / Välj datum. Inte flera rader av chips före innehållet.
- Ett fullbrett huvudobjekt: bild, titel, en kort redaktionell anledning, datum/tid, område, pris och separat spara-knapp. Hela huvudytan öppnar detaljer; spara öppnar inte detaljer.
- Två mindre guider med tydlig etikett GUIDE och antal platser. Exempel på redaktionella teman: takbarer, första dejten, barnfamilj.
- Högst fyra ytterligare aktuella objekt följt av Visa fler. En större stadsfestival kan ersätta en modul när den är relevant; aldrig automatiskt lägga ännu ett stort block överst.
- Ett personligt överraskningsförslag är en sekundär handling. Preferenser behöver inte fyllas i för att börja använda appen.

### Utforska och kategorier

- Gemensam ordning: kategori, sökning, lättillgängliga filter, träffantal, resultat.
- Kultur: Idag, Snart och Välj datum med uttrycklig definition. ”Snart” får bara betyda en bekräftad start inom vald tidsgräns; okända eller återkommande tider märks med att program behöver kontrolleras.
- Mat: hela utbudet finns med från början, organiserat efter kök. Kök är förstahandsindelning, inte ett godtyckligt förvalt kök. Pris, kost och område är kompletterande filter.
- Nöje: kategorier för aktivitet och plats, med tidsåtgång, pris och eventuell bokning synliga.
- Filter öppnas i mobilpanel och ryms i sidoyta på dator. Aktiva val syns när panelen stängts. Rensa återställer även aktivt närhetsfilter. Visa träffar stänger panelen och tar användaren tillbaka till resultat.
- Närhet kräver ett aktivt platsval. Avstånd visas bara med en verklig position och tillräckligt säkra objektkoordinater. Manuell områdesväljare fungerar utan GPS.

### Objekt och redaktionella guider

- Ett objekt har delbar adress, tydlig tillbaka-väg, källa, datum, tid, pris, plats och primär handling som motsvarar objektet: bokning eller vägbeskrivning.
- En guide är en redaktionell samling: introduktion, bild och ett litet antal motiverade stopp. Guidekort får inte se ut som en bokningsbar händelse.
- Spara är samma handling överallt, med direkt återkoppling och möjlighet att ångra. Objektet hamnar först i Allt sparat; listval är valfritt.
- För längre innehåll används en egen detaljsida. Panel är en möjlig snabbförhandsvisning, inte det enda sättet att läsa.

### Sparat

- Rubrik, sökning och kompakt listväljare först. Därefter sparade objekt direkt.
- Alla / Kultur / Nöje / Mat fungerar över både Allt sparat och egna listor.
- Skapa lista är tillgängligt men konkurrerar inte med innehållet. Byt namn, ta bort och ordna ligger under listans meny.
- Utgångna evenemang ligger kvar i Sparat men märks Avslutat och erbjuds inte som kommande aktiviteter.
- ”Besökt” och personliga anteckningar är sekundära möjligheter, inte obligatoriska steg.

## Visuellt system

- Bas: varm pappersyta, nästan svart text och signalorange. Mörkt tema använder djup grafit, varm vit och samma begripliga hierarki.
- Brutalismen ligger i tydliga linjer, kondenserat ordmärke, korta kraftfulla rubriker och osentimental placering. Brödtexten ska vara lugn och lättläst.
- Två typsnitt i respektive förslag: ett för korta redaktionella rubriker/varumärke och ett för läsning och UI. Text ska inte tvingas in i för små rutor.
- Bento används för innehåll med olika vikt. På dator: 12 kolumner, huvudobjekt 8 och två sekundära ytor i 4. På mobil: huvudobjekt i en kolumn, två mindre guidekort bara när innehållet ryms. Evenemang med mycket fakta ligger alltid fullbrett.
- Glas används på bottennavigation och få bildöverlägg. Innehåll och långa texter har solid bakgrund. Ogenomskinlig reservstil behövs när transparens inte fungerar eller bör minskas.
- Avstånd bygger på 4/8-pixelsteg: 16–20 px sidmarginal på mobil, 12–16 px mellan kort, 24–32 px mellan grupper. Desktop max cirka 1280 px innehållsbredd.
- Rundningar är återhållsamma: 8–12 px på innehållskort, större på en flytande navigationsyta. Inga staplade skuggor eller kort inuti kort.
- Rörelse: snabb sparbekräftelse, lätt övergång vid filter och diskret bildrespons på dator. Ingen automatiskt bläddrande huvudkarusell. Reduced motion respekteras.

## Agentgranskning och revidering

Researchagenten gav historiska DOJO-källor och jämförelser med DICE/Mapstr. Strukturagenten granskade den aktiva koden. En separat domare granskade planen före bilderna.

Första förslaget innehöll Upptäck och Utforska som separata flikar, flera kontrollrader och risk för för täta bento-kort. Det reviderades till Idag/Utforska, en tidskontroll och fullbredda evenemangskort. Domarens invändning mot dold kategorinavigation åtgärdas genom att Kultur/Nöje/Mat alltid är synliga på första sidan. Mat får inga automatiskt valda kök.

Tre visuella förhandstittar undersöker samma produktstruktur med olika tyngdpunkt: redaktionellt huvudobjekt, guider som huvudingång och ett mer koncentrerat kvällsförslag. Bildernas exempeldata är formgivningsexempel, inte en ny kontroll av kvällens program.

### Andra domaromgången

Domaren godkänner riktningen för visuell utforskning, med två ytterligare preciseringar. Den första destinationen heter **Hem** i slutlig navigation: Hem / Utforska / Sparat / Profil. Annars skulle namnet Idag bli motsägelsefullt när användaren väljer helgen. Benämningen Idag i tidigare avsnitt beskriver därför hemvyns startläge, inte slutligt fliknamn.

Mat visar synliga köksingångar och ett urval per kök med Visa fler; hela katalogen renderas inte som hundratals upprepade grupper. Ingen kökstyp väljs tyst åt användaren. Mixade kök kan hittas från flera relevanta ingångar men dubbletter undviks i samma resultatlista. Guidevarianten ska också visa ett konkret objekt ovanför vikningen.

## Genomförande efter vald riktning

### Visuell slutgranskning av förhandstittarna

Tre separata bilder genererades med den inbyggda bildgeneratorn, för en logisk mobilvy på 390 × 844. Den befintliga lokala bilden `docs/design/qa/staden-home-dashboard-mobile.png` bifogades som historisk stilreferens. Dagens körande app granskades separat på dator och mobil. Mockupbildernas fotografier är genererade illustrationer, inte dokumentation av de namngivna platserna.

Domaren inspekterade alla tre bildfiler och rekommenderar **förhandstitt 1** som bas, med en tydligare huvudhandling inspirerad av bild 3. Följande behöver korrigeras i implementationen:

- Verkliga mått: metadata får inte krympa och primära knappar måste uppnå 44 px tryckyta. Bilderna bevisar inte dessa egenskaper.
- Förhandstitt 1 behöver ”Visa plats” och verifierade tider/priser där data finns. Okänd information ska märkas, inte fyllas i genom gissning. Den stora sloganen kan bli mindre.
- Förhandstitt 2 rekommenderas inte som mobilgrund: för tätt rutnät, för liten text, söndagsguide under tisdagens urval och en obestyrkt beskrivning av havsutsikt vid Skanshof. ”För dig” ska dessutom inte användas utan faktisk personalisering.
- Förhandstitt 3 fungerar som kvällskollektion eller mörkt tema, men är för kvällsspecifik som allmän startsida och saknar synligt datumval.

Bildfiler, i samma ordning som de visades i konversationen:

1. `/Users/kevinmarquez/.codex/generated_images/01a02bda-57e9-7f31-9ac8-889a4b7c17b1/exec-cef46ecf-a9cd-4d72-a33c-e4c576c45048.png`
2. `/Users/kevinmarquez/.codex/generated_images/01a02bda-57e9-7f31-9ac8-889a4b7c17b1/exec-a03d6986-195a-4ca0-a0c6-999e2af5f4f3.png`
3. `/Users/kevinmarquez/.codex/generated_images/01a02bda-57e9-7f31-9ac8-889a4b7c17b1/exec-1b65db11-9589-425e-ab3c-d9f0e3ebf3c9.png`

Gemensam promptstyrning: minimalistisk redaktionell STADEN, befintlig stilreferens, 390 × 844, kort masthead, synliga kategorier, konkret huvudobjekt, två stödytor, Hem/Utforska/Sparat/Profil, återhållet glas, verklighetstrogna illustrationsbilder och märkning DESIGNFÖRSLAG. Variationerna var varm orange platsrekommendation, kobolt guidebento och grafit/amber kvällsguide. Dagens datum 22 september 2026 angavs uttryckligen i samtliga promptar.

1. Skapa gemensamma typografi-, avstånds-, färg- och korttokens samt navigation. Bevara befintliga sparade ID:n och listor.
2. Bygg Idag och ett gemensamt objektkort. Säkerställ att utgångna highlights tas bort utan att radera sparat innehåll.
3. Samla kategoriupplevelserna kring samma sök/filter/resultatmodell. Återanvänd befintlig innehållsdata och tidslogik.
4. Förenkla Sparat och flytta inställningar/loggbok till Profil. Migrera data först om ett faktiskt schemaändringsbehov uppstår.
5. Slutkontroll på 320, 390, 430, 768, 1024 och 1440 px, ljust/mörkt tema, tangentbord och minskad rörelse.

## Acceptanskriterier för den fungerande versionen

- Vid 390 × 844 syns minst ett konkret objekt med titel, relevanta praktiska uppgifter och spara-handling före bottennavigationen.
- Kultur, Nöje och Mat nås direkt från första skärmen. Sparat är en egen destination.
- Ett objekt sparas med ett tryck. En användare kan återfinna det genom Sparat utan att känna till listans namn.
- Ingen oavsiktlig horisontell sidscroll vid 320 px eller bredare. Zoom, stora texter och långa svenska namn kontrolleras separat.
- Primära tryckytor minst 44 × 44 px. Fokus syns och täcks inte av fasta ytor. Brödtext normalt 16 px, informationstext minst 14 px.
- Filter går att kombinera, återställa och behåller begripligt tillstånd när en detalj stängs.
- Inga påståenden om öppet nu, bekräftad start, pris eller gångtid utan relevant data. Nedräkning beräknas från aktuellt datum och försvinner efter evenemanget.
- Ljus/mörk färgsättning och glas testas för kontrast i faktisk rendering; en mockup är inte ett tillgänglighetstest.
- Korta användartester före bred lansering: hitta något ikväll, hitta mat inom budget, spara i lista, återfinna sparat. Målet är att identifiera tvekan och felsteg, inte att tilldela designen ett ogrundat 10/10-betyg.
