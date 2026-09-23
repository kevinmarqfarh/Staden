"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, CalendarBlank, Check, MagnifyingGlass, Plus, X } from "@phosphor-icons/react";
import { culturalEvents } from "@/data/cultural-events";
import { entertainmentExperiences } from "@/data/entertainment";
import { restaurants } from "@/data/restaurants";
import { MapLink } from "@/components/map-link";
import { createDayPlan, createDayStop, getDayPlansSnapshot, isPlanDateEligible, MAX_DAYS, MAX_STOPS, parseDayPlans, subscribeDayPlans, writeDayPlans, type DayPlan, type DayStop, type PlanKind } from "@/lib/day-plans";

type Choice = { id: string; kind: PlanKind; title: string; area: string; detail: string; location: string; url: string; start?: string; end?: string; ongoing?: boolean; actualTime?: string };
const kinds: Record<PlanKind, string> = { culture: "Kultur", entertainment: "Nöje", food: "Mat" };
const catalog: Choice[] = [
  ...culturalEvents.map(e => ({ id: e.id, kind: "culture" as const, title: e.title, area: e.area, detail: `${e.category} · ${e.dateLabel}`, location: e.venue, url: e.sourceUrl, start: e.startDate, end: e.endDate, ongoing: e.isOngoing, actualTime: e.time })),
  ...entertainmentExperiences.map(e => ({ id: e.id, kind: "entertainment" as const, title: e.title, area: e.area, detail: e.category, location: `${e.title}, ${e.area}`, url: e.url })),
  ...restaurants.map(e => ({ id: e.id, kind: "food" as const, title: e.name, area: e.area, detail: e.cuisine, location: e.address, url: e.websiteUrl || e.sourceUrl })),
];
const byId = new Map(catalog.map(e => [`${e.kind}:${e.id}`, e]));
const savedKeys = ["staden:saved-cultural-events", "staden:saved-entertainment", "staden:saved-restaurants"];
function savedSnapshot() { try { return JSON.stringify(savedKeys.map(key => localStorage.getItem(key) || "[]")); } catch { return '[]'; } }
function subscribeSaved(fn: () => void) { const events = ["storage", ...savedKeys.map(key => `${key}-changed`)]; events.forEach(e => window.addEventListener(e, fn)); return () => events.forEach(e => window.removeEventListener(e, fn)); }
function savedSet(raw: string) {
  const result = new Set<string>();
  try { const groups = JSON.parse(raw); if (Array.isArray(groups)) groups.forEach((value, index) => { if (typeof value !== "string" || value.length > 100_000) return; const ids = JSON.parse(value); if (Array.isArray(ids)) ids.slice(0, 200).forEach(id => { if (typeof id === "string") result.add(`${["culture", "entertainment", "food"][index]}:${id}`); }); }); } catch { /* Invalid saved data never changes the user's lists. */ }
  return result;
}
const serverSnapshot = () => "[]";

export function DayPlanner() {
  const snapshot = useSyncExternalStore(subscribeDayPlans, getDayPlansSnapshot, serverSnapshot);
  const plans = useMemo(() => parseDayPlans(snapshot), [snapshot]);
  const savedRaw = useSyncExternalStore(subscribeSaved, savedSnapshot, serverSnapshot);
  const saved = useMemo(() => savedSet(savedRaw), [savedRaw]);
  const [selected, setSelected] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [picker, setPicker] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<PlanKind | "all">("all");
  const [onlySaved, setOnlySaved] = useState(false);
  const [limit, setLimit] = useState(8);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleted, setDeleted] = useState<DayPlan | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const focusAfterPick = useRef<HTMLButtonElement | null>(null);
  const plan = plans.find(p => p.id === selected);
  const matches = useMemo(() => catalog.filter(c => (kind === "all" || c.kind === kind) && (!onlySaved || saved.has(`${c.kind}:${c.id}`)) && `${c.title} ${c.area} ${c.detail}`.toLocaleLowerCase("sv").includes(query.trim().toLocaleLowerCase("sv")) && isPlanDateEligible(c, plan?.date || "")), [kind, onlySaved, saved, query, plan]);
  function commit(next: DayPlan[], notice = "Sparat") {
    if (!writeDayPlans(next)) { setError("Kunde inte spara på den här enheten. Kontrollera att webbläsaren tillåter lokal lagring och försök igen."); return false; }
    setError(""); setMessage(notice); return true;
  }
  function updatePlan(next: DayPlan) { return commit(plans.map(p => p.id === next.id ? next : p)); }
  function updateStop(id: string, patch: Partial<DayStop>) { if (plan) return updatePlan({ ...plan, stops: plan.stops.map(s => s.id === id ? { ...s, ...patch } : s) }); return false; }
  function openPicker(id: string, button: HTMLButtonElement) { focusAfterPick.current = button; setPicker(id); setQuery(""); setKind("all"); setOnlySaved(false); setLimit(8); }
  function closePicker() { const stopId = picker; setPicker(null); requestAnimationFrame(() => { const original = focusAfterPick.current; if (original?.isConnected) original.focus(); else if (stopId) document.getElementById(`day-replace-${stopId}`)?.focus(); }); }
  function moveStop(index: number, delta: number) { if (!plan) return; const stops = [...plan.stops]; [stops[index], stops[index + delta]] = [stops[index + delta], stops[index]]; updatePlan({ ...plan, stops }); }

  return <section className="day-planner" aria-labelledby="day-planner-heading">
    <header className="day-planner-heading"><div><p className="day-eyebrow">LITE ATT SE FRAM EMOT</p><h2 id="day-planner-heading">Mina dagar</h2><p>En dejt, en utflykt eller bara en ledig dag. Ett stopp i taget.</p></div>{!plan && !creating && <button className="day-primary" disabled={plans.length >= MAX_DAYS} onClick={() => { setCreating(true); setName(""); setDate(""); }}><Plus size={18}/> Planera en dag</button>}</header>
    <div className="day-feedback" role="status">{message}{deleted && <button onClick={() => { if (plans.length < MAX_DAYS && commit([...plans, deleted], "Dagen är återställd.")) setDeleted(null); }}>Ångra radering</button>}</div>
    {error && <p className="day-error" role="alert">{error}</p>}
    {creating && <form className="day-create" onSubmit={e => { e.preventDefault(); if (plans.length >= MAX_DAYS) return; const data = new FormData(e.currentTarget); const next = createDayPlan(String(data.get("name") || ""), String(data.get("date") || "")); if (commit([...plans, next], "Din dag är skapad.")) { setSelected(next.id); setCreating(false); setPicker(null); } }}>
      <label>Vad ska dagen heta?<input name="name" autoFocus required maxLength={80} value={name} placeholder="Lördag med barnen" onChange={e => setName(e.target.value)} /></label>
      <label>Datum <span>(valfritt)</span><input name="date" type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
      <div className="day-actions"><button className="day-primary" type="submit">Skapa dag <ArrowUp size={16}/></button><button type="button" onClick={() => setCreating(false)}>Avbryt</button></div>
    </form>}
    {!plan && !creating && <div className="day-overview">{plans.length ? plans.map(p => <button key={p.id} className="day-cover" onClick={() => { setSelected(p.id); setConfirmDelete(false); setPicker(null); }}><CalendarBlank size={25}/><span className="day-eyebrow">{p.date ? new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${p.date}T12:00:00`)) : "DATUMET ÄR ÖPPET"}</span><strong>{p.name}</strong><span>{p.stops.filter(s => s.objectId).length} stopp · Öppna dagen →</span></button>) : <div className="day-empty"><CalendarBlank size={32}/><h3>Ge dagen en liten plan.</h3><p>Museum på förmiddagen, lunch runt hörnet och något kul efteråt. Fyll bara de delar du vill.</p><div className="day-template" aria-hidden="true"><span>01 Förmiddag</span><span>02 Lunch</span><span>03 Eftermiddag</span></div></div>}</div>}
    {plans.length >= MAX_DAYS && !plan && <p>Du kan ha upp till {MAX_DAYS} dagar. Ta bort en gammal dag för att skapa en ny.</p>}
    {plan && <div className="day-detail">
      <button className="day-back" onClick={() => { setSelected(null); setPicker(null); setConfirmDelete(false); }}><ArrowLeft size={18}/> Alla mina dagar</button>
      <div className="day-plan-title"><h3>{plan.name}</h3><details><summary>Ändra dag</summary><form key={plan.id} onSubmit={e => { e.preventDefault(); const data = new FormData(e.currentTarget); updatePlan({ ...plan, name: String(data.get("name")).trim() || plan.name, date: String(data.get("date")) }); }}><label>Namn<input name="name" maxLength={80} required defaultValue={plan.name}/></label><label>Datum (valfritt)<input name="date" type="date" defaultValue={plan.date}/></label><button type="submit">Spara ändringar</button></form></details></div>
      <p className="day-date">{plan.date || "Välj datum när du vet"} · {plan.stops.filter(s => s.objectId).length} planerade stopp</p>
      <ol className="day-timeline">{plan.stops.map((stop, index) => {
        const item = stop.kind && stop.objectId ? byId.get(`${stop.kind}:${stop.objectId}`) : undefined;
        const mismatch = item && !isPlanDateEligible(item, plan.date);
        const needsVisitCheck = item?.kind === "culture" && !mismatch && (item.ongoing || (item.start && item.end && item.start !== item.end));
        return <li key={stop.id} className="day-slot"><div className="day-slot-heading"><span className="day-step">{String(index + 1).padStart(2, "0")}</span><h4>{stop.label}</h4><div className="day-order"><button disabled={index === 0} aria-label={`Flytta ${stop.label} uppåt`} onClick={() => moveStop(index, -1)}><ArrowUp size={16}/></button><button disabled={index === plan.stops.length - 1} aria-label={`Flytta ${stop.label} nedåt`} onClick={() => moveStop(index, 1)}><ArrowDown size={16}/></button></div></div>
          {item ? <div className="day-stop-content"><span className="day-eyebrow">{kinds[item.kind]} · {item.area}</span><h5>{item.title}</h5><p>{item.detail}{item.actualTime ? ` · ${item.actualTime}` : ""}</p>{mismatch && <p className="day-error">Evenemangets datum passar inte din dag. Byt aktivitet eller kontrollera nya datum hos arrangören.</p>}{needsVisitCheck && <p>Datumintervallet matchar. Kontrollera att aktiviteten ges och platsen är öppen just din besöksdag.</p>}<div className="day-actions"><MapLink query={`${item.location}, Göteborg`} label={item.title}>Hitta hit ↗</MapLink><a href={item.url} target="_blank" rel="noopener noreferrer">Öppettider & info ↗</a></div><div className="day-actions"><button id={`day-replace-${stop.id}`} onClick={e => openPicker(stop.id, e.currentTarget)}>Byt aktivitet</button><button onClick={() => updateStop(stop.id, { kind: undefined, objectId: undefined })}>Ta bort aktivitet</button></div></div> : <button className="day-add" onClick={e => openPicker(stop.id, e.currentTarget)}><Plus size={20}/>{stop.objectId ? "Objektet saknas — välj ett annat" : "Lägg till något"}</button>}
          {picker === stop.id && <div className="day-picker" aria-label={`Välj aktivitet för ${stop.label}`} onKeyDown={e => { if (e.key === "Escape") closePicker(); }}><div className="day-picker-title"><strong>Vad passar här?</strong><button aria-label="Stäng sökning" onClick={closePicker}><X size={18}/></button></div><label className="day-search"><MagnifyingGlass size={19}/><input autoFocus type="search" value={query} placeholder="Sök plats, mat eller aktivitet" aria-label="Sök aktivitet till dagen" onChange={e => { setQuery(e.target.value); setLimit(8); }}/></label><div className="day-filter"><button aria-pressed={!onlySaved} onClick={() => { setOnlySaved(false); setLimit(8); }}>Hela STADEN</button><button aria-pressed={onlySaved} onClick={() => { setOnlySaved(true); setLimit(8); }}>Mina sparade</button></div><div className="day-filter"><button aria-pressed={kind === "all"} onClick={() => { setKind("all"); setLimit(8); }}>Alla</button>{(Object.keys(kinds) as PlanKind[]).map(k => <button key={k} aria-pressed={kind === k} onClick={() => { setKind(k); setLimit(8); }}>{kinds[k]}</button>)}</div><p className="day-search-count" role="status">{matches.length} träffar{plan.date ? " · Datumintervall matchar – kontrollera besöksdag" : " · Välj datum för att avgränsa kultur"}</p><div className="day-search-results">{matches.slice(0, limit).map(c => <button key={`${c.kind}:${c.id}`} onClick={() => { if (updateStop(stop.id, { kind: c.kind, objectId: c.id })) closePicker(); }}><span><strong>{c.title}</strong><small>{kinds[c.kind]} · {c.area} · {c.detail}{c.actualTime ? ` · ${c.actualTime}` : ""}</small></span><Plus size={18}/></button>)}</div>{!matches.length && <p>Inga träffar. Prova ett annat sökord eller välj Hela STADEN och Alla.</p>}{matches.length > limit && <button onClick={() => setLimit(n => n + 8)}>Visa 8 till</button>}</div>}
          <details className="day-stop-options"><summary>Tid & anteckning</summary><form key={`${plan.id}-${stop.id}`} onSubmit={e => { e.preventDefault(); const data = new FormData(e.currentTarget); updateStop(stop.id, { label: String(data.get("label")).trim() || stop.label, time: String(data.get("time")), note: String(data.get("note")) }); }}><label>Namn på del av dagen<input name="label" defaultValue={stop.label} maxLength={40} required/></label><label>Min tid (valfri)<input name="time" type="time" defaultValue={stop.time}/></label><label>Anteckning<textarea name="note" defaultValue={stop.note} maxLength={500} placeholder="Boka bord, ta med regnkläder…" rows={2}/></label><button type="submit"><Check size={16}/> Spara</button></form><button className="day-remove-slot" onClick={() => { if (updatePlan({ ...plan, stops: plan.stops.filter(s => s.id !== stop.id) })) setPicker(null); }}>Ta bort {stop.label.toLocaleLowerCase("sv")}</button></details>{(stop.time || stop.note) && <p className="day-note">{stop.time && <strong>{stop.time} · </strong>}{stop.note}</p>}
        </li>;
      })}</ol>
      {plan.stops.length < MAX_STOPS && <div className="day-add-slots"><span>Lägg till en del av dagen</span>{["Förmiddag", "Lunch", "Eftermiddag", "Middag", "Kväll", "Egen tid"].filter(label => label === "Egen tid" || !plan.stops.some(s => s.label === label)).map(label => <button key={label} onClick={() => updatePlan({ ...plan, stops: [...plan.stops, createDayStop(label)] })}><Plus size={16}/> {label}</button>)}</div>}
      <p className="day-footnote">Planen sparas på den här enheten. Kontrollera öppettider, resväg och biljetter inför dagen. Dina tider innebär ingen bokning.</p>
      {confirmDelete ? <div className="day-delete-confirm"><p>Ta bort ”{plan.name}”?</p><button onClick={() => { if (commit(plans.filter(p => p.id !== plan.id), "Dagen är borttagen.")) { setDeleted(plan); setSelected(null); setConfirmDelete(false); setPicker(null); } }}>Ja, ta bort dagen</button><button onClick={() => setConfirmDelete(false)}>Behåll dagen</button></div> : <button className="day-delete" onClick={() => setConfirmDelete(true)}>Ta bort dagen</button>}
    </div>}
  </section>;
}
