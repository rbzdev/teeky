"use client"
import React from "react"
import type { InvitationDraft, InvitationContextValue } from '@/lib/types/invitation'

const defaultDraft: InvitationDraft = {
  hostManName: "",
  hostWomanName: "",
  description: "Nous avons le plaisir de vous inviter à célébrer notre union dans une ambiance chaleureuse et élégante.",
  location: "",
  coordinate: "",
  locationLat: null,
  locationLng: null,
  date: new Date(),
  startTime: "00:00",
  hasEnd: true,
  endTime: "00:00",
  theme: 'minimalist',
}

const InvitationContext = React.createContext<InvitationContextValue | undefined>(undefined)

export function InvitationDraftProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = React.useState<InvitationDraft>(defaultDraft)

  function update<K extends keyof InvitationDraft>(key: K, value: InvitationDraft[K]) {
    setDraft(prev => ({ ...prev, [key]: value }))
  }
  function reset() { setDraft(defaultDraft) }

  return (
    <InvitationContext.Provider value={{ draft, update, reset }}>
      {children}
    </InvitationContext.Provider>
  )
}

export function useInvitationDraft() {
  const ctx = React.useContext(InvitationContext)
  if (!ctx) throw new Error("useInvitationDraft must be used within InvitationDraftProvider")
  return ctx
}
