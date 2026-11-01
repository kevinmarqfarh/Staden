"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Bell, Check } from "@phosphor-icons/react";
import { culturalEvents } from "@/data/cultural-events";
import { PlaceLink } from "./place-link";
import { activitiesForPlace, createPlaceResolver, getFollowsSnapshot, getServerFollowsSnapshot, parseFollows, placeKey, subscribeFollows, writeFollows } from "@/lib/follows";

const canonicalPlaceName = createPlaceResolver(culturalEvents);
const readFollows = (raw: string) => parseFollows(JSON.stringify(parseFollows(raw).map(item => ({ ...item, name: canonicalPlaceName(item.name) }))));

function useFollows() {
  const raw = useSyncExternalStore(subscribeFollows, getFollowsSnapshot, getServerFollowsSnapshot);
  return useMemo(() => readFollows(raw), [raw]);
}

export function FollowButton({ name: suppliedName }: { name: string }) {
  const name = canonicalPlaceName(suppliedName);
  const follows = useFollows();
  const following = follows.some(item => placeKey(item.name) === placeKey(name));
  const [message, setMessage] = useState("");
  function toggle() {
    // Read at click time so actions from another card/tab are not overwritten.
    const current = readFollows(getFollowsSnapshot());
    const exists = current.some(item => placeKey(item.name) === placeKey(name));
    if (!exists && current.length >= 200) { setMessage("Du kan följa högst 200 platser."); return; }
    const next = exists ? current.filter(item => placeKey(item.name) !== placeKey(name)) : [...current, {
      name,
      knownIds: culturalEvents.filter(event => placeKey(canonicalPlaceName(event.venue)) === placeKey(name)).map(event => event.id),
    }];
    setMessage(writeFollows(next) ? (exists ? `Du följer inte längre ${name}.` : `Du följer ${name}. Se aktiviteter i Profil.`) : "Kunde inte spara. Tillåt lagring i webbläsaren och försök igen.");
  }
  return <span className="follow-control"><button type="button" className="follow-button" aria-pressed={following} aria-label={`${following ? "Sluta följa" : "Följ"} ${name}`} title={`Följ aktiviteter från ${name} i Profil`} onClick={toggle}>{following ? <Check size={17} aria-hidden="true"/> : <Bell size={17} aria-hidden="true"/>}{following ? "Följer" : "Följ"}</button><span className="follow-feedback" role="status">{message}</span></span>;
}

export function FollowingPanel({ snapshot }: { snapshot: string }) {
  const follows = useFollows();
  return <section className="following-panel" aria-labelledby="following-title"><header><p className="kicker">HÅLL KOLL PÅ DINA FAVORITER</p><h2 id="following-title">Följer <small>{follows.length}</small></h2><p>Nya aktiviteter från platser du följer samlas här när katalogen uppdateras. Sparas i den här webbläsaren, utan push eller mejl.</p></header>
    {follows.length === 0 ? <p>Tryck på Följ vid en plats i Kultur, Nöje eller Mat för att börja.</p> : <div className="following-places">{follows.map(follow => {
      const activities = activitiesForPlace(follow.name, culturalEvents, snapshot);
      const fresh = activities.filter(event => !follow.knownIds.includes(event.id));
      return <article className="following-place" key={placeKey(follow.name)}><header><h3>{follow.name}</h3><FollowButton name={follow.name}/></header>{fresh.length > 0 ? <p className="kicker">{fresh.length} nya sedan du började följa</p> : null}
        {activities.length === 0 ? <p>Inga aktuella aktiviteter i katalogen just nu.</p> : <details><summary>Visa aktiviteter ({activities.length})</summary><ul>{activities.map(event => <li key={event.id}><a href={event.sourceUrl} target="_blank" rel="noopener noreferrer"><strong>{event.title}</strong><span>{event.dateLabel}{event.time ? ` · ${event.time}` : ""}{!follow.knownIds.includes(event.id) ? " · Ny" : ""}</span><span>Program & bokning ↗</span></a></li>)}</ul></details>}
        <PlaceLink name={follow.name} />
      </article>;
    })}</div>}
  </section>;
}
