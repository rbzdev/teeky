import React from 'react'

export const metadata = {
	title: 'Connexion - Teeky'
}

export default function AuthLoginLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen flex flex-col">
			{children}
		</div>
	)
}
