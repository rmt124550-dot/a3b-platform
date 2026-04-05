import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://a3bhub.cloud'
  const app  = 'https://app.a3bhub.cloud'
  const now  = new Date()

  return [
    { url: base,                                                         lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: app + '/pricing',                                             lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: app + '/affiliates',                                          lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: app + '/launch',                                              lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: app + '/blog',                                                lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: app + '/blog/coursera-en-espanol',                            lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: app + '/blog/a3b-vs-subtitulos-coursera',               lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: app + '/blog/data-science-en-espanol',                    lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: app + '/blog/coursera-gratis-certificado',                lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: app + '/blog/mejores-extensiones-aprender-ingles',            lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: app + '/help',                                                lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: app + '/help/getting-started',                                lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: app + '/help/platforms',                                      lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: app + '/help/voice',                                          lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: app + '/help/billing',                                        lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: app + '/help/troubleshooting',                                lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: app + '/help/mobile',                                         lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: app + '/register',                                            lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: app + '/login',                                               lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: app + '/privacy',                                             lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: app + '/terms',                                               lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]
}
