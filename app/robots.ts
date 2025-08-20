import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/chat', '/documents', '/login'],
      disallow: ['/api/', '/auth/callback'],
    },
    sitemap: 'https://legal-genie-five.vercel.app/sitemap.xml',
  }
}
