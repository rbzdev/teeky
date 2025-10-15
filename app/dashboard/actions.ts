"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma/client"
import { getCurrentUser } from "@/lib/auth/current-user"

export async function activateInvitation(invitationId: string) {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error("Non autorisé")
    }

    try {
        await prisma.invitation.update({
            where: {
                id: invitationId,
                hostId: user.id,
            },
            data: {
                status: "ACTIVE",
            },
        })

        revalidatePath("/dashboard")

    } catch (error) {
        console.error("Erreur lors de l'activation:", error)
        throw new Error("Impossible d'activer l'invitation")
    }
}

export async function archiveInvitation(invitationId: string) {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error("Non autorisé")
    }

    try {
        await prisma.invitation.update({
            where: {
                id: invitationId,
                hostId: user.id,
            },
            data: {
                status: "DRAFT",
            },
        })

        revalidatePath("/dashboard")
    } catch (error) {
        console.error("Erreur lors de l'archivage:", error)
        throw new Error("Impossible d'archiver l'invitation")
    }
}

export async function deleteInvitation(invitationId: string) {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error("Non autorisé")
    }

    try {
        await prisma.invitation.delete({
            where: {
                id: invitationId,
                hostId: user.id,
            },
        })

        revalidatePath("/dashboard")
    } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        throw new Error("Impossible de supprimer l'invitation")
    }
}