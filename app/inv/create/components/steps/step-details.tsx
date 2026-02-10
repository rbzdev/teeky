"use client"

import React from "react"
import { Icon } from "@iconify/react"
import { toast } from 'sonner'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useInvitationDraft } from "../invitation-context"

interface StepDetailsProps {
    date: Date | undefined
    setDate: (d: Date) => void
    dateInput: string
    setDateInput: (s: string) => void
    dateInvalid: boolean
    setDateInvalid: (b: boolean) => void
    startTime: string
    setStartTime: (s: string) => void
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    removeImage: () => void  // To handle removing the image (or first image)
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

export default function StepDetails({
    date, setDate,
    dateInput, setDateInput,
    dateInvalid, setDateInvalid,
    startTime, setStartTime,
    handleImageUpload,
    removeImage
}: StepDetailsProps) {
    const { draft, update } = useInvitationDraft()
    const [openDate, setOpenDate] = React.useState(false)

    // Helper to get first image or null
    const currentImage = draft.images?.[0] || null

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Quand aura lieu l&apos;événement ?</h3>
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
                                if (parsed) {
                                    setDate(parsed)
                                    update('date', parsed)
                                    setDateInvalid(false)
                                } else {
                                    setDateInvalid(true)
                                }
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
                                    onSelect={(d) => {
                                        if (d) {
                                            setDate(d)
                                            update('date', d)
                                            setDateInput(d.toLocaleDateString())
                                            setDateInvalid(false)
                                        }
                                        setOpenDate(false)
                                    }}
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
                        onChange={e => {
                            setStartTime(e.target.value)
                            update('startTime', e.target.value)
                        }}
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
            <div className="space-y-2">
                <Label htmlFor="image">Joindre une image (Optionnel)</Label>
                <div className="flex items-center gap-4">
                    <div className="relative w-full">
                        <label
                            htmlFor="image-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group overflow-hidden"
                        >
                            {currentImage ? (
                                <div className="relative w-full h-full">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Icon icon="solar:pen-new-square-bold" className="text-white text-3xl" />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground group-hover:text-primary transition-colors">
                                    <Icon icon="solar:gallery-add-bold" className="size-8 mb-2" />
                                    <p className="text-sm font-medium">Cliquez pour ajouter une image</p>
                                    <p className="text-xs opacity-60">PNG, JPG (Max 5MB)</p>
                                </div>
                            )}
                            <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                        {currentImage && (
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-md hover:bg-destructive/90 transition-colors"
                            >
                                <Icon icon="solar:trash-bin-trash-bold" className="size-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
