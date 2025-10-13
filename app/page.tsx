import { Button } from "@/components/ui/button"
import Link from "next/link"
import InvitationModelRenderer from "@/app/inv/Models/renderer"

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/40 dark:from-neutral-950 dark:to-neutral-900">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Teeky
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Fonctionnalités</Link>
            <Link href="#models" className="hover:text-foreground transition-colors">Modèles</Link>
            <Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="hidden sm:inline-flex">
              <Button variant="ghost" className="text-xs">
                Se connecter
              </Button>
            </Link>
            <Link href="/inv/create" className="">
              <Button className="text-xs">
                Créer une invitation
              </Button>
            </Link>
            <AnimatedThemeToggler />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_0%,theme(colors.amber.200/.4),transparent_60%)] dark:bg-[radial-gradient(70%_50%_at_50%_0%,theme(colors.neutral.800/.7),transparent_60%)]" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
                Crée des invitations élégantes en quelques minutes
              </h1>
              <p className="text-sm text-muted-foreground max-w-prose">
                Personnalise ton thème, partage en un lien, et suis les réponses en temps réel. Simple, rapide, sans stress.
              </p>
              <div className="flex flex-row gap-3">
                <Link href="/inv/create" className="">
                  <Button className="text-xs">
                    Commencer
                  </Button>
                </Link>
                <Link href="#features" className="">
                  <Button variant="outline" className="text-xs">
                    Découvrir les fonctionnalités
                  </Button>
                </Link>
              </div>
              <div className="text-xs text-muted-foreground">Aucune carte bancaire requise</div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 -z-10 bg-gradient-to-tr from-amber-400/30 via-rose-300/30 to-transparent rounded-3xl blur-2xl" />
              <div className="rounded-4xl border bg-card shadow-sm p-2">
                {/* Live models preview */}
                <div className="w-full overflow-x-auto">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-full">
                      <InvitationModelRenderer
                        model="classic"
                        hostManName="Alex"
                        hostWomanName="Sophie"
                        description="Rejoignez-nous pour une célébration chaleureuse."
                        location="1234, Avenue des événements, Lubumbashi"
                        startsAt={new Date('2025-06-21T16:00:00')}
                      />
                    </div>

                  </div>
                </div>
                <div className="mt-3 text-center text-xs text-muted-foreground">Aperçu du modèles Classic</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Models showcase */}
      <section id="models" className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-16">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Modèles</h2>
          <p className="text-sm text-muted-foreground">Aperçu rapide des thèmes disponibles.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-4xl border bg-card p-2 shadow-sm">
            <div className="w-full">
              <div className="w-full">
                <InvitationModelRenderer
                  model="classic"
                  hostManName="Jacques"
                  hostWomanName="Christine"
                  description="Rejoignez-nous pour une célébration chaleureuse."
                  location="Le Jardin des Arts, Marseille"
                  startsAt={new Date('2025-06-21T16:00:00')}
                />
              </div>
            </div>
            <div className="mt-3 text-xs text-center text-muted-foreground">Classic</div>
          </div>
          <div className="rounded-4xl border bg-card p-2 shadow-sm">
            <div className="w-full">
              <InvitationModelRenderer
                model="minimalist"
                hostManName="Teddy"
                hostWomanName="Gloria"
                description="Rejoignez-nous pour une célébration chaleureuse."
                location="0001, Blvd de la République, Kinshasa"
                startsAt={new Date('2025-06-21T16:00:00')}
              />
            </div>
            <div className="mt-3 text-xs text-center text-muted-foreground">Minimalist</div>
          </div>

          <div className="rounded-3xl border bg-card p-2 shadow-sm">
            <div className="w-full">
              <InvitationModelRenderer
                model="elegant"
                hostManName="Mr"
                hostWomanName="Madame Rubuz"
                description="Rejoignez-nous pour une célébration chaleureuse."
                location="321, Main street, Lusaka"
                startsAt={new Date('2025-06-21T16:00:00')}
              />
            </div>
            <div className="mt-3 text-xs text-center text-muted-foreground">Elegant</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-semibold">Modèles soignés</h3>
            <p className="mt-1 text-sm text-muted-foreground">Choisis parmi des thèmes élégants et personnalisables adaptés à ton événement.</p>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-semibold">Partage instantané</h3>
            <p className="mt-1 text-sm text-muted-foreground">Un lien unique à envoyer par message, email ou via QR code.</p>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-semibold">RSVP en temps réel</h3>
            <p className="mt-1 text-sm text-muted-foreground">Suis les réponses facilement et gère tes invités sans tableur.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="rounded-2xl border bg-gradient-to-br from-amber-100/60 via-white to-rose-100/60 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 p-6 sm:p-10 text-center">
          <h2 className="text-xl sm:text-3xl font-semibold tracking-tight">Prêt à créer ton invitation ?</h2>
          <p className="mt-2 text-sm text-muted-foreground">Commence dès maintenant — c’est rapide et gratuit.</p>
          <div className="mt-5 flex justify-center">
            <Link href="/inv/create" className="inline-flex items-center rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background hover:opacity-90">
              Créer mon invitation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
