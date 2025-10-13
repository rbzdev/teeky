import 'server-only'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma/client'

export type CurrentUser = {
  id: string
  email: string
  firstName: string
  lastName: string
}

/**
 * Returns the minimal current user based on the session cookie, or null if unauthenticated.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getSession()
  if (!session?.userId) return null

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, firstName: true, lastName: true },
  })

  return user ?? null
}
