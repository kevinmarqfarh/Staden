import { anslag as beraknaAnslag } from "@/lib/tid";
import type { Objekt } from "@/lib/typer";

/**
 * ANSLAGET — a notice board, not a timer.
 *
 * A rectangle with full-bleed rules. Never a circle, never text locked inside
 * a fixed-aspect shape, never a fixed height. The numeral is provably never the
 * largest glyph on any screen: --type-anslag's clamp sits below
 * --type-title-lg's at every width and every zoom level.
 *
 * Language is arrival, never depletion — "om nio dagar", never "9 dagar kvar".
 * Never hours, minutes or seconds.
 *
 * aria-live is never set anywhere in this subtree. A notice must not announce
 * itself changing. The visible numeral and mono label are aria-hidden so the
 * whole plate is read once as a sentence, not as four fragments — and both the
 * digit and the spelled-out word come from the same integer, so they cannot
 * desync.
 */
export function Anslag({
  objekt,
  nu,
  format = "platta",
}: {
  objekt: Objekt;
  nu: Date;
  format?: "platta" | "rad";
}) {
  const tillfalle = objekt.tillfallen.find((t) => t.datumBekraftat);
  if (!tillfalle) return null;

  const a = beraknaAnslag(
    nu,
    new Date(tillfalle.borjar),
    tillfalle.slutar ? new Date(tillfalle.slutar) : undefined,
    objekt.platsNamn,
    objekt.titel,
  );

  /* On a card the countdown is a single mono line in the catalogue rail —
     never the plate, never a badge over the media. */
  if (format === "rad") {
    if (a.band === "kalender") return null;
    const text =
      a.band === "dagar"
        ? `OM ${a.dagar} DAGAR · ${a.datumrad}`
        : a.band === "veckor"
          ? `OM ${a.veckor} ${a.enhet} · ${a.datumrad}`
          : `${a.figur} · ${a.datumrad}`;
    return (
      <span className="katalog" data-band={a.band}>
        {text}
      </span>
    );
  }

  const idBas = `anslag-${objekt.accession.toLowerCase()}`;

  return (
    <section
      role="group"
      aria-labelledby={idBas}
      className="anslag"
      data-band={a.band}
      data-sal={objekt.sal}
    >
      <h2 id={idBas} className="visually-hidden">
        {a.mening}
      </h2>

      <div className="anslag__figur" aria-hidden="true">
        {a.band === "pagar" && <span className="anslag__punkt" />}
        {a.figur && <span className="anslag__tal">{a.figur}</span>}
        {a.enhet && <span className="anslag__enhet katalog">{a.enhet}</span>}
      </div>

      <div className="anslag__text" aria-hidden="true">
        <p className="anslag__titel">{objekt.titel}</p>
        <p className="anslag__rad katalog">
          <time dateTime={a.datumIso}>{a.datumrad}</time>
          {objekt.platsNamn ? ` · ${objekt.platsNamn.toUpperCase()}` : ""}
        </p>
      </div>
    </section>
  );
}
