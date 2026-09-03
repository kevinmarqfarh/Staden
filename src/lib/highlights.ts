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
  const slot = hour < 12 ? 0 : 1;

  return `${year}-${month}-${day}|${slot}`;
}

export function dateKeyFromHighlightSnapshot(snapshot: string) {
  return snapshot.split("|")[0] ?? snapshot;
}

export function hasEventNotEnded(
  event: {
    startDate: string;
    endDate?: string;
    isOngoing?: boolean;
  },
  today: string,
) {
  if (event.isOngoing && !event.endDate) return true;
  return (event.endDate ?? event.startDate) >= today;
}

export function isEventActiveOnDate(
  event: {
    startDate: string;
    endDate?: string;
    isOngoing?: boolean;
  },
  today: string,
) {
  return event.startDate <= today && hasEventNotEnded(event, today);
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
