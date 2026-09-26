import assert from "node:assert/strict";
import test from "node:test";
import { createDayPlan, isPlanDateEligible, parseDayPlans, validPlanDate, MAX_DAYS, MAX_STOPS } from "../src/lib/day-plans.ts";

test("ongoing culture still respects explicit start and end dates", () => {
  assert.equal(isPlanDateEligible({ kind: "culture", ongoing: true, start: "2026-09-01", end: "2026-09-20" }, "2026-09-22"), false);
  assert.equal(isPlanDateEligible({ kind: "culture", ongoing: true, start: "2026-09-25" }, "2026-09-22"), false);
  assert.equal(isPlanDateEligible({ kind: "culture", ongoing: true, start: "2026-09-01", end: "2026-09-22" }, "2026-09-22"), true);
  assert.equal(isPlanDateEligible({ kind: "culture", ongoing: true, start: "2026-09-01" }, "2026-09-22"), true);
});
test("single events only match their day; undated plans do not filter", () => {
  const item = { kind: "culture", start: "2026-09-22" };
  assert.equal(isPlanDateEligible(item, "2026-09-22"), true);
  assert.equal(isPlanDateEligible(item, "2026-09-23"), false);
  assert.equal(isPlanDateEligible(item, ""), true);
  assert.equal(isPlanDateEligible({ kind: "culture", ongoing: true }, "2026-09-22"), false);
  assert.equal(isPlanDateEligible({ kind: "food" }, "2026-09-22"), true);
});

test("day creation keeps dates optional and creates independent ordered stops", () => {
  const day = createDayPlan("  Lördag med barnen  ", "");
  assert.equal(day.name, "Lördag med barnen");
  assert.equal(day.date, "");
  assert.deepEqual(day.stops.map(s => s.label), ["Förmiddag", "Lunch", "Eftermiddag"]);
  assert.equal(new Set(day.stops.map(s => s.id)).size, 3);
  assert.equal(JSON.stringify(parseDayPlans(JSON.stringify([day]))), JSON.stringify([day]));
});
test("malformed storage does not crash the planner", () => {
  for (const raw of ["{broken", "null", "{}", '[null,3,"text"]', " ".repeat(500_001)]) assert.deepEqual(parseDayPlans(raw), []);
});
test("storage ignores duplicate days and sanitizes invalid stop fields", () => {
  const day = { id: "day", name: "a".repeat(100), date: "2026-02-30", stops: [{ id: "stop", label: "Lunch", kind: "javascript", objectId: "bad", time: "25:99", note: "x".repeat(1000) }, { id: "stop" }] };
  const [parsed] = parseDayPlans(JSON.stringify([day, day]));
  assert.equal(parseDayPlans(JSON.stringify([day, day])).length, 1);
  assert.equal(parsed.name.length, 80);
  assert.equal(parsed.date, "");
  assert.equal(parsed.stops.length, 1);
  assert.equal(parsed.stops[0].kind, undefined);
  assert.equal(parsed.stops[0].objectId, undefined);
  assert.equal(parsed.stops[0].time, "");
  assert.equal(parsed.stops[0].note.length, 500);
});
test("storage bounds large collections and validates leap dates", () => {
  const many = Array.from({ length: 40 }, (_, i) => ({ id: String(i), name: "Day", date: "", stops: Array.from({ length: 20 }, (_, n) => ({ id: String(n), label: "Lunch", time: "12:30", note: "" })) }));
  const parsed = parseDayPlans(JSON.stringify(many));
  assert.equal(parsed.length, MAX_DAYS);
  assert.equal(parsed[0].stops.length, MAX_STOPS);
  assert.equal(validPlanDate("2028-02-29"), true);
  assert.equal(validPlanDate("2026-02-29"), false);
});
