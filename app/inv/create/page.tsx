"use client"

import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"

// Components
import CreateInvitationForm from "./components/form"
import InvitationPreview from "./components/preview"
import { InvitationDraftProvider } from "./components/invitation-context"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/dialog"
import FooterMin from "@/components/footer.min"

export default function CreateInvitationPage() {
    return (
        <InvitationDraftProvider>
            <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950">
                <div className="mx-auto max-w-6xl pt-12 pb-20 px-4 sm:px-6 lg:px-8">
                    {/* Progress Header */}
                    <header className="mb-12 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Célébrons ensemble</h1>
                            <p className="text-muted-foreground text-lg font-medium max-w-lg">
                                Donnez vie à votre événement en quelques instants. Chaque détail compte pour créer l&apos;invitation parfaite.
                            </p>
                        </div>

                        <div className="flex items-center justify-center sm:justify-start gap-4">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="lg" className="sm:hidden w-full gap-2 rounded-xl shadow-sm">
                                        <Icon icon="solar:eye-bold" className="size-5" />
                                        Aperçu en direct
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl" showCloseButton>
                                    <DialogTitle className="sr-only">Prévisualisation</DialogTitle>
                                    <DialogDescription className="sr-only">Aperçu actuel de l&apos;invitation</DialogDescription>
                                    <InvitationPreview variant="dialog" />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </header>

                    <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-start">
                        <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-border/50 shadow-xl shadow-black/5 p-6 sm:p-10 transition-all">
                            {/* Form Section */}
                            <CreateInvitationForm />
                        </div>

                        {/* Sticky Desktop Preview */}
                        <div className="hidden lg:block sticky top-24">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Prévisualisation</h3>
                                    <div className="flex items-center gap-2 text-primary font-bold text-xs">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                        </span>
                                        Mise à jour en temps réel
                                    </div>
                                </div>
                                <div className="rounded-[2.8rem] overflow-hidden border border-border/50 shadow-2xl">
                                    <InvitationPreview variant="inline" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <FooterMin />
            </div>
        </InvitationDraftProvider>
    )
}