import RegisterForm from './components/registerForm'
import Link from 'next/link'

export default function RegisterPage() {
	return (
		<div className="min-h-screen flex items-center justify-center px-4 py-10 0 ">
			<div className="w-full max-w-md space-y-6 flex flex-col justify-center">
				<div className="space-y-1 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">Inscription</h1>
					<p className="text-sm text-muted-foreground">Créez votre compte</p>
				</div>
				<RegisterForm />
				<p className="text-start text-xs text-muted-foreground">Déjà un compte ?{' '}
					<Link href="/auth/login" className="underline hover:text-foreground">Connectez-vous</Link>
				</p>
			</div>
		</div>
	)
}
