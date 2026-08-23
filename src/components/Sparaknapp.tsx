"use client";

import { useEffect, useState } from "react";

/**
 * ETIKETTEN — saving.
 *
 * The bookmark crosses outline → filled over 180ms, the plate's top rule
 * flashes and settles, aria-pressed flips. No rotation, no scale overshoot, no
 * stamp, no squash. Under reduced motion the icon swaps instantly.
 *
 * Saving works without an account and without a network round-trip: the
 * collection lives in localStorage until the visitor chooses to keep it, which
 * is what makes the emotional payoff of the product reachable in the first
 * twenty seconds. When Supabase auth lands, this reads the same shape from the
 * lists table and merges the local set on first sign-in.
 */

const NYCKEL = "staden-sparat";

function las(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const v = window.localStorage.getItem(NYCKEL);
    return v ? (JSON.parse(v) as string[]) : [];
  } catch {
    return [];
  }
}

export function Sparaknapp({
  objektId,
  titel,
}: {
  objektId: string;
  titel: string;
}) {
  const [sparad, setSparad] = useState(false);
  const [monterad, setMonterad] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setSparad(las().includes(objektId));
      setMonterad(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [objektId]);

  function vaxla() {
    const nuvarande = las();
    const nasta = nuvarande.includes(objektId)
      ? nuvarande.filter((id) => id !== objektId)
      : [...nuvarande, objektId];
    try {
      window.localStorage.setItem(NYCKEL, JSON.stringify(nasta));
    } catch {
      /* Private mode. The button still reflects the session. */
    }
    setSparad(nasta.includes(objektId));
    window.dispatchEvent(new CustomEvent("staden:sparat"));
    if (nasta.includes(objektId) && "vibrate" in navigator) {
      navigator.vibrate(8);
    }
  }

  return (
    <button
      type="button"
      className="spara"
      onClick={vaxla}
      aria-pressed={monterad ? sparad : undefined}
      aria-label={sparad ? `Ta bort ${titel} från sparat` : `Spara ${titel}`}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
        <path
          d="M5 3h14v18l-7-5-7 5V3z"
          fill={sparad ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="miter"
        />
      </svg>
    </button>
  );
}
