# Säkerhetspolicy för STADEN

STADEN är i förproduktionsfas. Ingen produktionsrelease eller garanterad supportperiod kan verifieras i repot ännu. Säkerhetskontrollerna och målen i `docs/security/` är därför en **provisorisk baslinje** som måste valideras innan systemet tar emot riktiga användare eller personuppgifter.

## Rapportera en sårbarhet

Rapportera inte misstänkta sårbarheter i en publik GitHub-issue.

1. Använd GitHubs privata sårbarhetsrapportering för repot om funktionen är aktiverad.
2. Om den inte är aktiverad, kontakta projektägaren via en privat kanal. **Blockerare:** en bevakad säkerhetsadress eller annan namngiven kanal måste dokumenteras innan publik lansering.
3. Ta med berörd version/commit, reproduktionssteg, förväntad påverkan och eventuell säker loggning. Skicka aldrig riktiga användaruppgifter eller aktiva hemligheter.

Målsatta svarstider, räknat under svensk kontorstid:

| Prioritet | Första bekräftelse | Första bedömning | Mål för begränsning |
|---|---:|---:|---:|
| Kritisk | 4 timmar | 1 arbetsdag | Omedelbart eller inom 24 timmar |
| Hög | 1 arbetsdag | 3 arbetsdagar | 7 dagar |
| Medel | 3 arbetsdagar | 10 arbetsdagar | 30 dagar |
| Låg | 5 arbetsdagar | 20 arbetsdagar | Planerad release |

Tiderna är operativa mål, inte ett bug-bounty-löfte.

## Grundkrav före produktion

- Alla tabeller som kan nås via Supabase Data API ska ha verifierad row-level security och explicita policyer; service-role-nyckeln får aldrig exponeras i klienten.
- Administratörskonton i GitHub, Supabase och framtida driftplattform ska använda MFA och minsta möjliga behörighet.
- Hemligheter ska lagras i leverantörens secrets manager, aldrig i källkod, byggartefakter, klientbundle, loggar eller testdata.
- Pull requests ska passera relevanta SAST-, SCA-, IaC-, container- och secret-detection-kontroller enligt [säkerhetsbaslinjen](docs/security/security-baseline.md).
- Återställning ska vara testad och dokumenterad enligt [disaster recovery-planen](docs/security/disaster-recovery-plan.md).
- Den [provisoriska hotmodellen](docs/security/staden-threat-model.md) ska valideras när arkitektur, autentisering och dataklassning är beslutade.

## Incidenthantering

Vid misstänkt intrång: stoppa exponeringen utan att förstöra bevis, återkalla berörda tokens, bevara tidsstämplade loggar, utse incidentledare och följ körboken i `docs/security/disaster-recovery-plan.md`. Rotera alltid en exponerad hemlighet; att enbart radera den ur Git-historiken gör den inte säker igen.
