"use client"


import * as React from 'react'
import { QrcodeCanvas } from 'react-qrcode-pretty'

export default function QrCanvas({ value, size = 160 }: { value: string; size?: number }) {
  return (
    <div className="items-center justify-center rounded-sm border bg-white shadow-sm dark:bg-card">
      <QrcodeCanvas
        value={value}
        size={size}
        variant={{ eyes: 'gravity', body: 'fluid' }}
        color={{ eyes: '#223344', body: '#000' }}
        padding={2}
        margin={5}
        bgColor="#fff"
        bgRounded
        divider
      />
    </div>
  )
}
