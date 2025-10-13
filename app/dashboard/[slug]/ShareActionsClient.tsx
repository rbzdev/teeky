"use client"

import * as React from 'react'

// Components
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

export default function ShareActionsClient({ url, title }: { url: string; title?: string }) {
    const [copied, setCopied] = React.useState(false)

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
            toast.success('Lien copié dans le presse-papiers !')
        } catch (e) {
            console.error('Copy failed', e)
        }
    }

    async function handleShare() {
        try {
            if (navigator.share) {
                await navigator.share({ title: title || 'Invitation', url })
            } else {
                await handleCopy()
            }
        } catch (e) {
            // user cancelled or share unsupported
            console.debug('Share cancelled/unsupported', e)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center rounded-md border px-3 py-1.5 text-xs hover:bg-accent"
            >
                {copied ?
                 <div className="flex items-center gap-1">
                        <span>Lien copié !</span>
                        <Icon icon="tabler:copy-check-filled" className="size-5 rotate-12 " />
                 </div>
                 :
                    <div className="flex items-center gap-1">
                        <span>Copier le lien</span>
                        <Icon icon="solar:copy-line-duotone" className="size-4 rotate-12" />
                    </div>
                }
            </Button>
            <Button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1"
            >

                <span>Partager l&apos;invitation</span>
                <Icon icon="solar:square-share-line-linear" className="size-4" />
            </Button>
        </div>
    )
}
