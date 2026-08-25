import type { Metadata } from "next";
import Image from "next/image";
import { applyOverrides, episodes } from "@/data/episodes";
import { getMember, loadEpisodeOverrides } from "@/db/episode-state";
import { getChatGPTUser } from "../chatgpt-auth";
import { isAdmin } from "../admin-access";
import { EpisodeLibrary } from "../components/EpisodeLibrary";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const characters = [
  { name: "Willo", slug: "willo", role: "The word-weather guide", note: "Notices one possible impact, offers a pause and helps reveal a clearer next sentence - never a mind reader or judge." },
  { name: "Mina", slug: "mina", role: "Sprout explorer", note: "Shows how everyday transitions, mistakes and big reactions can look from a younger child's point of view." },
  { name: "Leo", slug: "leo", role: "Quiet problem-solver", note: "Often knows more than he can show in the moment, inviting adults to widen the routes into participation." },
  { name: "Zahra", slug: "zahra", role: "Thoughtful trail-finder", note: "Brings curiosity, strong ideas and deeper questions about assumptions, friendship, fairness and repair." },
  { name: "Alex", slug: "alex", role: "Parent and carer", note: "Practises keeping real family boundaries while repairing rushed, global or threatening language." },
  { name: "Ms Chen", slug: "ms-chen", role: "Educator", note: "Models specific classroom language, private repair and learning access without lowering a necessary safety boundary." },
  { name: "Arthur", slug: "arthur", role: "The wise background presence", note: "At 89, Arthur rarely takes over. He appears when one grounded observation can give a difficult moment more room." },
];

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "120 illustrated episode previews", description: "Browse Sprout, All Ages and Trail stories with a clear eight-stage learning journey, release dates and free educational resources.", alternates: { canonical: "/episodes" } };

export default async function EpisodesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const effectiveEpisodes = applyOverrides(episodes, await loadEpisodeOverrides());
  const today = new Date().toISOString().slice(0, 10);
  const user = await getChatGPTUser();
  const member = user ? await getMember(user.userId).catch(() => null) : null;
  const canDownload = Boolean(member) || isAdmin(user);

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
      <section className="section story-character-intro" aria-labelledby="meet-story-characters">
        <div className="section-heading heading-row"><div><p className="eyebrow">Meet the story world</p><h2 id="meet-story-characters">Seven characters. Many kinds of weather.</h2></div><p>The same cast returns across home, school and community moments, so children can recognise a familiar person before meeting a more complex communication challenge.</p></div>
        <div className="story-character-lineup"><Image src="/character-lineup.png" width={1672} height={941} sizes="(max-width: 760px) 94vw, 1200px" alt="Willo, Mina, Leo, Zahra, Alex, Ms Chen and Arthur together" /></div>
        <div className="story-character-grid">
          {characters.map((character) => <article key={character.name}>
            <div className="story-character-portrait" style={{ backgroundImage: `url(/characters/${character.slug}-portrait.jpg)` }} role="img" aria-label={`${character.name} character portrait`} />
            <div><span>{character.role}</span><h3>{character.name}</h3><p>{character.note}</p></div>
          </article>)}
        </div>
      </section>
      <section className="section library-section" id="episode-library">
        <EpisodeLibrary episodes={effectiveEpisodes} initialCategory={params.category ?? "All"} today={today} canDownload={canDownload} />
      </section>
      <SiteFooter />
    </main>
  );
}
