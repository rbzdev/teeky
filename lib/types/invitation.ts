// Centralized invitation-related TypeScript types

// Route params
export type DashboardInvitationBySlugPageProps = {
	params: { slug: string }
}

// Client-side draft state used during creation flow
import type {} from 'zod'

export interface InvitationDraft {
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
}

export interface InvitationContextValue {
	draft: InvitationDraft
	update<K extends keyof InvitationDraft>(key: K, value: InvitationDraft[K]): void
	reset(): void
}

// Server action payloads
export interface CreateInvitationPayload {
	hostManName: string
	hostWomanName: string
	description?: string
	location?: string
	startsAt: string // ISO date string (timezone-aware)
	coordinateLat?: number
	coordinateLng?: number
	theme?: InvitationModelKey
}

// UI models / components
export type MinimalistInvitationProps = {
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

