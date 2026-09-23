"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, BookmarkSimple, Check, X } from "@phosphor-icons/react";
import { culturalEvents, type CulturalEvent } from "@/data/cultural-events";
import { restaurants } from "@/data/restaurants";
import { addDaysToDateKey, dateKeyFromHighlightSnapshot, hasEventNotEnded, rotateHighlights } from "@/lib/highlights";
import { MapLink } from "./map-link";

type Props = {
  snapshot: string;
  savedEventIds: string[];
  onToggleSaveEvent: (id: string) => void;
  onNavigate: (view: "kultur" | "noje" | "mat" | "profile" | "explore" | "saved") => void;
  onSearch: () => void;
};
const guides = [
  { tag: "Första dejten" as const, title: "Första dejten, utan stress", image: "/media/guide-forsta-dejten-goteborg.png" },
  { tag: "Barnfamilj" as const, title: "Med hela familjen", image: "/media/guide-barnfamilj-goteborg.png" },
];
export function EditorialHome({ snapshot, savedEventIds, onToggleSaveEvent, onNavigate, onSearch }: Props) {
  const [period, setPeriod] = useState("today");
  const [detail, setDetail] = useState<CulturalEvent | null>(null);
  const [guide, setGuide] = useState<(typeof guides)[number] | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const today = dateKeyFromHighlightSnapshot(snapshot);
  const picks = useMemo(() => {
    const weekday = new Date(`${today}T12:00:00Z`).getUTCDay();
    const saturday = addDaysToDateKey(today, weekday === 0 ? -1 : (6 - weekday + 7) % 7);
    const from = period === "weekend" ? saturday : today;
    const to = period === "weekend" ? addDaysToDateKey(saturday, 1) : period === "today" ? today : addDaysToDateKey(today, 30);
    // A season's date range does not confirm an occurrence on every day.
    const pool = culturalEvents.filter(event => hasEventNotEnded(event, snapshot) && event.startDate <= to && (event.isOngoing ? (event.endDate ?? "9999-12-31") >= from : event.startDate >= from));
    return rotateHighlights([...pool.filter(e => e.featured), ...pool.filter(e => !e.featured)], snapshot, 5);
  }, [snapshot, today, period]);
  const open = Boolean(detail || guide);
  useEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;
    element.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { element.close(); document.body.style.overflow = oldOverflow; };
  }, [open]);
  function close() { setDetail(null); setGuide(null); }
  const lead = picks[0];
  return <section className="editorial-home content-view" data-view="home">
    <header className="editorial-intro"><p className="kicker">GÖTEBORG · STADEN I DIN FICKA</p><h1>Lite mer Göteborg<span>.</span></h1></header>
    <nav className="editorial-categories" aria-label="Utforska efter kategori"><button type="button" aria-current="page">Alla</button>{([['kultur','Kultur'],['noje','Nöje'],['mat','Mat']] as const).map(([view,label]) => <button type="button" key={view} onClick={() => onNavigate(view)}>{label}</button>)}</nav>
    <div className="editorial-section-label"><h2>STADEN väljer</h2><label><span className="sr-only">Visa urval för</span><select value={period} onChange={e => setPeriod(e.target.value)}><option value="today">Idag</option><option value="weekend">I helgen</option><option value="month">Kommande 30 dagar</option></select></label></div>
    <div className="editorial-bento">
      {lead ? <article className="editorial-lead">
        <div className="editorial-lead-photo"><Image src="/media/theme-blue-line-gallery.png" alt="Illustration av ett besök i en konsthall" fill priority sizes="(min-width: 900px) 65vw, 100vw"/><small>Illustrationsbild</small><button className="editorial-bookmark" type="button" aria-label={`${savedEventIds.includes(lead.id) ? "Ta bort" : "Spara"} ${lead.title}`} aria-pressed={savedEventIds.includes(lead.id)} onClick={() => onToggleSaveEvent(lead.id)}>{savedEventIds.includes(lead.id) ? <Check size={22}/> : <BookmarkSimple size={22}/>}</button></div>
        <div className="editorial-lead-copy"><p className="kicker">{lead.category} · {lead.area}</p><h3>{lead.title}</h3><p className="editorial-date">{lead.dateLabel} · {lead.isFree ? "Fri entré" : lead.priceMaxSek !== undefined ? `Upp till ${lead.priceMaxSek} kr` : "Se pris hos arrangören"}</p><p className="editorial-schedule">{lead.endDate && lead.endDate !== lead.startDate ? "Flera datum – kontrollera programmet" : lead.time ?? "Se öppettider hos arrangören"}</p><button className="editorial-primary" type="button" onClick={() => setDetail(lead)}>Visa detaljer <ArrowUpRight size={20}/></button></div>
      </article> : <div className="editorial-empty"><h3>Vi har inget säkert urval för den perioden.</h3><p>Utforska stadens platser eller välj en längre period.</p><button className="editorial-primary" onClick={() => onNavigate("explore")}>Utforska Göteborg <ArrowUpRight size={20}/></button></div>}
      <div className="editorial-guides"><h2>Gå på känsla</h2>{guides.map(item => <button key={item.tag} className="editorial-guide" type="button" onClick={() => setGuide(item)}><div className="editorial-guide-photo"><Image src={item.image} alt="" fill sizes="(min-width: 900px) 30vw, 50vw"/></div><div><span className="kicker">Guide · {restaurants.filter(r => r.editorialTags?.includes(item.tag)).length} platser</span><h3>{item.title}</h3><ArrowUpRight size={20} aria-hidden="true"/></div></button>)}</div>
    </div>
    <section className="editorial-more"><div className="editorial-section-label"><h2>Mer att upptäcka</h2><button onClick={onSearch}>Sök i staden <ArrowUpRight size={18}/></button></div>{picks.slice(1).map(event => <article key={event.id}><button className="editorial-row-open" onClick={() => setDetail(event)}><span>{event.category} · {event.dateLabel}</span><h3>{event.title}</h3><p>{event.area} · {event.isFree ? "Fri entré" : "Se pris"}</p></button><button className="editorial-bookmark" aria-label={`${savedEventIds.includes(event.id) ? "Ta bort" : "Spara"} ${event.title}`} aria-pressed={savedEventIds.includes(event.id)} onClick={() => onToggleSaveEvent(event.id)}>{savedEventIds.includes(event.id) ? <Check size={22}/> : <BookmarkSimple size={22}/>}</button></article>)}<button className="editorial-all" onClick={() => onNavigate("explore")}>Utforska hela staden <ArrowUpRight size={20}/></button></section>
    <aside className="editorial-plan"><div><p className="kicker">DIN DAG, I DIN ORDNING</p><h2>Från en idé till en hel dag.</h2><p>Samla museum, lunch och nästa stopp i Mina dagar.</p></div><button className="editorial-primary" onClick={() => onNavigate("profile")}>Planera en dag <ArrowUpRight size={20}/></button></aside>
    <dialog ref={dialog} className="editorial-dialog" aria-labelledby="editorial-detail-title" onCancel={close} onClick={e => { if (e.target === e.currentTarget) close(); }}><div className="editorial-dialog-inner"><button className="editorial-dialog-close" aria-label="Stäng detaljer" onClick={close}><X size={24}/></button>{detail ? <><p className="kicker">{detail.category} · {detail.area}</p><h2 id="editorial-detail-title">{detail.title}</h2><p>{detail.dateLabel} · {detail.time ?? "Kontrollera öppettider"}</p><p>{detail.description}</p><p>{detail.venue}</p><div className="editorial-detail-actions"><a href={detail.sourceUrl} target="_blank" rel="noopener noreferrer">Tider, pris & bokning <ArrowUpRight size={18}/></a><MapLink query={`${detail.venue}, ${detail.area}, Göteborg`} label={detail.venue}>Hitta hit <ArrowUpRight size={18}/></MapLink><button onClick={() => onToggleSaveEvent(detail.id)} aria-pressed={savedEventIds.includes(detail.id)}>{savedEventIds.includes(detail.id) ? "Sparad" : "Spara"} <BookmarkSimple size={18}/></button></div></> : guide ? <><p className="kicker">STADENS GUIDE</p><h2 id="editorial-detail-title">{guide.title}</h2><p>Utvalda ställen att börja med. Kontrollera aktuell meny och boka vid behov.</p>{restaurants.filter(r => r.editorialTags?.includes(guide.tag)).map(r => <article className="editorial-guide-stop" key={r.id}><h3>{r.name}</h3><p>{r.cuisine} · {r.area}</p><p>{r.description}</p><a href={r.websiteUrl ?? r.sourceUrl} target="_blank" rel="noopener noreferrer">Meny & detaljer <ArrowUpRight size={16}/></a><MapLink query={`${r.address}, Göteborg`} label={r.name}>Hitta hit</MapLink></article>)}<button className="editorial-primary" onClick={() => { close(); onNavigate("mat"); }}>Utforska och spara i Mat <ArrowUpRight size={18}/></button></> : null}</div></dialog>
  </section>;
}
