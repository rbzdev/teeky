"use server"

import { prisma } from "@/lib/prisma/client"
import { revalidatePath } from "next/cache"

import { getSession } from "@/lib/session"
import { randomSlug } from "@/lib/utils"

import type { CreateInvitationPayload, InvitationModelKey } from '@/lib/types/invitation'

export async function createInvitation(payload: CreateInvitationPayload) {

  // DEBUG
  // console.log("Payload de création inv reçu : ", payload)

  const session = await getSession()
  if (!session) {
    console.error("Not authorized: no session");
    return { success: false, code: 401, error: "Not authorized" }
  }

  const hostId = session?.userId

  const { type, hostManName, hostWomanName, description, location, startsAt, coordinateLat, coordinateLng, images, price, currency, theme, venueId, cateringId, securityId } = payload

  // Generate title based on event type
  let title = ""
  if (type === 'MARRIAGE') {
    title = [hostManName?.trim(), hostWomanName?.trim()].filter(Boolean).join(" & ") || "Événement"
  } else {
    // For other types, maybe use a generic title or something else
    title = hostManName?.trim() || hostWomanName?.trim() || "Nouvel Événement"
  }

  // // DEBUG
  // console.log("Title : ", title)

  // Build coordinate array from lat/lng if present
  let coordinate: string[] | undefined = undefined

  if (coordinateLat != null && coordinateLng != null) {
    if (!isNaN(coordinateLat) && !isNaN(coordinateLng)) {
      coordinate = [coordinateLat.toString(), coordinateLng.toString()]
    }
  }

  // // DEBUG
  // console.log("Coordinate : ", coordinate)

  // Validation
  if (!hostId) return { success: false, error: "Not authorized" }

  // DEBUG
  // console.log("Host id : ", hostId)

  if (!hostManName?.trim()) return { success: false, error: "Au moins un nom (Monsieur ou Madame) est requis" }

  // // DEBUG
  // console.log("Host names : ", hostManName)

  if (!startsAt) return { success: false, error: "Start date/time required" }

  // // DEBUG
  // console.log("Starts at : ", startsAt)

  if (!location?.trim()) return { success: false, error: "Location is required" }

  // // DEBUG
  // console.log("Location : ", location)

  if (location && location.trim().length > 100) return { success: false, error: "Location is too long (max 100 characters)" }

  // // DEBUG
  // console.log("Location : ", location)

  if (description && description.trim().length > 500) return { success: false, error: "Description is too long (max 500 characters)" }

  // // DEBUG
  // console.log("Description : ", description)

  // Parse and validate start date
  const starts = new Date(startsAt)
  if (isNaN(starts.getTime())) return { success: false, error: "Invalid start time" }



  // // DEBUG
  // console.log("Payload de création : ", payload)

  try {
    const slug = randomSlug();

    const invitation = await prisma.invitation.create({
      data: {
        hostId,
        type,
        title: title.trim(),
        hostManName,
        hostWomanName,
        description: description || undefined,
        location: location,
        coordinate: coordinate || [],
        images: images || [],
        startsAt: starts,
        theme: (theme as InvitationModelKey) || 'classic',
        visibility: "PRIVATE",
        slug,
        venueId: venueId || undefined,
        cateringId: cateringId || undefined,
        securityId: securityId || undefined,
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
