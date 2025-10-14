import { ImageResponse } from 'next/og'
import * as fs from 'node:fs/promises'
import path from 'node:path'

export const runtime = 'nodejs'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function OGImage() {
  // For now, just render the logo centered on a subtle gradient background
  // Load local logo (public/logo.png) at build time and embed as data URL to avoid external fetches
  async function loadLogoDataUrl(): Promise<string | null> {
    try {
      const file = path.join(process.cwd(), 'public', 'logo.png')
      const buf = await fs.readFile(file)
      const base64 = buf.toString('base64')
      return `data:image/png;base64,${base64}`
    } catch {
      return null
    }
  }
  const logoDataUrl = await loadLogoDataUrl()
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fff6e5 0%, #ffffff 40%, #ffe4e6 100%)',
          fontSize: 64,
          color: '#111',
        }}
      >
        {logoDataUrl ? (
          <img src={logoDataUrl} alt="Teeky" width={180} height={180} style={{ borderRadius: 24 }} />
        ) : (
          <div
            style={{
              height: 180,
              width: 180,
              borderRadius: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#111',
              color: '#fff',
              fontWeight: 700,
            }}
          >
            Teeky
          </div>
        )}
      </div>
    ),
    size,
  )
}
