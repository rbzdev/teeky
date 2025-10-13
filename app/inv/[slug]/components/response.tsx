
import { rsvpInvitation, confirmInvitation } from "../actions"
import { Button } from "@/components/ui/button"
import AcceptDialogClient from "./AcceptDialogClient"

type ResponseProps = { slug: string }

export default function Response({ slug }: ResponseProps) {
    async function declineAction() {
        'use server'
        await rsvpInvitation(slug, 'DECLINED')
    }

    async function acceptWithDetails(formData: FormData) {
        'use server'
        const fullName = (formData.get('fullName') as string | null)?.trim() || ''
        const phone = (formData.get('phone') as string | null)?.trim() || ''
            return await confirmInvitation(slug, { fullName, phone })
    }

    return (
        <section className="flex items-center gap-3">
            <form action={declineAction}>
                <Button
                    type="submit"
                    variant={"destructive"}
                    className="flex-1"
                >
                    Decliner
                </Button>
            </form>

            <AcceptDialogClient onSubmit={acceptWithDetails} />
        </section>
    )
}
