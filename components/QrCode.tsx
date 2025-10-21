import { getAppBaseUrl } from '@/lib/url'
import QrCanvas from '@/components/QrCanvas'

export default async function InvitationQrCode({ slug, size = 160 }: { slug: string; size?: number }) {
  const base = await getAppBaseUrl()
  const value = `${base}/inv/${slug}`
  return <QrCanvas value={value} size={size} />
}
