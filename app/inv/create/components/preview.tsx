"use client"
import * as React from "react"
import { useInvitationDraft } from "./invitation-context"
import type { InvitationModelKey } from '@/lib/types/invitation'
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"

// Invitation model renderer
import InvitationModelRenderer from "@/app/inv/Models/renderer"

interface InvitationPreviewProps { variant?: "inline" | "dialog" }

function composeStartsAt(date: Date | null, time: string): Date {
  const base = date ? new Date(date) : new Date()
  const [h, m] = (time || "00:00").split(":").map((n) => Number(n))
  const hours = Number.isFinite(h) ? h : 0
  const minutes = Number.isFinite(m) ? m : 0
  return new Date(base.getFullYear(), base.getMonth(), base.getDate(), hours, minutes, 0, 0)
}

export default function InvitationPreview({ variant = "inline" }: InvitationPreviewProps) {
  const { draft, update } = useInvitationDraft()
  const startsAt = React.useMemo(() => composeStartsAt(draft.date, draft.startTime), [draft.date, draft.startTime])

  const themes: { id: InvitationModelKey; label: string; icon: string }[] = [
    { id: 'classic', label: 'Classique', icon: 'solar:clapperboard-edit-bold' },
    { id: 'elegant', label: 'Élégant', icon: 'solar:crown-minimalistic-bold' },
    { id: 'minimalist', label: 'Minimal', icon: 'solar:leaf-bold' },
  ]

  return (
    <div className="relative group/preview h-full flex flex-col">
      {/* Live Indicator Overlay */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live Preview
        </div>
      </div>

      {/* Theme Switcher Header */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-white/20 p-1.5 rounded-2xl shadow-2xl flex items-center gap-1">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => update('theme', theme.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                draft.theme === theme.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              <Icon icon={theme.icon} className="text-sm" />
              <span className="hidden sm:inline">{theme.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-[500px] h-full overflow-hidden">
        <InvitationModelRenderer
          model={draft.theme}
          title={undefined}
          hostManName={draft.hostManName || "Alexandre"}
          hostWomanName={draft.hostWomanName || "Sophie"}
          description={draft.description || "Votre message s'affichera ici..."}
          location={draft.location || "Lieu de l'événement"}
          coordinate={undefined}
          startsAt={startsAt}
        />
      </div>

      {/* Hint Footer */}
      <div className="mt-4 px-4 text-center pb-4">
        <p className="text-[10px] text-muted-foreground font-medium flex items-center justify-center gap-1.5 uppercase tracking-tighter italic">
          <Icon icon="solar:info-circle-bold" className="text-primary text-sm" />
          L&apos;aperçu s&apos;adapte automatiquement à vos saisies
        </p>
      </div>
    </div>
  )
}