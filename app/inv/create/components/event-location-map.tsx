"use client"

import React, { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

interface EventLocationMapProps {
    lat: number
    lng: number
    className?: string
}

export default function EventLocationMap({ lat, lng, className }: EventLocationMapProps) {
    const mapRef = useRef<L.Map | null>(null)
    const mapContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!mapContainerRef.current) return

        // If map already initialized, just return (update logic in other effect)
        if (mapRef.current) return

        // Initialize map
        const map = L.map(mapContainerRef.current, {
            center: [lat, lng],
            zoom: 15,
            zoomControl: false, // Minimalist for preview
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            keyboard: false,
            attributionControl: false,
        })

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map)

        L.marker([lat, lng], { icon: markerIcon }).addTo(map)

        mapRef.current = map

        // Fix for map not rendering correctly in some containers initially
        setTimeout(() => {
            map.invalidateSize()
        }, 100)

        return () => {
            map.remove()
            mapRef.current = null
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Update view if props change
    useEffect(() => {
        if (mapRef.current) {
            const currentCenter = mapRef.current.getCenter()
            if (currentCenter.lat !== lat || currentCenter.lng !== lng) {
                mapRef.current.setView([lat, lng], 15)
                // Clear markers and add new one (simple approach: remove all layers that are markers? or just keep ref to marker)
                // Actually, let's just re-render markers.
                mapRef.current.eachLayer((layer) => {
                    if (layer instanceof L.Marker) {
                        mapRef.current?.removeLayer(layer)
                    }
                })
                L.marker([lat, lng], { icon: markerIcon }).addTo(mapRef.current)
            }
        }
    }, [lat, lng])

    return <div ref={mapContainerRef} className={className} style={{ width: '100%', height: '100%' }} />
}
