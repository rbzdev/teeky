import LoginForm from './components/loginForm'
import Link from 'next/link'

export default function LoginPage() {
	return (
		<div className="min-h-screen flex  items-center justify-center px-4 py-10">
			<div className="w-full max-w-md space-y-6 flex flex-col items-center justify-center">
				<div className="space-y-1 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
					<p className="text-sm text-muted-foreground">Accédez à votre espace</p>
				</div>
				<LoginForm />
				<p className="text-center text-xs text-muted-foreground">Pas de compte ?{' '}
					<Link href="/auth/register" className="underline hover:text-foreground">Inscrivez-vous</Link>
				</p>
			</div>
		</div>
	)
}
