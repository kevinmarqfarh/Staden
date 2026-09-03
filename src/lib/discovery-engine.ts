import type {
  CulturalDiscoveryIntent,
  CulturalEvent,
  CulturalEventCategory,
} from "@/data/cultural-events";
import type {
  EntertainmentCategory,
  EntertainmentExperience,
} from "@/data/entertainment";
import {
  addDaysToDateKey,
  dateKeyFromHighlightSnapshot,
  hasEventNotEnded,
  isEventActiveOnDate,
} from "@/lib/highlights";
import type { IntentAffinities } from "@/lib/cultural-journal";
import type { LifeRhythm } from "@/lib/life-rhythm";

/**
 * DISCOVERY-MOTORN
 *
 * En enhetlig upptäcktsmotor över kultur OCH nöje. Den optimerar inte för
 * maximal likhet med det du redan gillar — den blandar trolig träff (60 %),
 * angränsande upptäckt (25 %) och rena wildcard (15 %) så att världen blir
 * större, inte bara mer förutsägbar. Loggboken och livsrytmen (barnvecka /
 * barnfri) knuffar mjukt, aldrig som hårda filter — utom när ett läge är en
 * hård begränsning (t.ex. "Gratis ikväll").
 */

export type DiscoveryMode =
  | "gratis-ikvall"
  | "under-150"
  | "i-helgen"
  | "tva-timmar"
  | "ga-sjalv"
  | "socialt"
  | "overraska";

export const discoveryIntents: Array<{
  id: CulturalDiscoveryIntent;
  label: string;
}> = [
  { id: "fortrollad", label: "Bli förtrollad" },
  { id: "inspirerad", label: "Bli inspirerad" },
  { id: "nyfiken", label: "Upptäcka något" },
  { id: "social", label: "Träffa människor" },
  { id: "berord", label: "Bli berörd" },
  { id: "energi", label: "Få energi" },
  { id: "overraskad", label: "Se något märkligt" },
];

export const discoveryModes: Array<{ id: DiscoveryMode; label: string }> = [
  { id: "gratis-ikvall", label: "Gratis ikväll" },
  { id: "under-150", label: "Under 150 kr" },
  { id: "i-helgen", label: "I helgen" },
  { id: "tva-timmar", label: "Jag har två timmar" },
  { id: "ga-sjalv", label: "Bra att gå själv" },
  { id: "socialt", label: "Socialt" },
];

const INTENT_ADJACENCY: Record<
  CulturalDiscoveryIntent,
  CulturalDiscoveryIntent[]
> = {
  fortrollad: ["berord", "overraskad"],
  inspirerad: ["nyfiken", "berord"],
  nyfiken: ["inspirerad", "overraskad"],
  social: ["energi"],
  berord: ["fortrollad", "inspirerad"],
  energi: ["social", "overraskad"],
  overraskad: ["nyfiken", "fortrollad", "energi"],
};

const cultureCategoryIntents: Record<
  CulturalEventCategory,
  CulturalDiscoveryIntent[]
> = {
  Festival: ["energi", "social", "overraskad"],
  Scenkonst: ["fortrollad", "berord", "overraskad"],
  Musik: ["energi", "berord", "social"],
  Film: ["berord", "inspirerad", "nyfiken"],
  Litteratur: ["nyfiken", "inspirerad", "berord"],
  Samtal: ["inspirerad", "nyfiken", "social"],
  Konst: ["inspirerad", "nyfiken", "overraskad"],
  Museum: ["nyfiken", "inspirerad", "fortrollad"],
  Kulturhus: ["social", "nyfiken", "inspirerad"],
  Skapande: ["social", "energi", "inspirerad"],
};

const entertainmentCategoryIntents: Record<
  EntertainmentCategory,
  CulturalDiscoveryIntent[]
> = {
  "Göteborgsklassiker": ["nyfiken", "social", "fortrollad"],
  "Skärgård & hav": ["fortrollad", "energi", "nyfiken"],
  "Barn & lek": ["energi", "social", "nyfiken"],
  "Natur & vandring": ["berord", "energi", "nyfiken"],
  "Kultur & historia": ["nyfiken", "inspirerad", "fortrollad"],
  "Aktivt & sport": ["energi", "social", "overraskad"],
  "Spel & utmaning": ["energi", "overraskad", "social"],
  "Scen & kväll": ["fortrollad", "energi", "berord"],
  "Kvarter & stadsliv": ["nyfiken", "social", "inspirerad"],
  "Lugn & välmående": ["berord", "inspirerad", "fortrollad"],
};

const cultureSoloFriendly = new Set<CulturalEventCategory>([
  "Konst",
  "Museum",
  "Film",
  "Litteratur",
  "Samtal",
  "Musik",
  "Scenkonst",
]);

export type DiscoveryPick = {
  key: string;
  kind: "kultur" | "noje";
  id: string;
  title: string;
  categoryLabel: string;
  area: string;
  venue?: string;
  timeLabel?: string;
  priceLabel: string;
  isFree: boolean;
  mapQuery: string;
  sourceUrl?: string;
  intents: CulturalDiscoveryIntent[];
  soloFriendly: boolean;
  familyFriendly: boolean;
  socialIntensity: "low" | "medium" | "high";
  durationMinutes: number | null;
  bucket: "trolig" | "angransande" | "wildcard";
};

type Candidate = {
  pick: DiscoveryPick;
  active: boolean;
  startDate: string | null;
};

const EVENT_TIME_PATTERN = /\b([01]?\d|2[0-3])[:.]([0-5]\d)\b/g;

function hasEveningTime(event: CulturalEvent) {
  const matches = event.time?.matchAll(EVENT_TIME_PATTERN);
  if (!matches) return false;
  return Array.from(matches).some((match) => Number(match[1]) >= 16);
}

function cultureDurationMinutes(event: CulturalEvent) {
  if (event.durationMinutes) return event.durationMinutes;
  const range = event.time?.match(
    /(\d{1,2}):([0-5]\d)\s*[–-]\s*(\d{1,2}):([0-5]\d)/,
  );
  if (range) {
    const [, sh, sm, eh, em] = range;
    const start = Number(sh) * 60 + Number(sm);
    let end = Number(eh) * 60 + Number(em);
    if (end < start) end += 24 * 60;
    return end - start;
  }
  if (["Samtal", "Litteratur", "Film"].includes(event.category)) return 120;
  return null;
}

function cultureSocialIntensity(
  event: CulturalEvent,
): "low" | "medium" | "high" {
  if (event.socialIntensity) return event.socialIntensity;
  if (["Festival", "Skapande"].includes(event.category)) return "high";
  if (["Musik", "Kulturhus", "Samtal"].includes(event.category)) return "medium";
  return "low";
}

function parseDurationLabel(label: string): number | null {
  const hours = label.match(/(\d+(?:[.,]\d+)?)\s*(?:tim|h\b|timmar)/i);
  if (hours) return Math.round(Number(hours[1].replace(",", ".")) * 60);
  const minutes = label.match(/(\d+)\s*min/i);
  if (minutes) return Number(minutes[1]);
  return null;
}

function weekendRange(today: string) {
  const [year, month, day] = today.split("-").map(Number);
  const dayOfWeek = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const daysToSaturday = dayOfWeek === 0 ? -1 : (6 - dayOfWeek + 7) % 7;
  const saturday = addDaysToDateKey(today, daysToSaturday);
  return { saturday, sunday: addDaysToDateKey(saturday, 1) };
}

function eventOverlapsRange(event: CulturalEvent, from: string, until: string) {
  const end = event.endDate ?? event.startDate;
  return event.startDate <= until && end >= from;
}

function cultureCandidate(
  event: CulturalEvent,
  today: string,
): Candidate | null {
  const horizon = addDaysToDateKey(today, 30);
  if (!hasEventNotEnded(event, today)) return null;
  if (event.startDate > horizon) return null;
  if (event.dateLabel === "Permanent") return null;
  if (event.isOngoing && !event.endDate) return null;

  const priceLabel = event.isFree
    ? "GRATIS"
    : event.priceMaxSek
      ? `MAX ${event.priceMaxSek} KR`
      : "KOLLA PRIS";

  return {
    active: isEventActiveOnDate(event, today),
    startDate: event.startDate,
    pick: {
      key: `kultur:${event.id}`,
      kind: "kultur",
      id: event.id,
      title: event.title,
      categoryLabel: event.category,
      area: event.area,
      venue: event.venue,
      timeLabel: event.time
        ? `${event.dateLabel} · ${event.time}`
        : event.dateLabel,
      priceLabel,
      isFree: Boolean(event.isFree),
      mapQuery: `${event.venue}, ${event.area}, Göteborg`,
      sourceUrl: event.sourceUrl,
      intents:
        event.discoveryIntents ?? cultureCategoryIntents[event.category],
      soloFriendly: event.soloFriendly ?? cultureSoloFriendly.has(event.category),
      familyFriendly:
        event.category === "Skapande" ||
        event.category === "Museum" ||
        (event.category === "Festival" && Boolean(event.isFree)),
      socialIntensity: cultureSocialIntensity(event),
      durationMinutes: cultureDurationMinutes(event),
      bucket: "wildcard",
    },
  };
}

function entertainmentCandidate(
  experience: EntertainmentExperience,
): Candidate {
  const audiences = experience.audiences ?? [];
  const priceLabel = experience.free
    ? "GRATIS"
    : experience.price
      ? experience.price.toUpperCase()
      : "KOLLA PRIS";
  return {
    active: true,
    startDate: null,
    pick: {
      key: `noje:${experience.id}`,
      kind: "noje",
      id: experience.id,
      title: experience.title,
      categoryLabel: experience.category,
      area: experience.area,
      venue: experience.area,
      timeLabel: experience.duration ? experience.duration : "När du vill",
      priceLabel,
      isFree: Boolean(experience.free),
      mapQuery: `${experience.title}, ${experience.area}, Göteborg`,
      sourceUrl: experience.url,
      intents: entertainmentCategoryIntents[experience.category] ?? ["nyfiken"],
      soloFriendly: audiences.includes("singel"),
      familyFriendly: audiences.includes("barnfamilj"),
      socialIntensity: audiences.includes("barnfamilj") ? "medium" : "low",
      durationMinutes: parseDurationLabel(experience.duration ?? ""),
      bucket: "wildcard",
    },
  };
}

function matchesMode(
  candidate: Candidate,
  event: CulturalEvent | null,
  mode: DiscoveryMode | null,
  today: string,
) {
  if (!mode || mode === "overraska") return true;
  const { pick } = candidate;

  if (mode === "gratis-ikvall") {
    if (!pick.isFree) return false;
    if (pick.kind === "noje") return true; // evergreen, alltid tillgängligt
    if (!event) return false;
    return (
      isEventActiveOnDate(event, today) &&
      hasEveningTime(event) &&
      (event.startDate === today ||
        event.endDate === today ||
        event.category === "Festival")
    );
  }

  if (mode === "under-150") {
    if (pick.isFree) return true;
    if (event) return Boolean(event.priceMaxSek && event.priceMaxSek <= 150);
    return /\b(0|[1-9]\d?|1[0-4]\d)\s*kr/i.test(pick.priceLabel);
  }

  if (mode === "i-helgen") {
    if (pick.kind === "noje") return true;
    if (!event) return false;
    const { saturday, sunday } = weekendRange(today);
    return eventOverlapsRange(event, saturday, sunday);
  }

  if (mode === "tva-timmar") {
    return pick.durationMinutes !== null && pick.durationMinutes <= 120;
  }

  if (mode === "ga-sjalv") return pick.soloFriendly;

  return pick.socialIntensity !== "low"; // socialt
}

function hashSnapshot(seed: string) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function scorePick(
  pick: DiscoveryPick,
  intent: CulturalDiscoveryIntent | null,
  affinities: IntentAffinities,
  lifeRhythm: LifeRhythm | null,
) {
  let score = 0;
  if (intent && pick.intents.includes(intent)) score += 6;
  for (const pickIntent of pick.intents) {
    score += affinities[pickIntent] ?? 0;
  }
  if (pick.isFree) score += 1;
  if (lifeRhythm === "barnvecka") {
    if (pick.familyFriendly) score += 4;
    if (pick.durationMinutes !== null && pick.durationMinutes <= 90) score += 1;
    if (pick.socialIntensity === "high") score -= 1;
  }
  if (lifeRhythm === "barnfri") {
    if (pick.socialIntensity !== "low") score += 2;
    if (pick.intents.includes("overraskad")) score += 1;
    if (pick.familyFriendly) score -= 1;
  }
  return score;
}

function classifyBucket(
  pick: DiscoveryPick,
  intent: CulturalDiscoveryIntent | null,
  affinities: IntentAffinities,
): "trolig" | "angransande" | "wildcard" {
  if (intent) {
    if (pick.intents.includes(intent)) return "trolig";
    const adjacent = INTENT_ADJACENCY[intent] ?? [];
    if (pick.intents.some((value) => adjacent.includes(value))) {
      return "angransande";
    }
    return "wildcard";
  }
  const affinity = pick.intents.reduce(
    (sum, value) => sum + (affinities[value] ?? 0),
    0,
  );
  if (affinity > 0) return "trolig";
  if (affinity === 0) return "angransande";
  return "wildcard";
}

function sortBucket(picks: DiscoveryPick[], scores: Map<string, number>) {
  return [...picks].sort((left, right) => {
    const scoreDiff = (scores.get(right.key) ?? 0) - (scores.get(left.key) ?? 0);
    if (scoreDiff !== 0) return scoreDiff;
    const freeDiff = Number(right.isFree) - Number(left.isFree);
    if (freeDiff !== 0) return freeDiff;
    return left.title.localeCompare(right.title, "sv-SE");
  });
}

/**
 * Väver ihop de tre hinkarna till en ordnad lista med målblandningen
 * 60 % trolig / 25 % angränsande / 15 % wildcard via en seedad, deterministisk
 * dragning. "Visa ett till" går bara vidare i listan.
 */
export function buildDiscoveryOrder({
  cultureEvents,
  entertainment,
  snapshot,
  intent,
  mode,
  lifeRhythm = null,
  affinities = {},
}: {
  cultureEvents: readonly CulturalEvent[];
  entertainment: readonly EntertainmentExperience[];
  snapshot: string;
  intent: CulturalDiscoveryIntent | null;
  mode: DiscoveryMode | null;
  lifeRhythm?: LifeRhythm | null;
  affinities?: IntentAffinities;
}): DiscoveryPick[] {
  const today = dateKeyFromHighlightSnapshot(snapshot);
  const cultureByKey = new Map<string, CulturalEvent>();

  const candidates: Candidate[] = [];
  for (const event of cultureEvents) {
    const candidate = cultureCandidate(event, today);
    if (candidate) {
      cultureByKey.set(candidate.pick.key, event);
      candidates.push(candidate);
    }
  }
  // Nöje ingår när ett läge inte är rent tidsbundet till kultur.
  for (const experience of entertainment) {
    candidates.push(entertainmentCandidate(experience));
  }

  const matched = candidates.filter((candidate) =>
    matchesMode(candidate, cultureByKey.get(candidate.pick.key) ?? null, mode, today),
  );
  if (matched.length === 0) return [];

  const scores = new Map<string, number>();
  for (const candidate of matched) {
    scores.set(
      candidate.pick.key,
      scorePick(candidate.pick, intent, affinities, lifeRhythm) +
        (candidate.active ? 2 : 0),
    );
  }

  const buckets: Record<"trolig" | "angransande" | "wildcard", DiscoveryPick[]> =
    { trolig: [], angransande: [], wildcard: [] };
  for (const candidate of matched) {
    const bucket = classifyBucket(candidate.pick, intent, affinities);
    candidate.pick.bucket = bucket;
    buckets[bucket].push(candidate.pick);
  }

  const trolig = sortBucket(buckets.trolig, scores);
  const angransande = sortBucket(buckets.angransande, scores);
  const wildcard = sortBucket(buckets.wildcard, scores);

  const random = mulberry32(hashSnapshot(snapshot));
  const cursors = { trolig: 0, angransande: 0, wildcard: 0 };
  const order: DiscoveryPick[] = [];
  const total = matched.length;

  const drawFrom = (name: "trolig" | "angransande" | "wildcard") => {
    const source =
      name === "trolig" ? trolig : name === "angransande" ? angransande : wildcard;
    if (cursors[name] >= source.length) return false;
    order.push(source[cursors[name]]);
    cursors[name] += 1;
    return true;
  };

  while (order.length < total) {
    const roll = random();
    const primary =
      roll < 0.6 ? "trolig" : roll < 0.85 ? "angransande" : "wildcard";
    const fallbacks: Array<"trolig" | "angransande" | "wildcard"> =
      primary === "trolig"
        ? ["trolig", "angransande", "wildcard"]
        : primary === "angransande"
          ? ["angransande", "wildcard", "trolig"]
          : ["wildcard", "angransande", "trolig"];
    if (!fallbacks.some((name) => drawFrom(name))) break;
  }

  return order;
}

export function pickDiscovery(
  order: readonly DiscoveryPick[],
  skipKeys: readonly string[] = [],
): DiscoveryPick | null {
  const skipped = new Set(skipKeys);
  return order.find((pick) => !skipped.has(pick.key)) ?? null;
}

export function recommendationReason(
  pick: DiscoveryPick,
  intent: CulturalDiscoveryIntent | null,
  mode: DiscoveryMode | null,
  lifeRhythm: LifeRhythm | null = null,
) {
  if (lifeRhythm === "barnvecka" && pick.familyFriendly) {
    return "Funkar med barnen — nära, hanterbart och utan tung planering.";
  }
  if (mode === "gratis-ikvall") {
    return "Det händer nu, kostar inget och kräver nästan ingen planering.";
  }
  if (mode === "under-150") {
    return pick.isFree
      ? "Gratis är tryggt under budget — resten av kvällen får vara spontan."
      : "Det håller sig inom din budget och går att bestämma nära inpå.";
  }
  if (mode === "i-helgen") return "Ett konkret helgval, utan en lång lista att sålla.";
  if (mode === "tva-timmar") return "Tillräckligt kort för att faktiskt bli av idag.";
  if (mode === "ga-sjalv") {
    return "Ett format där det känns naturligt att komma själv och gå rakt in i upplevelsen.";
  }
  if (mode === "socialt") {
    return "Här finns naturliga öppningar för samtal, deltagande eller gemensam energi.";
  }

  if (pick.bucket === "wildcard") {
    return `Ett rent wildcard — förmodligen inget du sökt efter själv. Just därför väljer STADEN ${pick.categoryLabel.toLocaleLowerCase(
      "sv-SE",
    )} åt dig.`;
  }

  const intentLabel = discoveryIntents.find((item) => item.id === intent)?.label;
  if (intentLabel) {
    return `${intentLabel} utan att välja kategori först — ett litet steg utanför rutinen.`;
  }

  return `Du hade kanske inte sökt efter ${pick.categoryLabel.toLocaleLowerCase(
    "sv-SE",
  )} själv. Just därför väljer STADEN det här åt dig.`;
}
