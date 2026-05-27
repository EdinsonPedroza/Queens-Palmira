"use client"

import { useEffect, useRef } from "react"

const LAT = 3.5261
const LNG = -76.2985
const GMAPS_LINK = "https://maps.app.goo.gl/PKAKSgb6rRDPwBvUA"

export function MapLeaflet() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import("leaflet").Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    async function init() {
      const L = (await import("leaflet")).default

      // Fix default marker icon paths broken by webpack
      // @ts-expect-error — leaflet internal
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      const map = L.map(containerRef.current!, {
        center: [LAT, LNG],
        zoom: 17,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map)

      const customIcon = L.divIcon({
        className: "",
        html: `<div style="
          width:44px;height:44px;
          background:linear-gradient(135deg,#D4AF37,#c9a227);
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:3px solid white;
          box-shadow:0 4px 16px rgba(0,0,0,0.35);
          display:flex;align-items:center;justify-content:center;
        "><div style="
          transform:rotate(45deg);
          font-size:18px;line-height:1;
          color:white;font-weight:bold;
        ">Q</div></div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 44],
        popupAnchor: [0, -48],
      })

      L.marker([LAT, LNG], { icon: customIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:sans-serif;font-size:13px;line-height:1.5;min-width:160px">
            <strong style="font-size:14px">Queens Cosmetics</strong><br/>
            Local 128 · Unicentro Palmira<br/>
            <a href="${GMAPS_LINK}" target="_blank" rel="noopener noreferrer"
               style="color:#D4AF37;font-weight:600;text-decoration:none;margin-top:4px;display:inline-block">
              Ver en Google Maps →
            </a>
          </div>`,
          { offset: [0, -8] }
        )
        .openPopup()

      mapRef.current = map
    }

    init()

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <div ref={containerRef} className="h-full w-full" />
    </>
  )
}
