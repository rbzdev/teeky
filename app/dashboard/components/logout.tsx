"use client"
import * as React from 'react'

export default function LogoutButton() {
//   async function onLogout() {
//     const action = async () => {
//       'use server'
//       const { logoutAction } = await import('../../auth/logout/actions')
//       await logoutAction()
//     }
//     // Submit a form to invoke server action for compatibility
//     const form = document.createElement('form')
//     // @ts-expect-error action is a server function in Next 15
//     form.action = action
//     document.body.appendChild(form)
//     form.requestSubmit()
//     form.remove()
//   }

const handleLogout = async () => {
    const { logoutAction } = await import('../../auth/logout/actions')
    await logoutAction()
  }

  return (
    <button type="button" onClick={handleLogout} className="inline-flex items-center rounded-md border px-3 py-1 text-sm hover:bg-accent">
      Se déconnecter
    </button>
  )}
