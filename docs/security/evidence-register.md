# Säkerhetsevidens — initial baslinje

**Status:** PROVISIONAL

**Insamlingsdatum:** 2026-08-23

**Basrevision:** `bef8cd8` på `main`; säkerhetshärdningen infördes i `7d2baba` och scannerfixen verifierades i `8858b4f`

**Syfte:** reproducerbar evidens för den första säkerhetsbaslinjen, inte ett produktionsgodkännande.

## Repoöversikt

Basrevisionen innehöll fyra spårade filer och två commits. Tabellen skiljer uttryckligen basläget från säkerhetshärdningen i detta ändringspaket:

| Evidens | Observation | Säkerhetstolkning |
|---|---|---|
| `README.md` | Endast projektnamnet `Staden` | Ingen arkitektur, dataklassning eller driftmodell kan härledas. |
| Basrevision `bef8cd8` | `README.md`, `.mcp.json`, `supabase/config.toml`, `supabase/.gitignore`; ingen app, migration, CI, dependencyfil, container eller IaC | SAST, SCA, container-, DAST- och faktisk IaC-skanning kunde inte ge meningsfull täckning. |
| Härdningsdelta: `.mcp.json` | Project-scoped Supabase MCP ändrad till `read_only=true` med begränsad funktionslista | Reducerar mutationsrisk; autentisering, läsrättighet och faktisk serverbehörighet ligger utanför repot. Project ref är inte en hemlighet. |
| Härdningsdelta: `supabase/config.toml` | Auth-mallen ändrad till minst 12 tecken, komplexitetskrav, bekräftad e-post, säkert lösenordsbyte och OTP 600 sekunder | Lokal kontroll, inte bevis för hosted-konfiguration. |
| Härdningsdelta: `README.md`, `.gitignore`, `.github/`, `SECURITY.md`, `docs/security/` | Navigerbar säkerhetsöversikt, rotpolicy för env/rapportfiler, SHA-pinnade villkorade scannergrindar, OCI-digestpinnade ZAP/TruffleHog-images, CODEOWNERS, säkerhetspolicy, hotmodell och DR-plan | Kritiska process- och repo-kontroller införda. Saknade scanner-targets förblir ej tillämpliga och plattformsinställningar förblir overifierade. |

## Utförda läsbaserade kontroller

| Kontroll | Omfattning | Resultat | Begränsning |
|---|---|---|---|
| Inventering | Git-basrevision samt aktuellt säkerhetsdelta | Bas: 4 filer, 2 commits; delta enligt ovan | Leverantörskonfiguration utanför Git ingår inte. |
| Hemlighetsdetektion | Gitleaks v8.30.1 `git` mot hela historiken och `dir` mot aktuellt worktree, verifierad release-checksumma, redigerad JSON-output | 0 läckor i historik och 0 i arbetskatalog | Täcker inte issues, Actions-loggar eller leverantörers secrets stores. GitHub Secret Scanning/push protection är ej verifierad. |
| Vulnerability/config/secret triage | Trivy v0.74.0 `fs` med officiell vulnerability DB och `HIGH,CRITICAL` | 0 resultat eftersom 0 språkmanifest och 0 tillämpliga configmål hittades | Detta är **NOT APPLICABLE**, inte en godkänd vulnerability/IaC-scan. Ingen image eller körbar target fanns. |
| GitHub Actions SAST | Zizmor v1.29.0 offline med strikt `auditor`-persona mot `.github/workflows/` | Inga rapporterade fynd lokalt; hosted Zizmor-jobb passerade | Online-audits är avstängda; actions och ZAP/TruffleHog-images har dessutom granskats för SHA/digest-pinning. |
| Hosted Security CI | GitHub Actions [run 32608825098](https://github.com/kevinmarqfarh/Staden/actions/runs/32608825098) på commit `8858b4f` | **Success:** applicability, TruffleHog, Zizmor och strict required gate passerade | CodeQL, SCA/OSV/Trivy, IaC och container var korrekt `skipped` eftersom tillämpliga targets saknas; det är inte scan-pass. |
| Supabase-konfigurationsgranskning | `supabase/config.toml` | `api.max_rows = 1000`, Auth-rate limits, refresh-tokenrotation och härdade lokala email/password-värden finns. Nätverksrestriktioner är lokalt avstängda. | Standardfilen kan avvika helt från det hostade projektet. Dessa värden ska inte rapporteras som produktionskontroller utan dashboard/API-verifiering. |

## Ej verifierat

- GitHub-repot är publikt enligt GitHubs publika API. Branch protection/rulesets, privata sårbarhetsrapporter, secret scanning och push protection är inte verifierade; den lokala `gh`-sessionen saknade giltig autentisering vid kontrollen.
- Hostad Supabase-plan, region, RLS/policyer, nätverksrestriktioner, MFA, backup/PITR, loggretention, extensions eller faktiska scheman.
- Om Vercel används; inga Vercel-filer eller länkmetadata finns i revisionen.
- Klientramverk, API-routes, automationsmotor, Google/andra datakällor, administratörsgränssnitt eller medielagring.
- Personuppgiftskategorier, åldersgräns, geografisk precision, användarskala, SLO eller regulatoriska krav.

## Beviskrav för nästa säkerhetsgrind

Före första externa preview ska följande arkiveras som CI-artefakter eller säkerhetsärenden:

1. SAST-resultat för release-revisionens källkod och secret-scan-resultat för hela Git-historiken.
2. SBOM samt SCA-resultat från låsta beroenden.
3. Export/attestation av Supabase RLS-policyer, privilegier och backupstatus.
4. DAST-rapport mot en isolerad previewmiljö med skriftlig scope.
5. Återställningsprotokoll med start/sluttid, verifierade checksummor/radräkningar och godkännande av incidentledare.
6. Uppdaterad hotmodell där antagandena i `staden-threat-model.md` har bekräftats eller ersatts med repoankare.
