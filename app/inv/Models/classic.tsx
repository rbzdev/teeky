"use client"
import * as React from 'react'
import { Icon } from '@iconify/react'
import type { MinimalistInvitationProps as ClassicProps } from '@/lib/types/invitation'
import { Cookie, Dancing_Script } from 'next/font/google'

// Distinct fonts for the Classic theme
const cookie_font = Cookie({ subsets: ['latin'], weight: ['400'], display: 'swap' })
const dancing = Dancing_Script({ subsets: ['latin'], weight: ['400', '600'], display: 'swap' })

function formatDate(d: Date) {
    try {
        return d.toLocaleDateString(undefined, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
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

export default function ClassicInvitationModel(props: ClassicProps) {
    const couple = [props.hostManName, props.hostWomanName].filter(Boolean).join(' & ') || 'Monsieur & Madame'
    const startsAtDate = React.useMemo(
        () => (typeof props.startsAt === 'string' ? new Date(props.startsAt) : props.startsAt),
        [props.startsAt]
    )
    const dateText = formatDate(startsAtDate)
    const timeText = formatTime(startsAtDate)

    return (
        <div className="relative overflow-hidden rounded-3xl border shadow-sm bg-gradient-to-br from-amber-50 via-white to-rose-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 ">
            {/* Crest / monogram */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2">
                <div className="p-1 md:p-2 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg ring-4 ring-amber-100 dark:ring-neutral-800">
                    <Icon icon="solar:heart-bold-duotone" className="size-4 " />
                </div>
            </div>

            <div className="p-8 md:p-10">
                <header className="text-center space-y-2">
                    <p className="text-[11px] tracking-[0.25em] text-muted-foreground uppercase">Invitation</p>
                    {/* Couple */}
                    <h2 className={`${dancing.className} text-2xl md:text-5xl font-normal tracking-tight`}>{couple}</h2>

                    {/* <p className={`${cookie_font.className} text-sm text-muted-foreground`}>{props.title || ''}</p> */}

                    <p className={`${cookie_font.className} text-sm text-muted-foreground`}> Invitation privée </p>

                    <div className="mx-auto mt-2 h-px w-28 bg-gradient-to-r from-transparent via-border to-transparent" />
                </header>

                <section className="mt-4 md:mt-7 grid gap-5 text-center">

                    {/* Description */}
                    <p className={`${cookie_font.className} mx-auto max-w-2xl text-md md:text-[20px] leading-5 text-black/60 dark:text-white/60`}>
                        {props.description || "Nous avons le plaisir de vous inviter à célébrer notre union dans une ambiance chaleureuse et élégante."}
                    </p>

                    {/* Date & time pill */}
                    <div className="mx-auto inline-flex items-center gap-3 rounded-full border bg-card/70 px-2 py-1 md:px-4 md:py-2 text-sm shadow-sm backdrop-blur">
                        <span className={` ${cookie_font.className} inline-flex items-center gap-1 text-lg md:text-xl `}>
                            <Icon icon="solar:calendar-outline" className="size-4 text-muted-foreground" />
                            {dateText}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className={` inline-flex items-center gap-1`}>
                            <Icon icon="solar:clock-circle-outline" className="size-4 text-muted-foreground" />
                            {timeText}
                        </span>
                    </div>

                    {/* Location card */}
                    <div className="mx-auto w-full max-w-xl p-1 text-sm shadow-sm">
                        <div className="flex items-start justify-center gap-1">
                            <Icon icon="fluent:location-28-regular" className="mt-0.5 size-5 text-muted-foreground" />
                            <p className={`${cookie_font.className} max-w-[92%] text-md md:text-lg text-black/80 dark:text-white/60 `}>
                                {props.location || "Lieu de l'événement"}
                            </p>
                        </div>
                    </div>
                </section>

                <footer className="mt-2 md:mt-8 text-center">
                    <p className="text-[10px] tracking-wide uppercase text-muted-foreground/70">RSVP prochainement</p>
                </footer>
            </div>
        </div>
    )
}
