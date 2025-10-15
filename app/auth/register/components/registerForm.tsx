"use client"
import React from 'react'
import { registerAction } from '../actions'

// Components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'

export function RegisterForm() {
  const [submitting, setSubmitting] = React.useState(false)

  // Handle form submit
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = {
      firstName: String(fd.get('firstName') || '').trim(),
      lastName: String(fd.get('lastName') || '').trim(),
      email: String(fd.get('email') || '').trim(),
      password: String(fd.get('password') || ''),
    }
    setSubmitting(true)
    try {
      const res = await registerAction(payload)
      if (res.success && res.user) {
        toast.success('Compte créé', { description: res.user.email })
        form.reset()
      } else {
        toast.error('Échec inscription', { description: res.error })
      }
    } catch {
      toast.error('Erreur inattendue')
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="firstName" className="text-sm font-medium">Prénom</Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder='John'
            required
            autoComplete="given-name"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="lastName" className="text-sm font-medium">Nom</Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder='Doe'
            required
            autoComplete="family-name"
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder='vous@exemple.com'
          required autoComplete="email"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
        <Input 
        id="password" 
        name="password" 
        type="password"
        placeholder='● ● ● ● ● ● ● ● '
        required 
        autoComplete="new-password"
         />
      </div>
      <Button type="submit" disabled={submitting} className="w-full">{submitting ? <div className="flex items-center gap-1"><Spinner /> <span>Création...</span></div> : 'Créer le compte'}</Button>
    </form>
  )
}

export default RegisterForm
