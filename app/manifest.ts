import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Words Have Weather", short_name: "Word Weather", description: "Illustrated communication stories and learning resources for Australian parents and educators.", start_url: "/", display: "standalone", background_color: "#f6efe3", theme_color: "#41584d", lang: "en-AU", icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" }] };
}
