import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Random slug generator: 3 to 6 chars, digits, letters, hyphen
const SLUG_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-'

/**
 * Generates a random slug of length between 3 and 6 (inclusive),
 * using digits, letters (a-zA-Z) and hyphen '-'.
 */
export function randomSlug(): string {
  const len = 3 + Math.floor(Math.random() * 4) // 3..6
  let out = ''
  const bytes = new Uint8Array(len)
  // crypto is available in Node 18+ and in modern browsers
  globalThis.crypto.getRandomValues(bytes)
  for (let i = 0; i < len; i++) {
    const idx = bytes[i] % SLUG_CHARS.length
    out += SLUG_CHARS[idx]
  }
  return out
}

