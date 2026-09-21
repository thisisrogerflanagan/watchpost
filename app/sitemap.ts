import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://watchpost.hq';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const popularTickers = ['crwd', 'lii', 'kr', 'aapl', 'msft', 'googl', 'amzn', 'tsla', 'nvda', 'meta'];
  const companyRoutes: MetadataRoute.Sitemap = popularTickers.map((ticker) => ({
    url: `${baseUrl}/sec/company/${ticker}`,
    lastModified: new Date(),
    changeFrequency: 'hourly',
    priority: 0.8,
  }));

  const sampleBreaches = ['0001535527-26-000042', '0001069202-26-000091'];
  const breachRoutes: MetadataRoute.Sitemap = sampleBreaches.map((id) => ({
    url: `${baseUrl}/sec/breaches/2026/${id}`,
    lastModified: new Date(),
    changeFrequency: 'never',
    priority: 0.9,
  }));

  return [...staticRoutes, ...companyRoutes, ...breachRoutes];
}
