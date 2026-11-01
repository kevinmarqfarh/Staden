"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { culturalEvents, type CulturalEvent } from "@/data/cultural-events";
import type { Objekt } from "@/lib/typer";
import { placeProgramme, placeForEvent } from "@/lib/places";
import { useHighlightClock } from "@/hooks/use-highlight-clock";
import { FollowButton } from "./following";
import { MapLink } from "./map-link";

const KEY = "staden:saved-cultural-events";
const CHANGED = "staden:saved-cultural-events-changed";
function subscribe(listener: () => void) {
  window.addEventListener("storage", listener); window.addEventListener(CHANGED, listener);
  return () => { window.removeEventListener("storage", listener); window.removeEventListener(CHANGED, listener); };
}
function snapshot() { try { return localStorage.getItem(KEY) ?? "[]"; } catch { return "[]"; } }
function parse(raw: string): string[] {
  try { const value: unknown = JSON.parse(raw); return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : []; } catch { return []; }
}
const serverSnapshot = () => "[]";

function Favourite({ id, title, place = false }: { id: string; title: string; place?: boolean }) {
  const saved = parse(useSyncExternalStore(subscribe, snapshot, serverSnapshot)).includes(id);
  const [error, setError] = useState("");
  function toggle() {
    const ids = parse(snapshot());
    try {
      localStorage.setItem(KEY, JSON.stringify(ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id]));
      window.dispatchEvent(new Event(CHANGED)); setError("");
    } catch { setError("Kunde inte spara. Kontrollera webbläsarens lagring."); }
  }
  return <span><button type="button" aria-pressed={saved} aria-label={`${saved ? "Ta bort favorit" : "Spara"} ${title}`} onClick={toggle}>{saved ? "✓ Sparad" : place ? "♡ Spara plats" : "♡ Spara evenemang"}</button>{error ? <span role="status">{error}</span> : null}</span>;
}

function Programme({ title, events }: { title: string; events: CulturalEvent[] }) {
  const [expanded, setExpanded] = useState(false);
  return <section className="place-programme"><h2>{title} <small>{events.length}</small></h2>{events.length ? <><div className="place-events">{(expanded ? events : events.slice(0, 4)).map(event => <article id={`event-${event.id}`} key={event.id}><p className="kicker">{event.category} · {event.dateLabel}</p><h3>{event.title}</h3><p>{event.time ?? "Se tider hos arrangören"} · {event.isFree ? "Fri entré" : event.priceMaxSek !== undefined ? `Upp till ${event.priceMaxSek} kr` : "Se pris hos arrangören"}</p><details><summary>Läs mer</summary><p>{event.description}</p><p>{event.venue}</p><a href={event.sourceUrl} target="_blank" rel="noopener noreferrer">Program, tider & bokning ↗</a></details><Favourite id={event.id} title={event.title}/></article>)}</div>{events.length > 4 ? <button type="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? "Visa färre" : `Visa alla ${events.length}`}</button> : null}</> : <p>Inga {title === "Kommande evenemang" ? "kommande evenemang" : "pågående program"} finns i vår katalog just nu. Se även platsens officiella program.</p>}</section>;
}

export function PlaceProfile({ place, serverDate }: { place: Objekt; serverDate: string }) {
  const clock = useHighlightClock(serverDate);
  const programme = placeProgramme(place.id, culturalEvents, clock);
  const directory = culturalEvents.find(event => event.dateLabel === "Permanent" && placeForEvent(event)?.id === place.id);
  const website = place.lankar.find(link => link.slag === "hemsida")?.url;
  useEffect(() => {
    try { const theme = localStorage.getItem("staden:theme"); if (theme && /^[a-z-]+$/.test(theme)) document.documentElement.dataset.theme = theme; } catch { /* Default theme remains available. */ }
  }, []);
  return <div className="place-page"><a className="skip-link" href="#place-content">Hoppa till innehållet</a><nav className="place-nav" aria-label="Navigation"><Link href="/#kultur">← Kultur</Link><Link href="/" aria-label="STADEN, startsida">STADEN</Link><Link href="/#profil">Profil</Link></nav><main id="place-content"><header className="place-hero"><p className="kicker">EN PLATS I GÖTEBORG · {place.kvarter}</p><h1>{place.titel}</h1><p className="place-intro">{place.underrubrik ?? place.varfor}</p><div className="place-actions"><FollowButton name={place.titel}/>{directory ? <Favourite id={directory.id} title={place.titel} place/> : null}</div><p className="place-note">Spara för ett framtida besök. Följ för nya aktiviteter i Profil. Dina val sparas i den här webbläsaren.</p></header>
    <div className="place-body"><div><Programme title="Kommande evenemang" events={programme.upcoming}/><Programme title="Pågår just nu" events={programme.ongoing}/></div><aside className="place-about"><h2>Om platsen</h2><p>{place.varfor}</p><h3>Hitta hit</h3><MapLink query={place.adress ?? `${place.titel}, Göteborg`} label={place.titel}>{place.adress ?? place.titel} ↗</MapLink><h3>Inför besöket</h3><p>Kontrollera öppettider, tillgänglighet och eventuella bokningskrav hos platsen innan du går.</p>{website ? <a href={website} target="_blank" rel="noopener noreferrer">Officiell webbplats & program ↗</a> : null}<Link href="/#sparat">Öppna mina sparade platser →</Link></aside></div>
  </main></div>;
}
