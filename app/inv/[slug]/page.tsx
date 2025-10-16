import { prisma } from '@/lib/prisma/client'
import InvitationModelRenderer from '@/app/inv/Models/renderer'
import type { InvitationModelKey } from '@/lib/types/invitation'
import Response from './components/response'


type PageProps = { params: Promise<{ slug: string }> }

export default async function PublicInvitationPage({ params }: PageProps) {
	const { slug: routeSlug } = await params
	const invitation = await prisma.invitation.findUnique({
		where: { slug: routeSlug },
		select: {
			id: true,
			slug: true,
			title: true,
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
		return (
			<main className="mx-auto max-w-3xl w-full p-6">
				<p className="text-sm text-muted-foreground">Invitation introuvable.</p>
			</main>
		)
	}

		const slug = invitation.slug

	return (
		<main className="mx-auto max-w-3xl w-full p-6 space-y-6 flex flex-col justify-center min-h-screen ">
			<section className="relative" >
				<InvitationModelRenderer
					model={(invitation.theme as InvitationModelKey) || 'minimalist'}
					title={invitation.title}
					hostManName={invitation.hostManName ?? undefined}
					hostWomanName={invitation.hostWomanName ?? undefined}
					description={invitation.description ?? undefined}
					location={invitation.location ?? undefined}
					coordinate={invitation.coordinate}
					startsAt={invitation.startsAt}
				/>
			</section>

			<Response slug={slug} />
		</main>
	)
}

