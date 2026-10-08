"use client"

import { useEffect, useMemo } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
// Bundled with this chunk — the map is dynamically imported, so the CSS is not
// render-blocking and no third-party CDN is needed.
import "leaflet/dist/leaflet.css"
import { VENUES, type Venue } from "@/lib/site"

/**
 * One pin per venue, in that venue's color, so the portal can show both on a
 * single map and you can still tell which is which.
 */
function pinIcon(color: string) {
  return L.divIcon({
    // Empty class name drops Leaflet's default white box around div icons
    className: "",
    html: `
      <svg width="32" height="42" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg"
           style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35))">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 8.4 12 20 12 20s12-11.6 12-20c0-6.63-5.37-12-12-12z"
              fill="${color}" stroke="#ffffff" stroke-width="1.75"/>
        <circle cx="12" cy="12" r="4.25" fill="#ffffff"/>
      </svg>`,
    iconSize: [32, 42],
    iconAnchor: [16, 40],
    popupAnchor: [0, -36],
  })
}

/**
 * Recalculates the tile grid after the container's entrance animation, and
 * re-frames multiple venues in case the container settled at a different size.
 * The initial framing comes from MapContainer's `bounds`, so this is a no-op in
 * the normal case — which is the point: refitting after the fact would make
 * Leaflet throw away a whole zoom level's worth of tiles it had started.
 */
function MapController({ venues }: { venues: Venue[] }) {
  const map = useMap()
  // Depend on the coordinates themselves, not the array identity, so this does
  // not re-run on every parent render.
  const key = venues.map((v) => v.coords.join(",")).join("|")

  useEffect(() => {
    const t = setTimeout(() => {
      map.invalidateSize()
      if (venues.length > 1) {
        map.fitBounds(L.latLngBounds(venues.map((v) => v.coords)), { padding: [70, 70] })
      }
    }, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key])

  return null
}

interface MapProps {
  /** A single venue, or several to frame together. Defaults to the store. */
  venue?: Venue
  venues?: Venue[]
  zoom?: number
}

export function MapReactLeaflet({ venue, venues, zoom = 17 }: MapProps) {
  const list = useMemo(() => venues ?? [venue ?? VENUES.cosmetics], [venues, venue])
  const multi = list.length > 1

  // Several venues are framed by `bounds` on the very first render, so Leaflet
  // never paints a wrong zoom level and then discards those tiles.
  const framing = multi
    ? { bounds: L.latLngBounds(list.map((v) => v.coords)), boundsOptions: { padding: [70, 70] as [number, number] } }
    : { center: list[0].coords, zoom }

  return (
    <MapContainer
      {...framing}
      style={{ width: "100%", height: "100%", filter: "saturate(0.8) contrast(1.05)" }}
      scrollWheelZoom={false}
      zoomControl
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapController venues={list} />
      {list.map((v) => (
        <Marker key={v.href} position={v.coords} icon={pinIcon(v.accent)}>
          <Popup>
            <div style={{ fontFamily: "sans-serif", minWidth: 170, lineHeight: 1.5 }}>
              <strong style={{ color: v.accent }}>{v.name}</strong><br />
              {v.address}<br />
              <span style={{ color: "#666", fontSize: 12 }}>{v.note}</span><br />
              <a
                href={v.gmaps}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#D4AF37", fontWeight: 600, textDecoration: "none", display: "inline-block", marginTop: 4 }}
              >
                Ver en Google Maps →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
