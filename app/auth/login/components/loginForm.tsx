"use client"
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loginAction } from '../actions'

// Components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'


export function LoginForm() {
	const [submitting, setSubmitting] = React.useState(false)
	const router = useRouter()
	const search = useSearchParams()
	const next = search?.get('next') || '/dashboard'
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const form = e.currentTarget
		const fd = new FormData(form)
		const payload = {
			email: String(fd.get('email') || '').trim(),
			password: String(fd.get('password') || ''),
		}
		setSubmitting(true)
		try {
			const res = await loginAction(payload)
			if (res.success && res.user) {
				toast.success('Connexion réussie', { description: res.user.email })
				form.reset()
				// Redirige vers la page souhaitée; le middleware empêchera de revenir sur /auth
				router.replace(next)
			} else {
				toast.error('Échec connexion', { description: res.error })
			}

			// // DEBUG
			// console.log('loginAction response:', res)
		} catch {
			toast.error('Erreur inattendue')
		} finally {
			setSubmitting(false)
		}
	}
	return (
		<form onSubmit={handleSubmit} className="space-y-4  w-full">
			<div className="space-y-1">
				<Label htmlFor="email" className="text-sm font-medium">Email</Label>
				<Input
					id="email"
					name="email"
					type="email"
					placeholder="vous@exemple.com"
					required
					autoComplete="email"
					className=''
				/>
			</div>
			<div className="space-y-1">
				<Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
				<Input
					id="password"
					name="password"
					type="password"
					placeholder="••••••••"
					required
					autoComplete="current-password"
				/>
			</div>
			<Button type="submit" disabled={submitting} className="w-full">{submitting ? <div className="flex items-center gap-1"><Spinner /> <span>Connexion...</span></div> : 'Se connecter'}</Button>
		</form>
	)
}

export default LoginForm
