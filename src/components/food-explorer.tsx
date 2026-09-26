"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  BookOpenText,
  BookmarkSimple,
  CaretDown,
  CaretRight,
  Check,
  Clock,
  EnvelopeSimple,
  MapPin,
  MagnifyingGlass,
  Phone,
  SlidersHorizontal,
  Sparkle,
  X,
} from "@phosphor-icons/react";
import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  RESTAURANT_SCAN_DATE,
  restaurantCuisines,
  restaurantCoverage,
  restaurants,
  type Restaurant,
  type RestaurantPriceTier,
} from "@/data/restaurants";
import { foodGuides, type FoodGuideTag } from "@/data/food-guides";
import { MapLink } from "@/components/map-link";
import { NearbyControl } from "@/components/nearby-control";
import { useHighlightClock } from "@/hooks/use-highlight-clock";
import { clearNearbyLocation, useNearbyLocation } from "@/hooks/use-nearby-location";
import {
  distanceInMeters,
  formatDistance,
  resolveGothenburgPoint,
} from "@/lib/geo";
import {
  dateKeyFromHighlightSnapshot,
  isHighlightWindowActive,
  rotateHighlights,
} from "@/lib/highlights";

const SAVED_RESTAURANTS_KEY = "staden:saved-restaurants";
const SAVED_RESTAURANTS_CHANGED = "staden:saved-restaurants-changed";
const EMPTY_SAVED_RESTAURANTS = "[]";
const MAX_SAVED_RESTAURANTS = 200;
type RestaurantCollection = "all" | "new" | "michelin" | "work-lunch";
type RestaurantResult = {
  restaurant: Restaurant;
  distanceMeters: number | null;
  approximateDistance: boolean;
};

const INITIAL_VISIBLE_RESTAURANTS = 5;
const RESTAURANT_LOAD_MORE_BATCH = 5;

const restaurantPoints = new Map(
  restaurants.map((restaurant) => [
    restaurant.id,
    resolveGothenburgPoint(
      restaurant.address,
      restaurant.area,
      restaurant.name,
    ),
  ]),
);
const mappedRestaurantCount = Array.from(restaurantPoints.values()).filter(
  Boolean,
).length;

const validRestaurantIds = new Set(
  restaurants.map((restaurant) => restaurant.id),
);

const priceFilters: Array<{
  value: 0 | RestaurantPriceTier;
  label: string;
}> = [
  { value: 0, label: "Alla priser" },
  { value: 1, label: "Under 180 kr" },
  { value: 2, label: "180–350 kr" },
  { value: 3, label: "350–700 kr" },
  { value: 4, label: "Över 700 kr" },
];

const priceLabels: Record<RestaurantPriceTier, string> = {
  1: "Budget · under 180 kr",
  2: "Mellan · 180–350 kr",
  3: "Hög · 350–700 kr",
  4: "Premium · 700+ kr",
};

function scrollToResults() {
  scrollToFoodSection("mat-resultat");
}

function scrollToFoodSection(id: string) {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const target = document.getElementById(id);
  target?.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
  if (target) {
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }
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

function normalize(value: string) {
  return value
    .toLocaleLowerCase("sv-SE")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function RestaurantCard({
  restaurant,
  number,
  distanceMeters,
  approximateDistance,
  isSaved,
  onToggleSave,
}: {
  restaurant: Restaurant;
  number: number;
  distanceMeters: number | null;
  approximateDistance: boolean;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}) {
  return (
    <article className="restaurant-card" data-object-id={`mat:${restaurant.id}`}>
      <div className="restaurant-card__topline">
        <span>{String(number).padStart(2, "0")}</span>
        <div className="restaurant-card__badges">
          {distanceMeters !== null ? (
            <span className="restaurant-badge restaurant-badge--distance">
              <MapPin aria-hidden="true" size={12} weight="fill" />
              {approximateDistance ? "≈ " : ""}{formatDistance(distanceMeters)}
            </span>
          ) : null}
          {restaurant.isNew ? (
            <span className="restaurant-badge restaurant-badge--new">
              <Sparkle aria-hidden="true" size={12} weight="fill" />
              Ny
            </span>
          ) : null}
          {restaurant.isMichelin ? (
            <span className="restaurant-badge">Michelin</span>
          ) : null}
          {restaurant.isWorkLunch ? (
            <span className="restaurant-badge">Jobblunch</span>
          ) : null}
          {restaurant.verificationStatus === "directory" ? (
            <span className="restaurant-badge restaurant-badge--directory">
              Katalog · kontrollera
            </span>
          ) : null}
          {restaurant.isVegan ? (
            <span className="restaurant-badge">Växtbaserat</span>
          ) : null}
        </div>
      </div>

      <div className="restaurant-card__body">
        <p className="restaurant-format">{restaurant.format}</p>
        <h3>{restaurant.name}</h3>
        <p>{restaurant.description}</p>
      </div>

      <div className="restaurant-card__flavours" aria-label="Smakinriktning">
        <span>{restaurant.cuisine}</span>
        {restaurant.flavours.slice(0, 2).map((flavour) => (
          <span key={flavour}>{flavour}</span>
        ))}
      </div>

      <div className="restaurant-card__details">
        <p>
          <MapPin aria-hidden="true" size={17} weight="bold" />
          <MapLink
            className="restaurant-card__address-link"
            query={[restaurant.address, restaurant.area, "Göteborg"]
              .filter(Boolean)
              .join(", ")}
            label={restaurant.name}
          >
            <span>
              {restaurant.address}
              <small>{restaurant.area} · Vägbeskrivning</small>
            </span>
          </MapLink>
        </p>
        <p>
          <span className="price-symbol" aria-hidden="true">
            {"·".repeat(restaurant.priceTier)}
          </span>
          <span>
            {restaurant.verificationStatus === "directory"
              ? `Prisindikation · ${priceLabels[restaurant.priceTier]}`
              : priceLabels[restaurant.priceTier]}
            {restaurant.opened ? <small>Öppnade {restaurant.opened}</small> : null}
          </span>
        </p>
      </div>

      {restaurant.hours || restaurant.phone || restaurant.email ? (
        <details className="restaurant-practical">
          <summary>
            Öppettider & kontakt
            <CaretDown aria-hidden="true" size={17} weight="bold" />
          </summary>
        {restaurant.hours ? (
          <p className="restaurant-card__hours">
            <Clock aria-hidden="true" size={17} weight="bold" />
            <span>
              <small>Öppettider</small>
              {restaurant.hours}
              {restaurant.lastVerified ? (
                <small>Kontrollerad {restaurant.lastVerified}</small>
              ) : null}
            </span>
          </p>
        ) : null}
      {restaurant.phone || restaurant.email ? (
        <div className="restaurant-card__contact" aria-label="Kontakt">
          {restaurant.phone ? (
            <a href={`tel:${restaurant.phone.replace(/[^+\d]/g, "")}`}>
              <Phone aria-hidden="true" size={15} weight="bold" />
              {restaurant.phone}
            </a>
          ) : null}
          {restaurant.email ? (
            <a href={`mailto:${restaurant.email}`}>
              <EnvelopeSimple aria-hidden="true" size={15} weight="bold" />
              {restaurant.email}
            </a>
          ) : null}
        </div>
      ) : null}
        </details>
      ) : null}

      <div className="restaurant-card__best-for" aria-label="Passar bäst för">
        {restaurant.bestFor.map((occasion) => (
          <span key={occasion}>{occasion}</span>
        ))}
      </div>

      <div className="restaurant-card__actions">
        <button
          className={`save-button${isSaved ? " is-saved" : ""}`}
          type="button"
          aria-pressed={isSaved}
          aria-label={`${isSaved ? "Ta bort" : "Spara"} ${restaurant.name}`}
          onClick={() => onToggleSave(restaurant.id)}
        >
          {isSaved ? (
            <Check aria-hidden="true" size={17} weight="bold" />
          ) : (
            <BookmarkSimple aria-hidden="true" size={17} weight="bold" />
          )}
          <span>{isSaved ? "Sparad" : "Spara"}</span>
        </button>
        <div>
          {restaurant.bookingUrl ? (
            <a
              href={restaurant.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Boka
              <ArrowUpRight aria-hidden="true" size={15} weight="bold" />
            </a>
          ) : null}
          {restaurant.websiteUrl ? (
            <a
              href={restaurant.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Besök
              <ArrowUpRight aria-hidden="true" size={15} weight="bold" />
            </a>
          ) : null}
          <a
            href={restaurant.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Öppna källan för ${restaurant.name}`}
          >
            Källa
            <ArrowUpRight aria-hidden="true" size={15} weight="bold" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function FoodExplorer({
  onSavedCountChange,
}: {
  onSavedCountChange?: (count: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState("Alla");
  const [priceTier, setPriceTier] = useState<0 | RestaurantPriceTier>(0);
  const [activeCollection, setActiveCollection] =
    useState<RestaurantCollection>("all");
  const [activeGuideTag, setActiveGuideTag] = useState<FoodGuideTag | null>(
    null,
  );
  const [visibleLimit, setVisibleLimit] = useState(INITIAL_VISIBLE_RESTAURANTS);
  const [saveMessage, setSaveMessage] = useState("");
  const nearby = useNearbyLocation();
  const highlightClock = useHighlightClock(RESTAURANT_SCAN_DATE);
  const today = dateKeyFromHighlightSnapshot(highlightClock);
  const activeFoodGuides = useMemo(
    () =>
      rotateHighlights(
        foodGuides.filter((guide) => isHighlightWindowActive(guide, today)),
        highlightClock,
      ),
    [highlightClock, today],
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
  const activeFilterCount =
    Number(Boolean(query.trim())) + Number(cuisine !== "Alla") +
    Number(priceTier !== 0) + Number(activeCollection !== "all") +
    Number(activeGuideTag !== null) + Number(Boolean(nearby.point));

  useEffect(() => {
    onSavedCountChange?.(savedRestaurantIds.length);
  }, [onSavedCountChange, savedRestaurantIds.length]);

  const stats = useMemo(
    () => ({
      areas: new Set(restaurants.map((restaurant) => restaurant.area)).size,
      cuisines: new Set(restaurants.map((restaurant) => restaurant.cuisine)).size,
      newPlaces: restaurants.filter((restaurant) => restaurant.isNew).length,
      michelin: restaurants.filter((restaurant) => restaurant.isMichelin).length,
      workLunch: restaurants.filter((restaurant) => restaurant.isWorkLunch).length,
    }),
    [],
  );

  const collections: Array<{
    value: RestaurantCollection;
    label: string;
    description: string;
    count: number;
  }> = [
    {
      value: "all",
      label: "Alla",
      description: "Hela restaurangbanken",
      count: restaurants.length,
    },
    {
      value: "new",
      label: "Nyöppnat",
      description: "Senaste tillskotten",
      count: stats.newPlaces,
    },
    {
      value: "michelin",
      label: "Michelin",
      description: "Alla Göteborgs stjärnkrogar",
      count: stats.michelin,
    },
    {
      value: "work-lunch",
      label: "Jobblunch",
      description: "Vardagsöppet mitt på dagen",
      count: stats.workLunch,
    },
  ];

  const cuisineCounts = useMemo(
    () =>
      new Map(
        restaurantCuisines.map((option) => [
          option,
          option === "Alla"
            ? restaurants.length
            : restaurants.filter((restaurant) => restaurant.cuisine === option)
                .length,
        ]),
      ),
    [],
  );

  const filteredRestaurants = useMemo(() => {
    const normalizedQuery = normalize(query.trim());

    return restaurants
      .filter((restaurant) => {
        const searchable = normalize(
          [
            restaurant.name,
            restaurant.cuisine,
            restaurant.area,
            restaurant.address,
            restaurant.format,
            restaurant.description,
            ...restaurant.flavours,
            ...restaurant.bestFor,
            restaurant.phone ?? "",
            restaurant.email ?? "",
            restaurant.hours ?? "",
            restaurant.isMichelin ? "Michelin stjärnkrog" : "",
            restaurant.isWorkLunch ? "Jobblunch vardagslunch" : "",
          ].join(" "),
        );

        const matchesCollection =
          activeCollection === "all" ||
          (activeCollection === "new" && restaurant.isNew) ||
          (activeCollection === "michelin" && restaurant.isMichelin) ||
          (activeCollection === "work-lunch" && restaurant.isWorkLunch);

        const matchesGuide =
          activeGuideTag === null ||
          restaurant.editorialTags?.includes(activeGuideTag);

        return (
          (!normalizedQuery || searchable.includes(normalizedQuery)) &&
          (cuisine === "Alla" || restaurant.cuisine === cuisine) &&
          (priceTier === 0 || restaurant.priceTier === priceTier) &&
          matchesCollection &&
          matchesGuide
        );
      })
      .map<RestaurantResult>((restaurant) => {
        const point = restaurantPoints.get(restaurant.id) ?? null;
        const distanceMeters =
          nearby.point && point
            ? distanceInMeters(nearby.point, point)
            : null;

        return {
          restaurant,
          distanceMeters,
          approximateDistance:
            nearby.source === "manual" || point?.precision === "area",
        };
      })
      .filter(
        (result) =>
          !nearby.point ||
          (result.distanceMeters !== null &&
            result.distanceMeters <= nearby.radiusMeters),
      )
      .sort((left, right) => {
        if (!nearby.point) return 0;
        return (left.distanceMeters ?? Infinity) - (right.distanceMeters ?? Infinity);
      });
  }, [
    activeCollection,
    activeGuideTag,
    cuisine,
    nearby.point,
    nearby.radiusMeters,
    nearby.source,
    priceTier,
    query,
  ]);

  const groupedRestaurants = useMemo(() => {
    if (nearby.point) {
      return [
        ["Närmast dig", filteredRestaurants.slice(0, visibleLimit)],
      ] as Array<[string, RestaurantResult[]]>;
    }

    const grouped = new Map<string, RestaurantResult[]>();

    filteredRestaurants.slice(0, visibleLimit).forEach((result) => {
      const group = grouped.get(result.restaurant.cuisine) ?? [];
      group.push(result);
      grouped.set(result.restaurant.cuisine, group);
    });

    return Array.from(grouped.entries()).sort(([left], [right]) =>
      left.localeCompare(right, "sv-SE"),
    );
  }, [filteredRestaurants, nearby.point, visibleLimit]);

  function toggleSavedRestaurant(id: string) {
    const isSaved = savedRestaurantIds.includes(id);
    if (!isSaved && savedRestaurantIds.length >= MAX_SAVED_RESTAURANTS) {
      setSaveMessage("Fickan är full. Ta bort ett sparat matställe i Profil och försök igen.");
      return;
    }
    const next = isSaved
      ? savedRestaurantIds.filter((savedId) => savedId !== id)
      : [...savedRestaurantIds, id];

    try {
      window.localStorage.setItem(
        SAVED_RESTAURANTS_KEY,
        JSON.stringify(next),
      );
      window.dispatchEvent(new Event(SAVED_RESTAURANTS_CHANGED));
      const name = restaurants.find((restaurant) => restaurant.id === id)?.name;
      setSaveMessage(isSaved ? `${name} har tagits bort från Fickan.` : `${name} finns nu i Fickan under Profil.`);
    } catch {
      setSaveMessage("Det gick inte att spara. Kontrollera att webbläsaren tillåter lokal lagring och försök igen.");
    }
  }

  function resetFilters() {
    setVisibleLimit(INITIAL_VISIBLE_RESTAURANTS);
    setQuery("");
    setCuisine("Alla");
    setPriceTier(0);
    setActiveCollection("all");
    setActiveGuideTag(null);
    clearNearbyLocation();
  }

  function selectCuisine(option: string) {
    setVisibleLimit(INITIAL_VISIBLE_RESTAURANTS);
    setCuisine(option);
    setActiveGuideTag(null);

    window.requestAnimationFrame(scrollToResults);
  }

  function openGuide(tag: FoodGuideTag) {
    setVisibleLimit(INITIAL_VISIBLE_RESTAURANTS);
    setQuery("");
    setCuisine("Alla");
    setActiveCollection("all");
    setActiveGuideTag(tag);
    setPriceTier(0);
    clearNearbyLocation();

    window.requestAnimationFrame(scrollToResults);
  }

  return (
    <section className="food-section explorer-refined" id="mat">
      <div className="section-heading">
        <p className="kicker">
          MATKATALOGEN · UPPDATERAD <span className="date-token">{RESTAURANT_SCAN_DATE}</span>
        </p>
        <h2>Göteborg på tallrik.</h2>
        <p>
          Hitta ditt nästa favoritställe. Välj ett kök, följ en guide eller
          sök efter något nära dig.
        </p>
        <details className="food-confidence-note">
          <summary>
            {restaurantCoverage.editorial} redaktionella val · {restaurantCoverage.directory + restaurantCoverage.fastFood} katalogposter
          </summary>
          <p>
            De redaktionella valen är källkontrollerade. Katalogen breddar med
            OpenStreetMap ({restaurantCoverage.directory} restauranger och {restaurantCoverage.fastFood} snabbmat),
            och {restaurantCoverage.excludedClosed} uttryckligen stängda verksamheter är bortfiltrerade.
            Pris och öppettider ska dubbelkollas före besök.
          </p>
        </details>
      </div>

      <nav className="explorer-jump-links" aria-label="Hitta i matguiden">
        <button type="button" onClick={() => scrollToFoodSection("mat-filter")}><MagnifyingGlass aria-hidden="true" size={18} />Sök matställe</button>
        <button type="button" onClick={() => scrollToFoodSection("mat-kok")}>Välj kök<CaretRight aria-hidden="true" size={17} /></button>
        <button type="button" onClick={() => scrollToFoodSection("mat-guider")}>Läs guider<CaretRight aria-hidden="true" size={17} /></button>
      </nav>

      <div className="food-stats" aria-label="Restaurangbankens täckning">
        <div>
          <strong>{restaurants.length}</strong>
          <span>restauranger</span>
        </div>
        <div>
          <strong>{stats.cuisines}</strong>
          <span>kök</span>
        </div>
        <div>
          <strong>{stats.areas}</strong>
          <span>områden</span>
        </div>
        <div>
          <strong>{stats.newPlaces}</strong>
          <span>nya 2025–26</span>
        </div>
      </div>

      <div className="cuisine-browser" id="mat-kok">
        <div className="food-subheading">
          <div>
            <p className="kicker">BÖRJA MED KÖKET</p>
            <h3>Vad är du sugen på?</h3>
          </div>
          <p>
            Italienskt, japanskt eller något nytt? Välj ett kök för att se adresserna.
          </p>
        </div>
        <div className="cuisine-rail" role="group" aria-label="Välj typ av kök">
          {restaurantCuisines.map((option, index) => (
            <button
              type="button"
              className={cuisine === option ? "is-active" : ""}
              aria-pressed={cuisine === option}
              onClick={() => selectCuisine(option)}
              key={option}
            >
              <span>{String(index).padStart(2, "0")}</span>
              <strong>{option === "Alla" ? "Alla kök" : option}</strong>
              <b>{cuisineCounts.get(option)}</b>
            </button>
          ))}
        </div>
      </div>

      <section className="editorial-food" id="mat-guider" aria-labelledby="editorial-food-title">
        <div className="food-subheading">
          <div>
            <p className="kicker">STADEN VÄLJER</p>
            <h3 id="editorial-food-title">Ät efter livet du lever.</h3>
          </div>
          <p>
            Takbarer, familjemiddagar och första dejter. Handplockade adresser
            för stunden du har framför dig.
          </p>
        </div>

        <div className="food-guide-feed">
          {activeFoodGuides.map((guide, index) => {
            const guideCount = restaurants.filter((restaurant) =>
              restaurant.editorialTags?.includes(guide.tag),
            ).length;

            return (
              <article className="food-guide-card" key={guide.id}>
                <div className="food-guide-card__media">
                  <Image
                    src={guide.imagePath}
                    alt={guide.imageAlt}
                    fill
                    sizes="(min-width: 900px) 33vw, 100vw"
                  />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="food-guide-card__copy">
                  <p>{guide.eyebrow}</p>
                  <h4>{guide.title}</h4>
                  <p>{guide.description}</p>
                  <div className="food-guide-card__meta">
                    <span>
                      <BookOpenText aria-hidden="true" size={16} weight="bold" />
                      Kurerat urval
                    </span>
                    <span>{guideCount} platser</span>
                  </div>
                  <div className="food-guide-card__actions">
                    <button
                      type="button"
                      aria-pressed={activeGuideTag === guide.tag}
                      onClick={() => openGuide(guide.tag)}
                    >
                      Visa {guideCount} platser
                      <CaretRight aria-hidden="true" size={17} weight="bold" />
                    </button>
                    {guide.sourceUrl ? (
                      <a
                        href={guide.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Öppna källan för ${guide.title}`}
                      >
                        Källa
                        <ArrowUpRight
                          aria-hidden="true"
                          size={15}
                          weight="bold"
                        />
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <NearbyControl mappedCount={mappedRestaurantCount} noun="matställen" />

      <div className="food-filter-panel" id="mat-filter">
        <div className="food-filter-panel__heading">
          <SlidersHorizontal aria-hidden="true" size={20} weight="bold" />
          <div>
            <h3>Hitta ett matställe</h3>
            <p>Sök fritt. Lägg till filter om du vill.</p>
          </div>
        </div>

        <div className="food-search" role="search">
          <label className="sr-only" htmlFor="food-query">Sök matställe</label>
          <MagnifyingGlass aria-hidden="true" size={19} weight="bold" />
          <input
            id="food-query"
            type="search"
            value={query}
            onChange={(event) => {
              setVisibleLimit(INITIAL_VISIBLE_RESTAURANTS);
              setQuery(event.target.value);
            }}
            placeholder="Restaurang, kök eller område"
          />
          {query ? <button type="button" aria-label="Rensa matsökning" onClick={() => { setQuery(""); setVisibleLimit(INITIAL_VISIBLE_RESTAURANTS); }}><X aria-hidden="true" size={18} weight="bold" /></button> : null}
        </div>

        <details className="explorer-filter-disclosure">
          <summary>
            <span><SlidersHorizontal aria-hidden="true" size={18} />Pris & urval</span>
            <span>{Number(priceTier !== 0) + Number(activeCollection !== "all") > 0 ? `${Number(priceTier !== 0) + Number(activeCollection !== "all")} valda` : "Valfritt"}<CaretDown aria-hidden="true" size={17} /></span>
          </summary>

        <div
          className="food-collections"
          role="group"
          aria-label="Snabba restaurangurval"
        >
          {collections.map((collection) => (
            <button
              className={
                activeCollection === collection.value && activeGuideTag === null
                  ? "is-active"
                  : ""
              }
              type="button"
              aria-pressed={
                activeCollection === collection.value && activeGuideTag === null
              }
              onClick={() => {
                setVisibleLimit(INITIAL_VISIBLE_RESTAURANTS);
                setActiveCollection(collection.value);
                setActiveGuideTag(null);
              }}
              key={collection.value}
            >
              <span className="food-collection__topline">
                <strong>{collection.label}</strong>
                <b>{collection.count}</b>
              </span>
              <span>{collection.description}</span>
            </button>
          ))}
        </div>

      <div className="food-controls">
        <p className="explorer-filter-label">Ungefärligt pris per person, utan dryck</p>
        <div className="price-filters" role="group" aria-label="Filtrera efter prisnivå">
          {priceFilters.map((filter) => (
            <button
              type="button"
              className={priceTier === filter.value ? "is-active" : ""}
              aria-pressed={priceTier === filter.value}
              onClick={() => {
                setVisibleLimit(INITIAL_VISIBLE_RESTAURANTS);
                setPriceTier(filter.value);
              }}
              key={filter.value}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
        </details>
        {activeFilterCount > 0 ? (
          <div className="explorer-active-filters" aria-label="Valda matfilter">
            {query.trim() ? <button type="button" onClick={() => setQuery("")} aria-label="Ta bort söktext">{query.trim()}<X aria-hidden="true" size={14} /></button> : null}
            {cuisine !== "Alla" ? <button type="button" onClick={() => setCuisine("Alla")} aria-label={`Ta bort köket ${cuisine}`}>{cuisine}<X aria-hidden="true" size={14} /></button> : null}
            {priceTier !== 0 ? <button type="button" onClick={() => setPriceTier(0)} aria-label="Ta bort prisfilter">{priceFilters.find((filter) => filter.value === priceTier)?.label}<X aria-hidden="true" size={14} /></button> : null}
            {activeCollection !== "all" ? <button type="button" onClick={() => setActiveCollection("all")} aria-label="Ta bort restaurangurval">{collections.find((collection) => collection.value === activeCollection)?.label}<X aria-hidden="true" size={14} /></button> : null}
            {activeGuideTag ? <button type="button" onClick={() => setActiveGuideTag(null)} aria-label={`Ta bort guiden ${activeGuideTag}`}>{activeGuideTag}<X aria-hidden="true" size={14} /></button> : null}
            {nearby.point ? <button type="button" onClick={clearNearbyLocation} aria-label="Sök i hela Göteborg">Nära {nearby.label}<X aria-hidden="true" size={14} /></button> : null}
            <button className="explorer-reset" type="button" onClick={resetFilters}>Rensa alla ({activeFilterCount})</button>
          </div>
        ) : null}
      </div>

      <div className="food-results-heading" id="mat-resultat">
        <p aria-live="polite">
          {filteredRestaurants.length} träffar
          {nearby.point ? ` · närmast ${nearby.label}` : ""}
          {activeGuideTag ? ` · ${activeGuideTag}` : ""}
          {!activeGuideTag && cuisine !== "Alla" ? ` · ${cuisine}` : ""}
        </p>
        <button type="button" onClick={() => scrollToFoodSection("mat-kok")}>Byt kök<CaretRight aria-hidden="true" size={16} /></button>
      </div>

      {filteredRestaurants.length > 0 ? (
        <>
          <div className="cuisine-results">
            {groupedRestaurants.map(([groupName, groupRestaurants]) => (
              <section
                className="cuisine-group"
                aria-labelledby={`cuisine-${normalize(groupName)}`}
                key={groupName}
              >
                <header>
                  <h3 id={`cuisine-${normalize(groupName)}`}>{groupName}</h3>
                  <span>{groupRestaurants.length} platser</span>
                </header>
                <div className="restaurant-grid">
                  {groupRestaurants.map((result) => (
                    <RestaurantCard
                      restaurant={result.restaurant}
                      number={filteredRestaurants.indexOf(result) + 1}
                      distanceMeters={result.distanceMeters}
                      approximateDistance={result.approximateDistance}
                      isSaved={savedRestaurantIds.includes(result.restaurant.id)}
                      onToggleSave={toggleSavedRestaurant}
                      key={result.restaurant.id}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

        {filteredRestaurants.length > visibleLimit ? (
          <div className="food-load-more">
            <p>
              Visar {visibleLimit} av {filteredRestaurants.length} träffar
            </p>
            <button
              type="button"
              onClick={() =>
                setVisibleLimit((current) => current + RESTAURANT_LOAD_MORE_BATCH)
              }
            >
              Visa {Math.min(RESTAURANT_LOAD_MORE_BATCH, filteredRestaurants.length - visibleLimit)} till
              <CaretRight aria-hidden="true" size={17} weight="bold" />
            </button>
          </div>
          ) : null}
        </>
      ) : (
        <div className="food-empty-state">
          <h3>Lite för smalt urval.</h3>
          <p>{nearby.point ? "Inga matställen matchar här. Prova hela Göteborg eller ta bort ett filter ovan." : "Inga matställen matchar just nu. Ta bort ett filter eller prova ett annat kök."}</p>
          <button type="button" onClick={resetFilters}>
            Visa alla matställen
          </button>
        </div>
      )}

      {saveMessage ? <p className="explorer-save-feedback" role="status">{saveMessage}<button type="button" onClick={() => setSaveMessage("")} aria-label="Stäng sparmeddelande"><X aria-hidden="true" size={17} /></button></p> : null}

      <p className="food-data-note">
        <strong>Källnivå:</strong> Redaktionella poster är handplockade från
        officiella restaurang- och Göteborgskällor. Katalogposter täcker hela
        Göteborgs kommun via OpenStreetMap; kontakt- och öppettidsfält visas
        när de finns och koordinat visas när gatuadress saknas. Dubbelkolla
        katalogposter före besök; saknad prisdata får neutral prisklass 2.
        <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>
        · senast skannad {RESTAURANT_SCAN_DATE}.
      </p>
    </section>
  );
}
