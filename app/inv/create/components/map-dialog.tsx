"use client"

import React from 'react'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Components
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'


const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface MapDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  /** Fired ONLY when user confirms ("Utiliser"). Returns coordinates only */
  onSelect: (data: { lat: number; lng: number }) => void
}

export default function MapDialog({ open, onOpenChange, onSelect }: MapDialogProps) {
  const [position, setPosition] = React.useState<[number, number] | null>(null)
  const [search, setSearch] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [results, setResults] = React.useState<Array<{ display_name: string; lat: string; lon: string }>>([])
  const [mounted, setMounted] = React.useState(false)
  const mapRef = React.useRef<L.Map | null>(null)
  const markerRef = React.useRef<L.Marker | null>(null)
  const [resolving, setResolving] = React.useState(false)
  const [resolvedAddress, setResolvedAddress] = React.useState<string | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  async function geocode(q: string) {
    if (!q.trim()) return
    try {
      setLoading(true)
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.slice(0, 5))
    } finally {
      setLoading(false)
    }
  }

  const reverseGeocode = React.useCallback(async (lat: number, lng: number) => {
    try {
      setResolving(true)
      setResolvedAddress(null)
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=fr`)
      if (!res.ok) throw new Error('fail')
      const data = await res.json()
      const address = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      setResolvedAddress(address)
    } catch {
      const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      setResolvedAddress(fallback)
    } finally {
      setResolving(false)
    }
  }, [])

  function handlePick(r: { display_name: string; lat: string; lon: string }) {
    const lat = parseFloat(r.lat)
    const lng = parseFloat(r.lon)
    setPosition([lat, lng])
    setResolvedAddress(r.display_name)
  }

  // Wrap onOpenChange to cleanup Leaflet map instance on close and bump a cycle key on reopen
  const handleOpenChange = React.useCallback((v: boolean) => {
    if (!v) {
      if (mapRef.current) {
        try { mapRef.current.remove() } catch { /* noop */ }
        mapRef.current = null
      }
      markerRef.current = null
    }
    onOpenChange(v)
  }, [onOpenChange])

  // Manual map initialization (instead of react-leaflet) to fully control lifecycle
  const mapContainerDivRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!open || !mounted) return
    let cancelled = false
    let attempts = 0
    const maxAttempts = 6

    const init = () => {
      if (cancelled) return
      const el = mapContainerDivRef.current
      if (!el) { schedule(); return }
      const rect = el.getBoundingClientRect()
      if ((rect.width < 50 || rect.height < 50) && attempts < maxAttempts - 1) {
        // Wait for dialog animation / layout stabilization
        schedule()
        return
      }
      // Cleanup previous if any (should not happen but safe)
      if (mapRef.current) {
        try { mapRef.current.remove() } catch { /* noop */ }
        mapRef.current = null
      }
      const center: [number, number] = position || [48.8566, 2.3522]
      const map = L.map(el, {
        center,
        zoom: position ? 14 : 5,
        zoomControl: true,
      })
      mapRef.current = map
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map)
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng
        setPosition([lat, lng])
        if (!markerRef.current) {
          markerRef.current = L.marker([lat, lng], { icon: markerIcon, draggable: true }).addTo(map)
          markerRef.current.on('dragend', () => {
            const p = markerRef.current!.getLatLng()
            setPosition([p.lat, p.lng])
            reverseGeocode(p.lat, p.lng)
          })
        } else {
          markerRef.current.setLatLng([lat, lng])
        }
        reverseGeocode(lat, lng)
      })
      setTimeout(() => { try { map.invalidateSize() } catch { /* noop */ } }, 80)
    }
    const schedule = () => {
      attempts += 1
      setTimeout(init, 70)
    }
    init()
    return () => {
      cancelled = true
      if (mapRef.current) {
        try { mapRef.current.remove() } catch { /* noop */ }
        mapRef.current = null
      }
      markerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mounted])

  // Reflect external position changes (search selection) into map + marker
  React.useEffect(() => {
    if (!mapRef.current || !position) return
    if (!markerRef.current) {
      markerRef.current = L.marker(position, { icon: markerIcon, draggable: true }).addTo(mapRef.current)
      markerRef.current.on('dragend', () => {
        const p = markerRef.current!.getLatLng()
        setPosition([p.lat, p.lng])
        reverseGeocode(p.lat, p.lng)
      })
    } else {
      markerRef.current.setLatLng(position)
    }
    mapRef.current.setView(position, 14)
  }, [position, reverseGeocode])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 overflow-hidden w-full sm:max-w-lg md:max-w-2xl md:h-auto max-h-[85dvh] flex flex-col">
        <div className="p-4 border-b bg-muted/30 flex flex-col items-start sm:flex-row sm:items-center gap-3 shrink-0">
          <DialogTitle className="text-sm font-semibold">Choisir un lieu</DialogTitle>
          <DialogDescription className="sr-only">Sélectionne un emplacement sur la carte</DialogDescription>

          <div className="ml-auto flex items-center gap-1 md:gap-2 ">
            <Input
              placeholder="Rechercher une adresse"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); geocode(search) } }}
              className="h-8 w-full sm:min-w-64"
            />
            <Button type="button" size="sm" variant="secondary" onClick={() => geocode(search)} disabled={loading}>
              {loading ? <div className="flex items-center gap-2"><Spinner variant="ellipsis" /> <span>En cours </span></div> : 'Rechercher'}
            </Button>
          </div>

        </div>


        <div className="md:flex md:h-[480px]  flex-1 overflow-hidden">

          <div className="relative md:flex-1 h-64 md:h-64  ">
            <div ref={mapContainerDivRef} className="absolute inset-0" />
            {(!open || !mounted) && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                Préparation de la carte…
              </div>
            )}
          </div>


          <div className="md:w-64 md:border-l bg-background flex flex-col border-t md:border-t-0 h-full md:h-auto md:max-h-full max-h-48">
            <div className="p-2 text-xs font-medium text-muted-foreground sticky top-0 bg-background/95 backdrop-blur md:static">Résultats</div>
            <div className="flex-1 overflow-auto space-y-1 px-2 pb-2">
              {results.length === 0 && (
                <p className="text-xs text-muted-foreground px-1">Aucun résultat. Lance une recherche.</p>
              )}
              {results.map(r => (
                <button
                  key={r.lat + r.lon}
                  type="button"
                  onClick={() => handlePick(r)}
                  className="text-left w-full rounded-md px-2 py-1.5 hover:bg-muted/70 transition text-xs"
                >
                  <span className="line-clamp-2 leading-snug">{r.display_name}</span>
                  <span className="block text-[10px] mt-1 text-muted-foreground/70">{r.lat}, {r.lon}</span>
                </button>
              ))}
            </div>

          </div>
        </div>
        {position && (
          <div className="p-3 text-xs flex items-center justify-between gap-4 bg-background/95 backdrop-blur border-t mt-auto sticky bottom-0 md:static md:bg-muted/40 md:backdrop-blur-none">
            <div className="truncate leading-snug">
              <span className="font-medium">Sélection :</span>{' '}
              {resolvedAddress || results.find(r => parseFloat(r.lat) === position[0] && parseFloat(r.lon) === position[1])?.display_name || `${position[0]}, ${position[1]}`}
              {resolving && <span className="ml-2 text-[10px] italic text-muted-foreground">(résolution...)</span>}
            </div>
            <Button
              size="sm"
              disabled={!position}
              onClick={() => {
                if (position) {
                  const [lat, lng] = position
                  onSelect({ lat, lng })
                }
                onOpenChange(false)
              }}
            >
              Confirmer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
