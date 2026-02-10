"use client"

import React from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { useInvitationDraft } from "../invitation-context"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import dynamic from 'next/dynamic'


// UI
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Dynamically import map components to avoid SSR issues
const MapDialog = dynamic(() => import('../map-dialog'), { ssr: false })
const EventLocationMap = dynamic(() => import('../event-location-map'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-muted animate-pulse" />
})

export default function StepLocation() {
    const { draft, update } = useInvitationDraft()
    const [openMap, setOpenMap] = React.useState(false)

    return (
        <div className="space-y-8">
            {(draft.type === 'DOT' || draft.type === 'OTHER') && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Accès & Billetterie</h3>
                    <div className="p-1 bg-muted rounded-xl flex items-center">
                        {(
                            [
                                { id: 'FREE', label: 'Gratuit' },
                                { id: 'PAID', label: 'Payant' },
                                { id: 'PRIVATE', label: 'Privé' },
                            ] as const
                        ).map((mode) => (
                            <button
                                key={mode.id}
                                type="button"
                                onClick={() => update('accessType', mode.id)}
                                className={cn(
                                    "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                                    draft.accessType === mode.id
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {mode.label}
                            </button>
                        ))}
                    </div>

                    {draft.accessType === 'PAID' && (
                        <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="price">Prix du ticket</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={draft.price || ''}
                                    onChange={e => update('price', parseFloat(e.target.value))}
                                    className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currency">Devise</Label>
                                <Select
                                    value={draft.currency || 'USD'}
                                    onValueChange={(value) => update('currency', value)}
                                >
                                    <SelectTrigger className="w-full h-12 rounded-xl border-muted-foreground/20 bg-background focus:ring-primary">
                                        <SelectValue placeholder="Devise" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USD">USD ($)</SelectItem>
                                        <SelectItem value="CDF">CDF (FC)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <div className="h-px bg-border/50" />
                </div>
            )}

            <div className="space-y-6">
                <h3 className="text-lg font-semibold">Où se déroule l&apos;événement ?</h3>
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
                        className="relative h-32 rounded-3xl overflow-hidden border-2 border-dashed border-muted hover:border-primary/50 cursor-pointer group transition-all"
                    >
                        {draft.locationLat && draft.locationLng ? (
                            <>
                                <div className="absolute inset-0 pointer-events-none grayscale group-hover:grayscale-0 transition-all duration-500">
                                    <EventLocationMap lat={draft.locationLat} lng={draft.locationLng} className="w-full h-full" />
                                </div>
                                <div className="absolute inset-0 bg-background/20 group-hover:bg-background/0 transition-colors" />
                                <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                                    Modifier
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                    <Icon icon="solar:map-bold" className="text-2xl text-primary" />
                                    <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">
                                        Itinéraire
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-border/50">
                <h3 className="text-lg font-semibold">Services additionnels (Bientôt disponible)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                        { id: 'venue', label: 'Lieu d\'exception', icon: 'solar:home-2-bold' },
                        { id: 'catering', label: 'Traiteur & Buffet', icon: 'solar:chef-hat-bold' },
                        { id: 'security', label: 'Sécurité & Accueil', icon: 'solar:shield-user-bold' },
                        { id: 'transport', label: 'Transport', icon: 'ion:car-sport-sharp' },
                    ].map((service) => (
                        <div
                            key={service.id}
                            className="flex items-center p-2 gap-2 rounded-full border bg-muted/5 opacity-60 cursor-not-allowed"
                        >
                            <div className="p-2 rounded-xl bg-background flex items-center justify-center text-primary shadow-sm">
                                <Icon icon={service.icon} className="text-2xl" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-sm">{service.label}</span>
                                <span className="text-xs text-muted-foreground">Prochainement</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

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
