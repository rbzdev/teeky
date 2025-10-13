import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SESSION_COOKIE = 'session'
const key = process.env.SESSION_SECRET

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  try {
    if (!key) return false
    const token = req.cookies.get(SESSION_COOKIE)?.value
    if (!token) return false
    const encodedKey = new TextEncoder().encode(key)
    const { payload } = await jwtVerify(token, encodedKey, { algorithms: ['HS256'] })
    return typeof payload?.userId === 'string' && payload.userId.length > 0
  } catch {
    return false
  }
}

function startsWithAny(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export async function middleware(req: NextRequest) {

  // Extraire les informations de l'URL d'où provient le rejet 
  const { pathname, search } = req.nextUrl
  const authed = await isAuthenticated(req)

  // Pages accessibles seulement si NON authentifié (login/register)
  const publicOnly = ['/auth']
  if (startsWithAny(pathname, publicOnly) && authed) {
    const url = req.nextUrl.clone()
    url.pathname = '/dashboard'
    url.search = ''
    return NextResponse.redirect(url)
  }

  // Pages protégées: rediriger vers login si NON authentifié
  const protectedAreas = ['/dashboard', '/settings']
  if (startsWithAny(pathname, protectedAreas) && !authed) {
    const url = req.nextUrl.clone()
    url.pathname = '/auth/login'
    const nextParam = pathname + (search || '')
    url.search = `?next=${encodeURIComponent(nextParam)}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Exclure assets statiques, images Next et l'API de ce middleware
export const config = {
  matcher: [
    // tout sauf _next, assets et certains fichiers
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js)).*)',
  ],
}


// Comment ça marche

// Découverte auto: Next.js détecte middleware.ts à la racine et l’exécute sur chaque requête correspondant au matcher (aucun import manuel).
// Notre middleware vérifie le cookie session (JWT signé) et:
// redirige un utilisateur déjà connecté loin des pages /auth/* (login/register),
// redirige un utilisateur non connecté loin des zones protégées (/dashboard, /inv) vers /auth/login?next=....
// Les assets statiques, images Next, API, etc., sont exclus via config.matcher.
