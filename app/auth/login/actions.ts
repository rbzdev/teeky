"use server"

import { prisma } from '@/lib/prisma/client'
import { verifyPassword } from '@/lib/auth/password'
import { createSession } from '@/lib/session'

interface LoginPayload {
  email: string
  password: string
}

export async function loginAction(payload: LoginPayload) {
  const email = payload.email?.trim().toLowerCase()
  const password = payload.password
  if (!email || !password) {
    return { success: false, error: 'Email et mot de passe requis' }
  }
  try {
    // Ne pas utiliser select ici pour éviter les désalignements de types
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return { success: false, error: 'Identifiants invalides' }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const u: any = user
    const hashed = (u.password as string | undefined) ?? (u.passwordHash as string | undefined)
    if (!hashed) return { success: false, error: 'Compte invalide (mot de passe absent)' }

    const ok = await verifyPassword(password, hashed)
    if (!ok) return { success: false, error: 'Identifiants invalides' }

    await createSession(user.id)

    return {
      success: true,
      user: { id: user.id, email: user.email, firstName: (u.firstName as string | undefined) ?? (u.name as string | undefined) ?? '', lastName: (u.lastName as string | undefined) ?? '' },
    }

  } catch (e) {
    console.error('loginAction error', e)
    return { success: false, error: 'Erreur serveur' }
  }
}
