import type { Venue } from "@/lib/site"

/*
 * The Google Maps view of one venue (the client asked for Google's map instead of the OpenStreetMap one): the free embed, no API key.
 * It is a plain iframe, so the sections that use it mount it through `WhenNear` (and the iframe itself is lazy): Google's map only loads
 * once the visitor is getting close to it. The address in the URL comes from `VENUES.<venue>.embed` (lib/site.ts).
 */
export function GoogleMap({ venue, className }: { venue: Venue; className?: string }) {
  return (
    <iframe
      title={`Mapa de Google: ${venue.name}, ${venue.address}`}
      src={venue.embed}
      className={className ?? "h-full w-full border-0"}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  )
}
