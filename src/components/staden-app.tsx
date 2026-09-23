"use client";

import { EditorialHome } from "./editorial-home";
import { DayPlanner } from "./day-planner";
import {
  House,
  Compass,
  GearSix,
  ArrowDownRight,
  ArrowUpRight,
  BookmarkSimple,
  Buildings,
  CalendarBlank,
  CaretRight,
  Check,
  Confetti,
  ForkKnife,
  MagnifyingGlass,
  MapPin,
  Palette,
  Sparkle,
  UserCircle,
  X,
} from "@phosphor-icons/react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  culturalCatalogVerifiedAt,
  culturalEvents,
  type CulturalDiscoveryIntent,
  type CulturalEvent,
} from "@/data/cultural-events";
import { restaurants } from "@/data/restaurants";
import { entertainmentExperiences } from "@/data/entertainment";
import { EntertainmentExplorer } from "@/components/entertainment-explorer";
import { AmbientCityField } from "@/components/ambient-city-field";
import { FoodExplorer } from "@/components/food-explorer";
import { MapLink } from "@/components/map-link";
import { NearbyControl } from "@/components/nearby-control";
import { SavedPocket } from "@/components/saved-pocket";
import { useHighlightClock } from "@/hooks/use-highlight-clock";
import {
  clearNearbyLocation,
  useNearbyLocation,
} from "@/hooks/use-nearby-location";
import {
  distanceInMeters,
  formatDistance,
  resolveGothenburgPoint,
} from "@/lib/geo";
import {
  buildDiscoveryOrder,
  combineAffinities,
  deriveSavedAffinities,
  discoveryIntents,
  discoveryModes,
  hasAffinitySignal,
  pickDiscovery,
  recommendationReason,
  type DiscoveryMode,
} from "@/lib/discovery-engine";
import {
  deriveJournalAffinities,
  getJournalSnapshot,
  getServerJournalSnapshot,
  parseJournal,
  subscribeToJournal,
} from "@/lib/cultural-journal";
import {
  getLifeRhythmSnapshot,
  getServerLifeRhythmSnapshot,
  lifeRhythmOptions,
  parseLifeRhythm,
  subscribeToLifeRhythm,
  writeLifeRhythm,
} from "@/lib/life-rhythm";
import {
  JournalLog,
  JournalPrompt,
  type JournalSubject,
} from "@/components/loggbok";
import { SokOverlay } from "@/components/sok";
import type { SearchResult } from "@/lib/search";
import {
  addDaysToDateKey,
  dateKeyFromHighlightSnapshot,
  daysBetweenDateKeys,
  hasEventNotEnded,
  isEventActiveOnDate,
  rotateHighlights,
} from "@/lib/highlights";
import {
  getSavedEntertainmentSnapshot,
  getServerSavedEntertainmentSnapshot,
  parseSavedEntertainmentIds,
  subscribeToSavedEntertainment,
  writeSavedEntertainmentIds,
} from "@/lib/saved-entertainment";

const SAVED_EVENTS_KEY = "staden:saved-cultural-events";
const SAVED_EVENTS_CHANGED = "staden:saved-cultural-events-changed";
const EMPTY_SAVED_EVENTS = "[]";
const SAVED_RESTAURANTS_KEY = "staden:saved-restaurants";
const SAVED_RESTAURANTS_CHANGED = "staden:saved-restaurants-changed";
const EMPTY_SAVED_RESTAURANTS = "[]";
const THEME_KEY = "staden:theme";
const THEME_CHANGED = "staden:theme-changed";
const DEFAULT_THEME = "atelier";
const MAX_SAVED_EVENTS = 200;
const MAX_SAVED_RESTAURANTS = 200;
const validEventIds = new Set(culturalEvents.map((event) => event.id));
const validRestaurantIds = new Set(
  restaurants.map((restaurant) => restaurant.id),
);
const categories = [
  "Alla",
  "Festival",
  "Scenkonst",
  "Musik",
  "Film",
  "Litteratur",
  "Samtal",
  "Konst",
  "Museum",
  "Kulturhus",
  "Skapande",
] as const;

function eventMapQuery(event: CulturalEvent) {
  return [event.venue, event.area, "Göteborg"].filter(Boolean).join(", ");
}

const discoveryEvents = [...culturalEvents].sort((left, right) => {
  const leftDate = left.isOngoing
    ? (left.endDate ?? "9999-12-31")
    : left.startDate;
  const rightDate = right.isOngoing
    ? (right.endDate ?? "9999-12-31")
    : right.startDate;

  return (
    leftDate.localeCompare(rightDate) ||
    left.title.localeCompare(right.title, "sv-SE")
  );
});

type CategoryFilter = (typeof categories)[number];
type ThemeId =
  | "staden"
  | "atelier"
  | "blue-hour"
  | "sunday-edition"
  | "blue-line"
  | "after-rain";
type AppView = "home" | "kultur" | "noje" | "mat" | "profile" | "explore" | "saved";

const cultureCategories = categories.slice(1) as readonly Exclude<
  CategoryFilter,
  "Alla"
>[];

const categoryDescriptions: Record<Exclude<CategoryFilter, "Alla">, string> = {
  Festival: "Hela staden, flera scener",
  Scenkonst: "Teater, dans, cirkus",
  Musik: "Konserter, klubb, jazz",
  Film: "Bio, samtal, festival",
  Litteratur: "Författare, poesi, böcker",
  Samtal: "Idéer, forskning, människor",
  Konst: "Utställningar och gallerier",
  Museum: "Samlingar att stanna i",
  Kulturhus: "Program nära vardagen",
  Skapande: "Workshops och eget uttryck",
};

const citywideFestivalIds = new Set([
  "gdtf-2026",
  "goteborgskalaset-2026",
]);
const culturePoints = new Map(
  culturalEvents.map((event) => [
    event.id,
    resolveGothenburgPoint(event.venue, event.area, event.title),
  ]),
);
const mappedCultureCount = Array.from(culturePoints.values()).filter(
  Boolean,
).length;

function viewFromHash(hash: string): AppView {
  if (hash === "#utforska") return "explore";
  if (hash === "#sparat") return "saved";
  if (
    hash === "#kultur" ||
    hash === "#noje" ||
    hash === "#mat" ||
    hash === "#profil"
  ) {
    if (hash === "#profil") return "profile";
    return hash.slice(1) as AppView;
  }

  return "home";
}

function festivalPulse(event: CulturalEvent, today: string) {
  if (isEventActiveOnDate(event, today)) return "PÅGÅR NU";

  const days = Math.max(1, daysBetweenDateKeys(today, event.startDate));
  return `OM ${days} ${days === 1 ? "DAG" : "DAGAR"}`;
}

function isCultureNowOrSoon(event: CulturalEvent, today: string) {
  return (
    event.startDate <= addDaysToDateKey(today, 2) &&
    hasEventNotEnded(event, today)
  );
}

const themes: Array<{
  id: ThemeId;
  name: string;
  description: string;
}> = [
  {
    id: "staden",
    name: "STADEN Original",
    description: "Rå, varm och signalorange.",
  },
  {
    id: "atelier",
    name: "Ateljé",
    description: "Papper, serif och redaktionellt lugn.",
  },
  {
    id: "blue-hour",
    name: "Blå timmen",
    description: "Elektriskt blå och byggd kring tiden.",
  },
  {
    id: "sunday-edition",
    name: "Söndagsupplagan",
    description: "Varmt tidningspapper, korall och kulturserif.",
  },
  {
    id: "blue-line",
    name: "Blå Linjen",
    description: "Kobolt, hårda rutnät och kondenserad typ.",
  },
  {
    id: "after-rain",
    name: "Efter Regnet",
    description: "Svart kväll, kobolt, bärnsten och redaktionell serif.",
  },
];

function subscribeToSavedEvents(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(SAVED_EVENTS_CHANGED, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(SAVED_EVENTS_CHANGED, onStoreChange);
  };
}

function getSavedEventsSnapshot() {
  try {
    return window.localStorage.getItem(SAVED_EVENTS_KEY) ?? EMPTY_SAVED_EVENTS;
  } catch {
    return EMPTY_SAVED_EVENTS;
  }
}

function getServerSavedEventsSnapshot() {
  return EMPTY_SAVED_EVENTS;
}

function subscribeToSavedRestaurants(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(SAVED_RESTAURANTS_CHANGED, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(SAVED_RESTAURANTS_CHANGED, onStoreChange);
  };
}

function getSavedRestaurantsSnapshot() {
  try {
    return (
      window.localStorage.getItem(SAVED_RESTAURANTS_KEY) ??
      EMPTY_SAVED_RESTAURANTS
    );
  } catch {
    return EMPTY_SAVED_RESTAURANTS;
  }
}

function getServerSavedRestaurantsSnapshot() {
  return EMPTY_SAVED_RESTAURANTS;
}

function subscribeToTheme(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_CHANGED, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_CHANGED, onStoreChange);
  };
}

function getThemeSnapshot(): ThemeId {
  try {
    const stored = window.localStorage.getItem(THEME_KEY);
    const validTheme = themes.some((theme) => theme.id === stored);
    return validTheme ? (stored as ThemeId) : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function getServerThemeSnapshot(): ThemeId {
  return DEFAULT_THEME;
}

function parseSavedEventIds(snapshot: string) {
  try {
    const parsed: unknown = JSON.parse(snapshot);

    if (!Array.isArray(parsed)) return [];

    return Array.from(
      new Set(
        parsed.filter(
          (id): id is string =>
            typeof id === "string" && validEventIds.has(id),
        ),
      ),
    ).slice(0, MAX_SAVED_EVENTS);
  } catch {
    return [];
  }
}

function parseSavedRestaurantIds(snapshot: string) {
  try {
    const parsed: unknown = JSON.parse(snapshot);

    if (!Array.isArray(parsed)) return [];

    return Array.from(
      new Set(
        parsed.filter(
          (id): id is string =>
            typeof id === "string" && validRestaurantIds.has(id),
        ),
      ),
    ).slice(0, MAX_SAVED_RESTAURANTS);
  } catch {
    return [];
  }
}

function SourceLink({ event }: { event: CulturalEvent }) {
  return (
    <a
      className="source-link"
      href={event.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Öppna källan för ${event.title}`}
    >
      <span>{event.sourceLabel}</span>
      <ArrowUpRight aria-hidden="true" size={16} weight="bold" />
    </a>
  );
}

function SaveButton({
  event,
  isSaved,
  onToggle,
}: {
  event: CulturalEvent;
  isSaved: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <button
      className={`save-button${isSaved ? " is-saved" : ""}`}
      type="button"
      aria-pressed={isSaved}
      aria-label={`${isSaved ? "Ta bort" : "Spara"} ${event.title}`}
      onClick={() => onToggle(event.id)}
    >
      {isSaved ? (
        <Check aria-hidden="true" size={17} weight="bold" />
      ) : (
        <BookmarkSimple aria-hidden="true" size={17} weight="bold" />
      )}
      <span>{isSaved ? "Sparad" : "Spara"}</span>
    </button>
  );
}

function EventCard({
  event,
  number,
  distanceMeters = null,
  approximateDistance = false,
  isSaved,
  onToggleSave,
}: {
  event: CulturalEvent;
  number: number;
  distanceMeters?: number | null;
  approximateDistance?: boolean;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}) {
  return (
    <article
      className={`event-card event-card--${event.category.toLowerCase()}`}
      data-object-id={`kultur:${event.id}`}
    >
      <div className="event-card__topline">
        <span>{String(number).padStart(2, "0")}</span>
        <div className="event-card__badges">
          {event.isOngoing ? <span>Pågår</span> : <span>Ny</span>}
          {event.isFree ? <span>Fri entré</span> : null}
        </div>
      </div>

      <div className="event-card__body">
        <p className="event-category">{event.category}</p>
        <h3>{event.title}</h3>
        <p className="event-description">{event.description}</p>
      </div>

      <div className="event-card__details">
        <p>
          <CalendarBlank aria-hidden="true" size={17} weight="bold" />
          <span>
            {event.dateLabel}
            {event.time ? ` · ${event.time}` : ""}
          </span>
        </p>
        <p>
          <MapPin aria-hidden="true" size={17} weight="bold" />
          <MapLink
            className="event-card__map-link"
            query={eventMapQuery(event)}
            label={event.venue}
          >
            {event.venue}
            <small>
              {event.area}
              {distanceMeters !== null
                ? ` · ${approximateDistance ? "≈ " : ""}${formatDistance(distanceMeters)}`
                : ""}
              {" · Vägbeskrivning"}
            </small>
          </MapLink>
        </p>
      </div>

      <div className="event-card__actions">
        <SaveButton
          event={event}
          isSaved={isSaved}
          onToggle={onToggleSave}
        />
        <SourceLink event={event} />
      </div>
    </article>
  );
}

function CultureDashboardCard({
  event,
  number,
  isSaved,
  onToggleSave,
}: {
  event: CulturalEvent;
  number: number;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}) {
  return (
    <article className="culture-dashboard-card">
      <div className="culture-dashboard-card__topline">
        <span>{String(number).padStart(2, "0")}</span>
        <span>{event.category}</span>
      </div>
      <div className="culture-dashboard-card__body">
        <p>
          {event.dateLabel}
          {event.time ? ` · ${event.time}` : ""}
        </p>
        <h3>{event.title}</h3>
        <MapLink
          className="culture-dashboard-card__map-link"
          query={eventMapQuery(event)}
          label={event.venue}
        >
          {event.venue} · {event.area} · Karta
        </MapLink>
      </div>
      <div className="culture-dashboard-card__actions">
        <SaveButton
          event={event}
          isSaved={isSaved}
          onToggle={onToggleSave}
        />
        <SourceLink event={event} />
      </div>
    </article>
  );
}

export function StadenApp() {
  const [activeCategory, setActiveCategory] =
    useState<CategoryFilter>("Alla");
  const [cultureCatalogOpen, setCultureCatalogOpen] = useState(false);
  const [showAllCultureResults, setShowAllCultureResults] = useState(false);
  const [cultureQuery, setCultureQuery] = useState("");
  const [cultureScope, setCultureScope] = useState<
    "alla" | "snart" | "kommande" | "permanenta"
  >("alla");
  const [cultureVenueScope, setCultureVenueScope] = useState<
    "alla" | "museum" | "kulturhus"
  >("alla");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [discoveryForYou, setDiscoveryForYou] = useState(false);
  const [locateTarget, setLocateTarget] = useState<{
    kind: string;
    id: string;
  } | null>(null);
  const [activeView, setActiveView] = useState<AppView>("home");
  const [discoveryIntent, setDiscoveryIntent] =
    useState<CulturalDiscoveryIntent | null>(null);
  const [discoveryMode, setDiscoveryMode] =
    useState<DiscoveryMode | null>(null);
  const [skippedRecommendationIds, setSkippedRecommendationIds] = useState<
    string[]
  >([]);
  const [journalSubject, setJournalSubject] = useState<JournalSubject | null>(
    null,
  );
  const nearby = useNearbyLocation();
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const lastSettingsTriggerRef = useRef<HTMLButtonElement | null>(null);
  const settingsDialogRef = useRef<HTMLElement>(null);
  const viewFocusRequestedRef = useRef(false);
  const overlayOpen = settingsOpen;
  const savedEventsSnapshot = useSyncExternalStore(
    subscribeToSavedEvents,
    getSavedEventsSnapshot,
    getServerSavedEventsSnapshot,
  );
  const savedEventIds = useMemo(
    () => parseSavedEventIds(savedEventsSnapshot),
    [savedEventsSnapshot],
  );
  const savedRestaurantsSnapshot = useSyncExternalStore(
    subscribeToSavedRestaurants,
    getSavedRestaurantsSnapshot,
    getServerSavedRestaurantsSnapshot,
  );
  const savedRestaurantIds = useMemo(
    () => parseSavedRestaurantIds(savedRestaurantsSnapshot),
    [savedRestaurantsSnapshot],
  );
  const savedEntertainmentSnapshot = useSyncExternalStore(
    subscribeToSavedEntertainment,
    getSavedEntertainmentSnapshot,
    getServerSavedEntertainmentSnapshot,
  );
  const savedEntertainmentIds = useMemo(
    () => parseSavedEntertainmentIds(savedEntertainmentSnapshot),
    [savedEntertainmentSnapshot],
  );
  const lifeRhythmSnapshot = useSyncExternalStore(
    subscribeToLifeRhythm,
    getLifeRhythmSnapshot,
    getServerLifeRhythmSnapshot,
  );
  const lifeRhythm = useMemo(
    () => parseLifeRhythm(lifeRhythmSnapshot),
    [lifeRhythmSnapshot],
  );
  const journalSnapshot = useSyncExternalStore(
    subscribeToJournal,
    getJournalSnapshot,
    getServerJournalSnapshot,
  );
  const journalEntries = useMemo(
    () => parseJournal(journalSnapshot),
    [journalSnapshot],
  );
  const journalAffinities = useMemo(
    () => deriveJournalAffinities(journalEntries),
    [journalEntries],
  );
  const savedAffinities = useMemo(
    () =>
      deriveSavedAffinities({
        cultureEvents: culturalEvents.filter((event) =>
          savedEventIds.includes(event.id),
        ),
        entertainment: entertainmentExperiences.filter((experience) =>
          savedEntertainmentIds.includes(experience.id),
        ),
      }),
    [savedEventIds, savedEntertainmentIds],
  );
  const combinedAffinities = useMemo(
    () =>
      combineAffinities(
        { affinities: journalAffinities, weight: 2 },
        { affinities: savedAffinities, weight: 1 },
      ),
    [journalAffinities, savedAffinities],
  );
  const selectedTheme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const highlightClock = useHighlightClock(culturalCatalogVerifiedAt);
  const today = dateKeyFromHighlightSnapshot(highlightClock);
  const activeDiscoveryEvents = useMemo(
    () =>
      discoveryEvents.filter((event) =>
        hasEventNotEnded(event, highlightClock),
      ),
    [highlightClock],
  );
  const festivalPool = useMemo(() => {
    const activeFestivals = activeDiscoveryEvents.filter(
      (event) => event.category === "Festival",
    );

    return [
      ...activeFestivals.filter((event) => citywideFestivalIds.has(event.id)),
      ...activeFestivals.filter((event) => !citywideFestivalIds.has(event.id)),
    ].slice(0, 8);
  }, [activeDiscoveryEvents]);
  const festivalHighlights = useMemo(
    () => rotateHighlights(festivalPool, highlightClock, 2),
    [festivalPool, highlightClock],
  );
  const cultureDashboardPool = useMemo(
    () =>
      [
        ...activeDiscoveryEvents.filter(
          (event) => event.featured && event.category !== "Festival",
        ),
        ...activeDiscoveryEvents.filter(
          (event) => !event.featured && event.category !== "Festival",
        ),
        ...activeDiscoveryEvents.filter(
          (event) => event.category === "Festival",
        ),
      ].slice(0, 16),
    [activeDiscoveryEvents],
  );
  const cultureDashboardEvents = useMemo(
    () => rotateHighlights(cultureDashboardPool, highlightClock, 5),
    [cultureDashboardPool, highlightClock],
  );
  const entertainmentPool = useMemo(
    () =>
      activeDiscoveryEvents
        .filter(
          (event) =>
            event.category === "Musik" ||
            event.category === "Scenkonst" ||
            event.category === "Festival",
        )
        .slice(0, 12),
    [activeDiscoveryEvents],
  );
  const entertainmentEvents = useMemo(
    () => rotateHighlights(entertainmentPool, highlightClock, 3),
    [entertainmentPool, highlightClock],
  );
  const discoveryOrder = useMemo(
    () =>
      discoveryIntent || discoveryMode
        ? buildDiscoveryOrder({
            cultureEvents: activeDiscoveryEvents,
            entertainment: entertainmentExperiences,
            snapshot: highlightClock,
            intent: discoveryIntent,
            mode: discoveryMode,
            lifeRhythm,
            affinities: combinedAffinities,
          })
        : [],
    [
      activeDiscoveryEvents,
      discoveryIntent,
      discoveryMode,
      highlightClock,
      lifeRhythm,
      combinedAffinities,
    ],
  );
  const discoveryRecommendation = useMemo(
    () => pickDiscovery(discoveryOrder, skippedRecommendationIds),
    [discoveryOrder, skippedRecommendationIds],
  );
  const discoverySelectionLabel = discoveryForYou
    ? "För dig"
    : discoveryMode === "overraska"
      ? "Överraska mig"
      : discoveryModes.find((mode) => mode.id === discoveryMode)?.label ??
        discoveryIntents.find((intent) => intent.id === discoveryIntent)?.label;
  const discoveryFeed = useMemo<SearchResult[]>(
    () =>
      buildDiscoveryOrder({
        cultureEvents: activeDiscoveryEvents,
        entertainment: entertainmentExperiences,
        snapshot: highlightClock,
        intent: null,
        mode: "overraska",
        lifeRhythm,
        affinities: combinedAffinities,
      })
        .slice(0, 6)
        .map((pick) => ({
          key: pick.key,
          kind: pick.kind,
          id: pick.id,
          title: pick.title,
          subtitle:
            pick.venue && pick.venue !== pick.area
              ? `${pick.venue} · ${pick.area}`
              : pick.area,
          categoryLabel: pick.categoryLabel,
          area: pick.area,
          mapQuery: pick.mapQuery,
          sourceUrl: pick.sourceUrl,
          isFree: pick.isFree,
        })),
    [activeDiscoveryEvents, highlightClock, lifeRhythm, combinedAffinities],
  );
  const hasAnotherDiscoveryRecommendation = useMemo(
    () =>
      discoveryRecommendation
        ? Boolean(
            pickDiscovery(discoveryOrder, [
              ...skippedRecommendationIds,
              discoveryRecommendation.key,
            ]),
          )
        : false,
    [discoveryOrder, discoveryRecommendation, skippedRecommendationIds],
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", selectedTheme);
  }, [selectedTheme]);

  useEffect(() => {
    if (!settingsOpen) return;
    const settingsButton =
      lastSettingsTriggerRef.current ?? settingsButtonRef.current;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSettingsOpen(false);

      if (event.key !== "Tab") return;

      const dialog = settingsDialogRef.current;
      const focusable = dialog?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.body.classList.add("settings-visible");
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("settings-visible");
      window.removeEventListener("keydown", closeOnEscape);
      settingsButton?.focus();
    };
  }, [settingsOpen]);

  useEffect(() => {
    function syncViewFromLocation() {
      setActiveView(viewFromHash(window.location.hash));
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
    }

    syncViewFromLocation();
    window.addEventListener("hashchange", syncViewFromLocation);
    window.addEventListener("popstate", syncViewFromLocation);

    return () => {
      window.removeEventListener("hashchange", syncViewFromLocation);
      window.removeEventListener("popstate", syncViewFromLocation);
    };
  }, []);

  useEffect(() => {
    const labels: Record<AppView, string> = {
      home: "Göteborg i din ficka",
      kultur: "Kultur",
      noje: "Nöje",
      mat: "Mat",
      profile: "Profil",
      explore: "Utforska",
      saved: "Sparat",
    };
    const nextTitle = `STADEN — ${labels[activeView]}`;

    document.title = nextTitle;
    const titleFrame = window.requestAnimationFrame(() => {
      document.title = nextTitle;
    });

    return () => window.cancelAnimationFrame(titleFrame);
  }, [activeView]);

  useEffect(() => {
    if (!viewFocusRequestedRef.current) return;

    const focusFrame = window.requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>(
        `[data-view="${activeView}"] h1, [data-view="${activeView}"] h2`,
      );

      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }

      viewFocusRequestedRef.current = false;
    });

    return () => window.cancelAnimationFrame(focusFrame);
  }, [activeView]);

  const filteredCultureEvents = useMemo(
    () => {
      const query = cultureQuery.trim().toLocaleLowerCase("sv-SE");

      return activeDiscoveryEvents
        .filter((event) => {
          const isPermanent = event.dateLabel === "Permanent";
          const matchesScope =
            cultureScope === "alla" ||
            (cultureScope === "snart" && isCultureNowOrSoon(event, today)) ||
            (cultureScope === "permanenta" && isPermanent) ||
            (cultureScope === "kommande" && !isPermanent);
          const haystack = [
            event.title,
            event.venue,
            event.area,
            event.description,
            event.category,
          ]
            .join(" ")
            .toLocaleLowerCase("sv-SE");
          const point = culturePoints.get(event.id);
          const distance = nearby.point && point
            ? distanceInMeters(nearby.point, point)
            : null;
          const matchesDistance =
            !nearby.point ||
            (distance !== null && distance <= nearby.radiusMeters);
          const venueText = `${event.venue} ${event.sourceLabel}`.toLocaleLowerCase(
            "sv-SE",
          );
          const matchesVenue =
            cultureVenueScope === "alla" ||
            (cultureVenueScope === "museum" &&
              (event.category === "Museum" || venueText.includes("museum"))) ||
            (cultureVenueScope === "kulturhus" &&
              (event.category === "Kulturhus" || venueText.includes("kulturhus")));

          return (
            matchesScope &&
            matchesDistance &&
            matchesVenue &&
            (activeCategory === "Alla" || event.category === activeCategory) &&
            (!query || haystack.includes(query))
          );
        })
        .sort((left, right) => {
          if (!nearby.point) return 0;
          const leftPoint = culturePoints.get(left.id);
          const rightPoint = culturePoints.get(right.id);
          const leftDistance = leftPoint
            ? distanceInMeters(nearby.point, leftPoint)
            : Infinity;
          const rightDistance = rightPoint
            ? distanceInMeters(nearby.point, rightPoint)
            : Infinity;
          return leftDistance - rightDistance;
        });
    },
    [
      activeCategory,
      activeDiscoveryEvents,
      cultureQuery,
      cultureScope,
      cultureVenueScope,
      nearby.point,
      nearby.radiusMeters,
      today,
    ],
  );

  const nearestCultureEvents = useMemo(() => {
    const origin = nearby.point;
    if (!origin) return [];

    return activeDiscoveryEvents
      .map((event) => {
        const point = culturePoints.get(event.id);
        return {
          event,
          point,
          distanceMeters: point
            ? distanceInMeters(origin, point)
            : null,
        };
      })
      .filter(
        (result) =>
          result.distanceMeters !== null &&
          result.distanceMeters <= nearby.radiusMeters,
      )
      .sort(
        (left, right) =>
          (left.distanceMeters ?? Infinity) - (right.distanceMeters ?? Infinity),
      )
      .slice(0, 5);
  }, [activeDiscoveryEvents, nearby.point, nearby.radiusMeters]);

  const visibleCultureEvents = showAllCultureResults
    ? filteredCultureEvents
    : filteredCultureEvents.slice(0, 5);
  const visibleCount = filteredCultureEvents.length;
  const cultureNowOrSoonCount = activeDiscoveryEvents.filter((event) =>
    isCultureNowOrSoon(event, today),
  ).length;

  function openSettings(trigger: HTMLButtonElement) {
    lastSettingsTriggerRef.current = trigger;
    setSettingsOpen(true);
  }

  function navigateToView(view: AppView) {
    const hash = view === "home" ? "#hem" : view === "profile" ? "#profil" : view === "explore" ? "#utforska" : view === "saved" ? "#sparat" : `#${view}`;

    if (window.location.hash !== hash) {
      window.history.pushState(null, "", hash);
    }

    setCultureCatalogOpen(false);
    setShowAllCultureResults(false);
    viewFocusRequestedRef.current = true;
    setActiveView(view);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }

  function openCultureCategory(category: CategoryFilter) {
    setActiveCategory(category);
    setShowAllCultureResults(false);
    setCultureCatalogOpen(true);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.requestAnimationFrame(() => {
      document.getElementById("kultur-katalog")?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  function openCultureNowOrSoon() {
    setCultureScope("snart");
    setCultureQuery("");
    openCultureCategory("Alla");
  }

  function resetCultureFilters() {
    setActiveCategory("Alla");
    setCultureQuery("");
    setCultureScope("alla");
    setCultureVenueScope("alla");
    setShowAllCultureResults(false);
    clearNearbyLocation();
  }

  function showMusicInCulture() {
    navigateToView("kultur");
    openCultureCategory("Musik");
  }

  function chooseDiscoveryIntent(intent: CulturalDiscoveryIntent) {
    setDiscoveryIntent(intent);
    setDiscoveryMode(null);
    setDiscoveryForYou(false);
    setSkippedRecommendationIds([]);
  }

  function chooseDiscoveryMode(mode: DiscoveryMode) {
    setDiscoveryMode(mode);
    setDiscoveryIntent(null);
    setDiscoveryForYou(false);
    setSkippedRecommendationIds([]);
  }

  function chooseForYou() {
    setDiscoveryMode("overraska");
    setDiscoveryIntent(null);
    setDiscoveryForYou(true);
    setSkippedRecommendationIds([]);
  }

  function locateFromSearch(result: SearchResult) {
    setSearchOpen(false);
    setLocateTarget({ kind: result.kind, id: result.id });
    navigateToView(
      result.kind === "kultur"
        ? "kultur"
        : result.kind === "noje"
          ? "noje"
          : "mat",
    );
    if (result.kind === "kultur") {
      resetCultureFilters();
      setCultureCatalogOpen(true);
      setShowAllCultureResults(true);
      setCultureQuery(result.title);
    }
  }

  useEffect(() => {
    if (!locateTarget) return;
    const expectedView =
      locateTarget.kind === "kultur"
        ? "kultur"
        : locateTarget.kind === "noje"
          ? "noje"
          : "mat";
    if (activeView !== expectedView) return;

    let cancelled = false;
    const selector = `[data-object-id="${locateTarget.kind}:${locateTarget.id}"]`;

    function tryLocate(attempt: number) {
      if (cancelled) return;
      const element = document.querySelector<HTMLElement>(selector);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("is-located");
        window.setTimeout(() => element.classList.remove("is-located"), 2400);
        setLocateTarget(null);
      } else if (attempt < 10) {
        window.setTimeout(() => tryLocate(attempt + 1), 220);
      } else {
        setLocateTarget(null);
      }
    }

    const timer = window.setTimeout(() => tryLocate(0), 280);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [locateTarget, activeView]);

  function showAnotherRecommendation() {
    if (!discoveryRecommendation) {
      setSkippedRecommendationIds([]);
      return;
    }

    setSkippedRecommendationIds((current) =>
      current.length >= 12
        ? []
        : [...current, discoveryRecommendation.key],
    );
  }

  function toggleSavedEvent(id: string) {
    const next = savedEventIds.includes(id)
      ? savedEventIds.filter((savedId) => savedId !== id)
      : [...savedEventIds, id];

    try {
      window.localStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(SAVED_EVENTS_CHANGED));
    } catch {
      // The event guide still works when browser storage is unavailable.
    }
  }

  function toggleSavedEntertainment(id: string) {
    writeSavedEntertainmentIds(
      savedEntertainmentIds.includes(id)
        ? savedEntertainmentIds.filter((savedId) => savedId !== id)
        : [...savedEntertainmentIds, id],
    );
  }

  function selectTheme(theme: ThemeId) {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
      window.dispatchEvent(new Event(THEME_CHANGED));
    } catch {
      // The selected theme remains usable when browser storage is unavailable.
    }
  }

  return (
    <div id="top">
      <div
        className="app-content"
        aria-hidden={overlayOpen ? "true" : undefined}
        inert={overlayOpen ? true : undefined}
      >
      <a className="skip-link" href="#huvudinnehall">
        Hoppa till innehållet
      </a>
      <header className="site-header">
        <nav className="desktop-main-nav" aria-label="Sektioner">{([{view:"home",hash:"#hem",label:"Hem"},{view:"explore",hash:"#utforska",label:"Utforska"},{view:"saved",hash:"#sparat",label:"Sparat"},{view:"profile",hash:"#profil",label:"Profil"}] as const).map(item => <a key={item.view} href={item.hash} aria-current={activeView === item.view || (item.view === "explore" && ["kultur","noje","mat"].includes(activeView)) ? "page" : undefined} onClick={event => { event.preventDefault(); navigateToView(item.view); }}>{item.label}</a>)}</nav>
        <a
          className="wordmark"
          href="#hem"
          aria-label="STADEN, startsida"
          aria-current={activeView === "home" ? "page" : undefined}
          onClick={(event) => {
            event.preventDefault();
            navigateToView("home");
          }}
        >
          STADEN
        </a>
        <div className="header-actions">
          <button
            type="button"
            className="search-trigger"
            aria-label="Sök i staden"
            onClick={() => setSearchOpen(true)}
          >
            <MagnifyingGlass aria-hidden="true" size={18} weight="bold" />
          </button>
          <a
            className="saved-shortcut"
            href="#sparat"
            aria-label={`Öppna Sparat, ${savedEventIds.length + savedRestaurantIds.length + savedEntertainmentIds.length} sparade objekt`}
            aria-current={activeView === "saved" ? "location" : undefined}
            onClick={(event) => {
              event.preventDefault();
              navigateToView("saved");
            }}
          >
            <BookmarkSimple aria-hidden="true" size={18} weight="bold" />
            <span aria-live="polite">
              {savedEventIds.length + savedRestaurantIds.length + savedEntertainmentIds.length}
            </span>
          </a>
        </div>
      </header>

      <main className="view-main" id="huvudinnehall">
      <AmbientCityField />

      {activeView === "home" ? <EditorialHome snapshot={highlightClock} savedEventIds={savedEventIds} onToggleSaveEvent={toggleSavedEvent} onNavigate={navigateToView} onSearch={() => setSearchOpen(true)} /> : null}
      {activeView === "explore" ? <section className="explore-hub content-view" data-view="explore"><header className="section-heading"><p className="kicker">HITTA DITT GÖTEBORG</p><h1>Vad lockar?</h1><p>Välj en ingång eller sök efter en plats, aktivitet eller smak.</p><button className="editorial-primary" onClick={() => setSearchOpen(true)}>Sök i hela staden <MagnifyingGlass size={20}/></button></header><div className="explore-entrances">{([{view:"kultur",title:"Kultur",text:"Konst, scener och nya perspektiv",icon:Buildings},{view:"noje",title:"Nöje",text:"Utflykter, lek och stadsliv",icon:Confetti},{view:"mat",title:"Mat",text:"Hitta ett kök eller följ en guide",icon:ForkKnife}] as const).map(item => <button key={item.view} onClick={() => navigateToView(item.view)}><item.icon size={28}/><h2>{item.title}</h2><p>{item.text}</p><ArrowUpRight size={24}/></button>)}</div><details className="discovery-help"><summary>Hjälp mig välja ett förslag <Sparkle size={20}/></summary>        <section
          className="discovery-starter"
          aria-labelledby="discovery-starter-title"
        >
          <div className="discovery-starter__intro">
            <p className="kicker">60 SEKUNDER TILL ETT BESLUT</p>
            <h3 id="discovery-starter-title">Vad vill du känna idag?</h3>
            <p>
              Välj en känsla eller ett praktiskt läge. STADEN ger dig ett
              konkret förslag — inte ännu en lång lista.
            </p>
          </div>

          <div className="discovery-intents" aria-label="Välj känsla">
            {discoveryIntents.map((intent) => (
              <button
                type="button"
                className={discoveryIntent === intent.id ? "is-active" : ""}
                aria-pressed={discoveryIntent === intent.id}
                onClick={() => chooseDiscoveryIntent(intent.id)}
                key={intent.id}
              >
                {intent.label}
              </button>
            ))}
          </div>

          <div className="discovery-shortcuts" aria-label="Snabba upptäcktsval">
            {discoveryModes.map((mode) => (
              <button
                type="button"
                className={discoveryMode === mode.id ? "is-active" : ""}
                aria-pressed={discoveryMode === mode.id}
                onClick={() => chooseDiscoveryMode(mode.id)}
                key={mode.id}
              >
                {mode.label}
              </button>
            ))}
            <button
              type="button"
              className={`discovery-surprise${
                discoveryMode === "overraska" ? " is-active" : ""
              }`}
              aria-pressed={discoveryMode === "overraska"}
              onClick={() => chooseDiscoveryMode("overraska")}
            >
              <Sparkle aria-hidden="true" size={17} weight="fill" />
              Överraska mig
            </button>
            {hasAffinitySignal(combinedAffinities) ? (
              <button
                type="button"
                className={`discovery-foryou${
                  discoveryForYou ? " is-active" : ""
                }`}
                aria-pressed={discoveryForYou}
                onClick={chooseForYou}
              >
                För dig
              </button>
            ) : null}
          </div>

          <div className="discovery-liferytm">
            <span className="discovery-liferytm__label">Din vecka</span>
            <div
              className="discovery-liferytm__options"
              role="group"
              aria-label="Livsrytm"
            >
              {lifeRhythmOptions.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  aria-pressed={lifeRhythm === option.id}
                  className={lifeRhythm === option.id ? "is-on" : ""}
                  onClick={() =>
                    writeLifeRhythm(lifeRhythm === option.id ? null : option.id)
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {discoveryIntent || discoveryMode ? (
            discoveryRecommendation ? (
              <article
                className="discovery-recommendation"
                aria-live="polite"
                key={discoveryRecommendation.key}
              >
                <div className="discovery-recommendation__topline">
                  <span>
                    {discoveryRecommendation.kind === "noje" ? "NÖJE" : "KULTUR"}{" "}
                    · {discoverySelectionLabel}
                  </span>
                  <span>{discoveryRecommendation.priceLabel}</span>
                </div>
                <div className="discovery-recommendation__body">
                  <p>{discoveryRecommendation.timeLabel}</p>
                  <h4>{discoveryRecommendation.title}</h4>
                  <p className="discovery-recommendation__why">
                    <strong>Varför?</strong>{" "}
                    {recommendationReason(
                      discoveryRecommendation,
                      discoveryIntent,
                      discoveryMode,
                      lifeRhythm,
                    )}
                  </p>
                  {discoveryRecommendation.bucket === "wildcard" ? (
                    <p className="discovery-recommendation__bucket">
                      <Sparkle aria-hidden="true" size={13} weight="fill" /> WILDCARD
                    </p>
                  ) : null}
                </div>
                <div className="discovery-recommendation__place">
                  <MapPin aria-hidden="true" size={17} weight="bold" />
                  <span>
                    {discoveryRecommendation.venue &&
                    discoveryRecommendation.venue !== discoveryRecommendation.area
                      ? `${discoveryRecommendation.venue} · ${discoveryRecommendation.area}`
                      : discoveryRecommendation.area}
                  </span>
                </div>
                <div className="discovery-recommendation__actions">
                  <MapLink
                    className="discovery-recommendation__go"
                    query={discoveryRecommendation.mapQuery}
                    label={discoveryRecommendation.venue ?? discoveryRecommendation.area}
                  >
                    Gå
                    <ArrowUpRight aria-hidden="true" size={18} weight="bold" />
                  </MapLink>
                  {discoveryRecommendation.kind === "kultur"
                    ? (() => {
                        const recEvent = activeDiscoveryEvents.find(
                          (event) => event.id === discoveryRecommendation.id,
                        );
                        return recEvent ? (
                          <SaveButton
                            event={recEvent}
                            isSaved={savedEventIds.includes(recEvent.id)}
                            onToggle={toggleSavedEvent}
                          />
                        ) : null;
                      })()
                    : (
                      <button
                        className={`save-button${
                          savedEntertainmentIds.includes(discoveryRecommendation.id)
                            ? " is-saved"
                            : ""
                        }`}
                        type="button"
                        aria-pressed={savedEntertainmentIds.includes(
                          discoveryRecommendation.id,
                        )}
                        aria-label={`${
                          savedEntertainmentIds.includes(discoveryRecommendation.id)
                            ? "Ta bort"
                            : "Spara"
                        } ${discoveryRecommendation.title}`}
                        onClick={() =>
                          toggleSavedEntertainment(discoveryRecommendation.id)
                        }
                      >
                        {savedEntertainmentIds.includes(discoveryRecommendation.id) ? (
                          <Check aria-hidden="true" size={17} weight="bold" />
                        ) : (
                          <BookmarkSimple aria-hidden="true" size={17} weight="bold" />
                        )}
                        <span>
                          {savedEntertainmentIds.includes(discoveryRecommendation.id)
                            ? "Sparad"
                            : "Spara"}
                        </span>
                      </button>
                    )}
                  <button
                    type="button"
                    className="discovery-recommendation__log"
                    onClick={() =>
                      setJournalSubject({
                        id: discoveryRecommendation.id,
                        kind: discoveryRecommendation.kind,
                        title: discoveryRecommendation.title,
                        category: discoveryRecommendation.categoryLabel,
                      })
                    }
                  >
                    Jag var där →
                  </button>
                  {hasAnotherDiscoveryRecommendation ? (
                    <button
                      type="button"
                      className="discovery-recommendation__next"
                      onClick={showAnotherRecommendation}
                    >
                      Ett annat förslag
                    </button>
                  ) : (
                    <span className="discovery-recommendation__only">
                      Enda säkra träffen just nu
                    </span>
                  )}
                </div>
              </article>
            ) : (
              <div className="discovery-recommendation discovery-recommendation--empty">
                <p className="kicker">INGEN SÄKER TRÄFF JUST NU</p>
                <h4>Vi chansar inte med dina villkor.</h4>
                <p>
                  Prova ett annat läge. STADEN visar hellre inget än ett
                  evenemang som redan är över eller spräcker ditt val.
                </p>
              </div>
            )
          ) : (
            <div className="discovery-starter__promise">
              <strong>ETT SVAR, INTE 150 TRÄFFAR.</strong>
              <span>Aktuellt · rimligt · lite oväntat</span>
            </div>
          )}
        </section>

</details></section> : null}
      {(["kultur", "noje", "mat"] as AppView[]).includes(activeView) ? <nav className="category-navigation" aria-label="Byt kategori"><button onClick={() => navigateToView("explore")}>Alla områden</button>{([['kultur','Kultur'],['noje','Nöje'],['mat','Mat']] as const).map(([view,label]) => <button key={view} aria-current={activeView === view ? "page" : undefined} onClick={() => navigateToView(view)}>{label}</button>)}</nav> : null}

      {activeView === "kultur" ? (
      <section className="culture-section content-view" id="kultur" data-view="kultur">
        <div className="section-heading">
          <p className="kicker">KULTUR · DIN DASHBOARD</p>
          <h2>En entré till hela staden.</h2>
          <p>
            Ett kort redaktionellt urval först. När du vill längre in väntar
            hela kulturkatalogen, sorterad som rum att gå vilse i.
          </p>
        </div>

        <button
          className="culture-now-soon"
          type="button"
          onClick={openCultureNowOrSoon}
        >
          <span>NU & SNART</span>
          <strong>{cultureNowOrSoonCount} val de närmaste tre dagarna</strong>
          <ArrowDownRight aria-hidden="true" size={22} weight="bold" />
        </button>

        {festivalHighlights.length ? (
        <section
          className="city-festival-section"
          aria-labelledby="city-festival-title"
        >
          <div className="culture-subheading">
            <div>
              <p className="kicker">STADEN ÄR SCENEN</p>
              <h3 id="city-festival-title">Festivalstaden.</h3>
            </div>
            <p>
              Aktuella festivaler får en egen plats före flödet. Urvalet
              kontrolleras och roteras automatiskt.
            </p>
          </div>

          <div className="city-festival-grid">
            {festivalHighlights.map((event, index) => (
              <article
                className={`city-festival-card${index === 0 ? " is-primary" : ""}`}
                key={event.id}
              >
                <div className="city-festival-card__topline">
                  <span>{festivalPulse(event, today)}</span>
                  <span>
                    {citywideFestivalIds.has(event.id)
                      ? "ÖVER HELA STADEN"
                      : event.area.toLocaleUpperCase("sv-SE")}
                  </span>
                </div>
                <div className="city-festival-card__body">
                  <p>{event.dateLabel}</p>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </div>
                <div className="city-festival-card__place">
                  <MapPin aria-hidden="true" size={17} weight="bold" />
                  <MapLink
                    className="city-festival-card__map-link"
                    query={eventMapQuery(event)}
                    label={event.venue}
                  >
                    {event.venue} · {event.area} · Karta
                  </MapLink>
                </div>
                <div className="city-festival-card__actions">
                  <SaveButton
                    event={event}
                    isSaved={savedEventIds.includes(event.id)}
                    onToggle={toggleSavedEvent}
                  />
                  <SourceLink event={event} />
                </div>
              </article>
            ))}
          </div>
        </section>
        ) : null}

        <NearbyControl mappedCount={mappedCultureCount} noun="kulturplatser" />

        {nearby.point ? (
          <section className="culture-nearby" aria-labelledby="culture-nearby-title">
            <div className="culture-subheading">
              <div>
                <p className="kicker">NÄRMAST {nearby.label?.toLocaleUpperCase("sv-SE")}</p>
                <h3 id="culture-nearby-title">Fem nära vägar in.</h3>
              </div>
              <p>
                Inom {formatDistance(nearby.radiusMeters)} och sorterat från
                närmast till längst bort. Områdeslägen markeras med ≈.
              </p>
            </div>
            {nearestCultureEvents.length ? (
              <div className="event-grid">
                {nearestCultureEvents.map((result, index) => (
                  <EventCard
                    event={result.event}
                    number={index + 1}
                    distanceMeters={result.distanceMeters}
                    approximateDistance={
                      nearby.source === "manual" || result.point?.precision === "area"
                    }
                    isSaved={savedEventIds.includes(result.event.id)}
                    onToggleSave={toggleSavedEvent}
                    key={result.event.id}
                  />
                ))}
              </div>
            ) : (
              <p className="culture-nearby__empty">
                Inga kartlagda kulturval finns inom den valda radien. Prova
                5 eller 10 km.
              </p>
            )}
          </section>
        ) : null}

        <section
          className="culture-dashboard-picks"
          aria-labelledby="culture-dashboard-picks-title"
        >
          <div className="culture-subheading">
            <div>
              <p className="kicker">STADEN VÄLJER · 5</p>
              <h3 id="culture-dashboard-picks-title">Börja här.</h3>
            </div>
            <p>
              Fem aktuella ingångar — tillräckligt för att välja något, aldrig
              så många att dashboarden blir en katalog.
            </p>
          </div>

          <div className="culture-dashboard-rail">
            {cultureDashboardEvents.map((event, index) => (
              <CultureDashboardCard
                event={event}
                number={index + 1}
                isSaved={savedEventIds.includes(event.id)}
                onToggleSave={toggleSavedEvent}
                key={event.id}
              />
            ))}
          </div>

          <button
            className="culture-show-more"
            type="button"
            aria-controls="kultur-katalog"
            aria-expanded={cultureCatalogOpen}
            onClick={() => openCultureCategory("Alla")}
          >
            <span>Visa hela kulturkalendern</span>
            <span>{activeDiscoveryEvents.length} aktuella objekt</span>
            <ArrowDownRight aria-hidden="true" size={22} weight="bold" />
          </button>
        </section>

        <section
          className="culture-explore"
          aria-labelledby="culture-explore-title"
        >
          <div className="culture-subheading">
            <div>
              <p className="kicker">UTFORSKA SJÄLV</p>
              <h3 id="culture-explore-title">Välj ett rum.</h3>
            </div>
            <p>
              Kategorierna är dörrar in i katalogen. Välj efter uttryck, inte
              efter vad redaktionen råkade lägga högst upp.
            </p>
          </div>

          <div className="culture-category-grid">
            {cultureCategories.map((category, index) => {
              const categoryCount = activeDiscoveryEvents.filter(
                (event) => event.category === category,
              ).length;

              return (
                <button
                  type="button"
                  className={
                    cultureCatalogOpen && activeCategory === category
                      ? "is-active"
                      : ""
                  }
                  aria-pressed={
                    cultureCatalogOpen && activeCategory === category
                  }
                  aria-controls="kultur-katalog"
                  onClick={() => openCultureCategory(category)}
                  key={category}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{category}</strong>
                  <small>{categoryDescriptions[category]}</small>
                  <b>{categoryCount}</b>
                  <CaretRight aria-hidden="true" size={19} weight="bold" />
                </button>
              );
            })}
          </div>
        </section>

        {cultureCatalogOpen ? (
          <section
            className="culture-catalog"
            id="kultur-katalog"
            aria-labelledby="culture-catalog-title"
          >
            <header className="culture-catalog__heading">
              <div>
                <p className="kicker">KULTURKATALOGEN · {activeCategory}</p>
                <h3 id="culture-catalog-title">
                  {activeCategory === "Alla"
                    ? "Hela kulturstaden."
                    : `Allt inom ${activeCategory.toLocaleLowerCase("sv-SE")}.`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCultureCatalogOpen(false)}
              >
                Dölj katalogen
                <X aria-hidden="true" size={18} weight="bold" />
              </button>
            </header>

            <div className="filter-row" aria-label="Filtrera kulturkatalogen">
              {categories.map((category) => {
                const categoryCount =
                  category === "Alla"
                    ? activeDiscoveryEvents.length
                    : activeDiscoveryEvents.filter(
                        (event) => event.category === category,
                      ).length;

                return (
                  <button
                    key={category}
                    type="button"
                    className={activeCategory === category ? "is-active" : ""}
                    aria-pressed={activeCategory === category}
                    onClick={() => {
                      setActiveCategory(category);
                      setShowAllCultureResults(false);
                    }}
                  >
                    {category}
                    <span>{categoryCount}</span>
                  </button>
                );
              })}
            </div>

            <div className="culture-catalog__tools">
              <label>
                <span>Sök i kulturkatalogen</span>
                <input
                  type="search"
                  value={cultureQuery}
                  onChange={(event) => {
                    setCultureQuery(event.target.value);
                    setShowAllCultureResults(false);
                  }}
                  placeholder="Sök plats, uttryck eller område"
                />
              </label>
              <div className="culture-scope" aria-label="Visa efter tid">
                {([
                  ["snart", "Nu & snart"],
                  ["alla", "Allt"],
                  ["kommande", "Datum"],
                  ["permanenta", "Alltid"],
                ] as const).map(([scope, label]) => (
                  <button
                    type="button"
                    className={cultureScope === scope ? "is-active" : ""}
                    aria-pressed={cultureScope === scope}
                    onClick={() => {
                      setCultureScope(scope);
                      setShowAllCultureResults(false);
                    }}
                    key={scope}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="culture-scope" aria-label="Visa efter plats">
                {([
                  ["alla", "Alla platser"],
                  ["museum", "Museum"],
                  ["kulturhus", "Kulturhus"],
                ] as const).map(([scope, label]) => (
                  <button
                    type="button"
                    className={cultureVenueScope === scope ? "is-active" : ""}
                    aria-pressed={cultureVenueScope === scope}
                    onClick={() => {
                      setCultureVenueScope(scope);
                      setShowAllCultureResults(false);
                    }}
                    key={scope}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <p className="results-count" aria-live="polite">
              Visar {visibleCultureEvents.length} av {visibleCount} träffar
            </p>

            {visibleCount === 0 ? (
              <div className="culture-empty-state" role="status">
                <p className="kicker">INGEN TRÄFF ÄN</p>
                <h4>Prova en öppnare väg in.</h4>
                <p>
                  Sökningen och filtren gav ingen träff. Rensa dem för att se
                  hela den aktuella kulturkatalogen igen.
                </p>
                <button type="button" onClick={resetCultureFilters}>
                  Rensa alla filter
                </button>
              </div>
            ) : (
              <div className="event-grid">
                {visibleCultureEvents.map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    number={index + 1}
                    distanceMeters={
                      nearby.point && culturePoints.get(event.id)
                        ? distanceInMeters(
                            nearby.point,
                            culturePoints.get(event.id)!,
                          )
                        : null
                    }
                    approximateDistance={
                      nearby.source === "manual" ||
                      culturePoints.get(event.id)?.precision === "area"
                    }
                    isSaved={savedEventIds.includes(event.id)}
                    onToggleSave={toggleSavedEvent}
                  />
                ))}
              </div>
            )}

            {filteredCultureEvents.length > 5 ? (
              <button
                className="culture-catalog__more"
                type="button"
                aria-expanded={showAllCultureResults}
                onClick={() =>
                  setShowAllCultureResults((current) => !current)
                }
              >
                <span>
                  {showAllCultureResults
                    ? "Visa fem utvalda"
                    : `Visa alla ${filteredCultureEvents.length}`}
                </span>
                <CaretRight aria-hidden="true" size={19} weight="bold" />
              </button>
            ) : null}
          </section>
        ) : null}
      </section>
      ) : null}

      {activeView === "noje" ? (
      <section className="entertainment-section content-view" id="noje" data-view="noje">
        <div className="section-heading">
          <p className="kicker">NÖJE · HELA GÖTEBORG</p>
          <h2>Hela staden är en utflykt.</h2>
          <p>
            Skärgård, lekplatser, sevärdheter, natur, spel och sena scener.
            Hitta något för en egen dag, en dejt, hela familjen eller ett
            lugnare tempo – oavsett om Göteborg är hemma eller helt nytt.
          </p>
        </div>

        <section className="entertainment-tonight" aria-labelledby="entertainment-tonight-title">
          <div className="entertainment-subheading entertainment-subheading--tonight">
            <div>
              <p className="kicker">IKVÄLL & SNART</p>
              <h3 id="entertainment-tonight-title">När dagen inte ska sluta än.</h3>
            </div>
            <p>
              Ett kort, aktuellt urval av konserter, scen och festivaler med
              tydlig tid och direkt till arrangörens källa.
            </p>
          </div>

          <div className="entertainment-pulse">
              <div>
                <span>NÄSTA</span>
                <strong>{entertainmentEvents[0]?.time ?? "IKVÄLL"}</strong>
              </div>
              <p>
                {entertainmentEvents[0]?.title}
                {entertainmentEvents[0] ? (
                  <MapLink
                    className="entertainment-pulse__map-link"
                    query={eventMapQuery(entertainmentEvents[0])}
                    label={entertainmentEvents[0].venue}
                  >
                    {entertainmentEvents[0].venue} · Vägbeskrivning
                  </MapLink>
                ) : null}
              </p>
              <button type="button" onClick={showMusicInCulture}>
                Alla musikval
                <ArrowUpRight aria-hidden="true" size={17} weight="bold" />
              </button>
          </div>

          <div className="entertainment-rail">
            {entertainmentEvents.map((event, index) => (
              <article className="entertainment-pick" key={event.id}>
                <div className="entertainment-pick__number">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <p>{event.category}</p>
                  <h3>{event.title}</h3>
                  <span>
                    {event.dateLabel}
                    {event.time ? ` · ${event.time}` : ""}
                  </span>
                  <MapLink
                    className="entertainment-pick__map-link"
                    query={eventMapQuery(event)}
                    label={event.venue}
                  >
                    {event.venue} · {event.area} · Karta
                  </MapLink>
                </div>
                <div className="entertainment-pick__actions">
                  <SaveButton
                    event={event}
                    isSaved={savedEventIds.includes(event.id)}
                    onToggle={toggleSavedEvent}
                  />
                  <SourceLink event={event} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <EntertainmentExplorer />
      </section>
      ) : null}

      {activeView === "mat" ? (
        <div className="content-view" data-view="mat">
          <FoodExplorer />
        </div>
      ) : null}

      {activeView === "saved" ? <div className="content-view" data-view="saved"><SavedPocket embedded /></div> : null}
      {activeView === "profile" ? <section className="profile-home content-view" data-view="profile"><header className="profile-heading"><div><p className="kicker">DIN STADEN</p><h1>Gör dagen till din.</h1><p>Planera nästa utflykt och samla dina upplevelser.</p></div><button ref={settingsButtonRef} type="button" className="profile-settings" aria-label="Öppna inställningar" aria-expanded={settingsOpen} onClick={event => openSettings(event.currentTarget)}><GearSix size={24}/></button></header><DayPlanner /><button className="profile-saved-link" onClick={() => navigateToView("saved")}><BookmarkSimple size={22}/> Öppna mina sparade platser <ArrowUpRight size={20}/></button><details className="profile-journal"><summary>Min loggbok</summary><JournalLog /></details></section> : null}

      </main>

      <footer>
        <p>GÖTEBORG, SVERIGE</p>
        <p>KÄLLOR KONTROLLERADE · {culturalCatalogVerifiedAt}</p>
      </footer>

      <nav className="mobile-bottom-nav" aria-label="Huvudnavigation">{([{view:"home",hash:"#hem",label:"Hem",icon:House},{view:"explore",hash:"#utforska",label:"Utforska",icon:Compass},{view:"saved",hash:"#sparat",label:"Sparat",icon:BookmarkSimple},{view:"profile",hash:"#profil",label:"Profil",icon:UserCircle}] as const).map(item => <a key={item.view} href={item.hash} aria-current={!overlayOpen && (activeView === item.view || (item.view === "explore" && ["kultur","noje","mat"].includes(activeView))) ? "page" : undefined} onClick={event => { event.preventDefault(); navigateToView(item.view); }}><item.icon size={24}/><span>{item.label}</span></a>)}</nav>
      </div>

      {settingsOpen ? (
        <div
          className="settings-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSettingsOpen(false);
          }}
        >
          <section
            ref={settingsDialogRef}
            className="settings-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
          >
            <header>
              <div>
                <p className="kicker">DIN STADEN</p>
                <h2 id="settings-title">Inställningar</h2>
              </div>
              <button
                className="close-button"
                type="button"
                aria-label="Stäng inställningar"
                autoFocus
                onClick={() => setSettingsOpen(false)}
              >
                <X aria-hidden="true" size={22} weight="regular" />
              </button>
            </header>

            <div className="settings-section">
              <div className="settings-label">
                <Palette aria-hidden="true" size={19} weight="regular" />
                <div>
                  <h3>Utseende</h3>
                  <p>Välj den redaktionella rytm som passar dig.</p>
                </div>
              </div>
              <div className="theme-options">
                {themes.map((theme) => (
                  <button
                    className={`theme-option preview-${theme.id}`}
                    type="button"
                    aria-pressed={selectedTheme === theme.id}
                    onClick={() => selectTheme(theme.id)}
                    key={theme.id}
                  >
                    <span className="theme-preview" aria-hidden="true">
                      <span>STADEN</span>
                      <strong>19.00</strong>
                      <i />
                    </span>
                    <span className="theme-option-copy">
                      <span>
                        <strong>{theme.name}</strong>
                        {selectedTheme === theme.id ? (
                          <Check aria-hidden="true" size={17} weight="bold" />
                        ) : null}
                      </span>
                      <small>{theme.description}</small>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <p className="settings-admin-note">
              Databas, anslutning och publicering hanteras separat i adminytan.
            </p>
          </section>
        </div>
      ) : null}

      <SokOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={locateFromSearch}
        discoveries={discoveryFeed}
      />

      {journalSubject ? (
        <JournalPrompt
          subject={journalSubject}
          existing={journalEntries.find(
            (entry) =>
              entry.id === journalSubject.id &&
              entry.kind === journalSubject.kind,
          )}
          onClose={() => setJournalSubject(null)}
        />
      ) : null}
    </div>
  );
}
