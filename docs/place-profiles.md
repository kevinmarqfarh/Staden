# Platsprofiler

## Plan och genomförande
- Egen delbar sida `/plats/[slug]` för etablerade kulturplatser i katalogen.
- Återanvänd katalogens stabila objekt-ID. Matcha registrerade namn med separat rum/adress efter komma; inga lösa delsträngsmatchningar.
- Separera kommande evenemang och pågående program. Dölj utgångna evenemang och permanenta katalogposter i programmet. Fyra kort per sektion med Visa alla.
- Spara plats och evenemang var för sig i befintliga Sparat. Följ platsen i Profil.
- Migrera gamla namnkopplade följval till plats-ID vid läsning och nästa sparning, utan att nollställa kända aktiviteter.
- Länka från kulturkort, startsidans detaljer, Sparat och Följer.

## Avgränsning
Inga nya evenemang, öppettider, tillgänglighetsuppgifter eller bilder fabriceras. Utan verifierad platsbild används en typografisk introduktion. Officiell webbplats kompletterar den lokala katalogen. Aktiviteter uppdateras när katalogen publiceras på nytt; detta är inte en liveintegration eller push-tjänst. Favoriter och följval är lokala i webbläsaren.

## Verifiering
Enhetstester: stabila ID:n, unika adresser, platskopplingar, datumgränser och migrering. Bygge och lint samt webbläsarkontroll av Följ, separata favoriter, direktlänk och mobilbredd.
