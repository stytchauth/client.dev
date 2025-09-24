import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://client.dev";

  return [
    {
      url: baseUrl,
      lastModified: "2025-10-20",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/clients`,
      lastModified: "2025-10-20",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/servers`,
      lastModified: "2025-10-20",
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
