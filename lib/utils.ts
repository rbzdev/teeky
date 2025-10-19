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



// FORMAT DATE && TIME

/**
 * Formate une date pour les invitations en français
 * @param dateString - La date au format ISO string ou null/undefined
 * @returns La date formatée en français ou "Date à confirmer"
 */
export function formatInvitationDate(dateString: string | null): string {
  if (!dateString) return 'Date à confirmer';

  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error);
    return 'Date à confirmer';
  }
}

/**
 * Formate une heure pour les invitations en français
 * @param dateString - La date au format ISO string ou null/undefined
 * @returns L'heure formatée en français ou "Heure à confirmer"
 */
export function formatInvitationTime(dateString: string | null): string {
  if (!dateString) return 'Heure à confirmer';

  try {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Erreur lors du formatage de l\'heure:', error);
    return 'Heure à confirmer';
  }
}


