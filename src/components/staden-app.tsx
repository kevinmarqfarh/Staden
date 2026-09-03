"use client";

import Image from "next/image";
import {
  ArrowDownRight,
  ArrowUpRight,
  BookmarkSimple,
  Buildings,
  CalendarBlank,
  CaretRight,
  Check,
  Confetti,
  ForkKnife,
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
import { useNearbyLocation } from "@/hooks/use-nearby-location";
import {
  distanceInMeters,
  formatDistance,
  resolveGothenburgPoint,
} from "@/lib/geo";
import {
  discoveryIntents,
  discoveryModes,
  getDiscoveryRecommendation,
  recommendationReason,
  type DiscoveryMode,
} from "@/lib/cultural-discovery";
import {
  addDaysToDateKey,
  dateKeyFromHighlightSnapshot,
  daysBetweenDateKeys,
  hasEventNotEnded,
  isEventActiveOnDate,
  isHighlightWindowActive,
  rotateHighlights,
} from "@/lib/highlights";
import {
  getSavedEntertainmentSnapshot,
  getServerSavedEntertainmentSnapshot,
  parseSavedEntertainmentIds,
  subscribeToSavedEntertainment,
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

const monthLabels = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAJ",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OKT",
  "NOV",
  "DEC",
] as const;

function eventMapQuery(event: CulturalEvent) {
  return [event.venue, event.area, "Göteborg"].filter(Boolean).join(", ");
}

const [verifiedYear, verifiedMonth, verifiedDay] =
  culturalCatalogVerifiedAt.split("-");
const culturalCatalogVerifiedLabel = `${Number(verifiedDay)} ${
  monthLabels[Number(verifiedMonth) - 1]
} ${verifiedYear}`;

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
type AppView = "home" | "kultur" | "noje" | "mat" | "profile";

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

const entertainmentEventCount =
  entertainmentExperiences.length +
  discoveryEvents.filter(
    (event) =>
      event.category === "Musik" ||
      event.category === "Scenkonst" ||
      event.category === "Festival",
  ).length;

function viewFromHash(hash: string): AppView {
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

const themeHeroMedia: Record<
  ThemeId,
  { src: string; alt: string; caption: string }
> = {
  staden: {
    src: "/media/jazz-under-traden.png",
    alt: "En jazztrio spelar utomhus inför publik i Göteborg.",
    caption: "Redaktionell bild",
  },
  atelier: {
    src: "/media/jazz-under-traden.png",
    alt: "En jazztrio spelar utomhus inför publik i Göteborg.",
    caption: "Redaktionell bild",
  },
  "blue-hour": {
    src: "/media/jazz-under-traden.png",
    alt: "En jazztrio spelar utomhus inför publik i Göteborg.",
    caption: "Redaktionell bild",
  },
  "sunday-edition": {
    src: "/media/jazz-under-traden.png",
    alt: "En jazztrio spelar under träden inför publik i Göteborg.",
    caption: "Söndagsupplagan · 01",
  },
  "blue-line": {
    src: "/media/theme-blue-line-gallery.png",
    alt: "Besökare på en vernissage i ett samtida galleri i Göteborg.",
    caption: "Blå Linjen · Utgåva 02",
  },
  "after-rain": {
    src: "/media/theme-after-rain-tram.png",
    alt: "En blå spårvagn och människor med paraplyer på en regnig gata i Göteborg.",
    caption: "Efter Regnet · Kvällsutgåva",
  },
};

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
    <article className={`event-card event-card--${event.category.toLowerCase()}`}>
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
  const [activeView, setActiveView] = useState<AppView>("home");
  const [discoveryIntent, setDiscoveryIntent] =
    useState<CulturalDiscoveryIntent | null>(null);
  const [discoveryMode, setDiscoveryMode] =
    useState<DiscoveryMode | null>(null);
  const [skippedRecommendationIds, setSkippedRecommendationIds] = useState<
    string[]
  >([]);
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
  const selectedTheme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const heroMedia = themeHeroMedia[selectedTheme];
  const highlightClock = useHighlightClock(culturalCatalogVerifiedAt);
  const today = dateKeyFromHighlightSnapshot(highlightClock);
  const activeDiscoveryEvents = useMemo(
    () => discoveryEvents.filter((event) => hasEventNotEnded(event, today)),
    [today],
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
  const homeRestaurantPool = useMemo(() => {
    const eligibleRestaurants = restaurants.filter(
      (restaurant) =>
        restaurant.verificationStatus !== "directory" &&
        isHighlightWindowActive(restaurant, today),
    );

    return [
      ...eligibleRestaurants.filter((restaurant) => restaurant.isNew),
      ...eligibleRestaurants.filter((restaurant) => !restaurant.isNew),
    ].slice(0, 16);
  }, [today]);
  const [homeFeaturedRestaurant] = useMemo(
    () => rotateHighlights(homeRestaurantPool, highlightClock, 1),
    [highlightClock, homeRestaurantPool],
  );
  const discoveryRecommendation = useMemo(
    () =>
      discoveryIntent || discoveryMode
        ? getDiscoveryRecommendation({
            events: activeDiscoveryEvents,
            snapshot: highlightClock,
            intent: discoveryIntent,
            mode: discoveryMode,
            skipIds: skippedRecommendationIds,
          })
        : null,
    [
      activeDiscoveryEvents,
      discoveryIntent,
      discoveryMode,
      highlightClock,
      skippedRecommendationIds,
    ],
  );
  const discoverySelectionLabel =
    discoveryMode === "overraska"
      ? "Överraska mig"
      : discoveryModes.find((mode) => mode.id === discoveryMode)?.label ??
        discoveryIntents.find((intent) => intent.id === discoveryIntent)?.label;
  const hasAnotherDiscoveryRecommendation = useMemo(() => {
    if (!discoveryRecommendation) return false;

    return Boolean(
      getDiscoveryRecommendation({
        events: activeDiscoveryEvents,
        snapshot: highlightClock,
        intent: discoveryIntent,
        mode: discoveryMode,
        skipIds: [
          ...skippedRecommendationIds,
          discoveryRecommendation.id,
        ],
      }),
    );
  }, [
    activeDiscoveryEvents,
    discoveryIntent,
    discoveryMode,
    discoveryRecommendation,
    highlightClock,
    skippedRecommendationIds,
  ]);

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
      window.requestAnimationFrame(() => window.scrollTo(0, 0));
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
    const hash = view === "home" ? "#hem" : view === "profile" ? "#profil" : `#${view}`;

    if (window.location.hash !== hash) {
      window.history.pushState(null, "", hash);
    }

    setCultureCatalogOpen(false);
    setShowAllCultureResults(false);
    viewFocusRequestedRef.current = true;
    setActiveView(view);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
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

  function showMusicInCulture() {
    navigateToView("kultur");
    openCultureCategory("Musik");
  }

  function chooseDiscoveryIntent(intent: CulturalDiscoveryIntent) {
    setDiscoveryIntent(intent);
    setDiscoveryMode(null);
    setSkippedRecommendationIds([]);
  }

  function chooseDiscoveryMode(mode: DiscoveryMode) {
    setDiscoveryMode(mode);
    setDiscoveryIntent(null);
    setSkippedRecommendationIds([]);
  }

  function showAnotherRecommendation() {
    if (!discoveryRecommendation) {
      setSkippedRecommendationIds([]);
      return;
    }

    setSkippedRecommendationIds((current) =>
      current.length >= 12
        ? []
        : [...current, discoveryRecommendation.id],
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
      <header className="site-header">
        <nav className="desktop-main-nav" aria-label="Sektioner">
          <a
            href="#kultur"
            aria-current={activeView === "kultur" ? "location" : undefined}
            onClick={(event) => {
              event.preventDefault();
              navigateToView("kultur");
            }}
          >
            Kultur
          </a>
          <a
            href="#noje"
            aria-current={activeView === "noje" ? "location" : undefined}
            onClick={(event) => {
              event.preventDefault();
              navigateToView("noje");
            }}
          >
            Nöje
          </a>
          <a
            href="#mat"
            aria-current={activeView === "mat" ? "location" : undefined}
            onClick={(event) => {
              event.preventDefault();
              navigateToView("mat");
            }}
          >
            Mat
          </a>
          <a
            href="#profil"
            aria-current={activeView === "profile" ? "location" : undefined}
            onClick={(event) => {
              event.preventDefault();
              navigateToView("profile");
            }}
          >
            Profil
          </a>
        </nav>
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
          <a
            className="saved-shortcut"
            href="#profil"
            aria-label={`Öppna Profil, ${savedEventIds.length + savedRestaurantIds.length + savedEntertainmentIds.length} sparade objekt`}
            aria-current={activeView === "profile" ? "location" : undefined}
            onClick={(event) => {
              event.preventDefault();
              navigateToView("profile");
            }}
          >
            <BookmarkSimple aria-hidden="true" size={18} weight="bold" />
            <span aria-live="polite">
              {savedEventIds.length + savedRestaurantIds.length + savedEntertainmentIds.length}
            </span>
          </a>
        </div>
      </header>

      <main className="view-main">
      <AmbientCityField />

      {activeView === "home" ? (
        <div className="content-view content-view--home" data-view="home">
      <section className="hero" id="hem">
        <div className="hero-copy">
          <p className="kicker">STADEN · UPPDATERAD {culturalCatalogVerifiedLabel}</p>
          <h1>
            Staden
            <br />
            står <em>öppen.</em>
          </h1>
          <p className="hero-description">
            {restaurants.length} restauranger och {culturalEvents.length}{" "}
            källkontrollerade kulturhändelser — från nya smaker och klassiska
            krogar till stora scener och lokala kulturhus.
          </p>
          <nav className="home-quick-nav" aria-label="Öppna en huvudfunktion">
            <a
              href="#kultur"
              onClick={(event) => {
                event.preventDefault();
                navigateToView("kultur");
              }}
            >
              <strong>{culturalEvents.length}</strong>
              <span>Kultur</span>
            </a>
            <a
              href="#noje"
              onClick={(event) => {
                event.preventDefault();
                navigateToView("noje");
              }}
            >
              <strong>{entertainmentEventCount}</strong>
              <span>Nöje</span>
            </a>
            <a
              href="#mat"
              onClick={(event) => {
                event.preventDefault();
                navigateToView("mat");
              }}
            >
              <strong>{restaurants.length}</strong>
              <span>Mat</span>
            </a>
          </nav>
        </div>

        <div className="hero-art">
          <Image
            src={heroMedia.src}
            alt={heroMedia.alt}
            fill
            priority
            sizes="(min-width: 900px) 50vw, 100vw"
          />
          <div className="hero-art__shade" />
          <div className="hero-art__stamp">
            <Sparkle aria-hidden="true" size={18} weight="fill" />
            <span>{String(culturalEvents.length).padStart(2, "0")} NYA</span>
          </div>
          <div className="event-caption">
            <span>GÖTEBORG I SEPTEMBER</span>
            <span>{heroMedia.caption}</span>
          </div>
        </div>
      </section>

      <section className="home-dashboard" aria-labelledby="home-dashboard-title">
        <div className="section-heading home-dashboard__heading">
          <p className="kicker">HEM · ÖVERBLICK</p>
          <h2 id="home-dashboard-title">Göteborg, just nu.</h2>
          <p>
            En redaktionell första vy över det som är aktuellt. Välj en ingång
            när du vill fördjupa dig i hela Kultur, Nöje eller Mat.
          </p>
        </div>

        <section
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
          </div>

          {discoveryIntent || discoveryMode ? (
            discoveryRecommendation ? (
              <article
                className="discovery-recommendation"
                aria-live="polite"
                key={discoveryRecommendation.id}
              >
                <div className="discovery-recommendation__topline">
                  <span>STADEN VÄLJER · {discoverySelectionLabel}</span>
                  <span>
                    {discoveryRecommendation.isFree
                      ? "GRATIS"
                      : discoveryRecommendation.priceMaxSek
                        ? `MAX ${discoveryRecommendation.priceMaxSek} KR`
                        : "KOLLA PRIS"}
                  </span>
                </div>
                <div className="discovery-recommendation__body">
                  <p>
                    {discoveryRecommendation.dateLabel}
                    {discoveryRecommendation.time
                      ? ` · ${discoveryRecommendation.time}`
                      : ""}
                  </p>
                  <h4>{discoveryRecommendation.title}</h4>
                  <p className="discovery-recommendation__why">
                    <strong>Varför?</strong>{" "}
                    {recommendationReason(
                      discoveryRecommendation,
                      discoveryIntent,
                      discoveryMode,
                    )}
                  </p>
                </div>
                <div className="discovery-recommendation__place">
                  <MapPin aria-hidden="true" size={17} weight="bold" />
                  <span>
                    {discoveryRecommendation.venue} · {discoveryRecommendation.area}
                  </span>
                </div>
                <div className="discovery-recommendation__actions">
                  <MapLink
                    className="discovery-recommendation__go"
                    query={eventMapQuery(discoveryRecommendation)}
                    label={discoveryRecommendation.venue}
                  >
                    Gå
                    <ArrowUpRight aria-hidden="true" size={18} weight="bold" />
                  </MapLink>
                  <SaveButton
                    event={discoveryRecommendation}
                    isSaved={savedEventIds.includes(discoveryRecommendation.id)}
                    onToggle={toggleSavedEvent}
                  />
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

        <div className="home-overview-grid">
          <a
            className="home-overview-card home-overview-card--culture"
            href="#kultur"
            onClick={(event) => {
              event.preventDefault();
              navigateToView("kultur");
            }}
          >
            <div className="home-overview-card__topline">
              <span>01 · KULTUR</span>
              <Buildings aria-hidden="true" size={21} weight="regular" />
            </div>
            <div className="home-overview-card__body">
              <p>{cultureDashboardEvents[0]?.dateLabel}</p>
              <h3>{cultureDashboardEvents[0]?.title}</h3>
              <span>{activeDiscoveryEvents.length} aktuella saker att upptäcka</span>
            </div>
            <div className="home-overview-card__action">
              <span>Öppna Kultur</span>
              <ArrowUpRight aria-hidden="true" size={18} weight="bold" />
            </div>
          </a>

          <a
            className="home-overview-card home-overview-card--entertainment"
            href="#noje"
            onClick={(event) => {
              event.preventDefault();
              navigateToView("noje");
            }}
          >
            <div className="home-overview-card__topline">
              <span>02 · NÖJE</span>
              <Confetti aria-hidden="true" size={21} weight="regular" />
            </div>
            <div className="home-overview-card__body">
              <p>{entertainmentEvents[0]?.time ?? "IKVÄLL"}</p>
              <h3>{entertainmentEvents[0]?.title}</h3>
              <span>{entertainmentEvents[0]?.venue}</span>
            </div>
            <div className="home-overview-card__action">
              <span>Öppna Nöje</span>
              <ArrowUpRight aria-hidden="true" size={18} weight="bold" />
            </div>
          </a>

          <a
            className="home-overview-card home-overview-card--food"
            href="#mat"
            onClick={(event) => {
              event.preventDefault();
              navigateToView("mat");
            }}
          >
            <div className="home-overview-card__topline">
              <span>03 · MAT</span>
              <ForkKnife aria-hidden="true" size={21} weight="regular" />
            </div>
            <div className="home-overview-card__body">
              <p>{homeFeaturedRestaurant?.cuisine}</p>
              <h3>{homeFeaturedRestaurant?.name}</h3>
              <span>
                {restaurants.length} restauranger · {homeFeaturedRestaurant?.area}
              </span>
            </div>
            <div className="home-overview-card__action">
              <span>Öppna Mat</span>
              <ArrowUpRight aria-hidden="true" size={18} weight="bold" />
            </div>
          </a>
        </div>

        {festivalHighlights[0] ? (
          <a
            className="home-festival-strip"
            href="#kultur"
            onClick={(event) => {
              event.preventDefault();
              navigateToView("kultur");
            }}
          >
            <span>{festivalPulse(festivalHighlights[0], today)}</span>
            <strong>{festivalHighlights[0].title}</strong>
            <span>
              {festivalHighlights[0].area}
              <ArrowUpRight aria-hidden="true" size={18} weight="bold" />
            </span>
          </a>
        ) : null}
      </section>
        </div>
      ) : null}

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
          <strong>{cultureNowOrSoonCount} val för idag och imorgon</strong>
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

      {activeView === "profile" ? (
        <div className="content-view" data-view="profile">
          <SavedPocket
            embedded
            settingsOpen={settingsOpen}
            settingsButtonRef={settingsButtonRef}
            onOpenSettings={openSettings}
          />
        </div>
      ) : null}

      </main>

      <footer>
        <p>GÖTEBORG, SVERIGE</p>
        <p>KÄLLOR KONTROLLERADE · {culturalCatalogVerifiedAt}</p>
      </footer>

      <nav className="mobile-bottom-nav" aria-label="Huvudnavigation">
        <a
          href="#kultur"
          aria-current={
            !overlayOpen && activeView === "kultur"
              ? "location"
              : undefined
          }
          onClick={(event) => {
            event.preventDefault();
            navigateToView("kultur");
          }}
        >
          <Buildings aria-hidden="true" size={23} weight="regular" />
          <span>Kultur</span>
        </a>
        <a
          href="#noje"
          aria-current={
            !overlayOpen && activeView === "noje"
              ? "location"
              : undefined
          }
          onClick={(event) => {
            event.preventDefault();
            navigateToView("noje");
          }}
        >
          <Confetti aria-hidden="true" size={23} weight="regular" />
          <span>Nöje</span>
        </a>
        <a
          href="#mat"
          aria-current={
            !overlayOpen && activeView === "mat"
              ? "location"
              : undefined
          }
          onClick={(event) => {
            event.preventDefault();
            navigateToView("mat");
          }}
        >
          <ForkKnife aria-hidden="true" size={23} weight="regular" />
          <span>Mat</span>
        </a>
        <a
          href="#profil"
          aria-current={
            !overlayOpen && activeView === "profile"
              ? "location"
              : undefined
          }
          onClick={(event) => {
            event.preventDefault();
            navigateToView("profile");
          }}
        >
          <UserCircle aria-hidden="true" size={24} weight="regular" />
          <span>Profil</span>
        </a>
      </nav>
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
    </div>
  );
}
