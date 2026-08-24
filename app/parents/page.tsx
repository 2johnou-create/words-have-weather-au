import Image from "next/image";
import type { Metadata } from "next";
import { IllustratedMoments } from "../components/IllustratedMoments";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const moments = [
  ["Morning rush", "Shorten the language and make one next step visible."],
  ["Strong feelings", "Acknowledge the feeling while the safety limit stays."],
  ["Mistakes and mess", "Describe the event without making it the child’s identity."],
  ["Homework", "Look for the barrier before reaching for a label."],
  ["Screens", "Warn, offer a real choice inside the limit and follow through."],
  ["Adult repair", "Own the delivery, apologise and restate the reasonable boundary."],
];

export const metadata: Metadata = { title: "For parents and carers", description: "Find short illustrated stories, next sentences and free practice workbooks for real family pressure points.", alternates: { canonical: "/parents" } };

export default function ParentsPage() {
  return (
    <main>
      <a className="skip-link" href="#parent-pathway">Skip to the parent pathway</a>
      <SiteHeader />
      <section className="audience-hero parent-hero" id="parent-pathway">
        <div>
          <p className="eyebrow">For parents and carers</p>
          <h1>A next sentence for the moment you are actually in.</h1>
          <p>Start with a familiar pressure point, see how the words may land, keep the boundary and practise one line. The goal is not perfect parenting or instant cooperation.</p>
          <div className="hero-actions"><a className="button button-primary" href="/episodes" target="_top">Find a story</a><a className="button button-secondary" href="/#weather-shift" target="_top">See how it works</a></div>
        </div>
        <Image src="/stories/morning-transition.jpg" width={1535} height={1024} sizes="(max-width: 820px) 100vw, 46vw" priority alt="Mina ties her shoe while Alex waits with her school bag and Willo notices the changing weather" />
      </section>

      <IllustratedMoments eyebrow="See the method in family life" title="Different moments. The same four-part weather shift." items={[
        { code: "001", label: "Pause before the label", alt: "Mina and Willo notice word-weather during a rushed transition" },
        { code: "022", label: "Keep the limit during a big feeling", alt: "A caregiver holds a calm boundary while a child has a strong feeling" },
        { code: "063", label: "Return and repair", alt: "An adult and child reconnect after a difficult moment with Willo nearby" },
      ]} />

      <section className="section adult-use-sequence">
        <div className="section-heading"><p className="eyebrow">A five-minute pathway</p><h2>Watch. Notice. Choose. Practise. Repair.</h2></div>
        <ol>
          <li><span>01</span><div><h3>Choose the moment</h3><p>Begin with the routine, conflict or feeling your family is meeting now.</p></div></li>
          <li><span>02</span><div><h3>Preview the whole move</h3><p>See the pressure line, possible weather, boundary and next sentence before downloading anything.</p></div></li>
          <li><span>03</span><div><h3>Borrow one line</h3><p>Adapt the wording so it sounds natural in your family and fits the child and context.</p></div></li>
          <li><span>04</span><div><h3>Keep safety and responsibility</h3><p>A warmer sentence can still say no, stop harm, end an activity or require repair.</p></div></li>
          <li><span>05</span><div><h3>Return if it went badly</h3><p>Own the delivery without asking the child to comfort you, then state the limit again.</p></div></li>
        </ol>
      </section>

      <section className="section home-moment-list">
        <div className="section-heading heading-row"><div><p className="eyebrow">Find your starting point</p><h2>Everyday pressure, organised for real life.</h2></div><p>The library can be searched by setting, key learning, category, stage, depth and release month.</p></div>
        <div>{moments.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p><a href="/episodes" target="_top">Find a matching preview <span aria-hidden="true">→</span></a></article>)}</div>
      </section>

      <section className="section parent-age-guide">
        <div><p className="eyebrow">Age is a guide—not a test</p><h2>Choose the language load, not a label for the child.</h2><p>Sprout uses shorter, concrete steps for ages 4–6. All Ages covers foundations that travel across childhood. Trail adds more privacy, autonomy and reflection for ages 7–12.</p></div>
        <div className="age-choice-links">
          <a href="/episodes?category=Sprout" target="_top"><strong>Sprout</strong><span>Ages 4–6 · transitions, play, feelings, safety</span></a>
          <a href="/episodes?category=All%20Ages" target="_top"><strong>All Ages</strong><span>Boundaries, repair, accountability, belonging</span></a>
          <a href="/episodes?category=Trail" target="_top"><strong>Trail</strong><span>Ages 7–12 · peers, school, autonomy, online life</span></a>
        </div>
      </section>

      <section className="section parent-resource-preview">
        <Image src="/resources/episode-001-parent-practice-workbook-preview.webp" width={900} height={1273} sizes="(max-width: 760px) 80vw, 38vw" alt="Preview cover of an illustrated Words Have Weather parent practice workbook" />
        <div><p className="eyebrow">Free illustrated practice workbooks</p><h2>Take the useful sentence off-screen.</h2><p>Each released episode has a six-page parent workbook with the story moment, possible weather, boundary, practice prompts, an age-aware adaptation and a place to write your own next sentence.</p><ul><li>Public story preview before sign-up</li><li>One adult membership unlocks released PDFs</li><li>Education-use agreement; release emails are optional</li></ul><a className="button button-primary" href="/join" target="_top">Join free for workbooks</a></div>
      </section>

      <section className="section family-note"><p className="eyebrow">Use with context</p><h2>A phrase is a tool—not a verdict.</h2><p>The same behaviour can have many explanations. Adapt for culture, language, disability, access needs and the individual child. Persistent distress, bullying, online harm, immediate danger or major changes in wellbeing need context-specific support.</p></section>
      <SiteFooter />
    </main>
  );
}
