import type {
  CulturalDiscoveryIntent,
  CulturalEvent,
  CulturalEventCategory,
} from "@/data/cultural-events";
import {
  addDaysToDateKey,
  dateKeyFromHighlightSnapshot,
  hasEventNotEnded,
  isEventActiveOnDate,
  rotateHighlights,
} from "@/lib/highlights";

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

export const discoveryModes: Array<{
  id: DiscoveryMode;
  label: string;
}> = [
  { id: "gratis-ikvall", label: "Gratis ikväll" },
  { id: "under-150", label: "Under 150 kr" },
  { id: "i-helgen", label: "I helgen" },
  { id: "tva-timmar", label: "Jag har två timmar" },
  { id: "ga-sjalv", label: "Bra att gå själv" },
  { id: "socialt", label: "Socialt" },
];

const categoryIntents: Record<
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

const soloFriendlyCategories = new Set<CulturalEventCategory>([
  "Konst",
  "Museum",
  "Film",
  "Litteratur",
  "Samtal",
  "Musik",
  "Scenkonst",
]);
const EVENT_TIME_PATTERN = /\b([01]?\d|2[0-3])[:.]([0-5]\d)\b/g;

function hasEveningTime(event: CulturalEvent) {
  const times = event.time?.matchAll(EVENT_TIME_PATTERN);
  if (!times) return false;

  return Array.from(times).some((match) => Number(match[1]) >= 16);
}

function eventDurationMinutes(event: CulturalEvent) {
  if (event.durationMinutes) return event.durationMinutes;

  const timeRange = event.time?.match(
    /(\d{1,2}):([0-5]\d)\s*[–-]\s*(\d{1,2}):([0-5]\d)/,
  );
  if (timeRange) {
    const [, startHour, startMinute, endHour, endMinute] = timeRange;
    const start = Number(startHour) * 60 + Number(startMinute);
    let end = Number(endHour) * 60 + Number(endMinute);
    if (end < start) end += 24 * 60;
    return end - start;
  }

  if (["Samtal", "Litteratur", "Film"].includes(event.category)) return 120;
  return null;
}

function socialIntensity(event: CulturalEvent) {
  if (event.socialIntensity) return event.socialIntensity;
  if (["Festival", "Skapande"].includes(event.category)) return "high";
  if (["Musik", "Kulturhus", "Samtal"].includes(event.category)) {
    return "medium";
  }
  return "low";
}

function weekendRange(today: string) {
  const [year, month, day] = today.split("-").map(Number);
  const dayOfWeek = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const daysToSaturday = dayOfWeek === 0 ? -1 : (6 - dayOfWeek + 7) % 7;
  const saturday = addDaysToDateKey(today, daysToSaturday);

  return {
    saturday,
    sunday: addDaysToDateKey(saturday, 1),
  };
}

function eventOverlapsRange(event: CulturalEvent, from: string, until: string) {
  const eventEnd = event.endDate ?? event.startDate;
  return event.startDate <= until && eventEnd >= from;
}

function eventMatchesMode(
  event: CulturalEvent,
  mode: DiscoveryMode | null,
  today: string,
) {
  if (!mode || mode === "overraska") return true;

  if (mode === "gratis-ikvall") {
    return (
      Boolean(event.isFree) &&
      isEventActiveOnDate(event, today) &&
      hasEveningTime(event) &&
      (event.startDate === today ||
        event.endDate === today ||
        event.category === "Festival")
    );
  }

  if (mode === "under-150") {
    return Boolean(event.isFree || (event.priceMaxSek && event.priceMaxSek <= 150));
  }

  if (mode === "i-helgen") {
    const { saturday, sunday } = weekendRange(today);
    return eventOverlapsRange(event, saturday, sunday);
  }

  if (mode === "tva-timmar") {
    const duration = eventDurationMinutes(event);
    return duration !== null && duration <= 120;
  }

  if (mode === "ga-sjalv") {
    return event.soloFriendly ?? soloFriendlyCategories.has(event.category);
  }

  return socialIntensity(event) !== "low";
}

function eventMatchesIntent(
  event: CulturalEvent,
  intent: CulturalDiscoveryIntent | null,
) {
  if (!intent) return true;
  return (event.discoveryIntents ?? categoryIntents[event.category]).includes(intent);
}

export function getDiscoveryRecommendation({
  events,
  snapshot,
  intent,
  mode,
  skipIds = [],
}: {
  events: readonly CulturalEvent[];
  snapshot: string;
  intent: CulturalDiscoveryIntent | null;
  mode: DiscoveryMode | null;
  skipIds?: readonly string[];
}) {
  const today = dateKeyFromHighlightSnapshot(snapshot);
  const horizon = addDaysToDateKey(today, 30);
  const skipped = new Set(skipIds);
  const currentPool = events.filter(
    (event) =>
      !skipped.has(event.id) &&
      hasEventNotEnded(event, today) &&
      event.startDate <= horizon &&
      event.dateLabel !== "Permanent" &&
      !(event.isOngoing && !event.endDate),
  );
  const strictMatches = currentPool.filter(
    (event) =>
      eventMatchesIntent(event, intent) && eventMatchesMode(event, mode, today),
  );
  const modeFallback = currentPool.filter((event) =>
    eventMatchesMode(event, mode, today),
  );
  const pool = strictMatches.length
    ? strictMatches
    : mode
      ? modeFallback
      : currentPool;
  const currentFirst = [...pool].sort((left, right) => {
    const activeDifference =
      Number(isEventActiveOnDate(right, today)) -
      Number(isEventActiveOnDate(left, today));
    const freeDifference = Number(Boolean(right.isFree)) - Number(Boolean(left.isFree));

    return (
      activeDifference ||
      left.startDate.localeCompare(right.startDate) ||
      freeDifference ||
      left.title.localeCompare(right.title, "sv-SE")
    );
  });

  return rotateHighlights(currentFirst.slice(0, 18), snapshot, 1)[0] ?? null;
}

export function recommendationReason(
  event: CulturalEvent,
  intent: CulturalDiscoveryIntent | null,
  mode: DiscoveryMode | null,
) {
  if (mode === "gratis-ikvall") {
    return "Det händer nu, kostar inget och kräver nästan ingen planering.";
  }
  if (mode === "under-150") {
    return event.isFree
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

  const intentLabel = discoveryIntents.find((item) => item.id === intent)?.label;
  if (intentLabel) {
    return `${intentLabel} utan att välja kategori först — ett litet steg utanför rutinen.`;
  }

  return `Du hade kanske inte sökt efter ${event.category.toLocaleLowerCase(
    "sv-SE",
  )} själv. Just därför väljer STADEN det här åt dig.`;
}
