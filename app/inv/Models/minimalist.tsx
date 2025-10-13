"use client"
import * as React from 'react'
import { Icon } from '@iconify/react'
import type { MinimalistInvitationProps } from '@/lib/types/invitation'

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

export default function MinimalistInvitationModel(props: MinimalistInvitationProps) {
	const couple = [props.hostManName, props.hostWomanName].filter(Boolean).join(' & ') || 'Monsieur & Madame'
	const startsAtDate = React.useMemo(() => (typeof props.startsAt === 'string' ? new Date(props.startsAt) : props.startsAt), [props.startsAt])
	const dateText = formatLongDate(startsAtDate)
	const timeText = formatTime(startsAtDate)

	return (
		<div className="relative rounded-xl border bg-card shadow-sm overflow-hidden">
			{/* Badge */}
			{/* <div className="absolute z-20 top-3 left-3">
				<span className="inline-flex items-center gap-1 rounded-md bg-emerald-600/90 px-2 py-1 text-[10px] font-medium tracking-wide text-white shadow-sm ring-1 ring-inset ring-emerald-500/60 backdrop-blur">
					<span className="inline-block size-1.5 rounded-full bg-white" /> INVITATION
				</span>
			</div> */}

            
			<div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 pointer-events-none" />
			<div className="relative p-8 flex flex-col gap-6">
				<header className="text-center space-y-3">
					<p className="text-xs tracking-wider text-muted-foreground uppercase">Invitation</p>
					<h2 className="font-light text-3xl tracking-tight">
						<span className="font-semibold">{couple}</span>
					</h2>
					<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
				</header>

				<section className="space-y-4 text-center">
					<p className="text-sm leading-relaxed text-muted-foreground">
						{props.description || "Nous avons le plaisir de vous inviter à célébrer notre union dans une ambiance chaleureuse et élégante."}
					</p>
					<div className="space-y-1">
						<p className="font-medium text-sm">{dateText}</p>
						<p className="text-xs text-muted-foreground">{timeText}</p>
					</div>
					<div className="flex justify-center items-start gap-1">
						<Icon icon="fluent:location-28-regular" className="size-5 text-slate-400" />
						<p className="text-sm line-clamp-2 max-w-[95%] ">{props.location || "Lieu de l'événement"}</p>
					</div>
				</section>

				<footer className="pt-4 text-center">
					<p className="text-[10px] tracking-wide uppercase text-muted-foreground/70">RSVP prochainement</p>
				</footer>
			</div>
		</div>
	)
}

