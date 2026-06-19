import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://fikraforge.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'], // Disallow crawling administrative or API endpoints
      },
      {
        userAgent: ['GPTBot', 'Google-Extended', 'Anthropic-Ai', 'ClaudeBot', 'Applebot-Extended'],
        allow: '/', // Allow modern search and AI models to crawl the public index
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
