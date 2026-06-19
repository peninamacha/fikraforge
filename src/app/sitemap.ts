import { MetadataRoute } from 'next';
import { getNews } from '../lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://fikraforge.com';

  // 1. Static Routes (Home and Anchor Sections)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#studio`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }
  ];

  // 2. Dynamic Routes fetched from the Database (SSR-safe mock)
  try {
    const newsArticles = getNews();
    const dynamicNewsRoutes: MetadataRoute.Sitemap = newsArticles.map((article) => {
      // Parse or fallback date
      let parsedDate = new Date();
      if (article.date) {
        const d = new Date(article.date);
        if (!isNaN(d.getTime())) {
          parsedDate = d;
        }
      }
      
      return {
        url: `${baseUrl}/news/${article.id}`,
        lastModified: parsedDate,
        changeFrequency: 'weekly',
        priority: 0.6,
      };
    });

    return [...staticRoutes, ...dynamicNewsRoutes];
  } catch (error) {
    console.error("Error generating dynamic sitemap routes:", error);
    return staticRoutes;
  }
}
