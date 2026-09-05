import { culturalEvents } from "@/data/cultural-events";
import { entertainmentExperiences } from "@/data/entertainment";
import { restaurants } from "@/data/restaurants";

export type SearchKind = "kultur" | "noje" | "mat";

export type SearchResult = {
  key: string; // `${kind}:${id}`
  kind: SearchKind;
  id: string;
  title: string;
  subtitle: string; // e.g. venue or "OMRÅDE · Kategori"
  categoryLabel: string;
  area: string;
  mapQuery: string; // for MapLink, e.g. `${title}, ${area}, Göteborg`
  sourceUrl?: string;
  isFree?: boolean;
};

type IndexEntry = {
  result: SearchResult;
  // Field haystacks, all lowercased (sv-SE), for weighted ranking.
  titleText: string;
  facetText: string; // category, area, venue/subtitle
  bodyText: string; // description, keywords, flavours, bestFor, cuisine
  haystack: string; // everything joined
};

function lower(value: string): string {
  return value.toLocaleLowerCase("sv-SE");
}

function joinParts(parts: Array<string | undefined | null>): string {
  return parts.filter((part): part is string => Boolean(part)).join(" ");
}

function buildIndex(): IndexEntry[] {
  const entries: IndexEntry[] = [];

  for (const event of culturalEvents) {
    const title = event.title;
    const facet = joinParts([event.category, event.area, event.venue]);
    const body = joinParts([
      event.description,
      event.sourceLabel,
      event.dateLabel,
      ...(event.discoveryIntents ?? []),
    ]);
    entries.push({
      result: {
        key: `kultur:${event.id}`,
        kind: "kultur",
        id: event.id,
        title,
        subtitle: joinParts([event.venue, event.area])
          ? `${event.venue} · ${event.area}`
          : event.venue || event.area,
        categoryLabel: event.category,
        area: event.area,
        mapQuery: `${event.venue || title}, ${event.area}, Göteborg`,
        sourceUrl: event.sourceUrl,
        isFree: event.isFree,
      },
      titleText: lower(title),
      facetText: lower(facet),
      bodyText: lower(body),
      haystack: lower(joinParts([title, facet, body])),
    });
  }

  for (const experience of entertainmentExperiences) {
    const title = experience.title;
    const facet = joinParts([experience.category, experience.area, experience.subtitle]);
    const body = joinParts([
      experience.description,
      experience.keywords,
      experience.duration,
      experience.price,
      ...experience.audiences,
    ]);
    entries.push({
      result: {
        key: `noje:${experience.id}`,
        kind: "noje",
        id: experience.id,
        title,
        subtitle: experience.subtitle || experience.area,
        categoryLabel: experience.category,
        area: experience.area,
        mapQuery: `${title}, ${experience.area}, Göteborg`,
        sourceUrl: experience.url,
        isFree: experience.free,
      },
      titleText: lower(title),
      facetText: lower(facet),
      bodyText: lower(body),
      haystack: lower(joinParts([title, facet, body])),
    });
  }

  for (const restaurant of restaurants) {
    const title = restaurant.name;
    const facet = joinParts([restaurant.cuisine, restaurant.area, restaurant.format]);
    const body = joinParts([
      restaurant.description,
      restaurant.address,
      ...restaurant.flavours,
      ...restaurant.bestFor,
      ...(restaurant.editorialTags ?? []),
    ]);
    entries.push({
      result: {
        key: `mat:${restaurant.id}`,
        kind: "mat",
        id: restaurant.id,
        title,
        subtitle: joinParts([restaurant.cuisine, restaurant.area])
          ? `${restaurant.cuisine} · ${restaurant.area}`
          : restaurant.area,
        categoryLabel: restaurant.cuisine,
        area: restaurant.area,
        mapQuery: `${title}, ${restaurant.address || restaurant.area}, Göteborg`,
        sourceUrl: restaurant.sourceUrl,
      },
      titleText: lower(title),
      facetText: lower(facet),
      bodyText: lower(body),
      haystack: lower(joinParts([title, facet, body])),
    });
  }

  return entries;
}

const index: IndexEntry[] = buildIndex();

export const searchableCount: number = index.length;

function startsWordWith(text: string, token: string): boolean {
  if (text.startsWith(token)) return true;
  return text.includes(` ${token}`);
}

function scoreEntry(entry: IndexEntry, tokens: string[]): number {
  let score = 0;
  for (const token of tokens) {
    if (entry.titleText.includes(token)) {
      score += startsWordWith(entry.titleText, token) ? 120 : 80;
    } else if (entry.facetText.includes(token)) {
      score += startsWordWith(entry.facetText, token) ? 45 : 30;
    } else if (entry.bodyText.includes(token)) {
      score += startsWordWith(entry.bodyText, token) ? 14 : 8;
    }
  }
  return score;
}

export function searchAll(query: string, limit = 40): SearchResult[] {
  const normalized = lower(query).trim();
  if (!normalized) return [];

  const tokens = normalized.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const matches: Array<{ entry: IndexEntry; score: number; order: number }> = [];

  index.forEach((entry, order) => {
    // AND: every token must appear somewhere in the haystack.
    const hasAll = tokens.every((token) => entry.haystack.includes(token));
    if (!hasAll) return;
    matches.push({ entry, score: scoreEntry(entry, tokens), order });
  });

  matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.order - b.order;
  });

  return matches.slice(0, limit).map((match) => match.entry.result);
}
