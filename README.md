# STADEN

Staden i din ficka — en mobilförst upptäcktsmotor som hjälper människor att
hitta ett aktuellt, genomförbart och lite oväntat sätt att uppleva Göteborg.

Projektet är i tidig förproduktionsfas. Repot innehåller ett deploybart, mobilförst Next.js-skal som etablerar STADENs första redaktionella uttryck; riktiga dataflöden, Auth, listor och ingestion återstår. Säkerhetskontroller som saknar körbar målmiljö rapporteras uttryckligen som **not applicable/not executed**, aldrig som godkända tester.

## Lokal utveckling

Kräver Node.js 24.

```bash
npm ci
npm run dev
```

Produktionskontroll:

```bash
npm run lint
npm run build
```

Vercel ska använda **Next.js** som Framework Preset och repots rot som Root Directory.

- [Säkerhetspolicy](SECURITY.md)
- [Produktdefinition](docs/product/product-definition.md)
- [AppSec-baslinje](docs/security/security-baseline.md)
- [Provisorisk hotmodell](docs/security/staden-threat-model.md)
- [Disaster recovery-plan](docs/security/disaster-recovery-plan.md)
