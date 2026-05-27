"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"

// Fix default icon paths broken by webpack/turbopack
;(L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl = undefined
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

const POS: [number, number] = [3.5400896, -76.310776]
const GMAPS = "https://maps.app.goo.gl/PKAKSgb6rRDPwBvUA"

export function MapReactLeaflet() {
  return (
    <MapContainer
      center={POS}
      zoom={17}
      style={{ width: "100%", height: "100%", filter: "saturate(0.75) contrast(1.05)" }}
      scrollWheelZoom={false}
      zoomControl
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
