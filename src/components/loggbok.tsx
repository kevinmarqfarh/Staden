"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Star, Trash, X, PencilSimple } from "@phosphor-icons/react";
import {
  getJournalSnapshot,
  getServerJournalSnapshot,
  journalEvocations,
  parseJournal,
  removeJournalEntry,
  subscribeToJournal,
  upsertJournalEntry,
  type JournalEntry,
  type JournalEvocation,
  type JournalKind,
} from "@/lib/cultural-journal";

export type JournalSubject = {
  id: string;
  kind: JournalKind;
  title: string;
  category?: string;
};

const dateFormatter = new Intl.DateTimeFormat("sv-SE", {
  day: "numeric",
  month: "short",
});

function StarRating({
  value,
  onChange,
  idBase,
}: {
  value: number;
  onChange?: (next: number) => void;
  idBase: string;
}) {
  if (!onChange) {
    return (
      <span className="loggbok-stars" aria-label={`${value} av 5`}>
        {[1, 2, 3, 4, 5].map((step) => (
          <Star
            key={`${idBase}-${step}`}
            size={16}
            weight={step <= value ? "fill" : "regular"}
            aria-hidden="true"
          />
        ))}
      </span>
    );
  }

  return (
    <div
      className="loggbok-stars loggbok-stars--input"
      role="radiogroup"
      aria-label="Betyg"
    >
      {[1, 2, 3, 4, 5].map((step) => (
        <button
          type="button"
          key={`${idBase}-${step}`}
          role="radio"
          aria-checked={value === step}
          aria-label={`${step} av 5`}
          className={step <= value ? "is-on" : ""}
          onClick={() => onChange(step)}
        >
          <Star size={22} weight={step <= value ? "fill" : "regular"} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

export function JournalPrompt({
  subject,
  existing,
  onClose,
}: {
  subject: JournalSubject;
  existing?: JournalEntry;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [evocations, setEvocations] = useState<JournalEvocation[]>(
    existing?.evocations ?? [],
  );
  const [note, setNote] = useState(existing?.note ?? "");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    cardRef.current?.focus();
  }, []);

  function toggleEvocation(id: JournalEvocation) {
    setEvocations((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  }

  function save() {
    if (rating < 1) return;
    upsertJournalEntry({
      id: subject.id,
      kind: subject.kind,
      title: subject.title,
      category: subject.category,
      rating,
      evocations,
      note: note.trim() ? note.trim() : undefined,
      ts: Date.now(),
    });
    onClose();
  }

  return (
    <div
      className="loggbok-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loggbok-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="loggbok-card" ref={cardRef} tabIndex={-1}>
        <div className="loggbok-card__head">
          <div>
            <p className="kicker">LOGGBOK</p>
            <h3 id="loggbok-title">Hur var det?</h3>
          </div>
          <button
            type="button"
            className="loggbok-close"
            aria-label="Stäng"
            onClick={onClose}
          >
            <X size={18} weight="bold" aria-hidden="true" />
          </button>
        </div>

        <p className="loggbok-subject">{subject.title}</p>

        <StarRating value={rating} onChange={setRating} idBase="input" />

        <fieldset className="loggbok-evocations">
          <legend>Vad väckte det?</legend>
          <div className="loggbok-evocations__chips">
            {journalEvocations.map((evocation) => (
              <button
                type="button"
                key={evocation.id}
                aria-pressed={evocations.includes(evocation.id)}
                className={evocations.includes(evocation.id) ? "is-on" : ""}
                onClick={() => toggleEvocation(evocation.id)}
              >
                {evocation.label}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="loggbok-note">
          <span>Kort anteckning (valfritt)</span>
          <textarea
            value={note}
            maxLength={400}
            rows={3}
            placeholder="Vad satt kvar efteråt?"
            onChange={(event) => setNote(event.target.value)}
          />
        </label>

        <div className="loggbok-card__actions">
          {existing ? (
            <button
              type="button"
              className="loggbok-remove"
              onClick={() => {
                removeJournalEntry(subject.id, subject.kind);
                onClose();
              }}
            >
              <Trash size={16} weight="bold" aria-hidden="true" />
              Ta bort
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            className="loggbok-save"
            disabled={rating < 1}
            onClick={save}
          >
            Spara i loggboken
          </button>
        </div>
      </div>
    </div>
  );
}

export function JournalLog() {
  const snapshot = useSyncExternalStore(
    subscribeToJournal,
    getJournalSnapshot,
    getServerJournalSnapshot,
  );
  const entries = useMemo(() => parseJournal(snapshot), [snapshot]);
  const [editing, setEditing] = useState<JournalEntry | null>(null);

  if (entries.length === 0) {
    return (
      <div className="loggbok-empty">
        <p>
          Din loggbok är tom. Efter en upplevelse kan du fånga vad den väckte
          — då börjar STADEN föreslå utifrån ditt tillstånd, inte bara kategori.
        </p>
      </div>
    );
  }

  return (
    <>
      <ul className="loggbok-list">
        {entries.map((entry) => (
          <li key={`${entry.kind}:${entry.id}`} className="loggbok-list__item">
            <div className="loggbok-list__head">
              <h4>{entry.title}</h4>
              <StarRating value={entry.rating} idBase={`view-${entry.id}`} />
            </div>
            {entry.evocations.length > 0 ? (
              <p className="loggbok-list__tags">
                {entry.evocations
                  .map(
                    (id) =>
                      journalEvocations.find((item) => item.id === id)?.label ??
                      id,
                  )
                  .join(" · ")}
              </p>
            ) : null}
            {entry.note ? (
              <p className="loggbok-list__note">”{entry.note}”</p>
            ) : null}
            <div className="loggbok-list__foot">
              <span>{dateFormatter.format(new Date(entry.ts))}</span>
              <button
                type="button"
                className="loggbok-edit"
                onClick={() => setEditing(entry)}
              >
                <PencilSimple size={14} weight="bold" aria-hidden="true" />
                Ändra
              </button>
            </div>
          </li>
        ))}
      </ul>
      {editing ? (
        <JournalPrompt
          subject={{
            id: editing.id,
            kind: editing.kind,
            title: editing.title,
            category: editing.category,
          }}
          existing={editing}
          onClose={() => setEditing(null)}
        />
      ) : null}
    </>
  );
}
