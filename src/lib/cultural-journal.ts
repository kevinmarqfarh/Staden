import type { CulturalDiscoveryIntent } from "@/data/cultural-events";

/**
 * KULTURELL LOGGBOK
 *
 * En liten, lokal loggbok över upplevelser du faktiskt varit på. Den fångar
 * inte "Kevin gillar balett" utan vad upplevelsen *väckte* — förundran,
 * nyfikenhet, känsla, energi, kreativitet, social kontakt. Ur den härleds en
 * affinitet per discovery-intent som gör att STADEN lär sig tillstånd, inte
 * taxonomi. Allt ligger i localStorage och lämnar aldrig enheten.
 */

export const CULTURAL_JOURNAL_KEY = "staden:cultural-journal";
export const CULTURAL_JOURNAL_CHANGED = "staden:cultural-journal-changed";
export const EMPTY_JOURNAL = "[]";

const MAX_ENTRIES = 500;
const MAX_RAW_SNAPSHOT_LENGTH = 400_000;
const MAX_NOTE_LENGTH = 400;

export type JournalKind = "kultur" | "noje";

export type JournalEvocation =
  | "fortrollad"
  | "nyfiken"
  | "berord"
  | "energi"
  | "kreativ"
  | "social"
  | "inte-min-grej";

export const journalEvocations: Array<{
  id: JournalEvocation;
  label: string;
}> = [
  { id: "fortrollad", label: "Förtrollad" },
  { id: "nyfiken", label: "Nyfiken" },
  { id: "berord", label: "Berörd" },
  { id: "energi", label: "Energi" },
  { id: "kreativ", label: "Kreativ" },
  { id: "social", label: "Social" },
  { id: "inte-min-grej", label: "Inte min grej" },
];

const validEvocations = new Set<JournalEvocation>(
  journalEvocations.map((item) => item.id),
);

export type JournalEntry = {
  id: string;
  kind: JournalKind;
  title: string;
  category?: string;
  rating: number;
  evocations: JournalEvocation[];
  note?: string;
  ts: number;
};

export function journalEntryKey(id: string, kind: JournalKind) {
  return `${kind}:${id}`;
}

export function subscribeToJournal(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CULTURAL_JOURNAL_CHANGED, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CULTURAL_JOURNAL_CHANGED, onStoreChange);
  };
}

export function getJournalSnapshot() {
  try {
    return window.localStorage.getItem(CULTURAL_JOURNAL_KEY) ?? EMPTY_JOURNAL;
  } catch {
    return EMPTY_JOURNAL;
  }
}

export function getServerJournalSnapshot() {
  return EMPTY_JOURNAL;
}

function isJournalKind(value: unknown): value is JournalKind {
  return value === "kultur" || value === "noje";
}

export function parseJournal(snapshot: string): JournalEntry[] {
  if (snapshot.length > MAX_RAW_SNAPSHOT_LENGTH) return [];

  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (!Array.isArray(parsed)) return [];

    const seen = new Set<string>();
    const entries: JournalEntry[] = [];

    for (const raw of parsed) {
      if (!raw || typeof raw !== "object") continue;
      const candidate = raw as Record<string, unknown>;
      if (typeof candidate.id !== "string") continue;
      if (!isJournalKind(candidate.kind)) continue;
      if (typeof candidate.title !== "string") continue;

      const key = journalEntryKey(candidate.id, candidate.kind);
      if (seen.has(key)) continue;

      const rating =
        typeof candidate.rating === "number" &&
        Number.isFinite(candidate.rating)
          ? Math.min(5, Math.max(1, Math.round(candidate.rating)))
          : 3;

      const evocations = Array.isArray(candidate.evocations)
        ? Array.from(
            new Set(
              candidate.evocations.filter(
                (value): value is JournalEvocation =>
                  typeof value === "string" &&
                  validEvocations.has(value as JournalEvocation),
              ),
            ),
          )
        : [];

      const note =
        typeof candidate.note === "string"
          ? candidate.note.slice(0, MAX_NOTE_LENGTH)
          : undefined;

      const ts =
        typeof candidate.ts === "number" && Number.isFinite(candidate.ts)
          ? candidate.ts
          : Date.now();

      seen.add(key);
      entries.push({
        id: candidate.id,
        kind: candidate.kind,
        title: candidate.title.slice(0, 200),
        category:
          typeof candidate.category === "string"
            ? candidate.category.slice(0, 60)
            : undefined,
        rating,
        evocations,
        note: note && note.length > 0 ? note : undefined,
        ts,
      });
    }

    return entries.sort((left, right) => right.ts - left.ts).slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

export function writeJournal(entries: JournalEntry[]) {
  try {
    window.localStorage.setItem(
      CULTURAL_JOURNAL_KEY,
      JSON.stringify(entries.slice(0, MAX_ENTRIES)),
    );
    window.dispatchEvent(new Event(CULTURAL_JOURNAL_CHANGED));
    return true;
  } catch {
    return false;
  }
}

export function upsertJournalEntry(entry: JournalEntry) {
  const current = parseJournal(getJournalSnapshot());
  const key = journalEntryKey(entry.id, entry.kind);
  const next = [
    entry,
    ...current.filter(
      (item) => journalEntryKey(item.id, item.kind) !== key,
    ),
  ];
  return writeJournal(next);
}

export function removeJournalEntry(id: string, kind: JournalKind) {
  const current = parseJournal(getJournalSnapshot());
  const key = journalEntryKey(id, kind);
  return writeJournal(
    current.filter((item) => journalEntryKey(item.id, item.kind) !== key),
  );
}

const EVOCATION_INTENT: Record<
  JournalEvocation,
  CulturalDiscoveryIntent | null
> = {
  fortrollad: "fortrollad",
  nyfiken: "nyfiken",
  berord: "berord",
  energi: "energi",
  kreativ: "inspirerad",
  social: "social",
  "inte-min-grej": null,
};

export type IntentAffinities = Partial<Record<CulturalDiscoveryIntent, number>>;

/**
 * Rating-viktad affinitet per intent. Ett högt betyg på något som väckte
 * förundran drar upp "fortrollad"; "Inte min grej" drar ned de intents
 * upplevelsen annars representerade. Resultatet används som en mjuk knuff i
 * rekommendationsmotorn — aldrig ett hårt filter.
 */
export function deriveJournalAffinities(
  entries: readonly JournalEntry[],
): IntentAffinities {
  const scores: IntentAffinities = {};
  const add = (intent: CulturalDiscoveryIntent, delta: number) => {
    scores[intent] = (scores[intent] ?? 0) + delta;
  };

  for (const entry of entries) {
    const weight = entry.rating - 3; // -2..2
    const disliked = entry.evocations.includes("inte-min-grej");

    for (const evocation of entry.evocations) {
      const intent = EVOCATION_INTENT[evocation];
      if (!intent) continue;
      add(intent, weight);
    }

    if (disliked) {
      for (const evocation of entry.evocations) {
        const intent = EVOCATION_INTENT[evocation];
        if (intent) add(intent, -1);
      }
    }
  }

  return scores;
}

export function journalEvocationLabel(id: JournalEvocation) {
  return journalEvocations.find((item) => item.id === id)?.label ?? id;
}
