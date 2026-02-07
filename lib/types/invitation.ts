// Centralized invitation-related TypeScript types

// Route params
export type DashboardInvitationBySlugPageProps = {
	params: { slug: string }
}

// Client-side draft state used during creation flow
import type { } from 'zod'

export type EventType = 'MARRIAGE' | 'DOT' | 'ANNIVERSARY' | 'CONFERENCE' | 'MEETING' | 'OTHER'

export interface InvitationDraft {
	type: EventType
	hostManName: string
	hostWomanName: string
	description: string
	location: string
	coordinate: string
	locationLat?: number | null
	locationLng?: number | null
	date: Date | null
	startTime: string
	hasEnd: boolean
	endTime: string
	// Selected visual model/theme for rendering previews and final invitation
	theme: InvitationModelKey
	// Optional services
	venueId?: string | null
	cateringId?: string | null
	securityId?: string | null
}

export interface InvitationContextValue {
	draft: InvitationDraft
	update<K extends keyof InvitationDraft>(key: K, value: InvitationDraft[K]): void
	reset(): void
}

// Server action payloads
export interface CreateInvitationPayload {
	type: EventType
	hostManName: string
	hostWomanName: string
	description?: string
	location?: string
	startsAt: string // ISO date string (timezone-aware)
	coordinateLat?: number
	coordinateLng?: number
	theme?: InvitationModelKey
	venueId?: string
	cateringId?: string
	securityId?: string
}

// UI models / components
export type MinimalistInvitationProps = {
	type?: EventType
	title?: string
	hostManName?: string
	hostWomanName?: string
	description?: string
	location?: string
	coordinate?: string[]
	// Accept string or Date since server-to-client serialization turns Date into string
	startsAt: string | Date
}

export interface InvitationPreviewProps {
	variant?: 'inline' | 'dialog'
}

// Invitation model key: allow any string to enable adding new themes without changing types
export type InvitationModelKey = string








// UTILS``

export function formatLongDate(d: Date) {
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

export function formatTime(d: Date) {
	try {
		return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
	} catch {
		return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
	}
}

export interface EventTypeInfo {
	label: string
	icon: string
	textColor: string
	lightBg: string
	strongBg: string
}

export const EVENT_TYPE_METADATA: Record<EventType, EventTypeInfo> = {
	MARRIAGE: {
		label: 'Mariage',
		icon: 'solar:heart-bold',
		textColor: 'text-rose-500',
		lightBg: 'bg-rose-50',
		strongBg: 'bg-rose-600',
	},
	DOT: {
		label: 'Dot',
		icon: 'solar:wad-of-money-bold',
		textColor: 'text-amber-500',
		lightBg: 'bg-amber-50',
		strongBg: 'bg-amber-600',
	},
	ANNIVERSARY: {
		label: 'Anniversaire',
		icon: 'fluent-mdl2:birthday-cake',
		textColor: 'text-purple-500',
		lightBg: 'bg-purple-50',
		strongBg: 'bg-purple-600',
	},
	CONFERENCE: {
		label: 'Conférence',
		icon: 'solar:videocamera-record-bold',
		textColor: 'text-blue-500',
		lightBg: 'bg-blue-50',
		strongBg: 'bg-blue-600',
	},
	MEETING: {
		label: 'Réunion',
		icon: 'solar:users-group-two-rounded-bold',
		textColor: 'text-emerald-500',
		lightBg: 'bg-emerald-50',
		strongBg: 'bg-emerald-600',
	},
	OTHER: {
		label: 'Autre',
		icon: 'solar:menu-dots-bold',
		textColor: 'text-slate-500',
		lightBg: 'bg-slate-50',
		strongBg: 'bg-slate-600',
	},
}

/**
 * Common logic to extract display names based on event type
 */
export function getInvitationDisplayNames(props: {
	type?: string
	hostManName?: string
	hostWomanName?: string
}) {
	const isWeddingRelated = props.type === 'MARRIAGE' || props.type === 'DOT'

	const displayNames = isWeddingRelated
		? [props.hostManName, props.hostWomanName].filter(Boolean).join(' & ') || 'Organisateur'
		: props.hostManName || 'Organisateur'

	const coHost = !isWeddingRelated && props.hostWomanName ? props.hostWomanName : null

	return { displayNames, coHost, isWeddingRelated }
}


