"use client"
import * as React from 'react'
import type { InvitationModelKey, MinimalistInvitationProps } from '@/lib/types/invitation'
import Minimalist from './minimalist'
import Elegant from './elegant'
import Classic from './classic'

// Internal registry of known models; unknown keys will fallback to minimalist
const registry: Record<string, React.ComponentType<MinimalistInvitationProps>> = {
  minimalist: Minimalist,
  elegant: Elegant,
  classic: Classic,
}

export type InvitationModelRendererProps = MinimalistInvitationProps & {
  model?: InvitationModelKey
}

export default function InvitationModelRenderer({ model = 'minimalist', ...props }: InvitationModelRendererProps) {
  const Cmp = registry[model] ?? Minimalist

  return (
    <Cmp {...props} />
  )
}
