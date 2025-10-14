"use client"
import * as React from 'react'
import Link from 'next/link'

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
          Vous n'avez pas encore créé d'invitation.{' '}
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
                    {inv.status ? (
                      <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {String(inv.status)}
                      </span>
                    ) : null}
                    {inv.visibility ? (
                      <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {String(inv.visibility)}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Link href={`/inv/${inv.slug}`} className="text-xs underline">
                    Voir la page publique
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
