import Image from "next/image";
import { applyOverrides, episodes, formatReleaseDate, stages } from "@/data/episodes";
import { loadEpisodeOverrides } from "@/db/episode-state";
import { ebooks } from "@/data/ebooks";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";

export const dynamic = "force-dynamic";

const pressureMoments = [
  ["Rushed mornings", "Before louder, try shorter.", "morning-transition.jpg"],
  ["Strong feelings", "Name the feeling. Keep the safety limit.", "spill-repair.webp"],
  ["Mistakes", "Describe what happened—not who the child is.", "private-correction.webp"],
  ["Screens and stopping", "Make the ending predictable, not endlessly negotiable.", "screen-transition.jpg"],
  ["Peer conflict", "Listen, protect dignity and make repair specific.", "peer-repair.jpg"],
  ["Immediate danger", "Stop first. Reconnect and explain once everyone is safe.", "kerb-safety.webp"],
];

const storySamples = [
  {
    id: "Home · ages 4–6",
    title: "The spill is not the child",
    image: "/stories/spill-repair.webp",
    alt: "Mina and Alex begin cleaning spilled milk while Willo observes nearby",
    pressure: "Mina! You’re so careless.",
    weather: "She may hear: careless is who I am.",
    keep: "The spill still needs cleaning.",
    next: "The milk spilled. Cups stay on the table. Grab the cloth; I’ll hold the bowl.",
    note: "Name what happened—not who the child is.",
  },
  {
    id: "Safety · all ages",
    title: "Stop first, explain second",
    image: "/stories/kerb-safety.webp",
    alt: "Alex gives a protective stop signal as Leo stands safely behind a kerb",
    pressure: "STOP. Kerb.",
    weather: "Direct can be safe. The first job is stopping harm.",
    keep: "The child must stop at the kerb.",
    next: "I shouted because the road was dangerous. Stop at the kerb and check with me.",
    note: "A safety voice can be firm and loud without becoming a character judgement.",
  },
  {
    id: "Classroom · ages 7–12",
    title: "Correct in private",
    image: "/stories/private-correction.webp",
    alt: "Ms Chen quietly supports Leo at his desk while classmates keep working",
    pressure: "Are you planning to do any work today?",
    weather: "A public correction can make the audience the lesson.",
    keep: "The learning still needs to begin.",
    next: "The first two questions aren’t started. Point to the part that’s blocking you.",
    note: "Private where possible. Clear either way.",
  },
];

const categoryNotes = [
  {
    name: "Sprout",
    ages: "Ages 4–6",
    copy: "Concrete words, one visible step and early practice with feelings, transitions and safety.",
    className: "sprout",
  },
  {
    name: "All Ages",
    ages: "Across childhood",
    copy: "Shared foundations for clear boundaries, help-seeking, accountability, repair and belonging.",
    className: "all-ages",
  },
  {
    name: "Trail",
    ages: "Ages 7–12",
    copy: "Growing depth for autonomy, peer conflict, feedback, school pressure, online life and trust.",
    className: "trail",
  },
];

const curriculumCards = [
  {
    label: "Ages 4–5 · early learning",
    title: "EYLF V2.0 + NQS Quality Area 5",
    copy: "Possible connections include wellbeing, communication, responsive relationships, dignity and learning with others.",
  },
  {
    label: "Foundation–Year 6",
    title: "Australian Curriculum v9.0",
    copy: "The strongest links sit within Personal and Social capability, especially awareness, communication and conflict resolution, and relevant HPE content.",
  },
  {
    label: "Teacher practice",
    title: "Classroom communication",
    copy: "Educator notes connect stories with clear instructions, deliberate pausing, appropriate voice and respectful correction for local planning.",
  },
];

export default async function Home() {
  const effectiveEpisodes = applyOverrides(episodes, await loadEpisodeOverrides());
  const featured = [1, 6, 11]
    .map((id) => effectiveEpisodes.find((episode) => episode.id === id))
    .filter((episode) => episode && episode.effectiveStatus !== "removed");

  return (
    <main className="whw-home">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <SiteHeader />

      <section className="home-hero" id="main-content">
        <div className="home-hero-copy">
          <p className="eyebrow">For Australian parents, carers and educators</p>
          <h1>Words have weather.</h1>
          <p className="home-hero-promise">Keep the boundary. <em>Change the weather.</em></p>
          <p className="home-hero-lead">
            Short illustrated stories show how words, tone, timing and privacy
            may change what a child hears—then offer one useful next sentence
            that keeps the limit clear.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#weather-shift">Try a weather shift</a>
            <a className="button button-secondary" href="/episodes" target="_top">Browse story previews</a>
          </div>
          <p className="hero-note">Warm. Firm. Clear. Repairable. No perfect-parent promise.</p>
        </div>
        <div className="home-hero-art">
          <div className="hero-weather-note">
            <span aria-hidden="true">☁</span>
            <p>Same boundary.</p>
            <strong>Different landing.</strong>
          </div>
          <Image
            src="/character-lineup.png"
            width={1672}
            height={941}
            sizes="(max-width: 900px) 92vw, 48vw"
            priority
            alt="Willo with Mina, Leo, Zahra, Alex, Ms Chen and Arthur"
          />
        </div>
      </section>

      <section className="home-proof-strip" aria-label="Words Have Weather at a glance">
        <div><strong>35–45 sec</strong><span>one recognisable moment</span></div>
        <div><strong>1 next sentence</strong><span>ready to practise</span></div>
        <div><strong>Ages 4–12</strong><span>three useful pathways</span></div>
        <div><strong>Australian context</strong><span>framework connections shown</span></div>
      </section>

      <section className="section weather-shift" id="weather-shift">
        <div className="section-heading">
          <p className="eyebrow">Try the idea in one minute</p>
          <h2>The rule stays. The landing changes.</h2>
          <p>
            Words have literal meaning, but they also arrive with pace, volume,
            expression and relationship context. Willo makes one possible
            experience visible—never claims to read a child’s mind.
          </p>
        </div>
        <div className="weather-shift-board">
          <div className="weather-scene">
            <Image
              src="/stories/spill-repair.webp"
              width={1536}
              height={1024}
              sizes="(max-width: 820px) 100vw, 46vw"
              alt="Mina beside spilled milk while Alex pauses and Willo notices the changing word-weather"
            />
            <div className="weather-scene-caption"><strong>A familiar moment</strong><span>Milk spills. An adult is rushed. Clean-up still matters.</span></div>
          </div>
          <ol className="weather-steps" id="how-it-works">
            <li className="weather-step pressure">
              <span>01 · Pressure line</span>
              <blockquote>“Mina! You’re so careless.”</blockquote>
            </li>
            <li className="weather-step cloud">
              <span>02 · Possible word-weather</span>
              <p>She may hear: <strong>careless is who I am.</strong></p>
            </li>
            <li className="weather-step boundary">
              <span>03 · Keep</span>
              <p>The spill still needs cleaning. Cups still stay on the table.</p>
            </li>
            <li className="weather-step clearing">
              <span>04 · Next sentence</span>
              <blockquote>“The milk spilled. Cups stay on the table. Grab the cloth; I’ll hold the bowl.”</blockquote>
            </li>
          </ol>
        </div>
        <div className="weather-result">
          <strong>What changed?</strong>
          <p>The child is separated from the mistake, responsibility remains, and there is a usable next step. Cooperation is still not guaranteed.</p>
        </div>
      </section>

      <section className="section moment-finder" id="real-moments">
        <div className="section-heading heading-row">
          <div>
            <p className="eyebrow">Start where life feels hard</p>
            <h2>Find the moment before finding the lesson.</h2>
          </div>
          <p>Parents need a usable line under pressure. Educators need a clear purpose before choosing a resource. Both can begin with the real moment.</p>
        </div>
        <div className="moment-grid">
          {pressureMoments.map(([title, copy, image]) => (
            <article key={title}>
              <Image src={`/stories/${image}`} width={720} height={480} sizes="(max-width: 760px) 46vw, 28vw" alt="" />
              <div><h3>{title}</h3><p>{copy}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section sample-stories" id="stories">
        <div className="section-heading heading-row">
          <div>
            <p className="eyebrow">Open story samples</p>
            <h2>Preview the pressure, weather and next line.</h2>
          </div>
          <p>No sign-up is needed to understand an episode. Every preview shows the entire adult move before a workbook is offered.</p>
        </div>
        <div className="sample-story-grid">
          {storySamples.map((story) => (
            <article className="sample-story" key={story.title}>
              <Image src={story.image} width={900} height={600} sizes="(max-width: 760px) 100vw, 33vw" alt={story.alt} />
              <div className="sample-story-copy">
                <span>{story.id}</span>
                <h3>{story.title}</h3>
                <div className="sample-pressure"><small>Pressure line</small><blockquote>“{story.pressure}”</blockquote></div>
                <p className="sample-weather"><strong>Weather:</strong> {story.weather}</p>
                <details>
                  <summary>Reveal the next sentence</summary>
                  <div>
                    <small>Keep</small><p>{story.keep}</p>
                    <small>Try next</small><blockquote>“{story.next}”</blockquote>
                    <p>{story.note}</p>
                  </div>
                </details>
              </div>
            </article>
          ))}
        </div>
        <a className="button button-primary" href="/episodes" target="_top">Open all 120 episode previews</a>
      </section>

      <section className="section home-ebook-launch" aria-labelledby="home-ebook-heading">
        <div className="section-heading heading-row"><div><p className="eyebrow">New · Story eBooks</p><h2 id="home-ebook-heading">A longer story gives the next sentence somewhere to live.</h2></div><p>Pause at the pressure line, notice the illustrated weather and turn the page into one useful adult move. Every final page includes a key message and shared-learning ideas.</p></div>
        <div className="home-ebook-grid">
          {ebooks.slice(0, 3).map((book) => <article key={book.slug}><a href={`/ebooks/${book.slug}`} target="_top"><Image src={book.pages[0].image} width={520} height={430} sizes="(max-width: 760px) 100vw, 33vw" alt={book.pages[0].imageAlt} /></a><div><span>{book.category} · Ages {book.ages}</span><h3><a href={`/ebooks/${book.slug}`} target="_top">{book.title}</a></h3><blockquote>{book.hook}</blockquote></div></article>)}
        </div>
        <div className="home-ebook-actions"><a className="button button-primary" href="/ebooks" target="_top">Open all six Story eBooks</a><span>Touch reader · landscape PDF · fixed-layout EPUB 3</span></div>
      </section>

      <section className="section home-journey" id="learning-journey">
        <div className="section-heading">
          <p className="eyebrow">A learning journey—not a content pile</p>
          <h2>Eight stages move from noticing to carrying the skill forward.</h2>
          <p>Each month releases 15 stories across all three pathways. The depth grows through guided practice, application, transfer and integration.</p>
        </div>
        <ol className="home-stage-track">
          {stages.map((stage) => (
            <li key={stage.number}>
              <span>{String(stage.number).padStart(2, "0")}</span>
              <div><small>{stage.depth}</small><h3>{stage.title}</h3><p>{stage.summary}</p></div>
            </li>
          ))}
        </ol>
        <a className="text-link" href="/journey" target="_top">Explore the interactive learning map <span aria-hidden="true">→</span></a>
      </section>

      <section className="section pathway-section" id="pathways">
        <div className="section-heading heading-row">
          <div><p className="eyebrow">Choose a pathway</p><h2>Same dignity. Useful depth for the age and moment.</h2></div>
          <p>Age ranges guide discovery; they are not tests or fixed claims about an individual child.</p>
        </div>
        <div className="category-grid">
          {categoryNotes.map((category) => (
            <article className={`category-card ${category.className}`} key={category.name}>
              <header><span>{category.ages}</span><strong>40 stories</strong></header>
              <h3>{category.name}</h3>
              <p>{category.copy}</p>
              <a href={`/episodes?category=${encodeURIComponent(category.name)}`} target="_top">Browse {category.name} <span aria-hidden="true">→</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="section australian-context" id="australian-context">
        <div className="curriculum-intro">
          <p className="eyebrow">Made for Australian settings</p>
          <h2>See the educational connection before using the story.</h2>
          <p>
            Every episode records possible framework links, its age lens, key
            learning, depth and adult practice. These mappings support local
            planning; they are not government approval, endorsement or a
            packaged curriculum.
          </p>
          <a className="button button-light" href="/educators" target="_top">Open the educator guide</a>
        </div>
        <div className="curriculum-card-grid">
          {curriculumCards.map((card) => (
            <article key={card.title}><span>{card.label}</span><h3>{card.title}</h3><p>{card.copy}</p></article>
          ))}
        </div>
      </section>

      <section className="section audience-entry">
        <article className="parent-entry">
          <div><p className="eyebrow">For parents and carers</p><h2>Start with today’s moment.</h2><p>Find a story by routine, feeling, conflict, mistake or transition. Preview the next line, then use the illustrated practice workbook when you are ready.</p></div>
          <a href="/parents" target="_top">Explore the parent pathway <span aria-hidden="true">→</span></a>
        </article>
        <article className="educator-entry">
          <div><p className="eyebrow">For educators</p><h2>Start with the learning purpose.</h2><p>See age range, curriculum connection, stage, discussion prompt, adaptation note and worksheet before adding an episode to local planning.</p></div>
          <a href="/educators" target="_top">Explore the educator pathway <span aria-hidden="true">→</span></a>
        </article>
      </section>

      <section className="section featured-library">
        <div className="section-heading heading-row">
          <div><p className="eyebrow">Inside the library</p><h2>Every episode follows the same useful pattern.</h2></div>
          <p>Public preview first. Parent and educator practice resources unlock free after adult sign-up.</p>
        </div>
        <div className="mini-episode-grid">
          {featured.map((episode) => episode && (
            <article key={episode.id}>
              <a className="mini-episode-cover" href={`/episodes/${episode.code}`} target="_top" aria-label={`Preview Episode ${episode.code}: ${episode.title}`}>
                <Image src={episode.heroImage} width={900} height={600} sizes="(max-width: 760px) 100vw, 33vw" alt={`Story illustration for Episode ${episode.code}, ${episode.title}`} />
              </a>
              <div>
                <span>Episode {episode.code} · {episode.category}</span>
                <h3><a href={`/episodes/${episode.code}`} target="_top">{episode.title}</a></h3>
                <p>{episode.keyLearning}</p>
                <small>{formatReleaseDate(episode.effectiveReleaseDate)}</small>
                <a className="mini-preview-link" href={`/episodes/${episode.code}`} target="_top">Preview story + next sentence <span aria-hidden="true">→</span></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section home-scope" aria-labelledby="scope-heading">
        <div><p className="eyebrow">Clear limits</p><h2 id="scope-heading">Some moments need more than a next sentence.</h2></div>
        <div><p>Words Have Weather offers general education for adults. It does not assess a child, replace professional support or promise that one phrase will produce cooperation.</p><p>In immediate danger, use a short direct safety instruction first. For persistent distress, bullying, online harm or safety concerns, seek context-specific support.</p></div>
      </section>

      <section className="home-closing">
        <div><p className="eyebrow">Begin with one real moment</p><h2>You do not need perfect words. You need a useful next sentence.</h2></div>
        <div><a className="button button-light" href="/episodes" target="_top">Preview the stories</a><a className="button button-ghost-light" href="/join" target="_top">Join free for workbooks</a></div>
      </section>

      <SiteFooter />
    </main>
  );
}
