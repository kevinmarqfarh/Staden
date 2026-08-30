import { entertainmentExperiences } from "@/data/entertainment";

export const SAVED_ENTERTAINMENT_KEY = "staden:saved-entertainment";
export const SAVED_ENTERTAINMENT_CHANGED =
  "staden:saved-entertainment-changed";
export const EMPTY_SAVED_ENTERTAINMENT = "[]";

const MAX_SAVED_ENTERTAINMENT = 200;
const MAX_RAW_SNAPSHOT_LENGTH = 100_000;
const validEntertainmentIds = new Set(
  entertainmentExperiences.map((experience) => experience.id),
);

export function subscribeToSavedEntertainment(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(SAVED_ENTERTAINMENT_CHANGED, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(SAVED_ENTERTAINMENT_CHANGED, onStoreChange);
  };
}

export function getSavedEntertainmentSnapshot() {
  try {
    return (
      window.localStorage.getItem(SAVED_ENTERTAINMENT_KEY) ??
      EMPTY_SAVED_ENTERTAINMENT
    );
  } catch {
    return EMPTY_SAVED_ENTERTAINMENT;
  }
}

export function getServerSavedEntertainmentSnapshot() {
  return EMPTY_SAVED_ENTERTAINMENT;
}

export function parseSavedEntertainmentIds(snapshot: string) {
  if (snapshot.length > MAX_RAW_SNAPSHOT_LENGTH) return [];

  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (!Array.isArray(parsed)) return [];

    return Array.from(
      new Set(
        parsed.filter(
          (id): id is string =>
            typeof id === "string" && validEntertainmentIds.has(id),
        ),
      ),
    ).slice(0, MAX_SAVED_ENTERTAINMENT);
  } catch {
    return [];
  }
}

export function writeSavedEntertainmentIds(ids: string[]) {
  try {
    window.localStorage.setItem(
      SAVED_ENTERTAINMENT_KEY,
      JSON.stringify(ids.slice(0, MAX_SAVED_ENTERTAINMENT)),
    );
    window.dispatchEvent(new Event(SAVED_ENTERTAINMENT_CHANGED));
    return true;
  } catch {
    return false;
  }
}
