"use client"
import * as React from 'react'
import { Icon } from '@iconify/react'
import { cn } from "@/lib/utils"
import type { MinimalistInvitationProps } from '@/lib/types/invitation'

import { formatLongDate, formatTime, EVENT_TYPE_METADATA, getInvitationDisplayNames } from '@/lib/types/invitation'

export default function MinimalistInvitationModel(props: MinimalistInvitationProps) {
	const typeInfo = EVENT_TYPE_METADATA[props.type || 'OTHER']
	const { displayNames, coHost } = getInvitationDisplayNames(props)

	const startsAtDate = React.useMemo(() => (typeof props.startsAt === 'string' ? new Date(props.startsAt) : props.startsAt), [props.startsAt])
	const dateText = formatLongDate(startsAtDate)
	const timeText = formatTime(startsAtDate)

	return (
		<div className="relative h-fit border rounded-sm shadow-2xl overflow-hidden flex flex-col">
			<div className="absolute inset-0 bg-white dark:bg-neutral-950 pointer-events-none" />

			<div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
			<div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />

			<div className="relative p-8 flex-1 flex flex-col gap-10 justify-center">
				<header className="text-center space-y-6">
					<div className="flex flex-col items-center gap-3">
						<div className={cn("p-4 rounded-2xl bg-white dark:bg-neutral-900 shadow-xl border border-border/50", typeInfo.textColor)}>
							<Icon icon={typeInfo.icon} className="size-8" />
						</div>
						<p className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase">{typeInfo.label}</p>
					</div>

					<div className="space-y-2">
						<h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white line-clamp-3">
							{displayNames}
						</h2>
						{coHost && (
							<p className="text-lg font-medium text-muted-foreground flex items-center justify-center gap-2">
								<span className="h-px w-4 bg-muted-foreground/30" />
								{coHost}
								<span className="h-px w-4 bg-muted-foreground/30" />
							</p>
						)}
					</div>
				</header>

				<section className="space-y-8 text-center max-w-sm mx-auto">
					<p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-400 font-medium italic">
						&ldquo;{props.description || "Nous avons le plaisir de vous inviter à cet événement spécial."}&rdquo;
					</p>

					<div className="grid grid-cols-2 gap-4">
						{/* Date */}
						<div className="p-2 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border border-border/50">
							<Icon icon="solar:calendar-bold" className="size-5 mx-auto mb-2 text-primary" />
							<p className="text-xs">{dateText.split(',')[0]}</p>
							<p className="text-xs text-muted-foreground">{dateText.split(',').slice(1).join(',')}</p>
						</div>

						<div className="p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border border-border/50">
							<Icon icon="solar:clock-circle-bold" className="size-5 mx-auto mb-2 text-primary" />
							<p className="font-bold text-xs uppercase tracking-wider">Heure</p>
							<p className="text-xs text-muted-foreground">{timeText}</p>
						</div>
					</div>

					<div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/5 border border-primary/10 text-primary">
						<Icon icon="solar:map-point-bold" className="size-5" />
						<p className="text-sm font-bold truncate max-w-[200px]">{props.location || "Lieu à confirmer"}</p>
					</div>
				</section>

				{/* <footer className="pt-2 text-center border-t border-border/30">
					<p className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground">Teeky &bull; RSVP</p>
				</footer> */}
			</div>
		</div>
	)
}
