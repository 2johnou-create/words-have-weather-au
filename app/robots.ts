import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const origin = "https://words-have-weather-au.misty-jelly-1931.chatgpt.site";
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/downloads/"] }], sitemap: `${origin}/sitemap.xml`, host: origin };
}
