/**
 * DST-safe civil-day arithmetic for ANSLAGET.
 *
 * 29→30 March is a 23-hour day and 25→26 October is a 25-hour day. Millisecond
 * division is off by one on both, twice a year, and is unreproducible in a UTC
 * CI runner. Both instants pass through the same city-zone formatter before
 * subtraction, so civilDag returns the same integer on a Vercel edge node in
 * UTC, on a phone in Bangkok, and in a GitHub Actions container.
 */

export const STADSZON = "Europe/Stockholm";

const DAG_FORMAT = new Intl.DateTimeFormat("sv-SE", {
  timeZone: STADSZON,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const KLOCKA_FORMAT = new Intl.DateTimeFormat("sv-SE", {
  timeZone: STADSZON,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const MANAD_KORT = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAJ",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OKT",
  "NOV",
  "DEC",
];

const RAKNEORD = [
  "noll",
  "en",
  "två",
  "tre",
  "fyra",
  "fem",
  "sex",
  "sju",
  "åtta",
  "nio",
  "tio",
  "elva",
  "tolv",
  "tretton",
  "fjorton",
];

/** An integer day index in the city's civil calendar, immune to DST. */
export function civilDag(d: Date): number {
  const [y, m, dd] = DAG_FORMAT.format(d).split("-").map(Number);
  return Date.UTC(y, m - 1, dd) / 86_400_000;
}

/** Calendar days between two instants. Never millisecond division. */
export function avstand(nu: Date, mal: Date): number {
  return civilDag(mal) - civilDag(nu);
}

export function klockslag(d: Date): string {
  return KLOCKA_FORMAT.format(d);
}

/** '13 AUG' — the dateline, always wrapped in <time datetime> by the caller. */
export function datumrad(d: Date): string {
  const [, m, dd] = DAG_FORMAT.format(d).split("-").map(Number);
  return `${dd} ${MANAD_KORT[m - 1]}`;
}

export function isoDatum(d: Date): string {
  return DAG_FORMAT.format(d);
}

export type AnslagBand =
  | "kalender"
  | "veckor"
  | "dagar"
  | "imorgon"
  | "idag"
  | "pagar"
  | "avslutat";

export interface Anslag {
  band: AnslagBand;
  dagar: number;
  veckor: number;
  /** The digit or word shown in the figure column. */
  figur: string;
  /** The mono unit under the figure. Empty when the figure is a word. */
  enhet: string;
  /** The dateline in the text column. */
  datumrad: string;
  /** ISO date for <time datetime>. */
  datumIso: string;
  /** Spelled out. Generated from the same integer as the digit, so the visible
   *  numeral and the screen-reader sentence cannot desync. */
  mening: string;
}

function raknaOrd(n: number): string {
  return n >= 0 && n < RAKNEORD.length ? RAKNEORD[n] : String(n);
}

/**
 * The seven bands. Language is arrival, never depletion: "om nio dagar",
 * never "9 dagar kvar". Never hours, minutes or seconds.
 */
export function anslag(
  nu: Date,
  borjar: Date,
  slutar?: Date,
  plats?: string,
  titel?: string,
): Anslag {
  const dagar = avstand(nu, borjar);
  const slutDagar = slutar ? avstand(nu, slutar) : dagar;
  const veckor = Math.round(dagar / 7);
  const datum = datumrad(borjar);
  const iso = isoDatum(borjar);
  const var_ = plats ? `, ${plats}` : "";
  const vad = titel ? `${titel} ` : "";

  if (slutDagar < 0) {
    return {
      band: "avslutat",
      dagar,
      veckor,
      figur: "AVSLUTAT",
      enhet: "",
      datumrad: slutar ? datumrad(slutar) : datum,
      datumIso: slutar ? isoDatum(slutar) : iso,
      mening: `Anslag. ${vad}är avslutat${var_}.`.trim(),
    };
  }

  if (dagar <= 0 && slutDagar >= 0 && slutar) {
    return {
      band: "pagar",
      dagar,
      veckor,
      figur: "PÅGÅR NU",
      enhet: "",
      datumrad: `TILL ${datumrad(slutar)}`,
      datumIso: isoDatum(slutar),
      mening: `Anslag. ${vad}pågår nu, till den ${datumrad(slutar).toLowerCase()}${var_}.`,
    };
  }

  if (dagar === 0) {
    return {
      band: "idag",
      dagar,
      veckor,
      figur: "IDAG",
      enhet: "",
      datumrad: `ÖPPNAR ${klockslag(borjar)}`,
      datumIso: iso,
      mening: `Anslag. ${vad}öppnar idag klockan ${klockslag(borjar)}${var_}.`,
    };
  }

  if (dagar === 1) {
    return {
      band: "imorgon",
      dagar,
      veckor,
      figur: "IMORGON",
      enhet: "",
      datumrad: datum,
      datumIso: iso,
      mening: `Anslag. ${vad}öppnar imorgon, den ${datum.toLowerCase()}${var_}.`,
    };
  }

  if (dagar <= 14) {
    return {
      band: "dagar",
      dagar,
      veckor,
      figur: String(dagar),
      enhet: "DAGAR",
      datumrad: datum,
      datumIso: iso,
      mening: `Anslag. ${vad}öppnar om ${raknaOrd(dagar)} dagar, den ${datum.toLowerCase()}${var_}.`,
    };
  }

  if (dagar <= 60) {
    return {
      band: "veckor",
      dagar,
      veckor,
      figur: String(veckor),
      enhet: veckor === 1 ? "VECKA" : "VECKOR",
      datumrad: datum,
      datumIso: iso,
      mening: `Anslag. ${vad}öppnar om ${raknaOrd(veckor)} ${veckor === 1 ? "vecka" : "veckor"}, den ${datum.toLowerCase()}${var_}.`,
    };
  }

  return {
    band: "kalender",
    dagar,
    veckor,
    figur: "",
    enhet: "",
    datumrad: `I KALENDERN · ${datum}`,
    datumIso: iso,
    mening: `Anslag. ${vad}finns i kalendern den ${datum.toLowerCase()}${var_}.`,
  };
}

/** Time-of-day bands, computed in Europe/Stockholm. */
export function tidPaDygnet(nu: Date): "morgon" | "dagtid" | "kvall" | "natt" {
  const timme = Number(klockslag(nu).slice(0, 2));
  if (timme >= 5 && timme < 11) return "morgon";
  if (timme >= 11 && timme < 17) return "dagtid";
  if (timme >= 17) return "kvall";
  return "natt";
}

/** The daylight hairline fraction. Counts toward nothing; nothing is missed
 *  when it empties. */
export function dagsljusAndel(
  nu: Date,
  soluppgang: string,
  solnedgang: string,
): number {
  const minuter = (s: string) => {
    const [h, m] = s.split(":").map(Number);
    return h * 60 + m;
  };
  const nuMin = minuter(klockslag(nu));
  const upp = minuter(soluppgang);
  const ner = minuter(solnedgang);
  if (nuMin <= upp) return 1;
  if (nuMin >= ner) return 0;
  return Math.max(0, Math.min(1, (ner - nuMin) / (ner - upp)));
}

export function prisrad(
  slag: string,
  minOre?: number,
  maxOre?: number,
  not?: string,
): string | null {
  const kr = (o: number) => `${Math.round(o / 100)} KR`;
  switch (slag) {
    case "gratis":
      return "GRATIS";
    case "fast":
      return minOre != null ? kr(minOre) : null;
    case "fran":
      return minOre != null ? `FRÅN ${kr(minOre)}` : null;
    case "intervall":
      return minOre != null && maxOre != null
        ? `${kr(minOre)}–${kr(maxOre)}`
        : null;
    default:
      /* Unknown price is omitted entirely — never greyed, never an em-dash. */
      return not ? not.toUpperCase() : null;
  }
}
