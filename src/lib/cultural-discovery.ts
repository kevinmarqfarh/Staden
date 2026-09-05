import type { CulturalDiscoveryIntent, CulturalEvent } from "@/data/cultural-events";
import {
  buildDiscoveryOrder,
  pickDiscovery,
  type DiscoveryMode,
} from "@/lib/discovery-engine";

// Keep the older culture-only API on the same eligibility rules as the
// cross-domain engine. Budget and time constraints must not drift apart.
export { discoveryIntents, discoveryModes } from "@/lib/discovery-engine";
export type { DiscoveryMode } from "@/lib/discovery-engine";

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
  const order = buildDiscoveryOrder({
    cultureEvents: events,
    entertainment: [],
    snapshot,
    intent,
    mode,
  });
  const pick = pickDiscovery(order, skipIds.map((id) => `kultur:${id}`));
  return pick ? events.find((event) => event.id === pick.id) ?? null : null;
}

export function recommendationReason(
  event: CulturalEvent,
  intent: CulturalDiscoveryIntent | null,
  mode: DiscoveryMode | null,
) {
  if (mode === "gratis-ikvall") {
    return "Ett gratis evenemang med start ikväll. Kontrollera om du behöver boka plats.";
  }
  if (mode === "under-150") {
    return event.isFree
      ? "Ett gratis val inom din budget."
      : "Det angivna priset är under 150 kr. Kontrollera aktuellt pris och eventuella bokningsavgifter.";
  }
  if (mode === "i-helgen") return "Ett konkret helgval, utan en lång lista att sålla.";
  if (mode === "tva-timmar") {
    return "Start och angiven längd ryms inom de närmaste två timmarna. Räkna även med restid.";
  }
  if (mode === "ga-sjalv") return "En upplevelse att utforska på egen hand.";
  if (mode === "socialt") return "Ett förslag med utrymme för gemensamma upplevelser.";
  if (intent) return "En ny upplevelse utifrån det du vill känna.";
  return `Upptäck ${event.category.toLocaleLowerCase("sv-SE")} utanför din vanliga rutin.`;
}
