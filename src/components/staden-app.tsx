"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  BookmarkSimple,
  CalendarBlank,
  Check,
  Database,
  GearSix,
  MapPin,
  Palette,
  Sparkle,
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
  type CulturalEvent,
} from "@/data/cultural-events";
import { restaurants } from "@/data/restaurants";
import { FoodExplorer } from "@/components/food-explorer";
import {
  isSupabaseConfigured,
  verifySupabaseConnection,
} from "@/lib/supabase/client";

const SAVED_EVENTS_KEY = "staden:saved-cultural-events";
const SAVED_EVENTS_CHANGED = "staden:saved-cultural-events-changed";
const EMPTY_SAVED_EVENTS = "[]";
const THEME_KEY = "staden:theme";
const THEME_CHANGED = "staden:theme-changed";
const DEFAULT_THEME = "atelier";
const MAX_SAVED_EVENTS = 200;
const validEventIds = new Set(culturalEvents.map((event) => event.id));
const categories = [
  "Alla",
  "Festival",
  "Scenkonst",
  "Musik",
  "Konst",
  "Museum",
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
type ThemeId = "staden" | "atelier" | "blue-hour";
type ConnectionStatus = "idle" | "checking" | "connected" | "error";

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
    return stored === "staden" || stored === "blue-hour" || stored === "atelier"
      ? stored
      : DEFAULT_THEME;
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
  isSaved,
  onToggleSave,
}: {
  event: CulturalEvent;
  number: number;
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
          <span>
            {event.venue}
            <small>{event.area}</small>
          </span>
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

export function StadenApp() {
  const [activeCategory, setActiveCategory] =
    useState<CategoryFilter>("Alla");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("idle");
  const [savedRestaurantCount, setSavedRestaurantCount] = useState(0);
  const [connectionMessage, setConnectionMessage] = useState(
    isSupabaseConfigured
      ? "Klientvariablerna finns. Testa den direkta anslutningen."
      : "Projektadressen finns, men den publika nyckeln måste läggas in.",
  );
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const settingsDialogRef = useRef<HTMLElement>(null);
  const savedEventsSnapshot = useSyncExternalStore(
    subscribeToSavedEvents,
    getSavedEventsSnapshot,
    getServerSavedEventsSnapshot,
  );
  const savedEventIds = useMemo(
    () => parseSavedEventIds(savedEventsSnapshot),
    [savedEventsSnapshot],
  );
  const selectedTheme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", selectedTheme);
  }, [selectedTheme]);

  useEffect(() => {
    if (!settingsOpen) return;
    const settingsButton = settingsButtonRef.current;

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

  const featuredEvent = discoveryEvents.find((event) => event.featured);
  const showFeatured =
    featuredEvent &&
    (activeCategory === "Alla" || activeCategory === featuredEvent.category);

  const filteredEvents = useMemo(
    () =>
      discoveryEvents.filter(
        (event) =>
          !event.featured &&
          (activeCategory === "Alla" || event.category === activeCategory),
      ),
    [activeCategory],
  );

  const visibleCount = filteredEvents.length + (showFeatured ? 1 : 0);

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

  async function testConnection() {
    setConnectionStatus("checking");
    const result = await verifySupabaseConnection();
    setConnectionStatus(result.ok ? "connected" : "error");
    setConnectionMessage(result.message);
  }

  return (
    <main id="top">
      <div
        className="app-content"
        aria-hidden={settingsOpen ? "true" : undefined}
        inert={settingsOpen ? true : undefined}
      >
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="STADEN, startsida">
          STADEN
        </a>
        <div className="city-stamp" aria-label="Aktuell stad">
          <span>GÖTEBORG</span>
          <span>57.7089° N</span>
        </div>
        <div className="header-actions">
          <div
            className="saved-shortcut"
            role="status"
            aria-live="polite"
          >
            <BookmarkSimple aria-hidden="true" size={18} weight="bold" />
            <span>{savedEventIds.length + savedRestaurantCount}</span>
            <span className="sr-only"> sparade objekt</span>
          </div>
          <button
            ref={settingsButtonRef}
            className="settings-button"
            type="button"
            aria-label="Öppna inställningar"
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen(true)}
          >
            <GearSix aria-hidden="true" size={20} weight="regular" />
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">
            NYTT I KULTURKALENDERN · {culturalCatalogVerifiedLabel}
          </p>
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
          <div className="hero-actions">
            <a className="primary-action" href="#mat">
              <span>Utforska Göteborgs matscen</span>
              <span aria-hidden="true">↘</span>
            </a>
            <a className="secondary-action" href="#kultur">
              Se kulturkalendern
            </a>
          </div>
        </div>

        <div className="hero-art">
          <Image
            src="/media/jazz-under-traden.png"
            alt="En jazztrio spelar utomhus inför publik i Göteborg."
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
            <span>Redaktionell bild</span>
          </div>
        </div>
      </section>

      <section className="culture-section" id="kultur">
        <div className="section-heading">
          <p className="kicker">SKANNAT & KÄLLKONTROLLERAT</p>
          <h2>Nya skäl att gå ut.</h2>
          <p>
            Endast nya poster har lagts till. Varje evenemang leder tillbaka
            till arrangören eller en officiell stadskälla.
          </p>
        </div>

        <div className="filter-row" aria-label="Filtrera evenemang">
          {categories.map((category) => {
            const categoryCount =
              category === "Alla"
                ? culturalEvents.length
                : culturalEvents.filter((event) => event.category === category)
                    .length;

            return (
              <button
                key={category}
                type="button"
                className={activeCategory === category ? "is-active" : ""}
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
                <span>{categoryCount}</span>
              </button>
            );
          })}
        </div>

        <p className="results-count" aria-live="polite">
          {visibleCount} evenemang
        </p>

        {showFeatured && featuredEvent ? (
          <article className="featured-event">
            <div className="featured-event__date">
              <span>05</span>
              <span>SEP</span>
              <small>12—24</small>
            </div>
            <div className="featured-event__copy">
              <p className="event-category">UTVALD · MUSIK</p>
              <h3>{featuredEvent.title}</h3>
              <p>{featuredEvent.description}</p>
              <div className="featured-event__place">
                <MapPin aria-hidden="true" size={18} weight="bold" />
                <span>
                  {featuredEvent.venue} · {featuredEvent.area}
                </span>
              </div>
            </div>
            <div className="featured-event__actions">
              <SaveButton
                event={featuredEvent}
                isSaved={savedEventIds.includes(featuredEvent.id)}
                onToggle={toggleSavedEvent}
              />
              <SourceLink event={featuredEvent} />
            </div>
          </article>
        ) : null}

        {filteredEvents.length > 0 ? (
          <div className="event-grid">
            {filteredEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                number={index + 1}
                isSaved={savedEventIds.includes(event.id)}
                onToggleSave={toggleSavedEvent}
              />
            ))}
          </div>
        ) : null}
      </section>

      <FoodExplorer onSavedCountChange={setSavedRestaurantCount} />

      <footer>
        <p>GÖTEBORG, SVERIGE</p>
        <p>KÄLLOR KONTROLLERADE · {culturalCatalogVerifiedAt}</p>
      </footer>
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

            <div className="settings-section data-setting">
              <div className="settings-label">
                <Database aria-hidden="true" size={19} weight="regular" />
                <div>
                  <h3>Supabase</h3>
                  <p>rucwlpzrumxejvhwazat.supabase.co</p>
                </div>
              </div>
              <div className={`connection-card ${connectionStatus}`}>
                <div>
                  <span className="status-dot" aria-hidden="true" />
                  <p aria-live="polite">{connectionMessage}</p>
                </div>
                <button
                  type="button"
                  disabled={
                    !isSupabaseConfigured || connectionStatus === "checking"
                  }
                  onClick={testConnection}
                >
                  {connectionStatus === "checking"
                    ? "Testar…"
                    : "Testa anslutning"}
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
