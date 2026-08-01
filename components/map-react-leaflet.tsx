"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
// Bundled with this chunk — the map is dynamically imported, so the CSS is not
// render-blocking and no third-party CDN is needed.
import "leaflet/dist/leaflet.css"

// Fix default icon paths broken by webpack/turbopack — assets served from public/leaflet
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl:       "/leaflet/marker-icon.png",
  shadowUrl:     "/leaflet/marker-shadow.png",
})

const POS: [number, number] = [3.5400896, -76.310776]
const GMAPS = "https://maps.app.goo.gl/PKAKSgb6rRDPwBvUA"

// Forces Leaflet to recalculate tile grid after container animations/transitions
function MapResizer() {
  const map = useMap()
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 300)
    return () => clearTimeout(t)
  }, [map])
  return null
}

export function MapReactLeaflet() {
  return (
    <MapContainer
      center={POS}
      zoom={17}
      style={{ width: "100%", height: "100%", filter: "saturate(0.8) contrast(1.05)" }}
      scrollWheelZoom={false}
      zoomControl
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapResizer />
      <Marker position={POS}>
        <Popup>
          <div style={{ fontFamily: "sans-serif", minWidth: 160, lineHeight: 1.5 }}>
            <strong>Queens Cosmetics</strong><br />
            Local 128 · Unicentro Palmira<br />
            <a
              href={GMAPS}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#D4AF37", fontWeight: 600, textDecoration: "none", display: "inline-block", marginTop: 4 }}
            >
              Ver en Google Maps →
            </a>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  )
}
