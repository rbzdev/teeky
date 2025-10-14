import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function OGImage() {
  // For now, just render the logo centered on a subtle gradient background
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
        <img src={`${process.env.NEXT_PUBLIC_APP_BASE_URL || ''}/logo.png`} alt="Teeky" style={{ height: 180, width: 180, borderRadius: 24 }} />
      </div>
    ),
    size,
  )
}
