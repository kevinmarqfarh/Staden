import { notFound } from "next/navigation";
import { places } from "@/lib/places";
import { PlaceProfile } from "@/components/place-profile";

export function generateStaticParams() { return places.map(place => ({ slug: place.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = places.find(item => item.slug === slug);
  return { title: place ? place.titel : "Platsen finns inte", description: place?.varfor };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = places.find(item => item.slug === slug);
  if (!place) notFound();
  return <PlaceProfile place={place} serverDate={new Date().toISOString().slice(0, 10)} />;
}
