"use client"
import React, { useState } from "react"
import { createInvitation } from "../action"
import dynamic from 'next/dynamic'
import { useInvitationDraft } from "./invitation-context"
import { toast } from 'sonner'
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"

// Components
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Icon } from "@iconify/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Spinner } from "@/components/ui/spinner"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Client-side form logic for date/time composition
function ISODate(date: Date, time?: string): string {
    let hours = 0
    let minutes = 0
    if (typeof time === 'string') {
        const parts = time.split(':').map((n) => Number(n))
        if (parts.length >= 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
            hours = parts[0]
            minutes = parts[1]
        }
    }

    const d = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hours,
        minutes,
        0,
        0
    )

    const y = d.getFullYear()
    const mo = String(d.getMonth() + 1).padStart(2, '0')
    const da = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    const ss = '00'
    const ms = '000'

    const tzMin = d.getTimezoneOffset()
    const sign = tzMin <= 0 ? '+' : '-'
    const abs = Math.abs(tzMin)
    const offH = String(Math.floor(abs / 60)).padStart(2, '0')
    const offM = String(abs % 60).padStart(2, '0')

    return `${y}-${mo}-${da}T${hh}:${mm}:${ss}.${ms}${sign}${offH}:${offM}`
}

const steps = [
    { title: "Hôtes", icon: "solar:users-group-rounded-bold" },
    { title: "Détails", icon: "solar:calendar-date-bold" },
    { title: "Lieu", icon: "solar:map-point-bold" },
]

export default function CreateInvitationForm() {
    const { draft, update, reset } = useInvitationDraft()
    const [currentStep, setCurrentStep] = useState(0)
    const [date, setDate] = useState<Date | undefined>(draft.date || new Date())
    const [dateInput, setDateInput] = useState<string>(() => draft.date ? draft.date.toLocaleDateString() : new Date().toLocaleDateString())
    const [dateInvalid, setDateInvalid] = useState(false)
    const [startTime, setStartTime] = useState(draft.startTime)
    const [submitting, setSubmitting] = useState(false)
    const [openDate, setOpenDate] = useState(false)
    const [openMap, setOpenMap] = useState(false)

    const router = useRouter()
    const MapDialog = React.useMemo(() => dynamic(() => import('./map-dialog'), { ssr: false }), [])

    const DRAFT_KEY = 'invitation:create:draft'
    const DRAFT_TTL = 10 * 60 * 1000

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

    function clearSavedDraft() {
        try {
            if (typeof window !== 'undefined') localStorage.removeItem(DRAFT_KEY)
        } catch { }
    }

    React.useEffect(() => {
        if (typeof window === 'undefined') return
        try {
            const raw = localStorage.getItem(DRAFT_KEY)
            if (!raw) return
            const parsed = JSON.parse(raw)
            if (!parsed?.savedAt || Date.now() - parsed.savedAt > DRAFT_TTL) {
                localStorage.removeItem(DRAFT_KEY)
                return
            }

            if (parsed.hostManName) update('hostManName', parsed.hostManName)
            if (parsed.hostWomanName) update('hostWomanName', parsed.hostWomanName)
            if (parsed.description) update('description', parsed.description)
            if (parsed.location) update('location', parsed.location)
            if (typeof parsed.locationLat === 'number') update('locationLat', parsed.locationLat)
            if (typeof parsed.locationLng === 'number') update('locationLng', parsed.locationLng)
            if (parsed.startTime) { setStartTime(parsed.startTime); update('startTime', parsed.startTime) }
            if (parsed.theme) update('theme', parsed.theme)
            if (parsed.dateISO) {
                const d = new Date(parsed.dateISO)
                if (!isNaN(d.getTime())) {
                    setDate(d)
                    setDateInput(d.toLocaleDateString())
                    update('date', d)
                }
            }
            toast.info('Brouillon restauré')
        } catch { }
    }, [])

    async function onSubmit() {
        if (!date) {
            toast.error("Date manquante")
            return
        }

        setSubmitting(true)
        try {
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

            const result = await createInvitation(payload)

            if (result.success) {
                toast.success("Invitation créée avec succès !")
                reset()
                clearSavedDraft()
                router.push(`/dashboard/${result.invitation?.slug || ""}`)
            } else if (result.code === 401) {
                toast.info("Veuillez vous connecter")
                saveDraftForLater()
                router.push('/auth/login?next=/inv/create')
            }
        } catch (error) {
            toast.error("Une erreur est survenue")

            console.error(error)
        } finally {
            setSubmitting(false)
        }
    }

    function parseDateInput(raw: string): Date | null {
        const v = raw.trim()
        if (!v) return null
        const dmy = /^([0-3]?\d)[\/\-.]([0-1]?\d)[\/\-.](\d{4})$/
        const ymd = /^(\d{4})[\/\-.]([0-1]?\d)[\/\-.]([0-3]?\d)$/
        let year, month, day
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
            return isNaN(direct.getTime()) ? null : direct
        }
        const constructed = new Date(year, month, day)
        return (constructed.getFullYear() === year && constructed.getMonth() === month && constructed.getDate() === day) ? constructed : null
    }

    const nextStep = () => {
        if (currentStep === 0 && (!draft.hostManName || !draft.hostWomanName)) {
            toast.error("Veuillez renseigner les noms des hôtes")
            return
        }
        if (currentStep === 1 && (!date || dateInvalid)) {
            toast.error("Veuillez renseigner une date valide")
            return
        }
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    }

    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

    return (
        <div className="space-y-8">
            {/* Stepper */}
            <div className="flex items-center justify-between relative px-2 mb-12">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 -z-10" />
                <div
                    className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 -z-10 transition-all duration-500"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3">
                        <div
                            className={cn(
                                "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-4",
                                idx <= currentStep
                                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-110"
                                    : "bg-background border-muted text-muted-foreground"
                            )}
                        >
                            <Icon icon={step.icon} className="text-xl" />
                        </div>
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest transition-colors duration-500",
                            idx <= currentStep ? "text-primary" : "text-muted-foreground"
                        )}>
                            {step.title}
                        </span>
                    </div>
                ))}
            </div>

            <form onSubmit={e => e.preventDefault()} className="min-h-[300px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        {currentStep === 0 && (
                            <div className="grid gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-black">Qui sont les hôtes ?</h3>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="mr">Monsieur</Label>
                                            <Input
                                                id="mr"
                                                required
                                                placeholder="Ex: Alexandre"
                                                value={draft.hostManName}
                                                onChange={e => update('hostManName', e.target.value)}
                                                className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="mme">Madame</Label>
                                            <Input
                                                id="mme"
                                                required
                                                placeholder="Ex: Sophie"
                                                value={draft.hostWomanName}
                                                onChange={e => update('hostWomanName', e.target.value)}
                                                className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-black">Quand aura lieu l&apos;événement ?</h3>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="dateDisplay">Date</Label>
                                        <div className="relative">
                                            <Input
                                                id="dateDisplay"
                                                value={dateInput}
                                                className={cn(
                                                    "h-12 pr-12 rounded-xl border-muted-foreground/20 focus:border-primary",
                                                    dateInvalid && "border-destructive focus:ring-destructive"
                                                )}
                                                placeholder="JJ/MM/AAAA"
                                                onChange={(e) => {
                                                    const v = e.target.value
                                                    setDateInput(v)
                                                    if (v.trim().length < 6) return
                                                    const parsed = parseDateInput(v)
                                                    if (parsed) { setDate(parsed); update('date', parsed); setDateInvalid(false) } else { setDateInvalid(true) }
                                                }}
                                            />
                                            <Popover open={openDate} onOpenChange={setOpenDate}>
                                                <PopoverTrigger asChild>
                                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                                                        <Icon icon="solar:calendar-bold" className="size-6" />
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden border-border/50" align="end">
                                                    <Calendar
                                                        mode="single"
                                                        selected={date}
                                                        onSelect={(d) => { if (d) { setDate(d); update('date', d); setDateInput(d.toLocaleDateString()); setDateInvalid(false) } setOpenDate(false) }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="startTime">Heure</Label>
                                        <Input
                                            type="time"
                                            id="startTime"
                                            value={startTime}
                                            onChange={e => { setStartTime(e.target.value); update('startTime', e.target.value) }}
                                            className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Message personnalisé</Label>
                                    <Textarea
                                        id="description"
                                        rows={4}
                                        placeholder="Décrivez votre événement..."
                                        value={draft.description}
                                        onChange={e => update('description', e.target.value)}
                                        className="rounded-2xl border-muted-foreground/20 focus:border-primary resize-none"
                                    />
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-black">Où se déroule la fête ?</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Lieu ou adresse</Label>
                                        <div className="relative">
                                            <Input
                                                id="location"
                                                placeholder="Ex: Villa des Arts, Paris"
                                                value={draft.location}
                                                onChange={e => update('location', e.target.value)}
                                                className="h-12 pr-12 rounded-xl border-muted-foreground/20 focus:border-primary"
                                            />
                                            <button
                                                onClick={() => setOpenMap(true)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                <Icon icon="solar:map-point-wave-bold" className="size-6" />
                                            </button>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => setOpenMap(true)}
                                        className="relative h-48 rounded-3xl overflow-hidden border-2 border-dashed border-muted hover:border-primary/50 cursor-pointer group transition-all"
                                    >
                                        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                            <div className="h-12 w-12 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center shadow-lg">
                                                <Icon icon="solar:map-bold" className="text-2xl text-primary" />
                                            </div>
                                            <span className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">
                                                {draft.locationLat ? "Position enregistrée" : "Choisir sur la carte"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-10 mt-8 border-t border-border/50">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={prevStep}
                        disabled={currentStep === 0 || submitting}
                        className="rounded-xl font-bold"
                    >
                        Retour
                    </Button>

                    {currentStep === steps.length - 1 ? (
                        <Button
                            type="button"
                            onClick={onSubmit}
                            disabled={submitting}
                            className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 min-w-40"
                        >
                            {submitting ? (
                                <div className="flex items-center gap-2">
                                    <Spinner className="size-4" />
                                    <span>Création...</span>
                                </div>
                            ) : (
                                "Finaliser l'invitation"
                            )}
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={nextStep}
                            className="h-12 px-8 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold min-w-40"
                        >
                            Suivant
                        </Button>
                    )}
                </div>
            </form>

            <MapDialog
                open={openMap}
                onOpenChange={setOpenMap}
                onSelect={({ lat, lng }) => {
                    update('locationLat', lat)
                    update('locationLng', lng)
                }}
            />
        </div>
    )
}
