import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://a3bhub.cloud'
  const now  = new Date()

  return [
    { url: base,                      lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/pricing`,         lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/affiliates`,      lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/help`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/help/getting-started`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/help/platforms`,       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/help/voice`,           lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/help/billing`,         lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/help/troubleshooting`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/help/mobile`,          lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/privacy`,         lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/terms`,           lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]
}
