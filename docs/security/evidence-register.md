# Säkerhetsevidens — initial baslinje

**Status:** PROVISIONAL

**Insamlingsdatum:** 2026-08-23

**Basrevision:** `bef8cd8` på `main`; säkerhetshärdningen infördes i `7d2baba`, appskalet i `e46fe04` och npm-kompatibilitetsfixen i `1ba0650`

**Syfte:** reproducerbar evidens för den första säkerhetsbaslinjen, inte ett produktionsgodkännande.

## Aktuell produktkandidat (ej ännu hosted)

Arbetskatalogen ovanpå `00cd68b` innehåller nu 32 kulturposter, 32 restauranger, lokal bild, tre teman, browser storage och en publishable-key-baserad Supabase health-check. Primära katalogkällor har kontrollerats online; en frivillig restaurangwebbplats svarar med anti-bot-status 455 för automatiserad GET men dess primära Göteborg.com-källa svarar 200. Lokalt har `npm audit` rapporterat 0 kända sårbarheter, `npm run lint` och `npm run build` passerat samt health-endpointen svarat HTTP 200 med den ignorerade `.env.local`. Sessionpersistens är avstängd. Dessa lokala resultat ersätter inte en ny hosted CodeQL/SCA/secret/DAST-körning eller attestering av RLS/grants/backups.

## Repoöversikt

Basrevisionen innehöll fyra spårade filer och två commits. Tabellen skiljer uttryckligen basläget från säkerhetshärdningen i detta ändringspaket:

| Evidens | Observation | Säkerhetstolkning |
|---|---|---|
| `README.md` | Endast projektnamnet `Staden` | Ingen arkitektur, dataklassning eller driftmodell kan härledas. |
| Basrevision `bef8cd8` | `README.md`, `.mcp.json`, `supabase/config.toml`, `supabase/.gitignore`; ingen app, migration, CI, dependencyfil, container eller IaC | SAST, SCA, container-, DAST- och faktisk IaC-skanning kunde inte ge meningsfull täckning. |
| Härdningsdelta: `.mcp.json` | Project-scoped Supabase MCP ändrad till `read_only=true` med begränsad funktionslista | Reducerar mutationsrisk; autentisering, läsrättighet och faktisk serverbehörighet ligger utanför repot. Project ref är inte en hemlighet. |
| Härdningsdelta: `supabase/config.toml` | Auth-mallen ändrad till minst 12 tecken, komplexitetskrav, bekräftad e-post, säkert lösenordsbyte och OTP 600 sekunder | Lokal kontroll, inte bevis för hosted-konfiguration. |
| Härdningsdelta: `README.md`, `.gitignore`, `.github/`, `SECURITY.md`, `docs/security/` | Navigerbar säkerhetsöversikt, rotpolicy för env/rapportfiler, SHA-pinnade villkorade scannergrindar, OCI-digestpinnade ZAP/TruffleHog-images, CODEOWNERS, npm/GitHub Actions-Dependabot, säkerhetspolicy, hotmodell och DR-plan | Kritiska process- och repo-kontroller införda. Appens lint/produktionsbuild ingår i required gate; saknade scanner-targets förblir ej tillämpliga och plattformsinställningar förblir overifierade. |
| Applikationsdelta: `package.json`, `package-lock.json`, `src/app/`, `next.config.ts` | Minimal Next.js 16.3.2/React 19.2.8 App Router-yta med exakt låsta beroenden, statisk startsida och grundläggande responsheaders | Gör SAST, SCA och localhost-DAST tillämpliga för den begränsade webbskalsytan. Ingen Auth-, API-, databas- eller ingestionkod har tillkommit. |

## Utförda läsbaserade kontroller

| Kontroll | Omfattning | Resultat | Begränsning |
|---|---|---|---|
| Inventering | Git-basrevision samt aktuellt säkerhetsdelta | Bas: 4 filer, 2 commits; delta enligt ovan | Leverantörskonfiguration utanför Git ingår inte. |
| Hemlighetsdetektion | Gitleaks v8.30.1 `git` mot hela historiken och `dir` mot aktuellt worktree, verifierad release-checksumma, redigerad JSON-output | 0 läckor i historik och 0 i arbetskatalog | Täcker inte issues, Actions-loggar eller leverantörers secrets stores. GitHub Secret Scanning/push protection är ej verifierad. |
| Applikationskvalitet | `npm run lint` och `npm run build` med låst dependency tree | Båda passerade lokalt och i hosted required gate; Next.js 16.3.2 producerade statiska routes för `/`, `/_not-found` och `/icon.svg` | Gäller den begränsade presentationsytan; inga dataflöden testas. |
| Dependency vulnerability scan | `npm audit` samt Trivy v0.74.0 mot `package-lock.json`, severity `HIGH,CRITICAL` | 0 rapporterade sårbarheter | Täcker den låsta Node-dependencygrafen, inte leverantörsplattformar, framtida runtime-dataflöden eller container eftersom ingen container finns. |
| Hemlighetsdetektion för appdelta | Gitleaks v8.30.1 `dir` mot aktuell arbetskatalog med defaultregler och begränsad allowlist för genererade `.next`/`node_modules` | 0 läckor i källor och konfiguration | Allowlisten gäller endast genererade artefakter/dependencies; hosted GitHub Secret Scanning/push protection är ej verifierad. |
| Lokal webbläsar-QA | Next dev i desktop- och 390×844-vy, DOM/loggkontroll samt ankarnavigering | Ingen runtime-overlay, inga console errors/warnings och ingen horisontell overflow; primär CTA nådde `#upptack` | Funktionell/visuell smoke test, inte tillgänglighetsrevision eller DAST. |
| Lokal produktionsrespons | `next start` och HEAD-request mot `127.0.0.1` | HTTP 200 med `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` och begränsad `Permissions-Policy` | Lokal kontroll; CDN/proxy kan förändra hosted respons och ska verifieras efter deployment. |
| GitHub Actions SAST | Zizmor v1.29.0 offline med strikt `auditor`-persona mot `.github/workflows/` | Inga rapporterade fynd lokalt; hosted Zizmor-jobb passerade | Online-audits är avstängda; actions och ZAP/TruffleHog-images har dessutom granskats för SHA/digest-pinning. |
| Hosted Security CI | GitHub Actions [run 32616042458](https://github.com/kevinmarqfarh/Staden/actions/runs/32616042458) på commit `1ba0650` | **Success:** required gate, TypeScript CodeQL, clean install, lint/build, OSV, Trivy, TruffleHog och Zizmor passerade; IaC/container och PR-only dependency review blev korrekt skipped | Hosted scanners täcker repo/apprevisionen, inte DAST, leverantörsinställningar eller framtida Supabase/datafunktioner. |
| Vercel Production | GitHub Deployment/commitstatus för `1ba0650` samt [staden.vercel.app](https://staden.vercel.app) | **Success:** Vercel rapporterade slutförd deployment; stabil alias svarade HTTP 200 med rätt titel/innehåll, appens säkerhetsheaders och Vercel-HSTS | Team/project settings, environment-variable-inventering, access protection, WAF, loggar, retention och rollback-policy är ej verifierade. |
| Supabase-konfigurationsgranskning | `supabase/config.toml` | `api.max_rows = 1000`, Auth-rate limits, refresh-tokenrotation och härdade lokala email/password-värden finns. Nätverksrestriktioner är lokalt avstängda. | Standardfilen kan avvika helt från det hostade projektet. Dessa värden ska inte rapporteras som produktionskontroller utan dashboard/API-verifiering. |

## Ej verifierat

- GitHub-repot är publikt enligt GitHubs publika API. Branch protection/rulesets, privata sårbarhetsrapporter, secret scanning och push protection är inte verifierade; den lokala `gh`-sessionen saknade giltig autentisering vid kontrollen.
- Hostad Supabase-plan, region, RLS/policyer, nätverksrestriktioner, MFA, backup/PITR, loggretention, extensions eller faktiska scheman.
- Vercel-projektets team-/åtkomstinställningar, environment variables, custom domain, WAF, loggar, retention och rollback-policy. Produktiondeployment och stabil `vercel.app`-alias är verifierade för `1ba0650`.
- API-routes, Auth-klient, automationsmotor, Google/andra datakällor, administratörsgränssnitt eller medielagring. Webbskalet är endast presentation.
- Personuppgiftskategorier, åldersgräns, geografisk precision, användarskala, SLO eller regulatoriska krav.

## Beviskrav för nästa säkerhetsgrind

Före första externa preview ska följande arkiveras som CI-artefakter eller säkerhetsärenden:

1. SAST-resultat för release-revisionens källkod och secret-scan-resultat för hela Git-historiken.
2. SBOM samt SCA-resultat från låsta beroenden.
3. Export/attestation av Supabase RLS-policyer, privilegier och backupstatus.
4. DAST-rapport mot en isolerad previewmiljö med skriftlig scope.
5. Återställningsprotokoll med start/sluttid, verifierade checksummor/radräkningar och godkännande av incidentledare.
6. Uppdaterad hotmodell där antagandena i `staden-threat-model.md` har bekräftats eller ersatts med repoankare.
