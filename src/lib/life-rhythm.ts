/**
 * LIVSRYTM — barnvecka eller barnfri vecka.
 *
 * Ingen kalenderintegration. Bara ett litet, lokalt läge som låter STADEN
 * lösa ett verkligt livsproblem istället för ett informationsproblem: en
 * barnvecka vill ha nära, korta och familjevänliga val; en barnfri vecka
 * tål wildcard, sena scener och det sociala. Ligger i localStorage.
 */

export const LIFE_RHYTHM_KEY = "staden:life-rhythm";
export const LIFE_RHYTHM_CHANGED = "staden:life-rhythm-changed";

export type LifeRhythm = "barnvecka" | "barnfri";

export const lifeRhythmOptions: Array<{ id: LifeRhythm; label: string }> = [
  { id: "barnvecka", label: "Barnvecka" },
  { id: "barnfri", label: "Barnfri vecka" },
];

export function subscribeToLifeRhythm(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(LIFE_RHYTHM_CHANGED, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(LIFE_RHYTHM_CHANGED, onStoreChange);
  };
}

export function getLifeRhythmSnapshot() {
  try {
    return window.localStorage.getItem(LIFE_RHYTHM_KEY) ?? "";
  } catch {
    return "";
  }
}

export function getServerLifeRhythmSnapshot() {
  return "";
}

export function parseLifeRhythm(snapshot: string): LifeRhythm | null {
  return snapshot === "barnvecka" || snapshot === "barnfri" ? snapshot : null;
}

export function writeLifeRhythm(value: LifeRhythm | null) {
  try {
    if (value) {
      window.localStorage.setItem(LIFE_RHYTHM_KEY, value);
    } else {
      window.localStorage.removeItem(LIFE_RHYTHM_KEY);
    }
    window.dispatchEvent(new Event(LIFE_RHYTHM_CHANGED));
    return true;
  } catch {
    return false;
  }
}
