import assert from "node:assert/strict";
import test from "node:test";
import {
  getGothenburgHighlightSnapshot,
  getEventDurationMinutes,
  getEventTimeWindow,
  hasEventNotEnded,
  isEventHappeningNow,
  isEventStartingSoon,
  parseDurationMinutes,
  rotateHighlights,
} from "../src/lib/highlights.ts";
import {
  buildDiscoveryOrder,
  pickDiscovery,
  recommendationReason,
} from "../src/lib/discovery-engine.ts";
import { getDiscoveryRecommendation } from "../src/lib/cultural-discovery.ts";

function event(overrides = {}) {
  return {
    id: "concert",
    title: "En kväll i Göteborg",
    category: "Musik",
    dateLabel: "5 sep",
    startDate: "2026-09-05",
    time: "18:00–19:00",
    venue: "En scen",
    area: "Centrum",
    description: "En aktuell upplevelse.",
    sourceLabel: "Arrangören",
    sourceUrl: "https://example.com/event",
    ...overrides,
  };
}

function experience(overrides = {}) {
  return {
    id: "walk",
    title: "En promenad",
    subtitle: "Utforska staden",
    description: "En kort promenad.",
    category: "Kvarter & stadsliv",
    area: "Centrum",
    duration: "1–2 TIM",
    price: "GRATIS",
    setting: "UTE",
    season: "ÅRET RUNT",
    pace: "LUGNT",
    booking: "SPONTANT",
    audiences: ["singel", "barnfamilj"],
    url: "https://example.com/walk",
    sourceLabel: "Arrangören",
    free: true,
    ...overrides,
  };
}

function discover(overrides = {}) {
  return buildDiscoveryOrder({
    cultureEvents: [],
    entertainment: [],
    snapshot: "2026-09-05|1|17:00",
    intent: null,
    mode: null,
    ...overrides,
  });
}

test("the clock uses Stockholm dates and minutes across seasons and midnight", () => {
  assert.equal(getGothenburgHighlightSnapshot(new Date("2026-09-05T22:31:00Z")), "2026-09-06|0|00:31");
  assert.equal(getGothenburgHighlightSnapshot(new Date("2026-01-05T22:31:00Z")), "2026-01-05|1|23:31");
  assert.equal(getGothenburgHighlightSnapshot(new Date("2026-10-25T01:30:00Z")), "2026-10-25|0|02:30");
});

test("minute updates expire content without reshuffling half-day highlights", () => {
  const items = ["one", "two", "three"];
  assert.deepEqual(rotateHighlights(items, "2026-09-05|0|08:00"), rotateHighlights(items, "2026-09-05|0|11:59"));
  assert.notDeepEqual(rotateHighlights(items, "2026-09-05|0|11:59"), rotateHighlights(items, "2026-09-05|1|12:00"));
});

test("known event endings expire at the boundary, including overnight events", () => {
  assert.equal(hasEventNotEnded(event(), "2026-09-05|1|18:59"), true);
  assert.equal(hasEventNotEnded(event(), "2026-09-05|1|19:00"), false);
  const overnight = event({ time: "23:00–01:00" });
  assert.equal(hasEventNotEnded(overnight, "2026-09-06|0|00:30"), true);
  assert.equal(isEventHappeningNow(overnight, "2026-09-06|0|00:30"), true);
  assert.equal(hasEventNotEnded(overnight, "2026-09-06|0|01:00"), false);
  assert.equal(hasEventNotEnded(event({ time: undefined }), "2026-09-06"), false);
});

test("ongoing seasons and ambiguous schedules do not claim an occurrence now", () => {
  const season = event({ endDate: "2026-10-01", time: "19:00" });
  assert.equal(getEventTimeWindow(season), null);
  assert.equal(isEventHappeningNow(season, "2026-09-05|1|19:15"), false);
  assert.equal(getEventTimeWindow(event({ time: "Fre 18:00 · lör 15:00" })), null);
  assert.equal(getEventTimeWindow(event({ time: "Vernissage 29 aug 13:00–15:00 · därefter öppettider" })), null);
  assert.equal(getEventTimeWindow(event({ time: "19:00–24:30" })), null);
});

test("starting soon means a future start within the requested interval", () => {
  assert.equal(isEventStartingSoon(event(), "2026-09-05|1|17:00", 60), true);
  assert.equal(isEventStartingSoon(event(), "2026-09-05|1|18:01", 120), false);
  assert.equal(isEventStartingSoon(event({ startDate: "2026-09-06" }), "2026-09-05|1|17:00", 120), false);
  assert.equal(isEventStartingSoon(event(), "2026-09-05|1", 120), false);
});

test("duration parsing uses the upper bound and includes hour/minute combinations", () => {
  assert.equal(parseDurationMinutes("1–3 TIM"), 180);
  assert.equal(parseDurationMinutes("40–60 MIN"), 60);
  assert.equal(parseDurationMinutes("1 tim 30 min"), 90);
  assert.equal(parseDurationMinutes("ca 2 tim 5 min"), 125);
  assert.equal(parseDurationMinutes("1,5 timmar"), 90);
  assert.equal(parseDurationMinutes("FRÅN 1 TIM"), null);
  assert.equal(parseDurationMinutes("2+ TIM"), null);
  assert.equal(parseDurationMinutes("HALV–HELDAG"), null);
  assert.equal(getEventDurationMinutes(event({ time: "19:00–ca 20:30" })), 90);
  assert.equal(getEventDurationMinutes(event({ time: "19:00 · cirka 2 tim 40 min inkl. paus" })), 160);
  assert.equal(getEventDurationMinutes(event({ category: "Film", time: "19:00" })), null);
});

test("free tonight requires a confirmed future evening occurrence", () => {
  const picks = discover({
    mode: "gratis-ikvall",
    cultureEvents: [
      event({ id: "tonight", isFree: true }),
      event({ id: "finished", isFree: true, time: "15:00–16:00" }),
      event({ id: "started", isFree: true, time: "16:00–19:00" }),
      event({ id: "tomorrow", isFree: true, startDate: "2026-09-06" }),
      event({ id: "recurring", isFree: true, endDate: "2026-10-01" }),
      event({ id: "unknown", isFree: true, time: undefined }),
      event({ id: "paid" }),
    ],
    entertainment: [experience()],
  });
  assert.deepEqual(picks.map((pick) => pick.id), ["tonight"]);
});

test("under 150 is strict and never treats a minimum price as a maximum", () => {
  const picks = discover({
    mode: "under-150",
    cultureEvents: [
      event({ id: "149", priceMaxSek: 149 }),
      event({ id: "150", priceMaxSek: 150 }),
      event({ id: "zero", priceMaxSek: 0 }),
      event({ id: "unknown" }),
    ],
    entertainment: [
      experience({ id: "free" }),
      experience({ id: "exact", free: false, price: "125 KR" }),
      experience({ id: "minimum", free: false, price: "FRÅN 99 KR" }),
      experience({ id: "expensive-range", free: false, price: "99–300 KR" }),
      experience({ id: "range", free: false, price: "99–140 KR" }),
    ],
  });
  assert.deepEqual(picks.map((pick) => pick.id).sort(), ["149", "exact", "free", "range", "zero"]);
});

test("two hours includes the wait to a dated event and never invents its length", () => {
  const picks = discover({
    mode: "tva-timmar",
    cultureEvents: [
      event({ id: "fits", time: "17:15–18:15" }),
      event({ id: "late", time: "18:30–19:30" }),
      event({ id: "tomorrow", startDate: "2026-09-06", time: "17:15–18:15" }),
      event({ id: "unknown", category: "Film", time: "18:00" }),
    ],
    entertainment: [
      experience({ id: "short" }),
      experience({ id: "long", duration: "1–3 TIM" }),
      experience({ id: "booking", booking: "BOKA" }),
    ],
  });
  assert.deepEqual(picks.map((pick) => pick.id).sort(), ["fits", "short"]);
  const short = picks.find((pick) => pick.id === "short");
  assert.match(short.availabilityLabel, /öppettider/i);
  assert.match(recommendationReason(short, null, "tva-timmar"), /öppettider/i);
});

test("expired recommendations cannot be rescued by wildcard or journal affinity", () => {
  const picks = discover({
    mode: "overraska",
    affinities: { energi: 100 },
    cultureEvents: [event({ id: "past-date", startDate: "2026-09-04" }), event({ id: "past-time", time: "15:00–16:00" }), event({ id: "past-start", time: "15:00" })],
    entertainment: [experience({ highlightUntil: "2026-09-04" })],
  });
  assert.deepEqual(picks, []);
});

test("journal and family scoring preserve hard constraints and every eligible domain", () => {
  const picks = discover({
    mode: "under-150",
    lifeRhythm: "barnvecka",
    affinities: { energi: 100, nyfiken: 50 },
    cultureEvents: [event({ id: "shared", isFree: true }), event({ id: "costly", category: "Skapande", priceMaxSek: 200 })],
    entertainment: [experience({ id: "shared" }), experience({ id: "shared" })],
  });
  assert.deepEqual(picks.map((pick) => pick.key).sort(), ["kultur:shared", "noje:shared"]);
  assert.equal(pickDiscovery(picks, ["kultur:shared"]).key, "noje:shared");
  assert.equal(pickDiscovery(picks, picks.map((pick) => pick.key)), null);
});

test("a family audience alone does not imply a social activity", () => {
  const picks = discover({
    mode: "socialt",
    entertainment: [
      experience({ id: "quiet-walk", audiences: ["singel", "barnfamilj"] }),
      experience({ id: "group-game", category: "Spel & utmaning", audiences: ["singel", "par"] }),
    ],
  });
  assert.deepEqual(picks.map((pick) => pick.id), ["group-game"]);
});

test("recommendation order stays stable within a rotation window", () => {
  const items = Array.from({ length: 20 }, (_, index) => experience({ id: `walk-${index}` }));
  const early = discover({ entertainment: items, snapshot: "2026-09-05|1|17:00" });
  const later = discover({ entertainment: items, snapshot: "2026-09-05|1|17:01" });
  assert.deepEqual(early.map((pick) => pick.key), later.map((pick) => pick.key));
  const tomorrow = discover({ entertainment: items, snapshot: "2026-09-06|0|09:00" });
  assert.notDeepEqual(early.map((pick) => pick.key), tomorrow.map((pick) => pick.key));
});

test("the older culture-only API obeys the same hard budget limit", () => {
  const events = [event({ id: "too-expensive", priceMaxSek: 150 }), event({ id: "eligible", priceMaxSek: 100 })];
  const args = { events, snapshot: "2026-09-05|1|17:00", intent: null, mode: "under-150" };
  assert.equal(getDiscoveryRecommendation(args).id, "eligible");
  assert.equal(getDiscoveryRecommendation({ ...args, skipIds: ["eligible"] }), null);
});
