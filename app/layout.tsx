import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner'

// Components
import { ThemeProvider } from "@/components/theme-provider";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL || process.env.APP_BASE_URL || 'https://teeky.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  applicationName: 'Teeky',
  title: {
    default: 'Teeky — Invitations élégantes en quelques minutes',
    template: '%s · Teeky',
  },
  description: 'Crée, personnalise et partage des invitations en ligne. Modèles élégants, partage instantané, et suivi des réponses (RSVP).',
  keywords: [
    'invitation', 'invitations', 'rsvp', 'événement', 'mariage', 'anniversaire', 'save the date', 'modèles', 'invitation en ligne',
  ],
  authors: [{ name: 'Olivier RUBUZ' }],
  creator: 'Teeky',
  publisher: 'Teeky',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Teeky',
    title: 'Teeky — Invitations élégantes en quelques minutes',
    description: 'Crée, personnalise et partage des invitations en ligne. Modèles élégants, partage instantané, et suivi des réponses (RSVP).',
    images: [{ url: 'https://teeky.vercel.app/logo.png', width: 1200, height: 630, alt: 'Teeky' }],
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@teeky',
    creator: '@teeky',
    title: 'Teeky — Invitations élégantes en quelques minutes',
    description: 'Crée, personnalise et partage des invitations en quelques minutes. Modèles élégants, partage instantané, et suivi des réponses (RSVP).',
    images: ['https://teeky.vercel.app/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.className} font-sans antialiased`}
      >
        <ThemeProvider attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          
        >
          {children}

          <div className="absolute left-4 top-2 border rounded-[11px] p-2 flex items-center justify-center bg-white/80 dark:bg-neutral-800/80 backdrop-blur">
            <AnimatedThemeToggler duration={900} />
          </div>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
