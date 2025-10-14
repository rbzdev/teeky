import React from 'react'
import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || process.env.APP_BASE_URL || 'https://teeky.vercel.app'
const canonicalPath = '/auth/register'

export const metadata: Metadata = {
  title: 'Inscription - Teeky',
  description: "Créez votre compte Teeky pour gérer vos invitations en ligne, suivre les réponses (RSVP) et personnaliser vos événements.",
  keywords: ['inscription', 'créer un compte', 'invitation', 'RSVP', 'événement', 'Teeky'],
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: canonicalPath,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    url: canonicalPath,
    title: 'Inscription - Teeky',
    siteName: 'Teeky',
    description: "Créez votre compte Teeky pour gérer vos invitations en ligne, suivre les réponses (RSVP) et personnaliser vos événements.",
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'Teeky'
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inscription - Teeky',
    description: "Créez votre compte Teeky pour gérer vos invitations en ligne, suivre les réponses (RSVP) et personnaliser vos événements.",
    images: ['/logo.png'],
  },
  category: 'technology',
}

export default function AuthRegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {children}
    </div>
  )
}
