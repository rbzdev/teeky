"use server"

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma/client'
import type { Prisma } from '@prisma/client'
import crypto from 'node:crypto'

import { randomSlug } from '@/lib/utils'

export type RsvpDecision = 'ACCEPTED' | 'DECLINED'

/**
 * Minimal RSVP action stub. In the future, link a Guest by token/email and update status.
 */
export async function rsvpInvitation(slug: string, decision: RsvpDecision) {
  // TODO: Persist guest response when token/email flow is implemented 
  console.log('RSVP:', { slug, decision })

  // Revalidate the public page to reflect any server-side derived changes
  revalidatePath(`/inv/${slug}`)
  return { ok: true }
}

/**
 * Confirm an invitation by creating a Guest linked to the Invitation identified by slug.
 * Currently creates a new Guest record with ACCEPTED status and optional phone.
 */
export async function confirmInvitation(slug: string, data: { fullName: string; phone?: string | null }) {
  const invitation = await prisma.invitation.findUnique({ where: { slug }, select: { id: true } })
  if (!invitation) {
    throw new Error('Invitation not found')
  }

  const fullName = (data.fullName || '').trim()
  if (!fullName) {
    throw new Error('Le nom complet est requis')
  }

  const guestSlug = randomSlug()
  const phoneNormalized = (data.phone || '').trim()
  
  // Generate a unique random token (>= 128 bits entropy)
  let token = crypto.randomBytes(32).toString('hex')
  // Basic retry in the rare event of a token collision
  
  for (let i = 0; i < 2; i++) {
    try {
      {
        const createData = {
          invitationId: invitation.id,
          name: fullName,
          phone: phoneNormalized || undefined,
          status: 'ACCEPTED',
          slug: guestSlug,
          token,
          respondedAt: new Date(),
        } as unknown as Prisma.GuestUncheckedCreateInput
        await prisma.guest.create({ data: createData, select: { id: true } })
      }
      revalidatePath(`/inv/${slug}`)
      return { ok: true }

    } catch (err) {
      // Prisma unique constraint violation (token) => retry with new token once
      const isUniqueViolation = typeof err === 'object' && err !== null && 'code' in err && (err as { code?: string }).code === 'P2002'
      if (isUniqueViolation) {
        token = crypto.randomBytes(32).toString('hex')
        continue
      }
      throw err
    }
  }

  // Final attempt if loop didn't return
  {
    const createData = {
      invitationId: invitation.id,
      name: fullName,
      phone: phoneNormalized || undefined,
      status: 'ACCEPTED',
      slug: guestSlug,
      token,
      respondedAt: new Date(),
    } as unknown as Prisma.GuestUncheckedCreateInput
    await prisma.guest.create({ data: createData, select: { id: true } })
  }
  revalidatePath(`/inv/${slug}`)
  return { ok: true }
}
