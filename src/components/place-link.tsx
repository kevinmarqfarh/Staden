import Link from "next/link";
import { findPlace } from "@/lib/places";

export function PlaceLink({ name }: { name: string }) {
  const place = findPlace(name);
  return place ? <Link className="place-profile-link" href={`/plats/${place.slug}`}>Utforska {place.titel} ↗</Link> : null;
}
