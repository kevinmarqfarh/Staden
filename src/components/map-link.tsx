"use client";

import type { MouseEvent, ReactNode } from "react";

type MapLinkProps = {
  query: string;
  label: string;
  children: ReactNode;
  className?: string;
};

export function googleMapsDirectionsUrl(query: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

function isUnmodifiedPrimaryClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button === 0 &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey
  );
}

export function MapLink({ query, label, children, className }: MapLinkProps) {
  const normalizedQuery = query.trim();
  const webUrl = googleMapsDirectionsUrl(normalizedQuery);

  function openPreferredMapsApp(event: MouseEvent<HTMLAnchorElement>) {
    if (!isUnmodifiedPrimaryClick(event)) return;

    const userAgent = window.navigator.userAgent;
    const isAndroid = /Android/i.test(userAgent);
    const isAppleMobile =
      /iPhone|iPad|iPod/i.test(userAgent) ||
      (window.navigator.platform === "MacIntel" &&
        window.navigator.maxTouchPoints > 1);

    if (isAndroid) {
      event.preventDefault();
      window.location.assign(`geo:0,0?q=${encodeURIComponent(normalizedQuery)}`);
      return;
    }

    if (isAppleMobile) {
      event.preventDefault();
      window.location.assign(
        `https://maps.apple.com/?daddr=${encodeURIComponent(normalizedQuery)}`,
      );
    }
  }

  return (
    <a
      className={className}
      href={webUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Öppna vägbeskrivning till ${label}`}
      title={`Öppna ${label} i kartapp`}
      onClick={openPreferredMapsApp}
    >
      {children}
    </a>
  );
}
