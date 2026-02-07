"use client"

import * as React from 'react'
import { Icon } from '@iconify/react'
import { cn } from "@/lib/utils"
import type { MinimalistInvitationProps as ClassicProps } from '@/lib/types/invitation'
import { Cookie, Dancing_Script } from 'next/font/google'

// Distinct fonts for the Classic theme
import { formatLongDate, formatTime, EVENT_TYPE_METADATA, getInvitationDisplayNames } from '@/lib/types/invitation'

// Distinct fonts for the Classic theme
const cookie_font = Cookie({ subsets: ['latin'], weight: ['400'], display: 'swap' })
const dancing = Dancing_Script({ subsets: ['latin'], weight: ['400', '600'], display: 'swap' })

export default function ClassicInvitationModel(props: ClassicProps) {
    const typeInfo = EVENT_TYPE_METADATA[props.type || 'OTHER']
    const { displayNames, coHost } = getInvitationDisplayNames(props)

    const startsAtDate = React.useMemo(
        () => (typeof props.startsAt === 'string' ? new Date(props.startsAt) : props.startsAt),
        [props.startsAt]
    )
    const dateText = formatLongDate(startsAtDate)
    const timeText = formatTime(startsAtDate)

    return (
        <div className="relative h-full min-h-[500px] overflow-hidden rounded-[2rem] border shadow-2xl bg-[#FFFDF9] dark:bg-neutral-950 flex flex-col">
            {/* Texture background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

            {/* Classic Emblem */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
                <div className={cn("p-3 rounded-full text-white flex items-center justify-center shadow-2xl ring-8 ring-[#FFFDF9] dark:ring-neutral-950", typeInfo.strongBg)}>
                    <Icon icon={typeInfo.icon} className="size-6" />
                </div>
            </div>

            <div className="relative p-10 pt-20 flex-1 flex flex-col justify-between items-center text-center">
                <header className="space-y-4 w-full">
                    <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase font-black">{typeInfo.label}</p>
                    <div className="space-y-2">
                        <h2 className={cn(dancing.className, "text-4xl sm:text-6xl font-normal text-neutral-800 dark:text-neutral-200")}>
                            {displayNames}
                        </h2>
                        {coHost && (
                            <p className={cn(cookie_font.className, "text-2xl text-primary/80")}>
                                avec {coHost}
                            </p>
                        )}
                    </div>
                    <div className="mx-auto h-px w-40 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                </header>

                <section className="space-y-8 flex-1 flex flex-col justify-center max-w-lg">
                    <p className={cn(cookie_font.className, "text-2xl md:text-3xl leading-relaxed text-black/70 dark:text-white/70 italic")}>
                        {props.description || "Nous vous convions avec joie à partager ce moment précieux de notre vie."}
                    </p>

                    <div className="grid grid-cols-2 gap-2 lg:gap-6 w-full max-w-md mx-auto">
                        <div className="flex flex-col items-center gap-2 px-1 py-2 rounded-2xl bg-white/50 dark:bg-neutral-900 shadow-sm border border-black/5">

                            <div className="flex items-center ">
                                <Icon icon="solar:calendar-minimalistic-bold" className="size-6 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</span>
                            </div>
                            <span className={cn(cookie_font.className, "text-xl")}>{dateText}</span>
                        </div>

                        <div className="flex flex-col items-center gap-2 px-1 py-2 rounded-2xl bg-white/50 dark:bg-neutral-900 shadow-sm border border-black/5">

                            <div className="flex items-center">
                                <Icon icon="solar:clock-square-bold" className="size-6 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Heure</span>

                            </div>

                            <span className={cn(cookie_font.className, "text-xl")}>{timeText}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-widest text-primary/60">Lieu de réception</span>

                        <div className="flex items-center justify-center gap-2 border rounded-xl">
                            <Icon icon="solar:map-point-wave-bold" className="size-6 text-primary" />
                            <p className={cn(cookie_font.className, "text-2xl text-black/80 dark:text-white/80")}>
                                {props.location || "L’adresse sera communiquée ultérieurement"}
                            </p>
                        </div>
                    </div>
                </section>

                <footer className="mt-10 pt-6 border-t border-black/5 w-full">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-bold">Teeky &bull; Héritage &bull; 2024</p>
                </footer>
            </div>
        </div>
    )
}
