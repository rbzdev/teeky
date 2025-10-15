"use client"
import * as React from 'react'
import Link from 'next/link'

// Components
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Icons
import { Icon } from '@iconify/react'

// Actions
import { archiveInvitation, deleteInvitation, activateInvitation } from "../actions"

type InvitationItem = {
  id: string
  title: string | null
  slug: string
  startsAt: string | Date
  status?: string | null
  visibility?: string | null
  theme?: string | null
  updatedAt?: string | Date | null
}

export default function MyInvitations({
  user,
  invitations,
}: {
  user: { id: string; firstName?: string; lastName?: string } | null
  invitations: InvitationItem[]
}) {
  const [isPending, startTransition] = React.useTransition()

  const handleActivate = (invitationId: string) => {
    startTransition(async () => {
      try {
        await activateInvitation(invitationId)
      } catch (error) {
        console.error("Erreur lors de l'activation:", error)
        // TODO: Afficher un toast d'erreur
      }
    })
  }

  const handleArchive = (invitationId: string) => {
    startTransition(async () => {
      try {
        await archiveInvitation(invitationId)
      } catch (error) {
        console.error("Erreur lors de l'archivage:", error)
        // TODO: Afficher un toast d'erreur
      }
    })
  }

  const handleDelete = (invitationId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette invitation ?")) {
      startTransition(async () => {
        try {
          await deleteInvitation(invitationId)
        } catch (error) {
          console.error("Erreur lors de la suppression:", error)
          // TODO: Afficher un toast d'erreur
        }
      })
    }
  }

  return (
    <section className="rounded-lg border p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-medium">Vos invitations</h2>
        <Link href="/inv/create" className="text-xs underline">Créer une invitation</Link>
      </div>
      {!user ? (
        <p className="text-sm text-muted-foreground">Connectez-vous pour voir vos invitations.</p>
      ) : invitations.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Vous n&apos;avez pas encore créé d&apos;invitation.
          <Link href="/inv/create" className="underline">Commencer</Link>
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {invitations.map((inv) => {
            const dateText = (() => {
              try {
                const d = inv.startsAt instanceof Date ? inv.startsAt : new Date(inv.startsAt)
                return d.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
              } catch {
                return ''
              }
            })()
            return (
              <li key={inv.id} className="rounded-md border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium leading-tight">{inv.title || 'Sans titre'}</h3>
                    <p className="text-xs text-muted-foreground">{dateText}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1">

                    {inv.status && (
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] tracking-wide text-muted-foreground 
                        ${inv.status === 'ACTIVE' ?
                          'bg-green-500 text-white dark:text-black' :
                          inv.status === 'DRAFT' ?
                            'bg-orange-400/30 dark:bg-orange-300/70 text-black!' : ''}
                         `}>

                        {String(inv.status === "ACTIVE" ? "Active" : inv.status === "DRAFT" ? "Archivé" : inv.status)}
                      </span>
                    )}

                    {inv.visibility && (
                      <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {String(inv.visibility)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <Link href={`/inv/${inv.slug}`} className="text-xs underline">
                    Voir la page publique
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <Icon icon="solar:menu-dots-bold" width="24" height="24" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild className='rounded-b-xs!'>

                        <Link href={`/dashboard/${inv.slug}`}>
                          Voir
                        </Link>
                      </DropdownMenuItem>


                      {inv.status === "ARCHIVED" ? (
                        <DropdownMenuItem
                          onClick={() => handleActivate(inv.id)}
                          disabled={isPending}
                          className="rounded-xs! "
                        >
                          Activer
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleArchive(inv.id)}
                          disabled={isPending}
                          className="rounded-xs! "
                        >
                          Archiver
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-destructive rounded-t-xs! "
                        onClick={() => handleDelete(inv.id)}
                        disabled={isPending}
                      >
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
