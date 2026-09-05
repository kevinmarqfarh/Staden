export type HighlightWindow = {
  highlightFrom?: string;
  highlightUntil?: string;
};

const GOTHENBURG_TIME_ZONE = "Europe/Stockholm";
const clockFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: GOTHENBURG_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function clockPart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) {
  return parts.find((part) => part.type === type)?.value ?? "";
}

export function getGothenburgHighlightSnapshot(now = new Date()) {
  const parts = clockFormatter.formatToParts(now);
  const year = clockPart(parts, "year");
  const month = clockPart(parts, "month");
  const day = clockPart(parts, "day");
  const hour = Number(clockPart(parts, "hour"));
  const minute = clockPart(parts, "minute");
  const slot = hour < 12 ? 0 : 1;

  // Clock-sensitive filters refresh each minute; rotation still uses only the
  // date and half-day slot, so the page does not reshuffle while being read.
  return `${year}-${month}-${day}|${slot}|${String(hour).padStart(2, "0")}:${minute}`;
}

export function dateKeyFromHighlightSnapshot(snapshot: string) {
  return snapshot.split("|")[0] ?? snapshot;
}

export function minuteFromHighlightSnapshot(snapshot: string): number | null {
  const time = snapshot.split("|")[2];
  const match = time?.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
}

export type TimedEvent = {
  startDate: string;
  endDate?: string;
  isOngoing?: boolean;
  time?: string;
  durationMinutes?: number;
};

/** Use the upper end of a duration range; never mistake a lower bound for a cap. */
export function parseDurationMinutes(label: string): number | null {
  const match = label.trim().match(
    /^(?:(?:ca|cirka)\.?\s*)?(\d+(?:[.,]\d+)?)(?:\s*[–-]\s*(\d+(?:[.,]\d+)?))?\s*(tim(?:me|mar)?|h|min(?:ut(?:er)?)?)(?:\s+(\d+)\s*min(?:uter)?)?(?:\s+inkl\.?\s+paus)?$/i,
  );
  if (!match) return null;
  const value = Number((match[2] ?? match[1]).replace(",", "."));
  const minutes = /^min/i.test(match[3])
    ? value
    : value * 60 + Number(match[4] ?? 0);
  return minutes > 0 && Number.isFinite(minutes) ? Math.ceil(minutes) : null;
}

/**
 * Only interpret a single, dated occurrence. A run of performances or opening
 * hours with weekdays is not evidence that an event happens every day.
 */
export function getEventTimeWindow(event: TimedEvent) {
  if (event.endDate && event.endDate !== event.startDate) return null;
  if (event.isOngoing || !event.time) return null;
  const parts = event.time.trim().split(/\s*·\s*/);
  if (parts.length > 2) return null;
  const match = parts[0].match(
    /^(?:samling\s+)?([01]?\d|2[0-3])[:.]([0-5]\d)(?:\s*[–-]\s*(?:(?:ca|cirka)\.?\s*)?([01]?\d|2[0-4])[:.]([0-5]\d))?$/i,
  );
  if (!match || (match[3] === "24" && match[4] !== "00")) return null;
  const startMinutes = Number(match[1]) * 60 + Number(match[2]);
  let duration = event.durationMinutes && Number.isFinite(event.durationMinutes) && event.durationMinutes > 0
    ? event.durationMinutes
    : parts[1] ? parseDurationMinutes(parts[1]) : null;
  let endMinutes: number | null = null;
  if (match[3] !== undefined) {
    endMinutes = Number(match[3]) * 60 + Number(match[4]);
    if (endMinutes < startMinutes) endMinutes += 24 * 60;
    if (endMinutes === startMinutes) return null;
    duration = endMinutes - startMinutes;
  } else if (duration) {
    endMinutes = startMinutes + duration;
  }
  if (parts[1] && parseDurationMinutes(parts[1]) === null) return null;
  return { startMinutes, endMinutes, durationMinutes: duration };
}

export function getEventDurationMinutes(event: TimedEvent): number | null {
  if (event.durationMinutes && Number.isFinite(event.durationMinutes) && event.durationMinutes > 0) return event.durationMinutes;
  const window = getEventTimeWindow(event);
  if (window?.durationMinutes) return window.durationMinutes;
  const duration = event.time?.split(/\s*·\s*/).at(-1);
  return duration ? parseDurationMinutes(duration) : null;
}

export function isEventHappeningNow(event: TimedEvent, snapshot: string) {
  const window = getEventTimeWindow(event);
  const now = minuteFromHighlightSnapshot(snapshot);
  if (!window || now === null || window.endMinutes === null) return false;
  const today = dateKeyFromHighlightSnapshot(snapshot);
  const elapsed = daysBetweenDateKeys(event.startDate, today) * 1440 + now;
  return elapsed >= window.startMinutes && elapsed < window.endMinutes;
}

export function isEventStartingSoon(event: TimedEvent, snapshot: string, withinMinutes = 120) {
  const window = getEventTimeWindow(event);
  const now = minuteFromHighlightSnapshot(snapshot);
  if (!window || now === null || withinMinutes < 0) return false;
  const today = dateKeyFromHighlightSnapshot(snapshot);
  const untilStart = daysBetweenDateKeys(today, event.startDate) * 1440 + window.startMinutes - now;
  return untilStart >= 0 && untilStart <= withinMinutes;
}

export function hasEventNotEnded(
  event: TimedEvent,
  snapshot: string,
) {
  const today = dateKeyFromHighlightSnapshot(snapshot);
  const now = minuteFromHighlightSnapshot(snapshot);
  const window = getEventTimeWindow(event);
  if (window?.endMinutes !== null && window?.endMinutes !== undefined && now !== null) {
    const elapsed = daysBetweenDateKeys(event.startDate, today) * 1440 + now;
    return elapsed < window.endMinutes;
  }
  if (event.isOngoing && !event.endDate) return true;
  return (event.endDate ?? event.startDate) >= today;
}

export function isEventActiveOnDate(
  event: TimedEvent,
  today: string,
) {
  const date = dateKeyFromHighlightSnapshot(today);
  return event.startDate <= date && hasEventNotEnded(event, today);
}

export function isHighlightWindowActive(
  item: HighlightWindow,
  today: string,
) {
  const hasStarted = !item.highlightFrom || item.highlightFrom <= today;
  const hasNotEnded = !item.highlightUntil || item.highlightUntil >= today;

  return hasStarted && hasNotEnded;
}

function rotationSlot(snapshot: string) {
  const [dateKey, period = "0"] = snapshot.split("|");
  const [year, month, day] = dateKey.split("-").map(Number);
  const dayNumber = Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);

  return dayNumber * 2 + Number(period);
}

export function rotateHighlights<T>(
  items: readonly T[],
  snapshot: string,
  limit = items.length,
) {
  if (items.length === 0 || limit <= 0) return [];

  const visibleCount = Math.min(limit, items.length);
  const offset = rotationSlot(snapshot) % items.length;

  return Array.from(
    { length: visibleCount },
    (_, index) => items[(offset + index) % items.length],
  );
}

export function addDaysToDateKey(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));

  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

export function daysBetweenDateKeys(from: string, to: string) {
  const toUtcDay = (dateKey: string) => {
    const [year, month, day] = dateKey.split("-").map(Number);
    return Date.UTC(year, month - 1, day);
  };

  return Math.ceil((toUtcDay(to) - toUtcDay(from)) / 86_400_000);
}
