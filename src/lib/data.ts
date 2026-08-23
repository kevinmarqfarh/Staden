import { GOTEBORG, OBJEKT, UTGAVA } from "@/data/goteborg";
import type { Objekt, Sal, Sallskap, Stad, Tidsband, Utgava } from "@/lib/typer";
import { avstand, tidPaDygnet } from "@/lib/tid";

/**
 * The single adapter between the UI and the store.
 *
 * Today it reads a seeded edition. Swapping it for a Supabase PostgREST client
 * is a change to this file alone: every function below returns the exact row
 * shape declared in src/lib/typer.ts, which mirrors the migrations.
 */

const STADER: Record<string, Stad> = { goteborg: GOTEBORG };

export function hamtaStad(slug: string): Stad | undefined {
  return STADER[slug];
}

export function alalStader(): Stad[] {
  return Object.values(STADER);
}

export function hamtaUtgava(stad: string): Utgava | undefined {
  return stad === UTGAVA.stad ? UTGAVA : undefined;
}

export function hamtaObjekt(id: string): Objekt | undefined {
  return OBJEKT.find((o) => o.id === id);
}

export function hamtaObjektMedSlug(
  stad: string,
  slug: string,
): Objekt | undefined {
  return OBJEKT.find(
    (o) => o.stad === stad && o.slug === slug && o.kurering === "publicerad",
  );
}

export function hamtaFlera(ids: string[]): Objekt[] {
  return ids
    .map((id) => hamtaObjekt(id))
    .filter((o): o is Objekt => Boolean(o) && o!.kurering === "publicerad");
}

export function hamtaSal(stad: string, sal: Sal): Objekt[] {
  return OBJEKT.filter(
    (o) => o.stad === stad && o.sal === sal && o.kurering === "publicerad",
  );
}

export function raknaSal(stad: string, sal: Sal): number {
  return hamtaSal(stad, sal).length;
}

/** Objects with at least one confirmed future occurrence, soonest first. */
export function kommandeHandelser(stad: string, nu: Date): Objekt[] {
  return OBJEKT.filter(
    (o) =>
      o.stad === stad &&
      o.kurering === "publicerad" &&
      o.slag === "handelse" &&
      o.tillfallen.some((t) => {
        const slut = t.slutar ?? t.borjar;
        return avstand(nu, new Date(slut)) >= 0;
      }),
  ).sort((a, b) => {
    const at = a.tillfallen[0]?.borjar ?? "";
    const bt = b.tillfallen[0]?.borjar ?? "";
    return at.localeCompare(bt);
  });
}

/**
 * The time axis. ALLTID is a permanent segment — it is what makes the
 * permanent city a first-class citizen of the time axis rather than a bolt-on.
 */
export function filtreraTid(
  objekt: Objekt[],
  band: Tidsband,
  nu: Date,
): Objekt[] {
  if (band === "alltid") return objekt;

  return objekt.filter((o) => {
    if (o.slag === "plats") return band === "nu";
    return o.tillfallen.some((t) => {
      const start = new Date(t.borjar);
      const slut = t.slutar ? new Date(t.slutar) : start;
      const dagarTillStart = avstand(nu, start);
      const dagarTillSlut = avstand(nu, slut);

      switch (band) {
        case "nu":
          return dagarTillStart <= 0 && dagarTillSlut >= 0;
        case "ikvall":
          return (
            dagarTillStart === 0 ||
            (dagarTillStart <= 0 && dagarTillSlut >= 0 && tidPaDygnet(nu) !== "natt")
          );
        case "imorgon":
          return dagarTillStart === 1;
        case "helgen": {
          const veckodag = start.getDay();
          return dagarTillStart >= 0 && dagarTillStart <= 7 && (veckodag === 5 || veckodag === 6 || veckodag === 0);
        }
        default:
          return true;
      }
    });
  });
}

/** Editorial booleans set by a human editor. No scoring, no model, no
 *  inference — which is why the active selection can honestly be printed in
 *  words with an undo. */
export function filtreraSallskap(objekt: Objekt[], sallskap: Sallskap): Objekt[] {
  if (sallskap === "alla") return objekt;
  return objekt.filter((o) => o.passar.includes(sallskap));
}

export function filtreraKvarter(objekt: Objekt[], kvarter?: string): Objekt[] {
  if (!kvarter) return objekt;
  return objekt.filter((o) => o.kvarter === kvarter);
}
