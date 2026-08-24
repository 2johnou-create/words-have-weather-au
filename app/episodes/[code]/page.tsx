import Image from "next/image";
import { notFound } from "next/navigation";
import { isAdmin } from "@/app/admin-access";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { SiteFooter, SiteHeader } from "@/app/components/SiteChrome";
import { applyOverrides, episodes, formatReleaseDate } from "@/data/episodes";
import { getMember, loadEpisodeOverrides } from "@/db/episode-state";

export const dynamic = "force-dynamic";

export default async function EpisodePreviewPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  if (!/^\d{3}$/.test(code)) notFound();

  const effectiveEpisodes = applyOverrides(episodes, await loadEpisodeOverrides());
  const episode = effectiveEpisodes.find((item) => item.code === code);
  if (!episode || episode.effectiveStatus === "removed") notFound();

  const today = new Date().toISOString().slice(0, 10);
  const isAvailable = episode.effectiveStatus === "enabled" && episode.effectiveReleaseDate <= today;
  const user = await getChatGPTUser();
  const member = user ? await getMember(user.userId).catch(() => null) : null;
  const canDownload = Boolean(member) || isAdmin(user);
  const joinHref = `/join?return_to=${encodeURIComponent(`/episodes/${episode.code}`)}`;

  return (
    <main>
      <a className="skip-link" href="#episode-preview">Skip to episode preview</a>
      <SiteHeader />

      <article className={`episode-preview category-${episode.category.toLowerCase().replaceAll(" ", "-")}`} id="episode-preview">
        <div className="episode-preview-art">
          <Image
            src={episode.heroImage}
            width={900}
            height={600}
            sizes="(max-width: 860px) 100vw, 52vw"
            priority
            alt={`Story illustration for Episode ${episode.code}, ${episode.title}`}
          />
          <span>{isAvailable ? "Available now" : episode.effectiveStatus === "disabled" ? "Temporarily paused" : `Releases ${formatReleaseDate(episode.effectiveReleaseDate)}`}</span>
        </div>

        <div className="episode-preview-intro">
          <a className="episode-back-link" href={`/episodes?category=${encodeURIComponent(episode.category)}`} target="_top">← Back to {episode.category}</a>
          <p className="eyebrow">Episode {episode.code} · {episode.category} · {episode.ages}</p>
          <h1>{episode.title}</h1>
          <p className="episode-preview-lead">{episode.keyLearning}</p>
          <div className="episode-preview-meta">
            <span>Stage {episode.stage}: {episode.stageTitle}</span>
            <span>{episode.depth}</span>
            <span>{episode.setting}</span>
          </div>
        </div>

        <section className="episode-moment" aria-labelledby="moment-heading">
          <div>
            <p className="eyebrow">The moment</p>
            <h2 id="moment-heading">Notice the weather before choosing the words.</h2>
            <p>{episode.possibleWeather}</p>
          </div>
          <dl>
            <div><dt>Pressure line</dt><dd>“{episode.pressureLine}”</dd></div>
            <div><dt>Keep the boundary</dt><dd>{episode.boundary}</dd></div>
            <div><dt>Try next</dt><dd>“{episode.nextSentence}”</dd></div>
          </dl>
        </section>

        <section className="episode-learning" aria-labelledby="learning-heading">
          <div>
            <p className="eyebrow">Practice and reflection</p>
            <h2 id="learning-heading">One move to practise. One principle to carry forward.</h2>
          </div>
          <div className="episode-learning-grid">
            <article><span>Practice</span><p>{episode.practice}</p></article>
            <article><span>Principle</span><p>{episode.principle}</p></article>
          </div>
          <div className="episode-curriculum-links">
            <h3>Possible curriculum and key-learning connections</h3>
            <ul>{episode.curriculum.map((item) => <li key={item}>{item}</li>)}</ul>
            <a href="/journey?audience=educators" target="_top">Open the complete learning journey <span aria-hidden="true">→</span></a>
          </div>
        </section>

        <section className="episode-download-panel" aria-labelledby="resources-heading">
          <div>
            <p className="eyebrow">Illustrated practice pack</p>
            <h2 id="resources-heading">Continue the episode with a guided worksheet.</h2>
            <p>Both resources are free for educational use. A one-time membership keeps the downloads protected and the release journey clear.</p>
          </div>
          <div className="episode-download-actions">
            {isAvailable ? (
              canDownload ? (
                <>
                  <a className="button button-primary" href={episode.educatorPdf} download>Download educator worksheet</a>
                  <a className="button button-secondary" href={episode.parentPdf} download>Download parent workbook</a>
                </>
              ) : (
                <>
                  <a className="button button-primary" href={joinHref} target="_top">Join free to download</a>
                  <small>Sign in once, accept the education-use terms, then return here automatically.</small>
                </>
              )
            ) : (
              <>
                <strong>{episode.effectiveStatus === "disabled" ? "Downloads are temporarily paused." : `Workbooks release ${formatReleaseDate(episode.effectiveReleaseDate)}.`}</strong>
                <span>The complete episode preview remains open now.</span>
              </>
            )}
          </div>
        </section>

        <nav className="episode-preview-nav" aria-label="Episode navigation">
          {episode.id > 1 ? <a className="previous" href={`/episodes/${String(episode.id - 1).padStart(3, "0")}`} target="_top">← Previous episode</a> : <span />}
          <a className="all-episodes" href="/episodes" target="_top">All 120 episodes</a>
          {episode.id < 120 ? <a className="next" href={`/episodes/${String(episode.id + 1).padStart(3, "0")}`} target="_top">Next episode →</a> : <span />}
        </nav>
      </article>

      <SiteFooter />
    </main>
  );
}
