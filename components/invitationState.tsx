"use client";

import * as React from 'react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Icons
import { Icon } from '@iconify/react'

type InvitationState =
    | 'not-found'
    | 'private'
    | 'inactive'
    | 'draft'
    | 'archived'
    | 'expired'

type InvitationStateDisplayProps = {
    state: InvitationState
    title?: string
    description?: string
    slug?: string
}

const stateConfig = {
    'not-found': {
        icon: "hugeicons:file-not-found",
        title: 'Invitation introuvable',
        description: 'Cette invitation n\'existe pas ou a été supprimée.',
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-950/20',
        borderColor: 'border-orange-200 dark:border-orange-800',
    },
    'private': {
        icon: "solar:lock-keyhole-minimalistic-bold",
        title: 'Invitation privée',
        description: 'Cette invitation n\'est accessible que sur invitation personnelle.',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-950/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
    },
    'inactive': {
        icon: "hugeicons:clock",
        title: 'Invitation inactive',
        description: 'Cette invitation n\'est plus active.',
        color: 'text-gray-600 dark:text-gray-400',
        bgColor: 'bg-gray-50 dark:bg-gray-950/20',
        borderColor: 'border-gray-200 dark:border-gray-800',
    },
    'draft': {
        icon: "hugeicons:clock",
        title: 'Invitation en brouillon',
        description: 'Cette invitation est en cours de préparation.',
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
    },
    'archived': {
        icon: "hugeicons:archive",
        title: 'Invitation archivée',
        description: 'Cette invitation a été archivée.',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-950/20',
        borderColor: 'border-green-200 dark:border-green-800',
    },
    'expired': {
        icon: "hugeicons:expired",
        title: 'Invitation expirée',
        description: 'Cette invitation n\'est plus valable.',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-950/20',
        borderColor: 'border-red-200 dark:border-red-800',
    },
}

export default function InvitationStateDisplay({
    state,
    title,
    description,
    slug
}: InvitationStateDisplayProps) {
    const config = stateConfig[state]

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full "
            >
                <div className={`rounded-lg border p-8 text-center ${config.bgColor} ${config.borderColor}`}>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${config.bgColor} ${config.color} mb-6`}
                    >
                        <Icon icon={config.icon} className="w-8 h-8" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
                    >
                        {title || config.title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-600 dark:text-gray-400 mb-8"
                    >
                        {description || config.description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-3"
                    >
                        {/* {slug && (
              <p className="text-sm text-gray-500">
                Slug: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{slug}</code>
              </p>
            )} */}

                        <div className="flex flex-row gap-3 justify-center">
                            <Button asChild variant="outline">
                                <Link href="/">
                                    <Icon icon="solar:home-smile-angle-bold" className='text-primary text-3xl' />
                                    Accueil
                                </Link>
                            </Button>

                            {state === 'private' && (
                                <Button asChild>
                                    <Link href="/auth/login">
                                        Se connecter
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Informations supplémentaires pour les développeurs/debug */}
                {/* {process.env.NODE_ENV === 'development' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 p-4 bg-gray-100 rounded-lg text-left"
          >
            <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Info</h3>
            <dl className="text-xs text-gray-600 space-y-1">
              <div>
                <dt className="inline font-medium">État:</dt>
                <dd className="inline ml-1">{state}</dd>
              </div>
              {slug && (
                <div>
                  <dt className="inline font-medium">Slug:</dt>
                  <dd className="inline ml-1">{slug}</dd>
                </div>
              )}
            </dl>
          </motion.div>
        )} */}
            </motion.div>
        </div>
    )
}

// Composant helper pour les états courants
export function InvitationNotFound({ slug }: { slug?: string }) {
    return <InvitationStateDisplay state="not-found" slug={slug} />
}

export function InvitationPrivate({ slug }: { slug?: string }) {
    return <InvitationStateDisplay state="private" slug={slug} />
}

export function InvitationInactive({ slug }: { slug?: string }) {
    return <InvitationStateDisplay state="inactive" slug={slug} />
}

export function InvitationDraft({ slug }: { slug?: string }) {
    return <InvitationStateDisplay state="draft" slug={slug} />
}

export function InvitationArchived({ slug }: { slug?: string }) {
    return <InvitationStateDisplay state="archived" slug={slug} />
}

export function InvitationExpired({ slug }: { slug?: string }) {
    return <InvitationStateDisplay state="expired" slug={slug} />
}
