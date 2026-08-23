# STADEN AppSec-baslinje

**Status:** PROVISIONAL — den statiska webbmiljön är verifierad; framtida dataflöden och leverantörskonfiguration återstår

**Datum:** 2026-08-23

**Evidens:** [`evidence-register.md`](evidence-register.md)

## Sammanfattning

Den nuvarande revisionen innehåller ett minimalt, statiskt Next.js-skal med låsta beroenden och en produktionsbyggd localhost-harness för dynamisk testning. Apprevision `1ba0650` har passerat Vercels produktiondeployment och GitHubs required security gate; den publika aliasen svarar med rätt innehåll och headers. Det vore fortfarande missvisande att kalla DAST, penetrationstestning, Supabase-säkerhet eller hela produktionsmiljön "godkänd" innan respektive test har körts och plattformsinställningarna har verifierats. De viktigaste omedelbara riskreduceringarna inför datafunktioner är deny-by-default i Supabase, skydd av leverantörskonton/hemligheter, reproducerbara migrationer och bevisad backup/restore.

## Kritiska åtgärder

### P0 — blockerar riktiga användare eller data

- **SUP-01:** verifiera hostad Supabase-konfiguration, inventera alla exponerade scheman/tabeller/vyer/funktioner och aktivera RLS med explicita deny-by-default-policyer. Ägare: Backend/Platform. Bevis: policyexport + negativa integrationstester.
- **IAM-01:** kräv MFA för GitHub-, Supabase- och eventuella Vercel-administratörer; separera admin-, deploy- och runtime-identiteter. Ägare: Projektägare. Bevis: daterad åtkomstgranskning utan återställningskoder i repot.
- **SEC-01:** aktivera secret scanning och push protection där GitHub-planen medger; kör TruffleHog på varje commitintervall och full historik veckovis/manuellt, och rotera alla verifierade träffar. Ägare: AppSec/Repo admin. Bevis: grön CI-körning + stängda alerts.
- **DR-01:** besluta RPO/RTO, aktivera en backupnivå som möter RPO och genomför första isolerade restoreövningen. Ägare: Incidentledare/DB-ägare. Bevis: signerad restorelogg.
- **DATA-01:** besluta dataklassning och retention för konton, sparade listor, exakt/platsbaserad aktivitet och importerat innehåll. Ägare: Produkt/Privacy. Bevis: godkänt datainventarium.
- **REL-01:** skydda `main`; `CODEOWNERS` finns för säkerhetskritiska sökvägar, men kräv dess granskning, lyckade säkerhetskontroller och miljögodkännande innan produktion. Ägare: Repo admin. Bevis: branch/ruleset-export.

### P1 — blockerar publik preview

- Generera en SBOM per release och behåll SCA på de nu låsta beroendena; kritiska/höga exploaterbara fynd blockerar merge.
- Kör språkmedveten SAST och säkerhetslint på varje PR.
- Kör IaC/config scanning på Supabase-migrationer och all framtida Terraform, Docker-, Vercel- eller GitHub Actions-konfiguration.
- Lägg till authZ-, inputvaliderings-, rate-limit- och negativa RLS-tester.
- Kör OWASP ZAP-baseline mot isolerad preview; endast godkända testkonton och testdata.

### P2 — före allmän lansering

- Oberoende, skriftligt auktoriserat penetrationstest av internetytan, inloggat läge, adminflöden, datainhämtning och Supabase-policyer.
- Missbruks- och kostnadslarm för auth, API, Edge Functions, lagring och tredjeparts-API:er.
- Kvartalsvis restoreövning och årlig leverantörs-/åtkomstgranskning.

## Kontrollmatris

| Område | Kontroll och rekommenderad implementation | Trigger/frekvens | Merge/release-policy | Operativ ägare | Status/evidens 2026-08-23 |
|---|---|---|---|---|---|
| Static Application Security Testing (SAST) | CodeQL med `security-extended` för stödda språk; obligatorisk lint/produktionsbuild; komplettera med ramverksspecifika regler för Supabase-klientanvändning, SSRF, injection och osäker rendering när stacken finns | Varje PR, `main`, veckovis full scan | Mål: blockera nya high/critical; kräver GitHub-ruleset för code-scanning-resultat | AppSec + kodägare | ESLint, produktionsbuild och CodeQL passerade i hosted required gate för `1ba0650`; CodeQL-resultat är report-only tills GitHub-enforcement verifierats |
| Software Composition Analysis (SCA) | Dependency Review, OSV-Scanner, Trivy och Dependabot; lägg till CycloneDX/SPDX-SBOM per release | Varje PR som ändrar manifest/lockfil; veckovis full scan | Blockera känd exploaterbar critical/high; tidsatt undantag kräver riskägare | Tech lead | Exakt låst `package-lock.json` finns. `npm audit`, lokal Trivy samt hosted OSV/Trivy för `1ba0650` rapporterade 0 blockerande sårbarheter. SBOM återstår |
| IaC/config scanning | Trivy config för Terraform/Kubernetes/Helm/Compose/Serverless/Pulumi/CloudFormation, Zizmor för GitHub Actions; komplettera med policytester för Supabase grants/RLS | Varje PR; månatlig drift-driftjämförelse | Blockera publik datalagring, wildcard-admin, okrypterad extern transport och avsaknad av RLS på exponerade tabeller | Platform | Zizmor-grind införd och lokalt utan fynd; villkorad Trivy-grind finns men ingen deploybar IaC. Lokal TOML granskad, hosted drift ej verifierad |
| Container scanning | Minimal, pinnad base image; Trivy image + SBOM + signering/provenance; kör som icke-root och read-only där möjligt | Build och före promotion; nattlig rescan | Ingen critical/high i körbar lagerkedja utan godkänt undantag | Platform | Villkorad build- och Trivy-grind införd; ej tillämplig: ingen Dockerfile/image |
| Vulnerability scanning | Konsolidera SAST/SCA/IaC/containerfynd; auktoriserad Nuclei/leverantörsscanning endast mot ägd preview/prod-scope; inventera externa endpoints | Veckovis preview, månatlig produktion, efter större infraändring | Critical inom 24 h, high inom 7 dagar eller dokumenterad kompensation | AppSec | Lokala och hostade dependency scans gav 0 blockerande fynd. `https://staden.vercel.app` är verifierad; full assetinventering och dynamisk scan återstår |
| Dynamic Application Security Testing (DAST) | OWASP ZAP passive baseline och försiktig Nuclei-baslinje mot en produktionsbyggd, repoägd localhost-harness; autentiserad aktiv scan först i separat, uttryckligen auktoriserad miljö | Manuellt per releasekandidat; aktiv scan enligt godkänd scope | Blockera verifierad high/critical; ett manuellt scan-anrop utan harness ska misslyckas som “not executed” | AppSec + QA | Körbar, låst localhost-harness finns; DAST-workflow bygger med `next build` och skannar `next start`. Den har inte körts mot denna revision och bevisar inte Vercel CDN/WAF/TLS eller Supabase |
| Secret detection | GitHub Secret Scanning/push protection + TruffleHog för commitintervall och veckovis/manuell full historik; egna mönster för leverantörsnycklar | Varje push/PR och veckovis historik | Varje verifierad hemlighet blockerar; återkalla/rotera omedelbart | Repo admin | Gitleaks v8.30.1 körd lokalt över historik och aktuell apparbetskatalog: 0 träffar; genererade `.next`/`node_modules` undantas uttryckligen. TruffleHog-grind införd. GitHub push protection ej verifierad |
| Penetration scanning/testing | Oberoende manuell testning enligt signerad Rules of Engagement: authN/Z, RLS, BOLA/IDOR, SSRF i ingestion, rate limiting, affärslogik, admin och leverantörsintegrationer | Före GA, årligen, efter stor auth/data-/ingestionändring | Critical/high måste retestas stängt före GA; medel får tidsatt åtgärdsplan | Produktägare + AppSec | Ej möjlig ännu; scope och target saknas |
| Threat model | Repo-grounded abuse-path-modell, uppdaterad tillsammans med dataflöden | Vid arkitekturändring och minst kvartalsvis före GA | Öppna critical/high måste ha ägare och plan | AppSec/Arkitekt | Provisorisk modell skapad; användarkontext saknas |
| Disaster recovery | PITR/daglig dump enligt RPO, separat objektbackup, repo mirror, leverantörskonfigexport och isolerad restoreövning | Backup automatiskt; verifiering dagligen; restore kvartalsvis | Missad backup eller misslyckad restore är release-/incidentblockerare | Incidentledare/Platform | Provisorisk plan skapad; ingen restoreevidens |

## Fynd från aktuell revision

### SB-001 — Produktionssäkerheten i Supabase kan inte härledas

**Allvarlighetsgrad:** hög som leveransrisk, inte en verifierad sårbarhet.

`supabase/config.toml` beskriver lokal utveckling. Repot saknar migrationer och policytester, och det finns ingen export av hostade RLS-, grant-, backup- eller nätverksinställningar. Innan data läggs in måste hosted state inventeras och representeras reproducerbart i migrationer.

### SB-002 — Lokal auth-baslinje har härdats; hosted state är fortfarande okänd

**Allvarlighetsgrad:** låg lokalt, hög kvarvarande verifieringsrisk.

`supabase/config.toml` kräver nu minst 12 tecken, stora/små bokstäver, siffror och symboler, e-postbekräftelse, säkert lösenordsbyte och 10 minuters OTP-livslängd. Det reducerar risken att den lokala mallen kopieras med svaga auth-defaults, men ändrar inte automatiskt det hostade projektet. Verifiera och dokumentera hosted Auth, MFA för administratörer och recovery-flöden före externa konton.

### SB-003 — Secret detection finns i CI; GitHub-skydd måste aktiveras externt

**Allvarlighetsgrad:** låg i repot, medel kvarvarande plattformsrisk.

Gitleaks v8.30.1 skannade hela den lokala Git-historiken och den aktuella arbetskatalogen utan fynd. CI kör en OCI-digestpinnad TruffleHog 3.97.0 mot commitintervallet på push/PR och hela historiken vid veckoschema/manuell körning. `.mcp.json` innehåller endast en project-scoped URL och är nu begränsad till read-only/funktioner; en Supabase project ref är en identifierare, inte en service-role-hemlighet. GitHub Secret Scanning, push protection och privata sårbarhetsrapporter måste fortfarande aktiveras/verifieras i repoinställningarna.

### SB-004 — Ingen verifierbar återställningskedja

**Allvarlighetsgrad:** hög som leveransrisk.

Repot saknade före denna ändring backup/restore-runbook, migrationshistorik och restoreprotokoll. Planen i `disaster-recovery-plan.md` reducerar processgapet men bevisar inte att backups finns eller går att återställa.

### SB-005 — Webbskalet är deployat; plattformsinställningar är fortfarande delvis okända

**Allvarlighetsgrad:** låg för den nuvarande statiska ytan, medel som leveransrisk.

`src/app/`, `package.json`, `package-lock.json` och `next.config.ts` ger en reproducerbar Next.js-yta. Vercel rapporterade lyckad Production-deployment av `1ba0650`; `https://staden.vercel.app` svarade HTTP 200 med korrekt titel/innehåll, konfigurerade appheaders och Vercel-HSTS. Project/team-åtkomst, deployment protection, miljövariabelinventering, retention, rollback och loggkonfiguration är fortfarande inte evidensbelagda.

## Undantag och triage

Ett undantag ska innehålla fynd-ID, berörd tillgång, exploaterbarhetsanalys, kompensationskontroll, namngiven riskägare och utgångsdatum (högst 30 dagar för high, 7 dagar för critical). Automatiskt genererade fynd får inte stängas enbart som "false positive" utan reproducerbar evidens. Hemlighetsfynd valideras utan att värdet kopieras till tickets eller loggar.
