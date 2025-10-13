import { getCurrentUser } from '@/lib/auth/current-user'
import Link from 'next/link'

export const metadata = {
  title: 'Tableau de bord - Teeky',
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  return (
    <main className="mx-auto max-w-4xl w-full p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tableau de bord</h1>
          <p className="text-sm text-muted-foreground">
            {user ? `Bienvenue, ${user.firstName} ${user.lastName}` : 'Bienvenue'}
          </p>
        </div>
        <Link className="text-sm underline" href="/">Accueil</Link>
      </header>

      <section className="rounded-lg border p-4">
        <h2 className="font-medium mb-2">Votre compte</h2>
        {user ? (
          <ul className="text-sm space-y-1">
            <li><span className="font-medium">Email:</span> {user.email}</li>
            <li><span className="font-medium">Id:</span> {user.id}</li>
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Aucune session active.</p>
        )}
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="font-medium mb-2">Actions rapides</h2>
        <form action={async () => {
          'use server'
          const { logoutAction } = await import('../auth/logout/actions')
          await logoutAction()
        }}>
          <button type="submit" className="inline-flex items-center rounded-md border px-3 py-1 text-sm hover:bg-accent">
            Se déconnecter
          </button>
        </form>
      </section>
    </main>
  )
}
