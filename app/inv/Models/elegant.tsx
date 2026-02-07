"use client"
import * as React from 'react'
import { Icon } from '@iconify/react'
import { cn } from "@/lib/utils"
import type { MinimalistInvitationProps as ElegantInvitationProps } from '@/lib/types/invitation'

import { formatLongDate, formatTime, EVENT_TYPE_METADATA, getInvitationDisplayNames } from '@/lib/types/invitation'

export default function ElegantInvitationModel(props: ElegantInvitationProps) {
    const typeInfo = EVENT_TYPE_METADATA[props.type || 'OTHER']
    const { displayNames, coHost } = getInvitationDisplayNames(props)

    const startsAtDate = React.useMemo(() => (typeof props.startsAt === 'string' ? new Date(props.startsAt) : props.startsAt), [props.startsAt])
    const dateText = formatLongDate(startsAtDate)
    const timeText = formatTime(startsAtDate)

    return (
        <div className="relative h-full min-h-[500px] overflow-hidden rounded-[2.5rem] border bg-background shadow-2xl flex flex-col">
            {/* Elegant Background Patterns */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.amber.100/.2),transparent_50%),radial-gradient(circle_at_bottom_left,theme(colors.rose.100/.2),transparent_50%)]" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <Icon icon="solar:star-fall-minimalistic-bold" className="absolute top-8 left-8 size-16 text-primary/5 -rotate-12" />
            <Icon icon="solar:wind-bold" className="absolute bottom-12 right-12 size-24 text-primary/5 rotate-12" />

            <div className="relative p-10 flex-1 flex flex-col justify-center items-center text-center">
                <header className="space-y-6 mb-8 w-full">
                    <div className="inline-flex flex-col items-center gap-2">
                        <div className={cn("p-3 rounded-full shadow-inner border border-white/50", typeInfo.lightBg, typeInfo.textColor)}>
                            <Icon icon={typeInfo.icon} className="size-6" />
                        </div>
                        <p className="text-[10px] tracking-[0.4em] font-black text-muted-foreground uppercase">{typeInfo.label}</p>
                    </div>

                    <div className="space-y-3 relative">
                        <h2 className="font-serif text-4xl sm:text-5xl tracking-tight text-neutral-900 dark:text-white leading-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-br from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-400">
                                {displayNames}
                            </span>
                        </h2>
                        {coHost && (
                            <div className="flex items-center justify-center gap-4 text-primary font-serif italic text-xl">
                                <span className="h-px w-8 bg-primary/20" />
                                {coHost}
                                <span className="h-px w-8 bg-primary/20" />
                            </div>
                        )}
                        <div className="absolute -top-4 -right-2 opacity-10">
                            <Icon icon="solar:double-alt-arrow-right-bold" className="size-12" />
                        </div>
                    </div>
                </header>

                <section className="space-y-10 max-w-lg">
                    <div className="relative">
                        <Icon icon="solar:double-quotes-l-bold" className="absolute -top-4 -left-6 size-8 text-primary/10" />
                        <p className="text-lg leading-relaxed text-black/70 dark:text-white/70 font-serif italic">
                            {props.description || "Nous avons le plaisir de vous inviter à célébrer ce moment d'exception avec nous."}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Quand</p>
                            <p className="font-serif text-sm text-neutral-800 dark:text-neutral-200">{dateText}</p>
                            <p className="text-sm text-muted-foreground">{timeText}</p>
                        </div>

                        <div className="hidden sm:block h-12 w-px bg-border/50" />
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Où</p>
                            <div className="flex items-center gap-2">
                                <Icon icon="solar:map-point-wave-bold" className="size-5 text-primary" />
                                <p className="font-serif text-sm text-neutral-800 dark:text-neutral-200">{props.location || "Lieu de réception"}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* <footer className="mt-12 pt-8 border-t border-border/50 w-full flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                        <Icon icon="solar:crown-minimalistic-bold" className="text-primary text-sm" />
                        Une expérience Teeky &bull; Exclusive
                    </div>
                </footer> */}
            </div>
        </div>
    )
}
