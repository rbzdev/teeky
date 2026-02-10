"use client"

import React from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { useInvitationDraft } from "../invitation-context"
import type { EventType } from "@/lib/types/invitation"

const eventTypes = [
    { id: 'MARRIAGE', label: 'Mariage', icon: 'solar:heart-bold' },
    { id: 'DOT', label: 'Billetterie', icon: 'solar:ticket-sale-bold' },
    { id: 'ANNIVERSARY', label: 'Anniversaire', icon: 'fluent-mdl2:birthday-cake' },
    { id: 'CONFERENCE', label: 'Conférence', icon: 'solar:videocamera-record-bold' },
    { id: 'MEETING', label: 'Réunion', icon: 'solar:users-group-two-rounded-bold' },
    { id: 'OTHER', label: 'Autre', icon: 'solar:menu-dots-bold' },
]

export default function StepType() {
    const { draft, update } = useInvitationDraft()

    return (
        <div className="space-y-6">
            <h3 className="text-sm lg:text-xl font-semibold ">Quel type d&apos;événement organisez-vous ?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {eventTypes.map((type) => (
                    <button
                        key={type.id}
                        type="button"
                        onClick={() => update('type', type.id as EventType)}
                        className={cn(
                            "flex flex-col items-center justify-center p-6 gap-3 rounded-3xl border-2 transition-all duration-300 cursor-pointer",
                            draft.type === type.id
                                ? "border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10 scale-105"
                                : "border-muted bg-background text-muted-foreground hover:border-primary/50 hover:bg-primary/5"
                        )}
                    >
                        <Icon icon={type.icon} className="text-3xl" />
                        <span className="font-bold text-sm">{type.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}
