import React from 'react'

export const metadata = {
  title: 'Dashboard - Teeky',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {children}
    </div>
  )
}
