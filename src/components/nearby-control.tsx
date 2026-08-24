"use client";

import {
  Crosshair,
  MapPin,
  ShieldCheck,
  X,
} from "@phosphor-icons/react";
import { MANUAL_LOCATIONS } from "@/lib/geo";
import {
  chooseManualLocation,
  clearNearbyLocation,
  requestDeviceLocation,
  setNearbyRadius,
  useNearbyLocation,
} from "@/hooks/use-nearby-location";

const radiusOptions = [
  { value: 1_000, label: "1 km" },
  { value: 3_000, label: "3 km" },
  { value: 5_000, label: "5 km" },
  { value: 10_000, label: "10 km" },
] as const;

export function NearbyControl({
  mappedCount,
  noun = "platser",
}: {
  mappedCount: number;
  noun?: string;
}) {
  const location = useNearbyLocation();
  const isReady = Boolean(location.point);

  return (
    <section className="nearby-panel" aria-labelledby="nearby-title">
      <div className="nearby-panel__heading">
        <div className="nearby-panel__icon" aria-hidden="true">
          <Crosshair size={22} weight="bold" />
        </div>
        <div>
          <p className="kicker">NÄRA DIG</p>
          <h3 id="nearby-title">Vad finns runt hörnet?</h3>
          <p>
            Sortera {mappedCount} kartlagda {noun} efter avstånd. Du bestämmer
            när positionen delas.
          </p>
        </div>
      </div>

      <div className="nearby-panel__controls">
        <button
          className="nearby-panel__locate"
          type="button"
          onClick={requestDeviceLocation}
          disabled={location.status === "requesting"}
        >
          <Crosshair aria-hidden="true" size={18} weight="bold" />
          {location.status === "requesting"
            ? "Hämtar position…"
            : isReady && location.source === "device"
              ? "Uppdatera min position"
              : "Använd min position"}
        </button>

        <label className="nearby-panel__manual">
          <MapPin aria-hidden="true" size={18} weight="bold" />
          <span className="sr-only">Välj område manuellt</span>
          <select
            value={location.manualLocationId}
            onChange={(event) => chooseManualLocation(event.target.value)}
          >
            <option value="">Välj område i stället</option>
            {MANUAL_LOCATIONS.map((option) => (
              <option value={option.id} key={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="nearby-panel__status" aria-live="polite">
        <ShieldCheck aria-hidden="true" size={17} weight="bold" />
        <span>
          <strong>{isReady ? location.label : "Privat som standard"}</strong>
          {location.message}
          {location.accuracy ? ` Noggrannhet cirka ±${location.accuracy} m.` : ""}
        </span>
        {isReady ? (
          <button type="button" onClick={clearNearbyLocation} aria-label="Stäng av Nära dig">
            <X aria-hidden="true" size={18} weight="bold" />
          </button>
        ) : null}
      </div>

      {isReady ? (
        <div className="nearby-panel__radius" role="group" aria-label="Sökradie">
          <span>VISA INOM</span>
          <div>
            {radiusOptions.map((option) => (
              <button
                type="button"
                className={location.radiusMeters === option.value ? "is-active" : ""}
                aria-pressed={location.radiusMeters === option.value}
                onClick={() => setNearbyRadius(option.value)}
                key={option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
