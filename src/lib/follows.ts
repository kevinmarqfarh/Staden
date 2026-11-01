import type { CulturalEvent } from "@/data/cultural-events";
import { hasEventNotEnded } from "@/lib/highlights";
import { findPlace, places, placeProgramme } from "@/lib/places";

export type Follow = { name: string; placeId?: string; knownIds: string[] };
export const FOLLOWS_KEY = "staden:follows:v1";
const CHANGED = "staden:follows-changed";
export const placeKey = (name: string) => name.normalize("NFC").trim().replace(/\s+/g, " ").toLocaleLowerCase("sv-SE");

// Directory entries sometimes put the full street address in `venue`.
// Resolve that explicit alias; never use fuzzy/substring matches between venues.
export function createPlaceResolver(events: readonly CulturalEvent[]) {
  const aliases = new Map(events.filter(event => event.dateLabel === "Permanent").map(event => [placeKey(event.venue), event.title]));
  return (name: string) => findPlace(name)?.titel ?? aliases.get(placeKey(name)) ?? name;
}

export function parseFollows(raw: string): Follow[] {
  if (raw.length > 500_000) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    const seen = new Map<string, Follow>();
    return value.slice(0, 200).flatMap(item => {
      if (!item || typeof item.name !== "string" || !item.name.trim() || item.name.length > 200 || !Array.isArray(item.knownIds)) return [];
      const place = places.find(place => place.id === item.placeId) ?? findPlace(item.name);
      const name = place?.titel ?? item.name.trim();
      const key = place?.id ?? placeKey(name);
      const knownIds = item.knownIds.filter((id: unknown): id is string => typeof id === "string" && id.length <= 200);
      const existing = seen.get(key);
      if (existing) {
        existing.knownIds = [...new Set([...existing.knownIds, ...knownIds])].slice(0, 2000);
        return [];
      }
      const follow = { name, ...(place ? { placeId: place.id } : {}), knownIds: [...new Set<string>(knownIds)].slice(0, 2000) };
      seen.set(key, follow);
      return [follow];
    });
  } catch { return []; }
}

export function activitiesForPlace(name: string, events: readonly CulturalEvent[], snapshot: string) {
  const place = findPlace(name);
  if (place) {
    const programme = placeProgramme(place.id, events, snapshot);
    return [...programme.ongoing, ...programme.upcoming];
  }
  const resolve = createPlaceResolver(events);
  const key = placeKey(resolve(name));
  return events.filter(event => placeKey(resolve(event.venue)) === key && event.dateLabel !== "Permanent" && hasEventNotEnded(event, snapshot))
    .toSorted((a, b) => a.startDate.localeCompare(b.startDate) || a.id.localeCompare(b.id));
}

export function getFollowsSnapshot() {
  try { return window.localStorage.getItem(FOLLOWS_KEY) ?? "[]"; } catch { return "[]"; }
}
export function getServerFollowsSnapshot() { return "[]"; }
export function subscribeFollows(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(CHANGED, listener);
  return () => { window.removeEventListener("storage", listener); window.removeEventListener(CHANGED, listener); };
}
export function writeFollows(follows: Follow[]) {
  try {
    window.localStorage.setItem(FOLLOWS_KEY, JSON.stringify(parseFollows(JSON.stringify(follows))));
    window.dispatchEvent(new Event(CHANGED));
    return true;
  } catch { return false; }
}
