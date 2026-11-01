import { OBJEKT } from "@/data/goteborg";
import type { CulturalEvent } from "@/data/cultural-events";
import { dateKeyFromHighlightSnapshot, hasEventNotEnded } from "@/lib/highlights";

export const places = OBJEKT.filter(item => item.slag === "plats" && item.sal === "kultur");
const normalize = (name: string) => name.normalize("NFC").trim().replace(/\s+/g, " ").toLocaleLowerCase("sv-SE");
const byName = new Map<string, typeof places[number]>();
for (const place of places) {
  for (const alias of [place.titel, place.platsNamn].filter(Boolean) as string[]) byName.set(normalize(alias), place);
}

/** Match a registered name, optionally followed by a comma and room/address.
 * Never match a substring (e.g. a different museum with a similar name). */
export function findPlace(name: string) {
  return byName.get(normalize(name)) ?? byName.get(normalize(name.split(",")[0]));
}
export function placeForEvent(event: CulturalEvent) {
  return places.find(place => event.id === `museum-directory-${place.id}` || event.id === `kulturhus-directory-${place.id}`) ?? findPlace(event.venue);
}
export function placeProgramme(placeId: string, events: readonly CulturalEvent[], snapshot: string) {
  const today = dateKeyFromHighlightSnapshot(snapshot);
  const eligible = events.filter(event => event.dateLabel !== "Permanent" && placeForEvent(event)?.id === placeId && hasEventNotEnded(event, snapshot))
    .toSorted((a, b) => a.startDate.localeCompare(b.startDate) || (a.time ?? "").localeCompare(b.time ?? "") || a.id.localeCompare(b.id));
  return {
    upcoming: eligible.filter(event => event.startDate >= today),
    ongoing: eligible.filter(event => event.startDate < today),
  };
}
