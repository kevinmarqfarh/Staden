"use client";

import {
  ArrowUpRight,
  BookmarkSimple,
  Check,
  MapPin,
  MagnifyingGlass,
  Sparkle,
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
  restaurants,
  type Restaurant,
  type RestaurantPriceTier,
} from "@/data/restaurants";

const SAVED_RESTAURANTS_KEY = "staden:saved-restaurants";
const SAVED_RESTAURANTS_CHANGED = "staden:saved-restaurants-changed";
const EMPTY_SAVED_RESTAURANTS = "[]";
const MAX_SAVED_RESTAURANTS = 200;
type RestaurantCollection = "all" | "new" | "michelin" | "work-lunch";

const validRestaurantIds = new Set(
  restaurants.map((restaurant) => restaurant.id),
);

const priceFilters: Array<{
  value: 0 | RestaurantPriceTier;
  label: string;
}> = [
  { value: 0, label: "Alla priser" },
  { value: 1, label: "Budget" },
  { value: 2, label: "Mellan" },
  { value: 3, label: "Hög" },
  { value: 4, label: "Avsmakning" },
];

const priceLabels: Record<RestaurantPriceTier, string> = {
  1: "Budget · under 180 kr",
  2: "Mellan · 180–350 kr",
  3: "Hög · 350–700 kr",
  4: "Avsmakning · 700+ kr",
};

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
  isSaved,
  onToggleSave,
}: {
  restaurant: Restaurant;
  number: number;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}) {
  return (
    <article className="restaurant-card">
      <div className="restaurant-card__topline">
        <span>{String(number).padStart(2, "0")}</span>
        <div className="restaurant-card__badges">
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
          <span>
            {restaurant.address}
            <small>{restaurant.area}</small>
          </span>
        </p>
        <p>
          <span className="price-symbol" aria-hidden="true">
            {"·".repeat(restaurant.priceTier)}
          </span>
          <span>
            {priceLabels[restaurant.priceTier]}
            {restaurant.opened ? <small>Öppnade {restaurant.opened}</small> : null}
          </span>
        </p>
      </div>

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
  const savedRestaurantsSnapshot = useSyncExternalStore(
    subscribeToSavedRestaurants,
    getSavedRestaurantsSnapshot,
    getServerSavedRestaurantsSnapshot,
  );
  const savedRestaurantIds = useMemo(
    () => parseSavedRestaurantIds(savedRestaurantsSnapshot),
    [savedRestaurantsSnapshot],
  );

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

  const filteredRestaurants = useMemo(() => {
    const normalizedQuery = normalize(query.trim());

    return restaurants.filter((restaurant) => {
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
          restaurant.isMichelin ? "Michelin stjärnkrog" : "",
          restaurant.isWorkLunch ? "Jobblunch vardagslunch" : "",
        ].join(" "),
      );

      const matchesCollection =
        activeCollection === "all" ||
        (activeCollection === "new" && restaurant.isNew) ||
        (activeCollection === "michelin" && restaurant.isMichelin) ||
        (activeCollection === "work-lunch" && restaurant.isWorkLunch);

      return (
        (!normalizedQuery || searchable.includes(normalizedQuery)) &&
        (cuisine === "Alla" || restaurant.cuisine === cuisine) &&
        (priceTier === 0 || restaurant.priceTier === priceTier) &&
        matchesCollection
      );
    });
  }, [activeCollection, cuisine, priceTier, query]);

  function toggleSavedRestaurant(id: string) {
    const next = savedRestaurantIds.includes(id)
      ? savedRestaurantIds.filter((savedId) => savedId !== id)
      : [...savedRestaurantIds, id];

    try {
      window.localStorage.setItem(
        SAVED_RESTAURANTS_KEY,
        JSON.stringify(next),
      );
      window.dispatchEvent(new Event(SAVED_RESTAURANTS_CHANGED));
    } catch {
      // Discovery remains usable when browser storage is unavailable.
    }
  }

  function resetFilters() {
    setQuery("");
    setCuisine("Alla");
    setPriceTier(0);
    setActiveCollection("all");
  }

  return (
    <section className="food-section" id="mat">
      <div className="section-heading">
        <p className="kicker">MATSCANNERN · VERIFIERAD {RESTAURANT_SCAN_DATE}</p>
        <h2>Göteborg på tallrik.</h2>
        <p>
          En växande restaurangbank som bryter ner staden efter kök, pris och
          kvarter — från nyöppnade luckor till institutioner och avsmakning.
        </p>
      </div>

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

      <div className="food-collections" aria-label="Kuraterade restaurangkategorier">
        {collections.map((collection) => (
          <button
            className={activeCollection === collection.value ? "is-active" : ""}
            type="button"
            aria-pressed={activeCollection === collection.value}
            onClick={() => setActiveCollection(collection.value)}
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
        <label className="food-search">
          <span className="sr-only">Sök i restaurangbanken</span>
          <MagnifyingGlass aria-hidden="true" size={19} weight="bold" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Sök kök, område eller restaurang"
          />
        </label>

        <label className="cuisine-select">
          <span>Kök</span>
          <select
            value={cuisine}
            onChange={(event) => setCuisine(event.target.value)}
          >
            {restaurantCuisines.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="price-filters" aria-label="Filtrera efter prisnivå">
          {priceFilters.map((filter) => (
            <button
              type="button"
              className={priceTier === filter.value ? "is-active" : ""}
              aria-pressed={priceTier === filter.value}
              onClick={() => setPriceTier(filter.value)}
              key={filter.value}
            >
              {filter.label}
            </button>
          ))}
        </div>

      </div>

      <div className="food-results-heading">
        <p aria-live="polite">{filteredRestaurants.length} träffar</p>
        <p>Pris per person, ungefärligt och utan dryck</p>
      </div>

      {filteredRestaurants.length > 0 ? (
        <div className="restaurant-grid">
          {filteredRestaurants.map((restaurant, index) => (
            <RestaurantCard
              restaurant={restaurant}
              number={index + 1}
              isSaved={savedRestaurantIds.includes(restaurant.id)}
              onToggleSave={toggleSavedRestaurant}
              key={restaurant.id}
            />
          ))}
        </div>
      ) : (
        <div className="food-empty-state">
          <p>Inga restauranger matchar den kombinationen ännu.</p>
          <button type="button" onClick={resetFilters}>
            Rensa filter
          </button>
        </div>
      )}
    </section>
  );
}
