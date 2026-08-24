import { applyOverrides, episodes } from "@/data/episodes";
import { loadEpisodeOverrides } from "@/db/episode-state";
import { EpisodeLibrary } from "../components/EpisodeLibrary";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const dynamic = "force-dynamic";

export default async function EpisodesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const effectiveEpisodes = applyOverrides(episodes, await loadEpisodeOverrides());
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main>
      <a className="skip-link" href="#episode-library">Skip to episode library</a>
      <SiteHeader />
      <section className="page-hero library-hero">
        <p className="eyebrow">Complete story and practice library</p>
        <h1>All 120 episodes.<em>One journey with growing depth.</em></h1>
        <p>Browse every planned story, preview the adult move, see its release date and download consistent parent and educator resources when available.</p>
        <div className="category-counts"><span>40 Sprout</span><span>40 All Ages</span><span>40 Trail</span><span>15 releases each month</span></div>
      </section>
      <section className="section library-section" id="episode-library">
        <EpisodeLibrary episodes={effectiveEpisodes} initialCategory={params.category ?? "All"} today={today} />
      </section>
      <SiteFooter />
    </main>
  );
}
