import { prisma } from '@/lib/prisma/client'
// import { getCurrentUser } from '@/lib/auth/current-user'
// import { redirect } from 'next/navigation'
import Link from 'next/link'
import InvitationModelRenderer from '../../inv/Models/renderer'
import type { InvitationModelKey } from '@/lib/types/invitation'
import type { DashboardInvitationBySlugPageProps } from '@/lib/types/invitation'
import QrCode from './QrCode'
import ShareActions from './ShareActions'

export default async function DashboardInvitationBySlugPage({ params }: DashboardInvitationBySlugPageProps) {
    //   const user = await getCurrentUser()
    //   if (!user) {
    //     redirect(`/auth/login?next=/dashboard/${encodeURIComponent(params.slug)}`)
    //   }

    const invitation = await prisma.invitation.findUnique({
        where: { slug: params.slug },
        select: {
            id: true,
            slug: true,
            title: true,
            hostId: true,
            hostManName: true,
            hostWomanName: true,
            description: true,
            location: true,
            coordinate: true,
            startsAt: true,
            theme: true,
            visibility: true,
            status: true,
            createdAt: true,
        },
    })


    if (!invitation) {
        // notFound()
        return (
            <div className="flex">
                <h2>Invitation non trouvée</h2>
            </div>
        )
    }

    // QR value will be built inside QrCode using getAppBaseUrl

    return (
        <main className="mx-auto max-w-4xl w-full p-6 space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">{invitation.title}</h1>
                    <p className="text-sm text-muted-foreground">Slug: {invitation.slug}</p>
                </div>
                <Link className="text-sm underline" href="/dashboard">Retour</Link>
            </header>

            <section className="space-y-4">
                <div className="relative">
                    <InvitationModelRenderer
                        model={(invitation.theme as InvitationModelKey) || 'elegant'}
                        title={invitation.title}
                        hostManName={invitation.hostManName ?? undefined}
                        hostWomanName={invitation.hostWomanName ?? undefined}
                        description={invitation.description ?? undefined}
                        location={invitation.location ?? undefined}
                        coordinate={invitation.coordinate}
                        startsAt={invitation.startsAt}
                    />
                    {/* QR collé en bas à droite de la carte */}
                    <div className="absolute bottom-3 right-3">
                        <QrCode slug={invitation.slug} size={96} />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground pt-2">
                    <span>Statut: {invitation.status}</span>
                    <span>•</span>
                    <span>Visibilité: {invitation.visibility}</span>
                    <span>•</span>
                    <span>Créé le {invitation.createdAt.toISOString()}</span>
                </div>

                <div className="pt-2">
                    <ShareActions slug={invitation.slug} title={invitation.title} />
                </div>
            </section>
        </main>
    )
}
