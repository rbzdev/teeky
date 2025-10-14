import type { MetadataRoute } from 'next'

// Static sitemap for now; extend to include dynamic invitations later.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_BASE_URL || process.env.APP_BASE_URL || 'https://teeky.vercel.app'
  const now = new Date().toISOString()

  const routes: Array<MetadataRoute.Sitemap[0]> = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/inv/create`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/auth/login`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/auth/register`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  return routes
}
