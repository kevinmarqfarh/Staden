"use client";

import {
  ArrowDown,
  ArrowUpRight,
  CaretDown,
  Check,
  MagnifyingGlass,
  MapPin,
  X,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import {
  entertainmentAudienceOptions,
  entertainmentCategories,
  entertainmentCategoryInfo,
  entertainmentExperiences,
  entertainmentJourneys,
  entertainmentVerifiedAt,
  type EntertainmentAudience,
  type EntertainmentCategory,
} from "@/data/entertainment";
import { MapLink } from "@/components/map-link";
import { NearbyControl } from "@/components/nearby-control";
import { useNearbyLocation } from "@/hooks/use-nearby-location";
import {
  distanceInMeters,
  formatDistance,
  resolveGothenburgPoint,
} from "@/lib/geo";

type AudienceFilter = "alla" | EntertainmentAudience;
type CategoryFilter = "Alla" | EntertainmentCategory;
type QuickFilter = "alla" | "gratis" | "regn" | "aktivt" | "lugnt" | "spontant";

const audienceLabels = new Map(
  entertainmentAudienceOptions.map((option) => [option.id, option.label]),
);

const quickFilters: Array<{ id: QuickFilter; label: string }> = [
  { id: "alla", label: "Alla lägen" },
  { id: "gratis", label: "Gratis" },
  { id: "regn", label: "Regnsäkert" },
  { id: "aktivt", label: "Aktivt" },
  { id: "lugnt", label: "Lugnt" },
  { id: "spontant", label: "Spontant" },
];

const INITIAL_RESULT_COUNT = 18;
const entertainmentPoints = new Map(
  entertainmentExperiences.map((item) => [
    item.id,
    resolveGothenburgPoint(item.title, item.area),
  ]),
);
const mappedEntertainmentCount = Array.from(
  entertainmentPoints.values(),
).filter(Boolean).length;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("sv-SE");
}

function scrollToCatalogue() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  window.requestAnimationFrame(() => {
    document.getElementById("noje-katalog")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  });
}

export function EntertainmentExplorer() {
  const [audience, setAudience] = useState<AudienceFilter>("alla");
  const [category, setCategory] = useState<CategoryFilter>("Alla");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("alla");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const nearby = useNearbyLocation();

  const filteredExperiences = useMemo(() => {
    const normalizedQuery = normalize(query.trim());

    return entertainmentExperiences
      .filter((item) => {
        const matchesAudience =
          audience === "alla" || item.audiences.includes(audience);
        const matchesCategory = category === "Alla" || item.category === category;
        const matchesQuickFilter =
          quickFilter === "alla" ||
          (quickFilter === "gratis" && item.free) ||
          (quickFilter === "regn" && item.setting !== "UTE") ||
          (quickFilter === "aktivt" && item.pace === "AKTIVT") ||
          (quickFilter === "lugnt" && item.pace === "LUGNT") ||
          (quickFilter === "spontant" && item.booking === "SPONTANT");
        const haystack = normalize(
          `${item.title} ${item.subtitle} ${item.description} ${item.area} ${item.category} ${item.keywords ?? ""}`,
        );
        const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);

        const point = entertainmentPoints.get(item.id);
        const distance = nearby.point && point
          ? distanceInMeters(nearby.point, point)
          : null;
        const matchesDistance =
          !nearby.point ||
          (distance !== null && distance <= nearby.radiusMeters);

        return matchesAudience && matchesCategory && matchesQuickFilter && matchesQuery && matchesDistance;
      })
      .sort((a, b) => {
        if (nearby.point) {
          const pointA = entertainmentPoints.get(a.id);
          const pointB = entertainmentPoints.get(b.id);
          const distanceA = pointA ? distanceInMeters(nearby.point, pointA) : Infinity;
          const distanceB = pointB ? distanceInMeters(nearby.point, pointB) : Infinity;
          return distanceA - distanceB;
        }
        const featuredDifference = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
        return featuredDifference || a.title.localeCompare(b.title, "sv-SE");
      });
  }, [audience, category, nearby.point, nearby.radiusMeters, query, quickFilter]);

  const visibleExperiences = showAll
    ? filteredExperiences
    : filteredExperiences.slice(0, INITIAL_RESULT_COUNT);
  const freeCount = entertainmentExperiences.filter((item) => item.free).length;
  const indoorCount = entertainmentExperiences.filter(
    (item) => item.setting !== "UTE",
  ).length;
  const isFiltered =
    audience !== "alla" || category !== "Alla" || quickFilter !== "alla" || Boolean(query);
  const verifiedDate = new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Stockholm",
  })
    .format(new Date(`${entertainmentVerifiedAt}T12:00:00+02:00`))
    .replace(".", "")
    .toLocaleUpperCase("sv-SE");

  function resetResultLimit() {
    setShowAll(false);
  }

  function chooseCategory(nextCategory: CategoryFilter) {
    setCategory(nextCategory);
    resetResultLimit();
  }

  function applyJourney(
    audienceFilter: AudienceFilter,
    categoryFilter: CategoryFilter,
  ) {
    setAudience(audienceFilter);
    setCategory(categoryFilter);
    setQuickFilter("alla");
    setQuery("");
    setShowAll(false);
    scrollToCatalogue();
  }

  function resetFilters() {
    setAudience("alla");
    setCategory("Alla");
    setQuickFilter("alla");
    setQuery("");
    setShowAll(false);
  }

  return (
    <div className="entertainment-discovery">
      <dl className="entertainment-stats" aria-label="Nöjesguidens omfattning">
        <div>
          <dt>UPPLEVELSER</dt>
          <dd>{entertainmentExperiences.length}</dd>
        </div>
        <div>
          <dt>TEMAN</dt>
          <dd>{entertainmentCategories.length - 1}</dd>
        </div>
        <div>
          <dt>GRATISVAL</dt>
          <dd>{freeCount}</dd>
        </div>
        <div>
          <dt>REGNSÄKRA</dt>
          <dd>{indoorCount}</dd>
        </div>
      </dl>

      <NearbyControl mappedCount={mappedEntertainmentCount} noun="upplevelser" />

      <section className="entertainment-journeys" aria-labelledby="noje-start-title">
        <div className="entertainment-subheading">
          <div>
            <p className="kicker">FYRA ENKLA STARTER</p>
            <h3 id="noje-start-title">Börja med en riktning.</h3>
          </div>
          <p>
            Färdiga spår för den som inte vill börja med hundra val. Ett tryck
            öppnar rätt del av katalogen, där du kan finjustera vidare.
          </p>
        </div>

        <div className="entertainment-journey-list">
          {entertainmentJourneys.map((journey) => (
            <button
              type="button"
              key={journey.id}
              onClick={() => applyJourney(journey.audience, journey.category)}
            >
              <span className="entertainment-journey__number">{journey.number}</span>
              <span className="entertainment-journey__copy">
                <small>{journey.eyebrow}</small>
                <strong>{journey.title}</strong>
                <span>{journey.description}</span>
              </span>
              <span className="entertainment-journey__stops">
                {journey.stops}
                <ArrowDown aria-hidden="true" size={17} weight="bold" />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section
        className="entertainment-catalogue"
        id="noje-katalog"
        aria-labelledby="noje-katalog-title"
      >
        <div className="entertainment-catalogue__inner">
          <div className="entertainment-catalogue__heading">
            <div>
              <p className="kicker">HELA GÖTEBORG, SORTERAT</p>
              <h3 id="noje-katalog-title">Vad känns rätt idag?</h3>
            </div>
            <p>
              Från en spontan timme i kvarteret till en heldag längst ut i
              havsbandet. Sök fritt eller börja med ett tema.
            </p>
          </div>

          <div className="entertainment-category-index" aria-label="Välj tema">
            {entertainmentCategoryInfo.map((item, index) => {
              const count = entertainmentExperiences.filter(
                (experience) => experience.category === item.id,
              ).length;

              return (
                <button
                  type="button"
                  key={item.id}
                  className={category === item.id ? "is-active" : ""}
                  aria-pressed={category === item.id}
                  onClick={() => chooseCategory(category === item.id ? "Alla" : item.id)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    <strong>{item.id}</strong>
                    <small>{item.description}</small>
                  </span>
                  <b>{String(count).padStart(2, "0")}</b>
                </button>
              );
            })}
          </div>

          <div className="entertainment-filter-panel">
            <label className="entertainment-search">
              <span className="sr-only">Sök bland nöjen</span>
              <MagnifyingGlass aria-hidden="true" size={20} />
              <input
                type="search"
                value={query}
                placeholder="Sök aktivitet, område eller känsla"
                onChange={(event) => {
                  setQuery(event.target.value);
                  resetResultLimit();
                }}
              />
              {query ? (
                <button type="button" aria-label="Rensa sökning" onClick={() => setQuery("")}>
                  <X aria-hidden="true" size={18} weight="bold" />
                </button>
              ) : null}
            </label>

            <div className="entertainment-filter-group">
              <p>SÄLLSKAP</p>
              <div>
                {entertainmentAudienceOptions.map((option) => {
                  const count =
                    option.id === "alla"
                      ? entertainmentExperiences.length
                      : entertainmentExperiences.filter((item) =>
                          item.audiences.includes(option.id as EntertainmentAudience),
                        ).length;

                  return (
                    <button
                      type="button"
                      key={option.id}
                      className={audience === option.id ? "is-active" : ""}
                      aria-pressed={audience === option.id}
                      title={option.description}
                      onClick={() => {
                        setAudience(option.id);
                        resetResultLimit();
                      }}
                    >
                      {audience === option.id ? <Check aria-hidden="true" size={14} weight="bold" /> : null}
                      {option.label}
                      <span>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="entertainment-filter-group">
              <p>LÄGE</p>
              <div>
                {quickFilters.map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    className={quickFilter === option.id ? "is-active" : ""}
                    aria-pressed={quickFilter === option.id}
                    onClick={() => {
                      setQuickFilter(option.id);
                      resetResultLimit();
                    }}
                  >
                    {quickFilter === option.id ? <Check aria-hidden="true" size={14} weight="bold" /> : null}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="entertainment-results-heading">
            <p aria-live="polite">
              {filteredExperiences.length} {filteredExperiences.length === 1 ? "TRÄFF" : "TRÄFFAR"}
              {nearby.point ? ` · NÄRMAST ${nearby.label?.toLocaleUpperCase("sv-SE")}` : ""}
              {category !== "Alla" ? ` · ${category.toLocaleUpperCase("sv-SE")}` : ""}
              {audience !== "alla" ? ` · ${audienceLabels.get(audience)?.toLocaleUpperCase("sv-SE")}` : ""}
            </p>
            <button type="button" onClick={resetFilters} disabled={!isFiltered}>
              Nollställ filter
            </button>
          </div>

          {visibleExperiences.length ? (
            <div className="experience-directory">
              {visibleExperiences.map((item, index) => {
                const itemPoint = entertainmentPoints.get(item.id);
                const distance = nearby.point && itemPoint
                  ? distanceInMeters(nearby.point, itemPoint)
                  : null;
                const approximate = nearby.source === "manual" || itemPoint?.precision === "area";

                return (
                <details className="experience-row" key={item.id}>
                  <summary>
                    <span className="experience-row__number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="experience-row__title">
                      <small>{item.category}</small>
                      <strong>{item.title}</strong>
                      <span>
                        {item.subtitle}
                        {distance !== null ? (
                          <small className="experience-row__distance">
                            {approximate ? "≈ " : ""}{formatDistance(distance)} bort
                          </small>
                        ) : null}
                      </span>
                    </span>
                    <span className="experience-row__where">
                      <MapPin aria-hidden="true" size={14} />
                      <span>
                        {item.area}
                        {distance !== null ? (
                          <small>{approximate ? "≈ " : ""}{formatDistance(distance)}</small>
                        ) : null}
                      </span>
                    </span>
                    <span className="experience-row__time">{item.duration}</span>
                    <CaretDown className="experience-row__caret" aria-hidden="true" size={19} weight="bold" />
                  </summary>

                  <div className="experience-row__details">
                    <p>{item.description}</p>
                    <dl>
                      <div><dt>PRIS</dt><dd>{item.price}</dd></div>
                      <div><dt>FORM</dt><dd>{item.setting}</dd></div>
                      <div><dt>TEMPO</dt><dd>{item.pace}</dd></div>
                      <div><dt>PLAN</dt><dd>{item.booking}</dd></div>
                      <div><dt>SÄSONG</dt><dd>{item.season}</dd></div>
                    </dl>
                    <div className="experience-row__footer">
                      <div className="experience-row__audiences" aria-label="Passar för">
                        {item.audiences.map((audienceId) => (
                          <span key={audienceId}>{audienceLabels.get(audienceId)}</span>
                        ))}
                      </div>
                      <div className="experience-row__links">
                        <MapLink
                          query={[item.title, item.area, "Göteborg"].join(", ")}
                          label={item.title}
                        >
                          Vägbeskrivning
                          <MapPin aria-hidden="true" size={16} weight="bold" />
                        </MapLink>
                        <a href={item.url} target="_blank" rel="noreferrer">
                          Planera besöket
                          <ArrowUpRight aria-hidden="true" size={16} weight="bold" />
                        </a>
                      </div>
                    </div>
                  </div>
                </details>
                );
              })}
            </div>
          ) : (
            <div className="entertainment-empty-state">
              <p className="kicker">INGA TRÄFFAR</p>
              <h4>Prova en större del av staden.</h4>
              <p>
                Ta bort ett filter eller sök på ett område, till exempel Haga,
                Hisingen eller skärgård.
              </p>
              <button type="button" onClick={resetFilters}>Visa alla nöjen</button>
            </div>
          )}

          {filteredExperiences.length > INITIAL_RESULT_COUNT ? (
            <button
              type="button"
              className="entertainment-load-more"
              aria-expanded={showAll}
              onClick={() => setShowAll((current) => !current)}
            >
              <span>
                {showAll
                  ? "Visa det korta urvalet"
                  : `Visa alla ${filteredExperiences.length} upplevelser`}
              </span>
              <ArrowDown aria-hidden="true" size={20} weight="bold" />
            </button>
          ) : null}

          <div className="entertainment-source-note">
            <p>
              <strong>KÄLLKONTROLLERAD {verifiedDate}</strong>
              Guiden bygger på Göteborgs Stads och Göteborg & Co:s officiella
              utbud. Öppettider, pris, tillgänglighet och avgångar kan ändras –
              kontrollera alltid länken innan du ger dig av.
            </p>
            <a href="https://www.goteborg.com/en/attractions" target="_blank" rel="noreferrer">
              Officiell Göteborgsguide
              <ArrowUpRight aria-hidden="true" size={16} weight="bold" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
