"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getGothenburgHighlightSnapshot } from "@/lib/highlights";

const CLOCK_REFRESH_INTERVAL = 60_000;

function subscribeToHighlightClock(onStoreChange: () => void) {
  const timer = window.setInterval(onStoreChange, CLOCK_REFRESH_INTERVAL);

  window.addEventListener("focus", onStoreChange);
  document.addEventListener("visibilitychange", onStoreChange);

  return () => {
    window.clearInterval(timer);
    window.removeEventListener("focus", onStoreChange);
    document.removeEventListener("visibilitychange", onStoreChange);
  };
}

function getHighlightClockSnapshot() {
  return getGothenburgHighlightSnapshot();
}

export function useHighlightClock(serverDate: string) {
  const getServerSnapshot = useCallback(() => `${serverDate}|0`, [serverDate]);

  return useSyncExternalStore(
    subscribeToHighlightClock,
    getHighlightClockSnapshot,
    getServerSnapshot,
  );
}
