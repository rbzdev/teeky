"use client"

import * as React from "react"
import { toast } from "sonner"

// Components
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogFooter } from "@/components/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icon } from "@iconify/react/dist/iconify.js"

type AcceptDialogClientProps = {
    onSubmit: (formData: FormData) => Promise<{ ok: boolean; guestSlug?: string; invitationSlug?: string }>
}

/**
 * Télécharge automatiquement l'image personnalisée pour le guest
 */
async function downloadGuestImage(guestSlug: string, guestName: string) {
    try {
        const response = await fetch(`/api/generate-my-inv?guestSlug=${guestSlug}`);

        if (!response.ok) {
            throw new Error("Failed to generate image");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `invitation-${guestName.replace(/\s+/g, '-').toLowerCase()}.png`;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Votre invitation a été téléchargée !");
    } catch (error) {
        console.error("Error downloading image:", error);
        toast.error("Impossible de télécharger l'image. Vous pouvez réessayer plus tard.");
    }
}

export default function AcceptDialogClient({ onSubmit }: AcceptDialogClientProps) {
    const [open, setOpen] = React.useState(false)
    const [submitting, setSubmitting] = React.useState(false)
    const [title, setTitle] = React.useState<string>("Monsieur")
    const [downloading, setDownloading] = React.useState(false)

    // Fonction pour obtenir l'icône selon le titre
    const getTitleIcon = (titleValue: string) => {
        switch (titleValue) {
            case "Monsieur":
                return <Icon icon="hugeicons:suit-02" width="24" height="24" />;
            case "Madame":
                return <Icon icon="hugeicons:dress-04" width="24" height="24" />;
            case "Couple":
                return <Icon icon="icon-park-outline:peoples" width="24" height="24" />;
            default:
                return null;
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        type="button"
                        className="flex-1 sm:flex-none "
                    >
                        Accepter
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md dark:bg-background">
                    <DialogTitle>Confirmer votre présence</DialogTitle>
                    <DialogDescription>
                        Veuillez renseigner vos coordonnées pour confirmer votre présence.
                    </DialogDescription>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault()
                            setSubmitting(true)

                            try {
                                // Vérifier que le titre est sélectionné
                                if (!title) {
                                    toast.error("Veuillez sélectionner un titre (Madame, Monsieur ou Couple)");
                                    setSubmitting(false)
                                    return;
                                }

                                const formData = new FormData(e.currentTarget);

                                // Combiner le titre avec le nom complet
                                const fullNameValue = (formData.get('fullName') as string | null)?.trim() || '';
                                const combinedName = `${title} ${fullNameValue}`.trim();

                                // Créer un nouveau FormData avec le nom complet combiné
                                const updatedFormData = new FormData();
                                updatedFormData.set('fullName', combinedName);
                                updatedFormData.set('phone', formData.get('phone') as string);

                                const result = await onSubmit(updatedFormData)
                                toast.info("Merci de votre présence");
                                setOpen(false)

                                // Télécharger automatiquement l'image personnalisée
                                if (result.ok && result.guestSlug) {
                                    setDownloading(true)
                                    await downloadGuestImage(result.guestSlug, combinedName);

                                    // Cacher le loader de téléchargement
                                    setDownloading(false)
                                }
                            } catch (e) {
                                console.error('[capture] error during confirmation flow:', e)
                                const msg = e instanceof Error ? e.message : "Une erreur s'est produite. Veuillez réessayer."
                                toast.error(msg)
                            } finally {
                                setSubmitting(false)
                            }
                        }}
                        className="grid gap-3 "
                    >
                        <div className="grid gap-1.5">
                            <Label htmlFor="title">Titre *</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-2"
                                        type="button"
                                    >
                                        {getTitleIcon(title)}
                                        <span>{title || "Sélectionner un titre"}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-full">
                                    <DropdownMenuLabel>Choisir un titre</DropdownMenuLabel>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuCheckboxItem
                                        checked={title === "Monsieur"}
                                        onCheckedChange={(checked) => checked && setTitle("Monsieur")}
                                        className="gap-2"
                                    >
                                        <Icon icon="hugeicons:suit-02" width="24" height="24" />
                                        <span>Monsieur</span>
                                    </DropdownMenuCheckboxItem>

                                    <DropdownMenuCheckboxItem
                                        checked={title === "Madame"}
                                        onCheckedChange={(checked) => checked && setTitle("Madame")}
                                        className="gap-2"
                                    >
                                        <Icon icon="hugeicons:dress-04" width="24" height="24" />
                                        <span>Madame</span>
                                    </DropdownMenuCheckboxItem>

                                    <DropdownMenuCheckboxItem
                                        checked={title === "Couple"}
                                        onCheckedChange={(checked) => checked && setTitle("Couple")}
                                        className="gap-2"
                                    >
                                        <Icon icon="icon-park-outline:peoples" width="24" height="24" />
                                        <span>Couple</span>
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="fullName">Nom complet</Label>
                            <Input id="fullName" name="fullName" placeholder="Jean Dupont" required />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="phone">Numéro de téléphone</Label>
                            <Input id="phone" name="phone" placeholder="+243 07 00 00 00" required />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={submitting}>
                                Annuler
                            </Button>
                            <Button type="submit" className="" disabled={submitting}>
                                {submitting ?
                                    // Loader de confirmation
                                    <div className="flex items-center gap-1">
                                        <Spinner />
                                        <span>Confirmation...</span>
                                    </div>
                                    :
                                    'Confirmer'
                                }

                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {downloading &&
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-[2px] ">
                    <div className="bg-white dark:bg-neutral-800 p-6 gap-4 rounded-lg shadow-lg flex flex-col items-center">

                        <Icon icon="line-md:cloud-alt-download-twotone-loop" className="text-7xl text-primary" />

                        <div className="flex items-center gap-1">
                            <Spinner />
                            <span> Obtention de l&apos;invitation...</span>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}
