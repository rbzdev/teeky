"use server"

import { prisma } from "@/lib/prisma/client"
import { revalidatePath } from "next/cache"

import { getSession } from "@/lib/session"
import { randomSlug } from "@/lib/utils"

import type { CreateInvitationPayload, InvitationModelKey } from '@/lib/types/invitation'

export async function createInvitation(payload: CreateInvitationPayload) {

  const session = await getSession()
  if (!session) {
    console.error("Not authorized: no session");
    return { success: false, code: 401, error: "Not authorized" }
  }

  const hostId = session?.userId

  const { hostManName, hostWomanName, description, location, startsAt, coordinateLat, coordinateLng, theme } = payload

  // Generate title from hostManName + hostWomanName
  const title = [hostManName?.trim(), hostWomanName?.trim()].filter(Boolean).join(" & ") || "Événement"

  // Build coordinate array from lat/lng if present
  let coordinate: string[] | undefined = undefined

  if (coordinateLat != null && coordinateLng != null) {
    if (!isNaN(coordinateLat) && !isNaN(coordinateLng)) {
      coordinate = [coordinateLat.toString(), coordinateLng.toString()]
    }
  }

  // Validation
  if (!hostId) return { success: false, error: "Not authorized" }
  if (!hostManName?.trim() && !hostWomanName?.trim()) return { success: false, error: "Au moins un nom (Monsieur ou Madame) est requis" }
  if (!startsAt) return { success: false, error: "Start date/time required" }
  if (!location?.trim()) return { success: false, error: "Location is required" }
  if (location && location.trim().length > 100) return { success: false, error: "Location is too long (max 100 characters)" }
  if (description && description.trim().length > 500) return { success: false, error: "Description is too long (max 500 characters)" }

  // Parse and validate start date
  const starts = new Date(startsAt)
  if (isNaN(starts.getTime())) return { success: false, error: "Invalid start time" }

  try {
    const slug = randomSlug();

    const invitation = await prisma.invitation.create({
      data: {
        hostId,
        title: title.trim(),
        hostManName,
        hostWomanName,
        description: description || undefined,
        location: location,
        coordinate: coordinate || [],
        startsAt: starts,
        theme: (theme as InvitationModelKey) || 'minimalist',
        visibility: "PRIVATE",
        slug,
      },
      select: {
        slug: true,
        title: true,
        startsAt: true,
        visibility: true,
        status: true,
        createdAt: true,
      },
    })


    revalidatePath("/inv/create")
    return { success: true, invitation }

  } catch (e: unknown) {
    console.error("createInvitation caught error", e)
    if (e && typeof e === 'object' && 'message' in e) {
      console.error("createInvitation error", { message: (e as { message?: string }).message })
    } else {
      console.error("createInvitation error", { raw: e })
    }
    return { success: false, error: "Failed to create invitation" }
  }
}
