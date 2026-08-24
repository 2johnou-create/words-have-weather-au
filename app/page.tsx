import Link from "next/link";
import Image from "next/image";
import { applyOverrides, episodes, formatReleaseDate, stages } from "@/data/episodes";
import { loadEpisodeOverrides } from "@/db/episode-state";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";

export const dynamic = "force-dynamic";

const categoryNotes = [
  {
    name: "Sprout",
    ages: "Ages 4-6",
    count: 40,
    copy: "Short, concrete language for transitions, play, safety, feelings and first repair moves.",
    colour: "sprout",
  },
  {
    name: "All Ages",
    ages: "Across childhood",
    count: 40,
    copy: "Shared foundations for safety, boundaries, accountability, help-seeking and belonging.",
    colour: "all-ages",
  },
  {
    name: "Trail",
    ages: "Ages 7-12",
    count: 40,
    copy: "Deeper practice for autonomy, school pressure, peers, online life, fairness and trust.",
    colour: "trail",
  },
];

const storyScenes = [
  {
    image: "/stories/morning-transition.jpg",
    width: 1535,
    height: 1024,
    label: "Morning pressure",
    title: "One clear next step",
    copy: "Mina and Alex make room for connection without making the school boundary disappear.",
    alt: "Mina ties her shoe while Alex waits beside her school bag and Willo's cloudy weather begins to clear",
  },
  {
    image: "/stories/spill-repair.webp",
    width: 1536,
    height: 1024,
    label: "Mistakes and repair",
    title: "The spill is not the child",
    copy: "A mistake becomes a shared clean-up, not a label about who Mina is.",
    alt: "Alex and Mina calmly begin cleaning spilled milk while Willo watches",
  },
  {
    image: "/stories/peer-repair.jpg",
    width: 1536,
    height: 1024,
    label: "Belonging after conflict",
    title: "Return, listen, repair",
    copy: "Leo returns the paper plane; Zahra decides what listening can look like next.",
    alt: "Leo offers a paper plane back to Zahra in a school garden while Willo and Arthur stay nearby",
  },
  {
    image: "/stories/private-correction.webp",
    width: 1536,
    height: 1024,
    label: "Classroom dignity",
    title: "Correct in private",
    copy: "Ms Chen keeps the learning visible and the correction quiet.",
    alt: "Ms Chen speaks quietly with Leo at his desk while the class continues in the background",
  },
  {
    image: "/stories/screen-transition.jpg",
    width: 1536,
    height: 1024,
    label: "Screens and stopping",
    title: "The boundary can stay calm",
    copy: "Leo can dislike the ending while Alex keeps the limit predictable and kind.",
    alt: "Leo sits beside a face-down tablet as Alex points to a sand timer and Willo's stormy weather settles",
  },
  {
    image: "/stories/kerb-safety.webp",
    width: 1536,
    height: 1024,
    label: "Safety first",
    title: "Stop first, explain second",
    copy: "Alex protects Leo at the kerb first; the teaching can follow once bodies are safe.",
    alt: "Alex gives a calm stop signal beside Leo at a kerb while a bicycle passes at a distance",
  },
];

export default async function Home() {
  const effectiveEpisodes = applyOverrides(episodes, await loadEpisodeOverrides());
  const featured = effectiveEpisodes
    .filter((episode) => episode.effectiveStatus !== "removed")
    .slice(0, 6);

  return (
    <main>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <SiteHeader />

      <section className="hero" id="main-content">
        <div className="weather-shape weather-shape-one" aria-hidden="true" />
        <div className="weather-shape weather-shape-two" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">120 short stories · one connected learning journey</p>
          <h1>The rule can be right.<em>The weather can still change.</em></h1>
          <p className="hero-lead">
            Explore practical stories for parents, carers and educators. Every
            episode includes a preview, a parent workbook, an educator worksheet,
            clear key learning and careful curriculum connections.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/episodes">Explore all 120 episodes</Link>
            <Link className="button button-secondary" href="/journey">See the learning journey</Link>
          </div>
          <p className="hero-note">Free for educational use after a simple member sign-up.</p>
        </div>
        <div className="hero-art" aria-label="The Words Have Weather cast">
          <div className="speech-card"><p>Eight stages.</p><strong>Growing depth.</strong></div>
          <Image src="/character-lineup.png" width={1672} height={941} sizes="(max-width: 1050px) 90vw, 48vw" priority alt="Willo, Mina, Leo, Zahra, Alex, Ms Chen and Arthur" />
        </div>
      </section>

      <section className="metric-strip" aria-label="Library overview">
        <div><strong>120</strong><span>complete episodes</span></div>
        <div><strong>3</strong><span>learning categories</span></div>
        <div><strong>8</strong><span>monthly stages</span></div>
        <div><strong>15</strong><span>scheduled each month</span></div>
      </section>

      <section className="section story-world">
        <div className="section-heading heading-row">
          <div><p className="eyebrow">Inside the story world</p><h2>See the moment before choosing the words.</h2></div>
          <p>Each scene holds a real pressure point, the feeling underneath it and one adult move that protects dignity.</p>
        </div>
        <div className="story-scene-grid">
          {storyScenes.map((scene) => (
            <article className="story-scene" key={scene.image}>
              <Image src={scene.image} width={scene.width} height={scene.height} sizes="(max-width: 760px) 100vw, 50vw" alt={scene.alt} />
              <div>
                <span>{scene.label}</span>
                <h3>{scene.title}</h3>
                <p>{scene.copy}</p>
              </div>
            </article>
          ))}
        </div>
        <Link className="text-link story-world-link" href="/episodes">Find the matching episodes and practice packs <span aria-hidden="true">→</span></Link>
      </section>

      <section className="section category-section">
        <div className="section-heading heading-row">
          <div><p className="eyebrow">Three ways into the library</p><h2>Same dignity. Developmentally useful depth.</h2></div>
          <p>Every month adds five episodes in each category, so no audience waits for the next part of its journey.</p>
        </div>
        <div className="category-grid">
          {categoryNotes.map((category) => (
            <article className={`category-card ${category.colour}`} key={category.name}>
              <header><span>{category.ages}</span><strong>{category.count} episodes</strong></header>
              <h3>{category.name}</h3>
              <p>{category.copy}</p>
              <Link href={`/episodes?category=${encodeURIComponent(category.name)}`}>Explore {category.name} <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section journey-preview">
        <div className="section-heading">
          <p className="eyebrow">The eight-stage learning arc</p>
          <h2>From noticing pressure to carrying the learning forward.</h2>
        </div>
        <ol className="stage-ribbon">
          {stages.map((stage) => (
            <li key={stage.number}>
              <span>{String(stage.number).padStart(2, "0")}</span>
              <small>{stage.depth}</small>
              <h3>{stage.title}</h3>
              <p>{stage.summary}</p>
            </li>
          ))}
        </ol>
        <Link className="text-link" href="/journey">Open the curriculum and key-learning overview <span aria-hidden="true">→</span></Link>
      </section>

      <section className="section release-preview">
        <div className="section-heading heading-row">
          <div><p className="eyebrow">First collection</p><h2>Preview the moment. Practise the next sentence.</h2></div>
          <p>All 120 episode cards remain visible, with clear release dates and availability.</p>
        </div>
        <div className="mini-episode-grid">
          {featured.map((episode) => (
            <article key={episode.id}>
              <Image src={episode.educatorPreview} width={745} height={1053} sizes="(max-width: 760px) 100vw, (max-width: 1050px) 50vw, 33vw" alt={`Preview of Episode ${episode.code}, ${episode.title}`} />
              <div>
                <span>Episode {episode.code} · {episode.category}</span>
                <h3>{episode.title}</h3>
                <p>{episode.keyLearning}</p>
                <small>Released {formatReleaseDate(episode.effectiveReleaseDate)}</small>
              </div>
            </article>
          ))}
        </div>
        <Link className="button button-primary" href="/episodes">Open the complete episode library</Link>
      </section>

      <section className="section audience-split">
        <article>
          <p className="eyebrow">For parents and carers</p>
          <h2>One phrase for the moment you are actually in.</h2>
          <p>See home moments, key learning, release timing and a gentle practice workbook for every episode.</p>
          <Link href="/journey?audience=parents">Open the parent pathway <span aria-hidden="true">→</span></Link>
        </article>
        <article>
          <p className="eyebrow">For educators</p>
          <h2>A clear overview before you choose a story.</h2>
          <p>Filter by curriculum connection, learning depth, developmental stage and classroom purpose.</p>
          <Link href="/journey?audience=educators">Open the educator pathway <span aria-hidden="true">→</span></Link>
        </article>
      </section>

      <section className="member-cta">
        <div><p className="eyebrow">Free educational membership</p><h2>Download the workbooks when the moment arrives.</h2></div>
        <div><p>Join with your name and email, agree to educational-use terms, and choose whether you want new-release updates.</p><Link className="button button-light" href="/join">Join free</Link></div>
      </section>

      <SiteFooter />
    </main>
  );
}
