"use client"
import * as React from 'react'
import { Icon } from '@iconify/react'
import type { MinimalistInvitationProps as ElegantInvitationProps } from '@/lib/types/invitation'

function formatLongDate(d: Date) {
    try {
        return d.toLocaleDateString(undefined, {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
    } catch {
        return d.toDateString()
    }
}

function formatTime(d: Date) {
    try {
        return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    } catch {
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
    }
}

export default function ElegantInvitationModel(props: ElegantInvitationProps) {
    const couple = [props.hostManName, props.hostWomanName].filter(Boolean).join(' & ') || 'Monsieur & Madame'
    const startsAtDate = React.useMemo(() => (typeof props.startsAt === 'string' ? new Date(props.startsAt) : props.startsAt), [props.startsAt])
    const dateText = formatLongDate(startsAtDate)
    const timeText = formatTime(startsAtDate)

    return (
        <div className="relative overflow-hidden rounded-2xl border bg-background shadow-sm scale-75 sm:scale-none ">
            {/* Decorative gradient header */}
            <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,theme(colors.red.200/.5),transparent_60%),linear-gradient(to_bottom_right,theme(colors.amber.100/.5),transparent)] dark:bg-[radial-gradient(70%_50%_at_50%_0%,theme(colors.neutral.800/.8),transparent_60%),linear-gradient(to_bottom_right,theme(colors.neutral.900/.6),transparent)]" />
            <Icon icon="game-icons:butterfly-flower" className="absolute top-4 right-4 size-20 text-muted-foreground/30 rotate-[15deg] scale-[2]" />
            <Icon icon="hugeicons:wedding" className="absolute bottom-2 left-0 size-20 text-muted-foreground/30 -rotate-[5deg] " />
            <Icon icon="ph:champagne-thin" className="absolute bottom-0 right-0 size-20 text-muted-foreground/30 -rotate-[12deg] " />

            <div className="p-8 md:p-10 ">
                <header className="text-center space-y-4">
                    <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Invitation</p>
                    <h2 className="font-serif text-3xl md:text-4xl tracking-tight">
                        <span className="font-semibold">{couple}</span>
                    </h2>
                    <div className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-border to-transparent" />
                </header>

                <section className="mt-6 grid gap-6 text-center">
                    <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground">
                        {props.description || "Nous avons le plaisir de vous inviter à célébrer notre union dans une ambiance chaleureuse et élégante."}
                    </p>

                    <div className="mx-auto inline-flex items-center gap-3 rounded-full border bg-card/70 px-4 py-2 text-sm shadow-sm backdrop-blur">
                        <span className="font-medium">{dateText}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{timeText}</span>
                    </div>

                    <div className="flex justify-center items-start gap-2">
                        <Icon icon="fluent:location-28-regular" className="size-5 text-muted-foreground" />
                        <p className="text-sm max-w-[90%]">{props.location || "Lieu de l'événement"}</p>
                    </div>
                </section>

                <footer className="mt-8 text-center">
                    <p className="text-[10px] tracking-wide uppercase text-muted-foreground/70">RSVP prochainement</p>
                </footer>
            </div>
        </div>
    )
}
