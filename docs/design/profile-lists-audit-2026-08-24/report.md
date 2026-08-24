# Profil · listfunktion — UI/UX-audit

Datum: 2026-08-24  
Omfattning: skapa, välja, byta namn på, radera och fylla egna listor i Profil.  
Verifierade bredder: 320, 360, 390, 430, 768, 1024, 1280 och 1920 px.

## Utfall

Listfunktionen har gjorts om från ett alltid öppet formulär och små filterknappar till ett tydligare redaktionellt arbetsflöde:

- `Ny lista` öppnar ett avgränsat formulär först när det behövs.
- `Alla sparade` och egna listor visas som visuella kort med typ, namn och antal.
- Vald lista får en tydlig signalorange aktiv status och en separat hanteringsyta.
- `Byt namn` och `Ta bort` ligger samlat på den aktiva listan.
- Radering kräver bekräftelse och förklarar att sparade objekt inte försvinner.
- Varje sparat objekt använder den tydligare åtgärden `Flytta till lista`.
- Profilens introduktionsyta har kortats så att listorna kommer fram tidigare på både mobil och desktop.

## Genomgång av flödet

1. **Öppna Profil — god hälsa.** Listor, antal sparade objekt och inställningar är tydligt separerade. Profilens visuella identitet är bevarad.
2. **Skapa lista — god hälsa.** Formuläret är progressivt öppningsbart, får fokus direkt och stängs efter lyckad skapning.
3. **Välja lista — god hälsa.** Kortens aktiva status, antal och den efterföljande rubriken `Aktiv lista` gör orienteringen tydlig.
4. **Byta namn — god hälsa.** Redigering sker i kontext med namngivet fält, spara- och avbrytknapp samt bibehållen liststatus.
5. **Radera lista — god hälsa.** En explicit bekräftelse visar exakt vilket listnamn som tas bort och vad som händer med objekten.
6. **Flytta sparat objekt — god hälsa.** Objekt kan flyttas ur och tillbaka till en lista; antal och tomläge uppdateras omedelbart.
7. **Responsiv layout — god hälsa.** Dokumentbredden matchade viewport i hela matrisen. Den horisontella listskenan är avsiktlig och isolerad från sidans bredd.

## Visuell evidens

### Före

- [Mobil — profilöversikt](./01-before-profile-mobile.png)
- [Mobil — vald lista](./02-before-list-selected-mobile.png)
- [Desktop — profilöversikt](./03-before-profile-desktop.png)

### Efter

- [Mobil — skapa lista](./05-after-create-open-mobile.png)
- [Mobil — skapad lista](./06-after-list-created-mobile.png)
- [Mobil — namnbyte](./07-after-rename-open-mobile.png)
- [Mobil — raderingsbekräftelse](./09-after-delete-confirm-mobile.png)
- [Mobil — vald lista](./11-after-list-selected-mobile.png)
- [Minsta verifierade mobilbredd, 320 px](./14-after-profile-320-mobile.png)
- [Surfplatta, 768 px](./15-after-profile-tablet.png)
- [Desktop, 1280 px](./12-after-profile-desktop.png)
- [Widescreen, 1920 px](./13-after-profile-widescreen.png)

## Teknisk verifiering

- `npm run lint` — godkänd.
- `npm run build` — godkänd med Next.js 16.3.2, TypeScript och statisk generering.
- Tillfällig QA-lista skapades, döptes om och raderades.
- Objektet `14m² Bao` flyttades ur och tillbaka till `Göteborgskväll`; ursprungligt testläge är återställt.

## Evidensgränser

Auditen verifierar lokal browser-rendering och interaktion med data i webbläsarens lokala lagring. Den verifierar inte fleranvändarsynk, Supabase-persistens, nätverksfel eller verkliga konton eftersom listfunktionen i detta läge använder lokal lagring.
