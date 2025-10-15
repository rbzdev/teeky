"use client"
import React from "react"
import { createInvitation } from "../action"
import dynamic from 'next/dynamic'
import { useInvitationDraft } from "./invitation-context"
import { toast } from 'sonner'
import { useRouter } from "next/navigation"

// Components
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Icon } from "@iconify/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Spinner } from "@/components/ui/spinner"
import { Label } from "@/components/ui/label"

// Client-side form logic for date/time composition
// Build an ISO string that preserves the user's local time with timezone offset (e.g. 2025-10-10T12:00:00.000+02:00)
function ISODate(date: Date, time?: string): string {
    // Normalize and parse time (expected HH:MM). Fallback to 00:00 if missing/invalid.
    let hours = 0
    let minutes = 0
    if (typeof time === 'string') {
        const parts = time.split(':').map((n) => Number(n))
        if (parts.length >= 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
            hours = parts[0]
            minutes = parts[1]
        }
    }

    // Construct a local Date for the given calendar day and time in the user's timezone
    const d = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hours,
        minutes,
        0,
        0
    )

    // Format as YYYY-MM-DDTHH:mm:ss.sss±HH:MM with the local offset at that instant (handles DST)
    const y = d.getFullYear()
    const mo = String(d.getMonth() + 1).padStart(2, '0')
    const da = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    const ss = '00'
    const ms = '000'

    const tzMin = d.getTimezoneOffset() // minutes to add to local time to get UTC
    const sign = tzMin <= 0 ? '+' : '-'
    const abs = Math.abs(tzMin)
    const offH = String(Math.floor(abs / 60)).padStart(2, '0')
    const offM = String(abs % 60).padStart(2, '0')

    return `${y}-${mo}-${da}T${hh}:${mm}:${ss}.${ms}${sign}${offH}:${offM}`
}

export default function CreateInvitationForm() {
    const { draft, update, reset } = useInvitationDraft()
    const [date, setDate] = React.useState<Date | undefined>(draft.date || new Date())
    const [dateInput, setDateInput] = React.useState<string>(() => draft.date ? draft.date.toLocaleDateString() : new Date().toLocaleDateString())
    const [dateInvalid, setDateInvalid] = React.useState(false)
    const [startTime, setStartTime] = React.useState(draft.startTime)
    const [submitting, setSubmitting] = React.useState(false)
    const [openDate, setOpenDate] = React.useState(false)
    const [openMap, setOpenMap] = React.useState(false)

    // Router for navigation
    const router = useRouter()

    // Lazy load MapDialog only on client when opened
    const MapDialog = React.useMemo(() => dynamic(() => import('./map-dialog'), { ssr: false }), [])

    // Draft persistence: keep data for up to 10 minutes
    const DRAFT_KEY = React.useMemo(() => 'invitation:create:draft', [])
    const DRAFT_TTL = 10 * 60 * 1000 // 10 minutes

    function saveDraftForLater() {
        try {
            const payload = {
                hostManName: draft.hostManName || '',
                hostWomanName: draft.hostWomanName || '',
                description: draft.description || '',
                location: draft.location || '',
                locationLat: draft.locationLat ?? null,
                locationLng: draft.locationLng ?? null,
                dateISO: date ? date.toISOString() : null,
                startTime: startTime || '',
                theme: draft.theme || 'classic',
                savedAt: Date.now(),
            }
            if (typeof window !== 'undefined') {
                localStorage.setItem(DRAFT_KEY, JSON.stringify(payload))
            }
        } catch { }
    }

    // Clear saved draft / Supprime les données sauvegardées en LocalStorage
    function clearSavedDraft() {
        try {
            if (typeof window !== 'undefined') localStorage.removeItem(DRAFT_KEY)
        } catch { }
    }

    React.useEffect(() => {
        // Restore draft if saved within TTL
        if (typeof window === 'undefined') return
        try {
            const raw = localStorage.getItem(DRAFT_KEY)
            if (!raw) return
            const parsed = JSON.parse(raw) as {
                hostManName: string; hostWomanName: string; description: string; location: string;
                locationLat: number | null; locationLng: number | null; dateISO: string | null; startTime: string;
                theme?: 'classic' | 'elegant';
                savedAt: number;
            }
            if (!parsed?.savedAt || Date.now() - parsed.savedAt > DRAFT_TTL) {
                // Expired -> cleanup
                localStorage.removeItem(DRAFT_KEY)
                return
            }

            // Apply to context/state
            if (parsed.hostManName) update('hostManName', parsed.hostManName)
            if (parsed.hostWomanName) update('hostWomanName', parsed.hostWomanName)
            if (parsed.description) update('description', parsed.description)
            if (parsed.location) update('location', parsed.location)
            if (typeof parsed.locationLat === 'number') update('locationLat', parsed.locationLat)
            if (typeof parsed.locationLng === 'number') update('locationLng', parsed.locationLng)
            if (parsed.startTime) { setStartTime(parsed.startTime); update('startTime', parsed.startTime) }
            if (parsed.theme && (parsed.theme === 'classic' || parsed.theme === 'elegant')) {
                update('theme', parsed.theme)
            }
            if (parsed.dateISO) {
                const d = new Date(parsed.dateISO)
                if (!isNaN(d.getTime())) {
                    setDate(d)
                    setDateInput(d.toLocaleDateString())
                    update('date', d)
                }
            }
            toast.info('Brouillon restauré', { description: 'Vos informations ont été rechargées.' })
        } catch { }
        // We restore only once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    // ===========================================================================
    // ======================== SOUMISSION DU FORMULAIRE ===========================
    // ===========================================================================
    async function onSubmit(form: HTMLFormElement) {
        setSubmitting(true)
        try {
            if (!date) {
                toast.error("Date manquante")
                return
            }

            // Build JSON payload instead of FormData
            const payload = {
                hostManName: draft.hostManName,
                hostWomanName: draft.hostWomanName,
                description: draft.description || undefined,
                location: draft.location || undefined,
                startsAt: ISODate(date, startTime),
                coordinateLat: draft.locationLat ?? undefined,
                coordinateLng: draft.locationLng ?? undefined,
                theme: draft.theme,
            }

            // DEBUG
            // console.log("Submitting payload:", JSON.stringify(payload))
            // console.log("Submitting payload:", payload)

            // // Call server action with JSON
            const result = await createInvitation(payload)

            if (result.success) {
                toast.success("Invitation créée avec succès !", {
                    description: `Slug: ${result.invitation?.slug || 'N/A'}`
                })
                form.reset()
                reset()
                clearSavedDraft()
                router.push(`/dashboard/${result.invitation?.slug || ""}`)
            } else {
                if (result.code === 401) {
                    toast.info("Attention", {
                        description: "Veuillez vous connecter pour créer une invitation"
                    })
                    // Persist draft for 10 minutes and redirect to login
                    saveDraftForLater()
                    router.push('/auth/login?next=/inv/create')
                }
            }

        } catch (e: unknown) {
            // console.error("createInvitation caught error", e)

            let message = "Erreur inconnue"
            if (e && typeof e === 'object' && 'message' in e) {
                message = String((e as { message?: string }).message || message)
            }
            toast.error("Erreur", {
                description: message
            })
        } finally {
            setSubmitting(false)
        }
    }

    function parseDateInput(raw: string): Date | null {
        const v = raw.trim()
        if (!v) return null
        // Accept DD/MM/YYYY
        const dmy = /^([0-3]?\d)[\/\-.]([0-1]?\d)[\/\-.](\d{4})$/
        const ymd = /^(\d{4})[\/\-.]([0-1]?\d)[\/\-.]([0-3]?\d)$/
        let year: number, month: number, day: number
        if (dmy.test(v)) {
            const m = v.match(dmy)!
            day = parseInt(m[1], 10)
            month = parseInt(m[2], 10) - 1
            year = parseInt(m[3], 10)
        } else if (ymd.test(v)) {
            const m = v.match(ymd)!
            year = parseInt(m[1], 10)
            month = parseInt(m[2], 10) - 1
            day = parseInt(m[3], 10)
        } else {
            const direct = new Date(v)
            if (!isNaN(direct.getTime())) return direct
            return null
        }
        const constructed = new Date(year, month, day)
        if (constructed.getFullYear() !== year || constructed.getMonth() !== month || constructed.getDate() !== day) return null
        return constructed
    }

    function formatDisplayDate(d: Date) {
        return d.toLocaleDateString()
    }

    return (
        <form
            className="space-y-4"
            onSubmit={async (e) => {
                e.preventDefault()
                await onSubmit(e.currentTarget)
            }}
        >
            <div className="grid gap-2 sm:gap-6 grid-cols-2">
                <div className="flex flex-col">
                    <Label htmlFor="mr" className="text-xs font-medium">Monsieur *</Label>
                    <Input id="mr" name="hostManName" required placeholder="Le marié" defaultValue={draft.hostManName} onChange={e => update('hostManName', e.target.value)} />
                </div>

                <div className="flex flex-col">
                    <Label htmlFor="mme" className="text-xs font-medium">Madame *</Label>
                    <Input id="mme" name="hostWomanName" required placeholder="La mariée" defaultValue={draft.hostWomanName} onChange={e => update('hostWomanName', e.target.value)} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Programme, dress code, notes..."
                    defaultValue={draft.description} onChange={e => update('description', e.target.value)}
                    className="max-h-40"
                />
            </div>

            <div className="grid gap-2 sm:gap-6 grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">Lieu</Label>
                    <div className="relative flex items-center justify-center">
                        <Input
                            id="location"
                            name="location"
                            placeholder="Adresse ou lieu"
                            defaultValue={draft.location}
                            onChange={e => update('location', e.target.value)}
                            className="pr-8"
                        />

                        <Icon icon="fluent:location-28-regular" className="size-5 sm:size-5 absolute right-2 sm:right-2 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setOpenMap(true)} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="coordinate" className="text-sm font-medium">Heure</Label>
                    <Input
                        type="time"
                        id="startTime"
                        name="_startTime_local"
                        placeholder="19:30"
                        value={startTime}
                        onChange={e => {
                            setStartTime(e.target.value);
                            update('startTime', e.target.value)
                        }}
                    />

                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2 col-span-2">
                    <Label className="text-sm font-medium" htmlFor="dateDisplay">Date *</Label>
                    <div className="flex items-center gap-2 relative">
                        <Input
                            id="dateDisplay"
                            value={dateInput}
                            aria-invalid={dateInvalid || undefined}
                            className={"flex-1 pr-10 " + (dateInvalid ? "border-destructive focus-visible:ring-destructive" : "")}
                            placeholder="JJ/MM/AAAA ou YYYY-MM-DD"
                            // onClick={() => setOpenDate(true)}
                            onChange={(e) => {
                                const v = e.target.value
                                setDateInput(v)
                                // live len-based heuristics – don't validate too early
                                if (v.trim().length < 6) { setDateInvalid(false); return }
                                const parsed = parseDateInput(v)
                                if (parsed) { setDate(parsed); update('date', parsed); setDateInvalid(false) } else { setDateInvalid(true) }
                            }}
                            onBlur={() => {
                                if (!dateInput.trim()) {
                                    setDate(undefined);
                                    setDateInvalid(true);
                                    toast.error("Date requise", {
                                        description: "Veuillez saisir une date valide"
                                    })
                                    return
                                }
                                const parsed = parseDateInput(dateInput)
                                if (parsed) {
                                    setDate(parsed);
                                    update('date', parsed);
                                    setDateInput(formatDisplayDate(parsed));
                                    setDateInvalid(false)
                                } else {
                                    setDateInvalid(true);
                                    toast.error("Format de date invalide", {
                                        description: "Utilisez JJ/MM/AAAA ou YYYY-MM-DD"
                                    })
                                }
                            }}
                        />
                        <Popover open={openDate} onOpenChange={setOpenDate}>
                            <PopoverTrigger asChild>
                                <Icon icon="solar:calendar-outline" className="size-6 absolute right-3 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => setOpenDate(true)} />
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" side="bottom" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(d) => { if (d) { setDate(d); update('date', d); setDateInput(formatDisplayDate(d)); setDateInvalid(false) } setOpenDate(false) }}
                                    fromYear={new Date().getFullYear() - 1}
                                    toYear={new Date().getFullYear() + 2}
                                    captionLayout="dropdown"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    {dateInvalid && (
                        <p className="text-xs text-destructive mt-1">Format invalide. Exemples valides: 25/12/2025 ou 2025-12-25</p>
                    )}
                </div>
            </div>

            {/* Time selectors to use the states */}

            <div className="pt-2 flex items-center gap-3">
                <Button type="submit" disabled={submitting} className="min-w-40 w-full">
                    {submitting ?
                        <div className="flex items-center gap-1">
                            <Spinner />
                            <span> En cours...</span>
                        </div>
                        :
                        "Créer l'invitation"
                    }
                </Button>
                {/* <span className="text-xs text-muted-foreground">Statut initial: DRAFT</span> */}
            </div>

            {/* Map dialog for selecting location */}
            <MapDialog
                open={openMap}
                onOpenChange={setOpenMap}
                onSelect={({ lat, lng }) => {
                    // update('location', address)
                    update('locationLat', lat)
                    update('locationLng', lng)
                }}
            />
        </form>
    )
}
