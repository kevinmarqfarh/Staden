"use client";

import { useSyncExternalStore } from "react";
import { MANUAL_LOCATIONS, type GeoPoint } from "@/lib/geo";

export type NearbyLocationStatus =
  | "idle"
  | "requesting"
  | "ready"
  | "denied"
  | "unavailable"
  | "timeout"
  | "unsupported";

type NearbyLocationState = {
  status: NearbyLocationStatus;
  point: GeoPoint | null;
  source: "device" | "manual" | null;
  label: string | null;
  manualLocationId: string;
  accuracy: number | null;
  radiusMeters: number;
  message: string;
};

const initialState: NearbyLocationState = {
  status: "idle",
  point: null,
  source: null,
  label: null,
  manualLocationId: "",
  accuracy: null,
  radiusMeters: 3_000,
  message: "Positionen delas först när du trycker på knappen och sparas inte.",
};

let state = initialState;
const listeners = new Set<() => void>();

function updateState(next: Partial<NearbyLocationState>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return initialState;
}

export function requestDeviceLocation() {
  if (typeof window === "undefined" || !("geolocation" in navigator)) {
    updateState({
      status: "unsupported",
      message: "Den här webbläsaren erbjuder inte platsdelning. Välj ett område i stället.",
    });
    return;
  }

  if (!window.isSecureContext) {
    updateState({
      status: "unavailable",
      message: "Platsdelning kräver HTTPS. Välj ett område tills sidan körs säkert.",
    });
    return;
  }

  updateState({
    status: "requesting",
    message: "Väntar på tillstånd från webbläsaren…",
  });

  navigator.geolocation.getCurrentPosition(
    (position) => {
      updateState({
        status: "ready",
        source: "device",
        point: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          precision: "exact",
        },
        label: "Din position",
        manualLocationId: "",
        accuracy: Math.round(position.coords.accuracy),
        message: "Närmast först. Din position stannar i den här fliken.",
      });
    },
    (error) => {
      const next =
        error.code === error.PERMISSION_DENIED
          ? {
              status: "denied" as const,
              message: "Platsåtkomst nekades. Tillåt den i webbläsaren eller välj ett område.",
            }
          : error.code === error.TIMEOUT
            ? {
                status: "timeout" as const,
                message: "Det tog för lång tid att hitta positionen. Försök igen eller välj ett område.",
              }
            : {
                status: "unavailable" as const,
                message: "Positionen gick inte att läsa just nu. Välj ett område i stället.",
              };

      updateState(next);
    },
    {
      enableHighAccuracy: false,
      timeout: 10_000,
      maximumAge: 300_000,
    },
  );
}

export function chooseManualLocation(id: string) {
  const location = MANUAL_LOCATIONS.find((option) => option.id === id);
  if (!location) return;

  updateState({
    status: "ready",
    point: location,
    source: "manual",
    label: location.label,
    manualLocationId: id,
    accuracy: null,
    message: `Visar ungefärliga avstånd från ${location.label}.`,
  });
}

export function setNearbyRadius(radiusMeters: number) {
  if (![1_000, 3_000, 5_000, 10_000].includes(radiusMeters)) return;
  updateState({ radiusMeters });
}

export function clearNearbyLocation() {
  updateState({
    status: "idle",
    point: null,
    source: null,
    label: null,
    manualLocationId: "",
    accuracy: null,
    message: initialState.message,
  });
}

export function useNearbyLocation() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
