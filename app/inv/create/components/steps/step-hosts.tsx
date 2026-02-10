"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useInvitationDraft } from "../invitation-context"

export default function StepHosts() {
    const { draft, update } = useInvitationDraft()

    return (
        <div className="grid gap-6">
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                    {draft.type === 'MARRIAGE' ? "Qui sont les hôtes ?" : "Qui organise ?"}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="mr">
                            {draft.type === 'MARRIAGE' ? "Monsieur" : "Nom principal"}
                        </Label>
                        <Input
                            id="mr"
                            required
                            placeholder={draft.type === 'MARRIAGE' ? "Ex: Alexandre" : "Nom"}
                            value={draft.hostManName}
                            onChange={e => update('hostManName', e.target.value)}
                            className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mme">
                            {draft.type === 'MARRIAGE' ? "Madame" : "Co-organisateur (optionnel)"}
                        </Label>
                        <Input
                            id="mme"
                            required={draft.type === 'MARRIAGE'}
                            placeholder={draft.type === 'MARRIAGE' ? "Ex: Sophie" : "Nom"}
                            value={draft.hostWomanName}
                            onChange={e => update('hostWomanName', e.target.value)}
                            className="h-12 rounded-xl border-muted-foreground/20 focus:border-primary transition-all"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
