"use client";

import { useEffect, useState } from "react";

type Tema = "ljust" | "morkt" | "system";

/**
 * Both themes are first-class, which means the visitor chooses. The app never
 * auto-switches at sunset — a product that changes its own appearance while you
 * are reading it is a product that thinks it knows better than you do.
 */
export function Temavaljare() {
  const [tema, setTema] = useState<Tema>("system");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const lagrat = window.localStorage.getItem("staden-tema");
        setTema(lagrat === "dark" ? "morkt" : lagrat === "light" ? "ljust" : "system");
      } catch {
        /* Private mode: stay on system. */
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  function valj(nasta: Tema) {
    setTema(nasta);
    const rot = document.documentElement;
    try {
      if (nasta === "system") {
        delete rot.dataset.theme;
        window.localStorage.removeItem("staden-tema");
      } else {
        const varde = nasta === "morkt" ? "dark" : "light";
        rot.dataset.theme = varde;
        window.localStorage.setItem("staden-tema", varde);
      }
    } catch {
      /* Preference is still applied for this session. */
    }
  }

  const nasta: Tema = tema === "ljust" ? "morkt" : tema === "morkt" ? "system" : "ljust";
  const namn =
    nasta === "ljust" ? "ljust läge" : nasta === "morkt" ? "mörkt läge" : "systemets läge";

  return (
    <button
      type="button"
      className="tema"
      onClick={() => valj(nasta)}
      aria-label={`Byt till ${namn}`}
    >
      <span className="katalog" aria-hidden="true">
        {tema === "ljust" ? "DAG" : tema === "morkt" ? "NATT" : "AUTO"}
      </span>
    </button>
  );
}
