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

// Fixed canvas widths per model (in px). Adjust as needed per design.
const modelWidths: Record<string, number> = {
  minimalist: 1200, // 1200px wide canvas
  elegant: 700, // Instagram-friendly width
  classic: 800, // Slightly narrower classic layout
}

export type InvitationModelRendererProps = MinimalistInvitationProps & {
  model?: InvitationModelKey
}

export default function InvitationModelRenderer({ model = 'minimalist', ...props }: InvitationModelRendererProps) {
  const Cmp = registry[model] ?? Minimalist
  const width = modelWidths[model] ?? modelWidths.minimalist

  return (
    // Outer container takes full viewport width and allows horizontal scroll if content overflows
    <div className="w-full overflow-x-auto overflow-y-visible p-2">
      {/* Fixed-width stage to render the invitation. Inline style ensures runtime width. */}
      <div
        className="inline-block max-w-none"
        style={{ width }}
        role="region"
        aria-label="Invitation preview"
      >
        <Cmp {...props} />
      </div>
    </div>
  )
}
