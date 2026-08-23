/**
 * KATALOGPLATTAN — the imageless object, and the best-looking thing in the app.
 *
 * Roughly a third of what the automation returns will have no usable
 * photograph. Everything here is derived from the object id and stored at
 * ingest, never computed in the browser, so a plate is byte-for-byte identical
 * on a Pixel, an iPhone, a 1440px desktop and in the Open Graph renderer.
 *
 * Three laws:
 *   1. The title is never cropped. plattaFro solves the type size against the
 *      plate's known aspect ratio, the plate has min-height, never height.
 *   2. The accession number may bleed off the plate edge — it carries no
 *      meaning a reader needs.
 *   3. Under LUGNT LÄGE every plate collapses to composition 1 on flat ink,
 *      halftone off, type left-aligned and uncropped, one step up the scale.
 */

export type Komposition =
  | "vaggtext"
  | "plakett"
  | "regalskylt"
  | "nummerplat"
  | "fotmarginal"
  | "diagonalstapel";

const KOMPOSITIONER: Komposition[] = [
  "vaggtext",
  "plakett",
  "regalskylt",
  "nummerplat",
  "fotmarginal",
  "diagonalstapel",
];

export interface PlattRecept {
  komposition: Komposition;
  /** Halftone rotation, 0–345°. */
  rastervinkel: number;
  /** Dot pitch in px. */
  punktavstand: number;
  hornankare: "tl" | "tr" | "bl" | "br";
  /** Solved at ingest against the plate's aspect ratio. */
  typstorlekPx: number;
}

/** FNV-1a 32-bit. Computed once, at ingest, and stored on the row. */
export function fnv1a32(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export function plattRecept(fro: number, titel: string): PlattRecept {
  const komposition = KOMPOSITIONER[fro % 6];
  const rastervinkel = ((fro >>> 8) % 24) * 15;
  const punktavstand = [3, 5, 8][(fro >>> 16) % 3];
  const hornankare = (["tl", "tr", "bl", "br"] as const)[(fro >>> 24) % 4];

  /* Solve the type size so the title always fits the plate at 100% and
     reflows to a taller plate at 200%. Long Swedish compounds —
     Världskulturmuseet, Universeumutställningen — are the default case. */
  const tecken = titel.length;
  const langstaOrd = titel
    .split(/\s+/)
    .reduce((max, ord) => Math.max(max, ord.length), 0);
  let typstorlekPx = 64;
  if (tecken > 20 || langstaOrd > 14) typstorlekPx = 52;
  if (tecken > 34 || langstaOrd > 18) typstorlekPx = 42;
  if (tecken > 52 || langstaOrd > 22) typstorlekPx = 34;
  if (tecken > 74) typstorlekPx = 26;
  typstorlekPx = Math.max(18, Math.min(96, typstorlekPx));

  return {
    komposition,
    rastervinkel,
    punktavstand,
    hornankare,
    typstorlekPx,
  };
}

export function receptFranId(id: string, titel: string): PlattRecept {
  return plattRecept(fnv1a32(id), titel);
}
