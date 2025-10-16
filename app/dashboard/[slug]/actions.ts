"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma/client"
import { getCurrentUser } from "@/lib/auth/current-user"

export async function deleteGuest(guestId: string, invitationSlug: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Non autorisé")
  }

  try {
    // Vérifier que l'invitation appartient à l'utilisateur
    const invitation = await prisma.invitation.findFirst({
      where: {
        slug: invitationSlug,
        hostId: user.id,
      },
    })

    if (!invitation) {
      throw new Error("Invitation non trouvée ou accès non autorisé")
    }

    // Supprimer l'invité
    await prisma.guest.delete({
      where: {
        id: guestId,
        invitationId: invitation.id,
      },
    })

    revalidatePath(`/dashboard/${invitationSlug}`)
  } catch (error) {
    console.error("Erreur lors de la suppression de l'invité:", error)
    throw new Error("Impossible de supprimer l'invité")
  }
}

export async function assignSeat(guestId: string, invitationSlug: string, seatNumber: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Non autorisé")
  }

  try {
    // Vérifier que l'invitation appartient à l'utilisateur
    const invitation = await prisma.invitation.findFirst({
      where: {
        slug: invitationSlug,
        hostId: user.id,
      },
    })

    if (!invitation) {
      throw new Error("Invitation non trouvée ou accès non autorisé")
    }

    // TODO: Implémenter l'attribution de place
    // Pour l'instant, on pourrait ajouter un champ seatNumber à la table Guest
    // ou créer une table séparée pour les places

    console.log(`Attribution de la place ${seatNumber} à l'invité ${guestId}`)

    // Temporairement, on ne fait rien mais on pourrait :
    // await prisma.guest.update({
    //   where: { id: guestId },
    //   data: { seatNumber }
    // })

    revalidatePath(`/dashboard/${invitationSlug}`)
  } catch (error) {
    console.error("Erreur lors de l'attribution de place:", error)
    throw new Error("Impossible d'attribuer la place")
  }
}