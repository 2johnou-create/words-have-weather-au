import type { MetadataRoute } from "next";
import { episodes } from "@/data/episodes";
import { ebooks } from "@/data/ebooks";

const origin = "https://words-have-weather-au.misty-jelly-1931.chatgpt.site";

export default function sitemap(): MetadataRoute.Sitemap {
  const main = [
    ["", 1, "weekly"], ["/episodes", 0.95, "weekly"], ["/ebooks", 0.95, "weekly"], ["/journey", 0.9, "monthly"],
    ["/parents", 0.85, "monthly"], ["/educators", 0.85, "monthly"], ["/join", 0.7, "monthly"], ["/terms", 0.35, "yearly"],
  ] as const;
  return [
    ...main.map(([path, priority, changeFrequency]) => ({ url: `${origin}${path}`, lastModified: new Date("2026-08-25"), changeFrequency, priority })),
    ...episodes.filter((episode) => episode.defaultStatus !== "removed").map((episode) => ({ url: `${origin}/episodes/${episode.code}`, lastModified: new Date(episode.releaseDate), changeFrequency: "monthly" as const, priority: 0.72 })),
    ...ebooks.map((book) => ({ url: `${origin}/ebooks/${book.slug}`, lastModified: new Date("2026-08-25"), changeFrequency: "monthly" as const, priority: 0.82 })),
  ];
}
