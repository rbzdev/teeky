
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"


// Components
import CreateInvitationForm from "./components/form"
import InvitationPreview from "./components/preview"
import { InvitationDraftProvider } from "./components/invitation-context"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/dialog"
import FooterMin from "@/components/footer.min"

export default function CreateInvitationPage() {
    return (
        <InvitationDraftProvider>
            <div className="mx-auto max-w-5xl py-10 px-4 space-y-10">
                <header className="space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight">Créer une invitation</h1>
                    <p className="text-sm text-muted-foreground">
                        Renseigne les informations de ton événement. Les champs marqués * sont obligatoires.
                    </p>
                </header>
                <div className="grid gap-10 sm:grid-cols-[2fr_auto_3fr] items-start">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between md:justify-start gap-4">
                            <h2 className="text-sm font-medium text-muted-foreground md:sr-only">Formulaire</h2>
                            {/* Dialog trigger only on small screens */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="sm:hidden gap-2">
                                        <Eye className="size-4" /> Prévisualiser
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md p-0 overflow-hidden" showCloseButton>
                                    <DialogTitle className="sr-only">Prévisualisation</DialogTitle>
                                    <DialogDescription className="sr-only">Aperçu actuel de l&apos;invitation</DialogDescription>
                                    
                                    <InvitationPreview variant="dialog" />
                                </DialogContent>
                            </Dialog>
                        </div>
                        {/* Form */}
                        <CreateInvitationForm />
                    </div>

                    {/* Vertical separator on large screens */}
                    <Separator orientation="vertical" className="hidden sm:block h-full w-px mx-auto" />

                    {/* Inline preview only large screens */}
                    <div className="hidden sm:block">
                        <InvitationPreview variant="inline" />
                    </div>
                </div>
            </div>
            <FooterMin />
        </InvitationDraftProvider>
    )
}