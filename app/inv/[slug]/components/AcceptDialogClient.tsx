"use client"

import * as React from "react"
import { toast } from "sonner"

// Components
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogFooter } from "@/components/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

type AcceptDialogClientProps = {
    onSubmit: (formData: FormData) => unknown | Promise<unknown>
}

export default function AcceptDialogClient({ onSubmit }: AcceptDialogClientProps) {
    const [open, setOpen] = React.useState(false)
    const [submitting, setSubmitting] = React.useState(false)

    return (
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
                    action={async (formData) => {
                        try {
                            setSubmitting(true)
                            await onSubmit(formData)
                            toast.success("Merci de votre présence");
                            setOpen(false)
                        } catch (e) {
                            console.error('[capture] error during confirmation flow:', e)
                            const msg = e instanceof Error ? e.message : "Une erreur s'est produite. Veuillez réessayer."
                            toast.error(msg)
                        } finally {
                            setSubmitting(false)
                        }
                    }}
                    className="grid gap-3"
                >
                    <div className="grid gap-1.5">
                        <Label htmlFor="fullName">Nom complet</Label>
                        <Input id="fullName" name="fullName" placeholder="Ex: Jean Dupont" required />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="phone">Numéro de téléphone</Label>
                        <Input id="phone" name="phone" placeholder="Ex: +225 07 00 00 00" required />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={submitting}>
                            Annuler
                        </Button>
                        <Button type="submit" className="" disabled={submitting}>
                            {submitting ?
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
    )
}
