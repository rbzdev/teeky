import 'server-only'
import { headers } from 'next/headers'

function trimTrailingSlash(u: string) {
  return u.replace(/\/$/, '')
}

/**
 * Returns the application base URL (protocol + host), e.g. https://teeky.app
 * Priority:
 * 1) APP_BASE_URL or NEXT_PUBLIC_APP_BASE_URL (environment)
 * 2) Forwarded headers (x-forwarded-proto/host) for proxies
 * 3) Host header with a sane default protocol (https in prod, http in dev)
 */
export async function getAppBaseUrl(): Promise<string> {
  const envBase = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_BASE_URL
  if (envBase) return trimTrailingSlash(envBase)

  const h = await headers()
  const forwardedProto = h.get('x-forwarded-proto')
  const forwardedHost = h.get('x-forwarded-host')
  const host = forwardedHost || h.get('host') || 'localhost:3000'
  const proto = forwardedProto || (process.env.NODE_ENV === 'development' ? 'http' : 'https')
  return `${proto}://${host}`
}

/** Extracts the origin (protocol + host) from a full URL string. */
export function originFromUrl(url: string): string | null {
  try {
    const u = new URL(url)
    return u.origin
  } catch {
    return null
  }
}
