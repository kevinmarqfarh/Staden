/**
 * Types mirror the Supabase schema in docs/design/staden-design-spec.md
 * ("## Supabase schema") one-to-one, so swapping the seed adapter in
 * src/lib/data.ts for a PostgREST client is a change to that file alone.
 *
 * There is deliberately no `google` member in Kalla. A Google-sourced value is
 * unrepresentable here, which is how the caching constraint in Google Maps
 * Platform's terms is enforced by the type system rather than by review.
 * google_place_id is the single exception: an identity join key, which the
 * terms permit to be stored indefinitely.
 */

export type Sal = "kultur" | "nojen" | "mat" | "sevardheter";

export type Slag = "handelse" | "plats";

export type Kurering =
  | "forslag"
  | "under_granskning"
  | "publicerad"
  | "avvisad"
  | "arkiverad";

export type Kalla =
  | "goteborg_co"
  | "osm"
  | "overture"
  | "wikidata"
  | "wikipedia"
  | "venue"
  | "redaktion"
  | "anvandare";

export type Licens =
  | "odbl-1.0"
  | "cc-by-sa-4.0"
  | "cc-by-4.0"
  | "cc0-1.0"
  | "proprietar_med_tillstand"
  | "redaktionell";

export type PrisSlag = "gratis" | "fast" | "fran" | "intervall" | "okand";

export type Terrang =
  | "platt"
  | "uppfor"
  | "nedfor"
  | "trappor"
  | "kaj"
  | "grus"
  | "skog";

export type LankSlag =
  | "biljett"
  | "bord"
  | "hemsida"
  | "program"
  | "karta"
  | "ljud";

export type Tidsband = "nu" | "ikvall" | "imorgon" | "helgen" | "alltid";

export type Sallskap =
  | "alla"
  | "med_barn"
  | "tva"
  | "vanner"
  | "ensam"
  | "pa_besok";

export interface Stad {
  slug: string;
  namn: string;
  namnEn: string;
  ordmarkeStad: string;
  tidszon: string;
  kvarter: Kvarter[];
}

export interface Kvarter {
  slug: string;
  namn: string;
  ordning: number;
}

export interface Lank {
  slag: LankSlag;
  url: string;
  /** The domain shown in words in AVFÄRDEN before anyone leaves. */
  vard: string;
  mobilanpassad: boolean;
}

export interface Media {
  url: string;
  alt: string;
  /** Rendered verbatim under the frame. "BILD FRÅN ARRANGÖREN" when the
   *  photographer could not be verified. */
  kredit: string;
  bredd: number;
  hojd: number;
}

export interface Tillfalle {
  /** ISO 8601 with offset. */
  borjar: string;
  slutar?: string;
  /** An anslag never ships from a scraped date. */
  datumBekraftat: boolean;
  tillstand: "planerad" | "installd" | "flyttad" | "slutsald";
}

export interface Oppettid {
  /** 1 = monday. */
  dag: number;
  oppnar: string;
  stanger: string;
}

export interface Harkomst {
  falt: string;
  kalla: Kalla;
  referens?: string;
  hamtad: string;
  licens: Licens;
  attribution: string;
}

export interface Objekt {
  id: string;
  stad: string;
  slag: Slag;
  sal: Sal;
  slug: string;
  /** 'K-0142' — printed once per plate at --type-micro, aria-hidden. */
  accession: string;

  titel: string;
  underrubrik?: string;
  /** THE WALL LABEL. 25–40 words, written by a human, never generated. */
  varfor: string;
  brodtext?: string;

  kvarter?: string;
  platsNamn?: string;
  adress?: string;
  gangminuter?: number;
  terrang?: Terrang;

  prisSlag: PrisSlag;
  prisMinOre?: number;
  prisMaxOre?: number;
  prisNot?: string;

  /** ANSLAGET qualification. Set by a human editor only; never inferred from
   *  ticket volume, capacity, popularity or click-through. */
  arAnslag: boolean;

  kurering: Kurering;
  publiceradVid?: string;

  /** Deterministic KATALOGPLATTA seed. Same object, same plate, every render,
   *  every device — the imageless state is the house look, not a hole. */
  plattaFro: number;

  passar: Sallskap[];
  inomhus: boolean;

  media?: Media;
  tillfallen: Tillfalle[];
  oppettider: Oppettid[];
  lankar: Lank[];
  harkomst: Harkomst[];

  /** The only Google field. Join key only — never a display value. */
  googlePlaceId?: string;
}

export interface Utgava {
  stad: string;
  /** ISO date of the edition. */
  dag: string;
  /** 'OMHÄNGD 06:40' */
  omhangdKl: string;
  objektIUtgavan: number;
  nyforvarv: number;
  /** The one Literata italic on the screen: a sentence about the day, not
   *  about an object. Two lines at 390px — 66 characters is the publish lint. */
  notis: string;
  vader?: string;
  soluppgang: string;
  solnedgang: string;
  ledObjekt: string;
  rummet: string[];
  anslag?: string;
  permanenta: string[];
  salsUrval: { sal: Sal; objekt: string[] };
}

export const SALAR: { slug: Sal; namn: string; beskrivning: string }[] = [
  {
    slug: "kultur",
    namn: "KULTUR",
    beskrivning: "Konst, scen, museer, utställningar, film och litteratur.",
  },
  {
    slug: "nojen",
    namn: "NÖJEN",
    beskrivning:
      "Utflykter, skärgård, lek, attraktioner, sport, konserter och kvällsliv.",
  },
  {
    slug: "mat",
    namn: "MAT",
    beskrivning: "Restauranger, kaféer, barer, saluhallar, bagerier.",
  },
  {
    slug: "sevardheter",
    namn: "SEVÄRDHETER",
    beskrivning: "Landmärken, natur, promenader, lekplatser, utsikter.",
  },
];

export const SALLSKAP: { slug: Sallskap; namn: string }[] = [
  { slug: "alla", namn: "ALLA" },
  { slug: "med_barn", namn: "MED BARN" },
  { slug: "tva", namn: "TVÅ" },
  { slug: "vanner", namn: "VÄNNER" },
  { slug: "ensam", namn: "ENSAM" },
  { slug: "pa_besok", namn: "PÅ BESÖK" },
];

export const TIDSBAND: { slug: Tidsband; namn: string }[] = [
  { slug: "nu", namn: "NU" },
  { slug: "ikvall", namn: "IKVÄLL" },
  { slug: "imorgon", namn: "IMORGON" },
  { slug: "helgen", namn: "HELGEN" },
  { slug: "alltid", namn: "ALLTID" },
];
