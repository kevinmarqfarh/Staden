"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MagnifyingGlass, X, ArrowUpRight, MapPin } from "@phosphor-icons/react";
import { MapLink } from "@/components/map-link";
import { searchAll, searchableCount, type SearchResult, type SearchKind } from "@/lib/search";

type SokOverlayProps = {
  open: boolean;
  onClose: () => void;
  discoveries?: SearchResult[];
};

const KIND_LABEL: Record<SearchKind, string> = {
  kultur: "KULTUR",
  noje: "NÖJE",
  mat: "MAT",
};

const KIND_ORDER: SearchKind[] = ["kultur", "noje", "mat"];

function ResultRow({ result }: { result: SearchResult }) {
  return (
    <li className="sok-result">
      <div className="sok-result__body">
        <span className={`sok-badge sok-badge--${result.kind}`}>
          {KIND_LABEL[result.kind]}
        </span>
        <h4 className="sok-result__title">{result.title}</h4>
        <p className="sok-result__meta">
          {result.subtitle}
          {result.isFree ? <span className="sok-result__free"> · Gratis</span> : null}
        </p>
      </div>
      <div className="sok-result__actions">
        <MapLink query={result.mapQuery} label={result.title} className="sok-action">
          <MapPin size={15} weight="bold" aria-hidden="true" />
          <span>Karta</span>
        </MapLink>
        {result.sourceUrl ? (
          <a
            className="sok-action"
            href={result.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Källa</span>
            <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </li>
  );
}

export function SokOverlay({ open, onClose, discoveries }: SokOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchAll(query), [query]);
  const trimmed = query.trim();

  const handleClose = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 20);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [open, handleClose]);

  if (!open) return null;

  const grouped = KIND_ORDER.map((kind) => ({
    kind,
    items: results.filter((result) => result.kind === kind),
  })).filter((group) => group.items.length > 0);

  return (
    <div
      className="sok-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div
        className="sok-card"
        role="dialog"
        aria-modal="true"
        aria-label="Sök i staden"
      >
        <div className="sok-head">
          <div className="sok-field">
            <MagnifyingGlass size={20} weight="bold" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              className="sok-input"
              aria-label="Sök i staden"
              placeholder="Sök evenemang, plats, kök…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <button
            type="button"
            className="sok-close"
            onClick={handleClose}
            aria-label="Stäng sök"
          >
            <X size={18} weight="bold" aria-hidden="true" />
          </button>
        </div>

        <div className="sok-scroll">
          {trimmed === "" ? (
            discoveries && discoveries.length > 0 ? (
              <section className="sok-section">
                <p className="sok-kicker">Upptäck nytt</p>
                <p className="sok-explainer">
                  Något du kanske inte hade sökt själv.
                </p>
                <ul className="sok-list">
                  {discoveries.map((result) => (
                    <ResultRow key={result.key} result={result} />
                  ))}
                </ul>
              </section>
            ) : (
              <div className="sok-empty sok-empty--start">
                <MagnifyingGlass size={26} weight="light" aria-hidden="true" />
                <p className="sok-empty__lead">Börja skriva för att söka.</p>
                <p className="sok-empty__hint">
                  Sök bland {searchableCount} platser och händelser.
                </p>
              </div>
            )
          ) : results.length === 0 ? (
            <div className="sok-empty">
              <p className="sok-empty__lead">
                Inget för ’{trimmed}’ — prova ett bredare ord.
              </p>
            </div>
          ) : (
            <section className="sok-section">
              <p className="sok-count" aria-live="polite">
                {results.length} träffar
              </p>
              {grouped.map((group) => (
                <div key={group.kind} className="sok-group">
                  <p className={`sok-group__head sok-group__head--${group.kind}`}>
                    {KIND_LABEL[group.kind]}
                  </p>
                  <ul className="sok-list">
                    {group.items.map((result) => (
                      <ResultRow key={result.key} result={result} />
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
