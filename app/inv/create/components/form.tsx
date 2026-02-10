"use client"
import React, { useState } from "react"
import { createInvitation } from "../action"
import { useInvitationDraft } from "./invitation-context"
import { toast } from 'sonner'
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import type { CreateInvitationPayload } from "@/lib/types/invitation"
import { AVAILABLE_THEMES } from "@/lib/types/invitation"

// Components
import { Icon } from "@iconify/react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

// Sub-steps
import StepType from "./steps/step-type"
import StepHosts from "./steps/step-hosts"
import StepDetails from "./steps/step-details"
import StepLocation from "./steps/step-location"

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
    { title: "Type", icon: "solar:widget-bold" },
    { title: "Hôtes", icon: "solar:users-group-rounded-bold" },
    { title: "Détails", icon: "solar:calendar-date-bold" },
    { title: "Lieu & Services", icon: "solar:map-point-bold" },
]

export default function CreateInvitationForm() {
    const { draft, update, reset } = useInvitationDraft()
    const [currentStep, setCurrentStep] = useState(0)
    const [date, setDate] = useState<Date | undefined>(draft.date || new Date())
    const [dateInput, setDateInput] = useState<string>(() => draft.date ? draft.date.toLocaleDateString() : new Date().toLocaleDateString())
    const [dateInvalid, setDateInvalid] = useState(false)
    const [startTime, setStartTime] = useState(draft.startTime)
    const [submitting, setSubmitting] = useState(false)

    const router = useRouter()

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
                images: draft.images || [],
                dateISO: date ? date.toISOString() : null,
                startTime: startTime || '',
                accessType: draft.accessType || 'FREE',
                price: draft.price || 0,
                currency: draft.currency || 'USD',
                theme: draft.theme || AVAILABLE_THEMES[0].id,
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
            // Handle legacy single image or new images array
            if (parsed.images && Array.isArray(parsed.images)) {
                update('images', parsed.images)
            } else if (parsed.image) {
                update('images', [parsed.image])
            }

            if (parsed.startTime) { setStartTime(parsed.startTime); update('startTime', parsed.startTime) }
            if (parsed.accessType) update('accessType', parsed.accessType)
            if (parsed.price) update('price', parsed.price)
            if (parsed.currency) update('currency', parsed.currency)
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
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    async function onSubmit() {
        if (!date) {
            toast.error("Date manquante")
            return
        }

        if (!draft.location) {
            toast.error("Ajoutez un lieu")
            return
        }

        setSubmitting(true)
        try {
            const payload: CreateInvitationPayload = {
                type: draft.type,
                hostManName: draft.hostManName,
                hostWomanName: draft.hostWomanName,
                description: draft.description || undefined,
                location: draft.location || undefined,
                startsAt: ISODate(date, startTime),
                coordinateLat: draft.locationLat ?? undefined,
                coordinateLng: draft.locationLng ?? undefined,
                images: draft.images || [],
                price: draft.accessType === 'PAID' ? Number(draft.price) : undefined,
                currency: draft.accessType === 'PAID' ? draft.currency : undefined,
                theme: draft.theme || AVAILABLE_THEMES[0].id,
                venueId: draft.venueId ?? undefined,
                cateringId: draft.cateringId ?? undefined,
                securityId: draft.securityId ?? undefined,
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

    const nextStep = () => {
        if (currentStep === 1 && (!draft.hostManName)) {
            toast.info("Veuillez renseigner un nom d'hôte")
            return
        }
        if (currentStep === 2 && (!date || dateInvalid)) {
            toast.info("Veuillez renseigner une date valide")
            return
        }
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    }

    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            toast.error("L'image est trop volumineuse (max 5MB)")
            return
        }

        const reader = new FileReader()
        reader.onload = (ev) => {
            const result = ev.target?.result as string
            // For now, replace the entire array with the new image (single image logic UI but multi-image backend ready)
            // Or append? Let's just set as the only image for now based on UI behavior
            update('images', [result])
        }
        reader.readAsDataURL(file)
    }

    const removeImage = () => {
        update('images', []) // Clear all for now
    }


    return (
        <div className="space-y-8 ">
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
                                "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2",
                                idx <= currentStep
                                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-110"
                                    : "bg-background border-muted text-muted-foreground"
                            )}
                        >
                            <Icon icon={step.icon} className="text-xl" />
                        </div>

                        <span className={cn(
                            "text-[10px] transition-all duration-500",
                            idx <= currentStep ? "text-primary" : "text-muted-foreground"
                        )}>
                            {step.title}
                        </span>
                    </div>
                ))}
            </div>

            <form onSubmit={e => e.preventDefault()} className="min-h-[300px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        {currentStep === 0 && <StepType />}
                        {currentStep === 1 && <StepHosts />}
                        {currentStep === 2 && (
                            <StepDetails
                                date={date}
                                setDate={setDate}
                                dateInput={dateInput}
                                setDateInput={setDateInput}
                                dateInvalid={dateInvalid}
                                setDateInvalid={setDateInvalid}
                                startTime={startTime}
                                setStartTime={setStartTime}
                                handleImageUpload={handleImageUpload}
                                removeImage={removeImage}
                            />
                        )}
                        {currentStep === 3 && <StepLocation />}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 mt-8 border-t border-border/50">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={prevStep}
                        disabled={currentStep === 0 || submitting}
                        className="rounded-xl font-bold hover:bg-primary/5 transition-colors"
                    >
                        <Icon icon="solar:alt-arrow-left-bold" className="mr-2" />
                        Retour
                    </Button>

                    {currentStep === steps.length - 1 ? (
                        <Button
                            type="button"
                            onClick={onSubmit}
                            disabled={submitting}
                            className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xl shadow-primary/20 min-w-48 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {submitting ? (
                                <div className="flex items-center gap-2">
                                    <Spinner className="size-4" />
                                    <span>Création en cours...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>Finaliser l&apos;invitation</span>
                                    <Icon icon="solar:check-read-bold" className="text-xl" />
                                </div>
                            )}
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={nextStep}
                            className="h-12 px-8 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black hover:opacity-90 font-bold min-w-40 transition-all hover:translate-x-1"
                        >
                            <div className="flex items-center gap-2">
                                Suivant
                                <Icon icon="solar:alt-arrow-right-bold" />
                            </div>
                        </Button>
                    )}
                </div>
            </form>
        </div>
    )
}
