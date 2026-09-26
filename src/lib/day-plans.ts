export type PlanKind = "culture" | "entertainment" | "food";
export type DayStop = { id: string; label: string; kind?: PlanKind; objectId?: string; time: string; note: string };
export type DayPlan = { id: string; name: string; date: string; stops: DayStop[] };
export const DAY_PLANS_KEY = "staden:day-plans:v1";
export const DAY_PLANS_CHANGED = "staden:day-plans-changed";
export const MAX_DAYS = 30;
export const MAX_STOPS = 12;
export function isPlanDateEligible(item: { kind: PlanKind; start?: string; end?: string; ongoing?: boolean }, date: string) {
  if (!date || item.kind !== "culture") return true;
  if (!validPlanDate(date) || !item.start || !validPlanDate(item.start)) return false;
  if (item.start > date) return false;
  if (item.end) return validPlanDate(item.end) && date <= item.end;
  return item.ongoing === true || date === item.start;
}
const text = (value: unknown, max: number) => typeof value === "string" ? value.slice(0, max) : "";
export function validPlanDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}
export function parseDayPlans(raw: string): DayPlan[] {
  if (raw.length > 500_000) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const ids = new Set<string>();
    return data.slice(0, MAX_DAYS).flatMap((day) => {
      if (!day || typeof day !== "object" || typeof day.id !== "string" || !day.id || ids.has(day.id) || !Array.isArray(day.stops)) return [];
      ids.add(day.id);
      const stopIds = new Set<string>();
      const stops = day.stops.slice(0, MAX_STOPS).flatMap((stop: unknown): DayStop[] => {
        if (!stop || typeof stop !== "object") return [];
        const s = stop as Record<string, unknown>;
        if (typeof s.id !== "string" || !s.id || stopIds.has(s.id)) return [];
        stopIds.add(s.id);
        const kind = s.kind === "culture" || s.kind === "food" || s.kind === "entertainment" ? s.kind : undefined;
        return [{ id: text(s.id, 80), label: text(s.label, 40) || "Egen tid", kind, objectId: kind ? text(s.objectId, 180) : undefined, time: typeof s.time === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(s.time) ? s.time : "", note: text(s.note, 500) }];
      });
      return [{ id: text(day.id, 80), name: text(day.name, 80) || "Min dag", date: typeof day.date === "string" && validPlanDate(day.date) ? day.date : "", stops }];
    });
  } catch { return []; }
}
export function createDayPlan(name: string, date: string): DayPlan {
  return { id: crypto.randomUUID(), name: name.trim().slice(0, 80) || "Min dag", date: validPlanDate(date) ? date : "", stops: ["Förmiddag", "Lunch", "Eftermiddag"].map(label => createDayStop(label)) };
}
export function createDayStop(label: string): DayStop { return { id: crypto.randomUUID(), label, time: "", note: "" }; }
export function getDayPlansSnapshot() {
  try { return window.localStorage.getItem(DAY_PLANS_KEY) || "[]"; } catch { return "[]"; }
}
export function subscribeDayPlans(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(DAY_PLANS_CHANGED, listener);
  return () => { window.removeEventListener("storage", listener); window.removeEventListener(DAY_PLANS_CHANGED, listener); };
}
export function writeDayPlans(plans: DayPlan[]) {
  try {
    window.localStorage.setItem(DAY_PLANS_KEY, JSON.stringify(plans));
    window.dispatchEvent(new Event(DAY_PLANS_CHANGED));
    return true;
  } catch { return false; }
}
