# Disaster Recovery Plan — STADEN

**Status:** PROVISIONAL — mål och beroenden är antaganden tills de godkänts och testats

**Version:** 0.1, 2026-08-23

**Ägare:** ej utsedd (blockerare före produktion)

## Mål och antaganden

Repot innehåller ett minimalt, statiskt Next.js-skal där GitHub lagrar koden och Vercel levererar produktion på `https://staden.vercel.app`; apprevision `1ba0650` är verifierad som deployad. Planen antar därutöver en framtida mobilförst, databuren app där GitHub lagrar migrationshistorik och Supabase lagrar Postgres/Auth/Storage. Vercel-projektets fulla konfiguration, rollback/retention och teamåtkomst kan inte verifieras enbart från repot. Inga riktiga användare, datavolymer, leverantörsplaner eller SLO:er kan verifieras.

Föreslagna mål att godkänna:

| Tjänst/tillgång | Föreslaget RPO | Föreslaget RTO | Villkor |
|---|---:|---:|---|
| Supabase Postgres/Auth | 15 minuter | 4 timmar | Kräver aktiverad och övervakad PITR. Utan PITR är interim-RPO 24 timmar och ska uttryckligen riskaccepteras. |
| Supabase Storage-objekt | 24 timmar | 8 timmar | Kräver separat versionshanterad/off-site objektbackup; DB-backup innehåller bara Storage-metadata. |
| Next.js-webb på Vercel | 0 för kodrevision; högst 1 timmes konfigurationsförlust | 1 timme | API är inte implementerat. Målet kräver verifierad Vercel-koppling, pinnad Node-major, bevarad known-good deployment och export/inventarium av miljövariabelnamn och inställningar. |
| GitHub-kod och migrationer | 24 timmar för nya commits | 4 timmar | Kräver daglig mirror till separat konto/leverantör och regelbunden restorekontroll. Lokala clones räknas inte ensamma som backup. |
| Importerade externa katalogdata | 24 timmar eller återinläsning | 8 timmar | Råa snapshots måste vara reproducerbara och licens/retention dokumenterad. |
| Redaktionellt innehåll och listor | 15 minuter | 4 timmar | Antas ligga i Postgres; om media ingår gäller Storage-målet. |

Supabase dokumenterar att betalda projekt får dagliga databasbackuper och att PITR ger finare återställningspunkter, men aktuell plan/status för STADEN är inte verifierad. Databasbackup omfattar inte själva Storage-objekten. Se [Supabase Database Backups](https://supabase.com/docs/guides/platform/backups). Vercels rollback återpekar trafik till en tidigare deployment men återställer inte databas eller aktuella miljövariabler; se [Vercel Instant Rollback](https://vercel.com/docs/instant-rollback). GitHub rekommenderar mirror-clone eller separat backupverktyg för återställningsbar kodhistorik; se [GitHub: Backing up a repository](https://docs.github.com/en/repositories/archiving-a-github-repository/backing-up-a-repository).

## Incidentroller

Namngivna personer och minst en reserv per roll ska fyllas i utanför publikt repo om kontaktuppgifterna är privata.

| Roll | Ansvar | Primär | Reserv |
|---|---|---|---|
| Incident Commander (IC) | Klassning, beslut, tidslinje, kommunikation och avslut | TODO | TODO |
| Technical Lead | Isolering, diagnos, återställningsordning och verifiering | TODO | TODO |
| Database/Backup Owner | PITR/dump, schema, roller, RLS och dataintegritet | TODO | TODO |
| Application/Deploy Owner | Vercel/GitHub rollback, smoke tests och release | TODO | TODO |
| Security Lead | Bevisbevarande, tokenrotation, intrångsbedömning och anmälningar | TODO | TODO |
| Communications/Privacy | Statussida, användarinformation och GDPR-bedömning | TODO | TODO |

Ingen person får ensam både välja backup, utföra destruktiv restore över produktion och godkänna resultatet. Använd tvåpersonerskontroll för projektdelete, PITR-restore och massrotation av hemligheter.

## Klassning och aktivering

- **SEV-1:** bekräftad eller sannolik kompromettering, omfattande datakorruption/förlust eller total publik otillgänglighet. Aktivera omedelbart; IC inom 15 minuter.
- **SEV-2:** betydande funktionsbortfall eller begränsad dataintegritetsrisk utan bekräftad bred exponering. IC inom 30 minuter.
- **SEV-3:** degradering med workaround och ingen känd data-/säkerhetspåverkan. Hanteras i ordinarie incidentflöde.

Aktivera planen när övervakning, leverantörsstatus eller rapporter visar att RTO/RPO kan brytas. Dokumentera första observerade tid, detektionstid, senaste kända goda datapunkt, berörd region/tjänst och alla åtgärder i UTC plus lokal tid.

## Återställningsordning

1. **Säkerställ människor och scope:** utse IC, öppna privat incidentkanal, frys icke-nödvändiga deployer och identifiera om incidenten är säkerhetsrelaterad.
2. **Bevara bevis:** exportera relevanta audit-, auth-, deploy- och databasloggar med åtkomstkontroll; skriv inte hemligheter i incidentloggen.
3. **Begränsa:** återkalla komprometterade tokens, stoppa skadlig ingestion/Edge Function eller sätt framtida skrivande flöden read-only. Det nuvarande webbskalet är redan statiskt/read-only; maintenance mode eller kill switch måste designas innan mutationer införs. Radera inte projekt/resurser under pågående triage.
4. **Välj återställningspunkt:** fastställ senaste kända goda commit, deployment och DB-tidpunkt före felhändelsen. Bekräfta retention och förväntad dataförlust mot RPO.
5. **Återställ i isolerad miljö först:** återställ backup/duplicera projekt när leverantören medger; kör integritets- och säkerhetstester utan produktionstrafik.
6. **Återställ beroenden:** databas/Auth före serverfunktioner, därefter Storage-objekt, webb/API och slutligen bakgrundsjobb/ingestion.
7. **Verifiera och öppna gradvis:** kör kriterierna nedan; börja read-only eller begränsad trafik om möjligt.
8. **Kommunicera:** ange påverkan, dataförlustfönster och nästa uppdatering utan att avslöja attackdetaljer.
9. **Efterarbete:** rotorsak inom fem arbetsdagar för SEV-1/2, rotera kvarvarande credentials, uppdatera hotmodell och skapa spårade åtgärder.

## Runbook: Supabase Postgres och Auth

### Förberedelser

- Bekräfta plan, region, senaste/äldsta restorepunkt och om PITR är aktiverat. Spara endast metadata, aldrig access token, i bevispaketet.
- Säkerställ att alla scheman, extensions, RLS-policyer, funktioner och grants finns som granskade migrationer i Git. Detta är ännu inte uppfyllt.
- Ta regelbunden logisk dump till krypterad, separat backupdomän med immutable retention. Testa att dumpen kan läsas och registrera checksumma.
- Dokumentera custom roles; Supabase anger att lösenord för egna roller inte ingår i nedladdade dagliga backups och kan behöva sättas om.

### Restore

1. IC godkänner restorepunkt och beräknad dataförlust skriftligt.
2. Stoppa skrivande klienter, cron, queues och ingestion; bevara senaste loggar.
3. Återställ till separat projekt när möjligt. Om in-place restore är enda vägen, bekräfta downtime och tvåpersonersgodkännande.
4. Återlägg eller verifiera extensions, custom-role-lösenord och secrets via secrets manager — aldrig från dokumentet.
5. Jämför migrationsversion, scheman, grants och RLS mot Git. Avvikelse blockerar öppning.
6. Validera Auth med dedikerade testkonton: inloggning, utloggning, tokenrotation, lösenordsåterställning och nekad cross-user-åtkomst.
7. Validera dataintegritet med tabellradräkningar, constraints, stickprov och domänspecifika invariants. Spara endast aggregerade resultat.
8. Återaktivera jobb ett i taget; använd idempotensnycklar så att events/importer inte dupliceras.

## Runbook: Supabase Storage

Databasbackuper återställer metadata men inte raderade objekt. Därför krävs en separat objektkedja:

1. Aktivera versionshantering eller schemalagd kopiering till ett separat, krypterat konto/bucket med annan administrativ felzon.
2. Inventera bucket, objekt-ID, checksumma, version, klassning och retention utan att publicera signerade URL:er.
3. Vid restore, återställ objekt före att publika länkar öppnas; matcha objektchecksummor mot metadata.
4. Kör stickprov på behörigheter och signerade URL:ers TTL. Bekräfta att privata objekt inte blivit publika.
5. Dokumentera saknade/orphaned objekt och omgenerera endast när licens och källa tillåter det.

## Runbook: GitHub

1. Skapa minst dagligen en `--mirror`-backup till en separat skyddad lagringsdomän; inkludera LFS om det införs.
2. Exportera separat nödvändig metadata (issues, releases, rulesets och actionskonfiguration) om RTO kräver den; mirror innehåller inte allt GitHub-innehåll.
3. Vid förlust, skapa ett nytt privat repo, pusha mirror, verifiera signerade/taggade releaser och återupprätta branch protection, secrets och deploy integrationer med nya tokens.
4. Kör secret scanning på återställt repo innan det kopplas till deployment.
5. Be två granskare jämföra HEAD, tags och migrationskedja med senaste kända goda bevis.

## Runbook: Vercel

Vercel Git-integration, Production-deployment och stabil `vercel.app`-alias är verifierade för `1ba0650`; miljövariabelinventering, åtkomstregler, custom domain, retention och rollback behöver fortfarande attesteras i plattformen:

1. Vid kodrelaterad incident, identifiera senaste kända goda produktiondeployment och använd Instant Rollback/CLI rollback.
2. Om en kall rebuild krävs: checka ut en known-good commit, verifiera lockfilens integritet, använd Node 24 och `npm ci`, kör `npm run build` och promota först den verifierade artefakten. Bevara en immutable known-good deployment/artefakt eftersom npm och `next/font/google` är externa byggtidsberoenden.
3. Verifiera domänalias, funktioner, cron och miljövariabelversioner. `NEXT_PUBLIC_SITE_URL` ska vara en giltig absolut origin. Rollback bygger inte om med aktuella miljövariabler och återställer inte externa databaser.
4. Rotera komprometterade hemligheter i Vercel och beroende leverantörer, skapa därefter en ny deployment; anta inte att rollback tar bort en läckt hemlighet.
5. Kör syntetiska smoke tests samt logg-/felkontroll innan trafiken anses återställd.
6. Dokumentera deployment-ID, commit, artefakt/checksumma, initiativtagare och verifieringsresultat.

## Återställningsbevis och exitkriterier

En incident får inte stängas enbart för att startsidan svarar. Följande ska bifogas incidenten:

| Bevis | Godkänt kriterium |
|---|---|
| Tidslinje | Detektion, beslut, restore start/slut och trafiköppning dokumenterade |
| Backupursprung | Backup-ID/tidpunkt, retention och checksumma; inga tokens |
| Databas | Migrationsversion, constraints och kritiska radräkningar matchar förväntat intervall |
| Auth/RLS | Positiva tester fungerar och cross-user/admin-negativa tester nekas |
| Storage | Stickprovschecksummor matchar; privata objekt förblir privata; orphanlista hanterad |
| Applikation nu | Ren `npm ci` + produktionsbuild passerar; `/` och `/icon.svg` ger 200; assets, metadata-origin och förväntade säkerhetsheaders är korrekta; inga 5xx |
| Framtida dataflöden | De fem viktigaste användarflödena och write/read-after-write läggs till som exitkriterier när API/databas finns |
| Jobs | Ingestion/cron återstartas kontrollerat utan dubbletter eller replay-gap |
| Säkerhet | Berörda tokens återkallade/roterade; inga öppna critical/high utan IC-riskacceptans |
| RTO/RPO | Faktisk RTO och faktisk dataförlust jämförda med mål; avvikelse har åtgärdsägare |

## Testkalender

| Frekvens | Övning | Bevis |
|---|---|---|
| Dagligen | Automatisk backupstatus, ålder på senaste restorepunkt, mirrorjobb och objektbackup | Maskinläsbar status + larm vid miss |
| Månadsvis | Läsbarhet/checksumma på dump, åtkomstgranskning av backupkonton, tabletop för en roterande incident | Protokoll och åtgärdslista |
| Kvartalsvis | Isolerad full restore av DB/Auth + Storage-stickprov + app smoke tests | Start/sluttid, RPO/RTO, checksummor och godkännare |
| Halvårsvis | Leverantörsbortfall och credential-compromise-övning; återuppbygg deploykopplingar | Scenario, beslut och observerade gap |
| Årligen | Full DR-simulering med kommunikation, personuppgiftsbedömning och extern beroendeinventering | Signerad rapport och reviderad plan |
| Efter större ändring | Restoretest efter schema/auth/storage/deployment- eller backupplansändring | Releasekopplat återställningsbevis |
| Nu, före datafunktioner | Clean checkout → `npm ci` → build → testdeployment → rollback av den statiska webbtiern | Commit/deployment-ID, tider, responses, headers och godkännare |

En webbtier-restore/rollback kan och ska testas redan med det statiska skalet. Första fulla DB/Auth/Storage-restoreövningen ska genomföras före att riktiga användare eller data tillkommer. En backup som aldrig återställts är inte verifierad återställningsförmåga.

## Öppna beslut

1. Vilka personer och reserver äger incident-, databas-, deploy-, säkerhets- och kommunikationsrollerna?
2. Vilken Supabase-plan/PITR-retention används, och accepterar verksamheten kostnaden för RPO 15 minuter?
3. Ska Storage innehålla oersättliga egna/licensierade bilder, och vilken separat objektbackup väljs?
4. Vilket Vercel-projekt, plan, region, produktionsbranch, retention/rollback och loggupplägg används, och var finns en återställningsbar konfigurationsinventering?
5. Vilka personuppgifter och exakt platsdata lagras, hur länge, och vilka anmälnings-/kommunikationskrav gäller?
6. Vilken högsta acceptabla samtidiga dataförlust och downtime gäller under lansering respektive senare skala?
