"use server"

import { prisma } from '@/lib/prisma/client'
import { hashPassword } from '@/lib/auth/password'
import { randomUUID } from 'crypto'

interface RegisterPayload {
    email: string
    password: string
    firstName: string
    lastName: string
}

export async function registerAction(payload: RegisterPayload) {
    const email = payload.email?.trim().toLowerCase()
    const password = payload.password?.trim()
    const firstName = payload.firstName?.trim()
    const lastName = payload.lastName?.trim()


    if (!email || !password || !firstName || !lastName) {
        return { success: false, error: 'Tous les champs sont requis' }
    }
    if (!process.env.DATABASE_URL) {
        return { success: false, error: 'Configuration BD manquante (DATABASE_URL absent)' }
    }

    // Generate uniq id
    const userId = randomUUID()
    // DEBUG
    // console.log('Generated userId:', userId)
    
    try {
        const existing = await prisma.user.findUnique({ where: { email }})
        if (existing) return { success: false, error: 'Un compte existe déjà avec cet email' }

        const passwordHashed = await hashPassword(password)
        
        const user = await prisma.user.create({
            data: {
                id: userId,
                email,
                password: passwordHashed,
                firstName,
                lastName
            }
        })

        console.log('Created user:', user)
        
        return { success: true, user }
    } catch (e) {
        // const message = e instanceof Error ? e.message : ''
        // if (message.includes('AuthenticationFailed') || message.includes('bad auth')) {
        //     return { success: false, error: 'Échec d\'authentification MongoDB (revérifiez utilisateur/mot de passe & whitelist IP)' }
        // }
        // if (message.includes('SCRAM')) {
        //     return { success: false, error: 'Problème d\'authentification cluster Mongo (SCRAM)' }
        // }
        // if (message.includes('Unknown arg') || message.includes('Argument') || message.includes('passwordHash')) {
        //     return { success: false, error: 'Le client Prisma n\'est pas aligné avec le schéma (exécutez: pnpm prisma generate)' }
        // }
        console.error('registerAction error', e)
        return { success: false, error: 'Erreur serveur' }
    }
}
