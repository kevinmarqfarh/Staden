import { receptFranId } from "@/lib/platta";
import type { Objekt } from "@/lib/typer";

/**
 * KATALOGPLATTAN — the imageless object.
 *
 * The title is never cropped: the type size is solved from the id against the
 * plate's known aspect ratio, and the plate has min-height, never height. The
 * accession number may bleed off the edge — that is where the print-crop
 * instinct is allowed to go, because it carries no meaning a reader needs.
 *
 * Under LUGNT LÄGE every plate collapses to composition 1 on flat ink,
 * halftone off, type left-aligned, one step up the reading scale. That is a
 * CSS-only fallback in komponenter.css, so it needs no JS and no preference
 * round-trip.
 */
export function Katalogplatta({
  objekt,
  format = "kort",
}: {
  objekt: Objekt;
  format?: "kort" | "led" | "detalj";
}) {
  const recept = receptFranId(objekt.id, objekt.titel);

  return (
    <div
      className={`platta platta--${recept.komposition} platta--${format}`}
      data-sal={objekt.sal}
      style={
        {
          "--raster-vinkel": `${recept.rastervinkel}deg`,
          "--raster-avstand": `${recept.punktavstand}px`,
          "--platta-typ": `${recept.typstorlekPx}px`,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <span className="platta__raster" />
      {recept.komposition === "nummerplat" && (
        <span className="platta__nummer">{objekt.accession}</span>
      )}
      <span className="platta__titel">{objekt.titel}</span>
      <span className="platta__accession katalog">{objekt.accession}</span>
    </div>
  );
}
