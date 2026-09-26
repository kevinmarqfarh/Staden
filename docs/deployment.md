# Publicering av STADEN

Produktionsadress: https://staden.kevinmarquez.se

## GitHub till produktion

1. Push till en arbetsgren uppdaterar förhandsversionen, inte livesidan.
2. Öppna eller uppdatera en pull request till `main`.
3. Kontrollera att Security CI och Vercel-bygget passerar. Förbigå inte säkerhetsgrinden.
4. Slå ihop pull requesten till `main`. Git-integrationen bygger produktionsversionen.
5. Kontrollera GitHub-deploymentens commit och status samt innehållet på den riktiga domänen. Rapportera inte en push som en färdig publicering.

## Säkerhetskontroller

Beroendegranskningen kör `npm audit --package-lock-only --include=dev --include=optional --audit-level=moderate` eftersom GitHubs Dependency Review API inte är tillgängligt för detta repo. Kontrollen omfattar hela låsfilen, inte bara nytillkomna paket. Den stoppar även vid tjänst-/nätverksfel. OSV, Trivy, CodeQL och hemlighetsskanning kvarstår separat.

## Återställning

Vid fel efter publicering: välj en tidigare verifierad produktionsdeployment i rätt STADEN-projekt på Vercel, eller revert:a den felande merge-committen via en granskad pull request. Radera inte deployments, användardata eller miljövariabler som felsökningsåtgärd.

Vercel-anslutningar kan peka på olika konton. STADENs GitHub-status länkar till projektet under `kevinmarqfarhs-projects`; en anslutning som bara visar Avalyx-projekt är inte rätt projektåtkomst.
