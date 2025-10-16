import { prisma } from '@/lib/prisma/client'
import type { Metadata } from 'next'
import InvitationStateDisplay from '@/components/invitationState'

type LayoutProps = {
    params: Promise<{ slug: string }>
    children: React.ReactNode
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const { slug } = await params

    const invitation = await prisma.invitation.findUnique({
        where: { slug },
        select: {
            id: true,
            title: true,
            description: true,
            hostManName: true,
            hostWomanName: true,
            location: true,
            startsAt: true,
            theme: true,
            visibility: true,
            status: true,
        },
    })

    if (!invitation) {
        return {
            title: 'Invitation introuvable',
            description: 'Cette invitation n\'existe pas ou n\'est plus disponible.',
        }
    }

    // Vérifier si l'invitation est publique
    if (invitation.visibility !== 'PUBLIC') {
        return {
            title: 'Invitation privée',
            description: 'Cette invitation n\'est pas accessible publiquement.',
        }
    }

    // Vérifier si l'invitation est active
    if (invitation.status !== 'ACTIVE') {
        return {
            title: 'Invitation inactive',
            description: 'Cette invitation n\'est plus active.',
        }
    }

    // Formater la date
    const formattedDate = invitation.startsAt.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

    // Construire le titre
    const title = invitation.title || `${invitation.hostManName || ''} ${invitation.hostWomanName ? '& ' + invitation.hostWomanName : ''} vous invitent`

    // Construire la description
    const description = invitation.description ||
        `Vous êtes invité${invitation.location ? ` à ${invitation.location}` : ''} le ${formattedDate}.`

    // URL de base (à adapter selon votre domaine)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const invitationUrl = `${baseUrl}/inv/${slug}`

    return {
        title: {
            default: title,
            template: `%s | ${title}`,
        },
        description,
        keywords: ['invitation', 'événement', 'fête', ...(invitation.location ? [invitation.location] : [])],
        authors: [{ name: invitation.hostManName || invitation.hostWomanName || 'Hôte' }],
        creator: invitation.hostManName || invitation.hostWomanName || 'Hôte',
        publisher: invitation.hostManName || invitation.hostWomanName || 'Hôte',
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: invitationUrl,
        },
        openGraph: {
            title,
            description,
            url: invitationUrl,
            siteName: 'Teeky - Invitations',
            type: 'website',
            locale: 'fr_FR',
            images: [
                {
                    url: `/api/og/invitation/${slug}`,
                    width: 1200,
                    height: 630,
                    alt: `Invitation ${title}`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [`/api/og/invitation/${slug}`],
            creator: '@teeky_app', // À adapter
        },
        robots: {
            index: invitation.visibility === 'PUBLIC' && invitation.status === 'ACTIVE',
            follow: invitation.visibility === 'PUBLIC' && invitation.status === 'ACTIVE',
            googleBot: {
                index: invitation.visibility === 'PUBLIC' && invitation.status === 'ACTIVE',
                follow: invitation.visibility === 'PUBLIC' && invitation.status === 'ACTIVE',
            },
        },
        other: {
            'article:author': invitation.hostManName || invitation.hostWomanName || 'Hôte',
            'article:published_time': invitation.startsAt.toISOString(),
            'og:locale': 'fr_FR',
            'og:site_name': 'Teeky - Invitations',
        },
    }
}

export default async function InvitationLayout({ params, children }: LayoutProps) {
    const { slug } = await params

    // Vérifier que l'invitation existe et est accessible
    const invitation = await prisma.invitation.findUnique({
        where: { slug },
        select: {
            id: true,
            visibility: true,
            status: true,
        },
    })

    if (!invitation) {
        return <InvitationStateDisplay state="not-found" slug={slug} />
    }

    // Vérifier la visibilité et le statut
    // if (invitation.visibility !== 'PUBLIC') {
    //     return <InvitationStateDisplay state="private" slug={slug} />
    // }

    if (invitation.status !== 'ACTIVE') {
        const state = invitation.status === 'DRAFT' ? 'draft' :
                     invitation.status === 'ARCHIVED' ? 'archived' : 'inactive'
        return <InvitationStateDisplay state={state} slug={slug} />
    }

    return (
        <>
            {children}
        </>
    )
}
