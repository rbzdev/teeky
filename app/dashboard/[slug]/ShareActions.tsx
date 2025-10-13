import { getAppBaseUrl } from '@/lib/url'
import ShareActionsClient from './ShareActionsClient'

export default async function ShareActions({ slug, title }: { slug: string; title?: string }) {
  const base = await getAppBaseUrl()
  const url = `${base}/inv/${slug}`
  return <ShareActionsClient url={url} title={title} />
}
