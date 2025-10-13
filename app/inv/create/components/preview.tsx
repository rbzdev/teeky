"use client"
import * as React from "react"
import { useInvitationDraft } from "./invitation-context"
import type { InvitationModelKey } from '@/lib/types/invitation'

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

  const variantClass = variant === "inline" ? "lg:sticky lg:top-8" : ""

  return (
    <div className={`relative ${variantClass}`}>
      {/* LIVE badge overlay */}
      <div className="absolute z-20 top-3 left-3">
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600/90 px-2 py-1 text-[10px] font-medium tracking-wide text-white shadow-sm ring-1 ring-inset ring-emerald-500/60 backdrop-blur">
          <span className="inline-block size-1.5 rounded-full bg-white animate-pulse" /> LIVE PREVIEW
        </span>
      </div>

      {/* Model switcher (free text with suggestions) */}
      {/* <div className="absolute z-20 top-3 right-3">
        <input
          list="known-models"
          className="rounded-md border bg-background/80 px-2 py-1 text-xs shadow-sm"
          value={draft.theme}
          onChange={(e) => update('theme', e.target.value as InvitationModelKey)}
          placeholder="theme"
        />
        <datalist id="known-models">
          <option value="minimalist" />
          <option value="elegant" />
        </datalist>
      </div> */}

      {/* Model switcher */}
      <div className="absolute z-20 top-3 right-3">
        <select
          className="rounded-md border bg-background/80 px-2 py-1 text-xs shadow-sm"
          value={draft.theme}
          onChange={(e) => update('theme', e.target.value as InvitationModelKey)}
        >
          <option value="minimalist">Minimalist</option>
          <option value="elegant">Elegant</option>
          <option value="classic">Classic</option>
        </select>
      </div>

      <InvitationModelRenderer
        model={draft.theme}
        title={undefined}
        hostManName={draft.hostManName || undefined}
        hostWomanName={draft.hostWomanName || undefined}
        description={draft.description || undefined}
        location={draft.location || undefined}
        coordinate={undefined}
        startsAt={startsAt}
      />
    </div>
  )
}