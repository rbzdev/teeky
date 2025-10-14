import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: {
		default: 'Connexion',
		template: '%s · Teeky',
	},
	description: 'Connectez-vous pour accéder à votre espace et gérer vos invitations.',
	alternates: { canonical: '/auth/login' },
	robots: {
		index: false,
		follow: false,
		googleBot: { index: false, follow: false },
	},
	openGraph: {
		type: 'website',
		url: '/auth/login',
		title: 'Connexion · Teeky',
		description: 'Accédez à votre espace sur Teeky.',
		images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'Teeky' }],
	},
}

export default function AuthLoginLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen flex flex-col">
			{children}
		</div>
	)
}
