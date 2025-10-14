import type { Metadata } from 'next'
import React from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL || process.env.APP_BASE_URL || 'https://teeky.vercel.app'

export const metadata: Metadata = {
	title: {
		default: 'Créer une invitation',
		template: '%s · Teeky',
	},
	description: "Crée et personnalise ton invitation en ligne. Choisis un modèle, ajoute tes informations et prévisualise instantanément.",
	alternates: {
		canonical: '/inv/create',
	},
	robots: {
		index: false,
		follow: false,
		googleBot: {
			index: false,
			follow: false,
			'max-image-preview': 'none',
			'max-snippet': 0,
			'max-video-preview': 0,
		},
	},
	openGraph: {
		type: 'website',
		url: new URL('/inv/create', BASE_URL).toString(),
		title: 'Créer une invitation',
		description: "Crée et personnalise ton invitation en ligne. Prévisualisation en direct.",
		images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'Teeky' }],
	},
}

export default function CreateLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>
}

