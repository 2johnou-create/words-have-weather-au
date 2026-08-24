import Image from "next/image";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

const planningSteps = [
  ["Choose", "Name the classroom moment and the adult or student learning purpose."],
  ["Preview", "See the story, pressure line, possible weather and boundary rewrite."],
  ["Map", "Select only the curriculum or practice connection genuinely addressed."],
  ["Adapt", "Adjust for age, communication access, culture, disability and local context."],
  ["Practise", "Use the short discussion and rehearsal prompts in the worksheet."],
  ["Review", "Record what was used, notice student response and identify further support."],
];

const frameworkRows = [
  ["Early years · ages 4–5", "EYLF V2.0; NQS Quality Area 5", "Wellbeing, communication, responsive relationships, dignity, learning with others"],
  ["Foundation–Year 6", "Australian Curriculum v9.0 Personal and Social capability", "Self-awareness, self-management, social awareness, communication, collaboration and conflict resolution"],
  ["Relevant school learning", "Australian Curriculum v9.0 Health and Physical Education", "Identity, emotions, relationships, help-seeking, safety and respectful interaction where content descriptions fit"],
  ["Teacher reflection", "APST + evidence-informed classroom practice", "Clear communication, participation, safe learning environments, feedback and family partnership where relevant"],
];

export default function EducatorsPage() {
  return (
    <main>
      <a className="skip-link" href="#educator-pathway">Skip to the educator pathway</a>
      <SiteHeader />
      <section className="audience-hero educator-hero" id="educator-pathway">
        <div>
          <p className="eyebrow">For Australian educators</p>
          <h1>See the learning purpose before choosing the story.</h1>
          <p>Use short, commercially neutral story previews and consistent worksheets to examine clear communication, dignity, boundaries and repair in early learning and primary settings.</p>
          <div className="hero-actions"><a className="button button-primary" href="/journey?audience=educators" target="_top">Open the learning map</a><a className="button button-secondary" href="/episodes" target="_top">Browse episodes</a></div>
        </div>
        <Image src="/stories/private-correction.webp" width={1536} height={1024} sizes="(max-width: 820px) 100vw, 46vw" priority alt="Ms Chen speaks privately with Leo at his desk while the class continues learning" />
      </section>

      <section className="section educator-planning">
        <div className="section-heading"><p className="eyebrow">A transparent planning sequence</p><h2>From story selection to local review.</h2><p>The website separates discovery, preview, curriculum mapping and download so an educator can evaluate the material before using it.</p></div>
        <ol>{planningSteps.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      </section>

      <section className="section curriculum-overview">
        <div className="section-heading heading-row"><div><p className="eyebrow">Australian education context</p><h2>Framework connections at a glance.</h2></div><p>Words Have Weather is aligned to possible learning and practice connections. It is not approved, endorsed, accredited or mandated by government.</p></div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Use context</th><th>Possible framework connection</th><th>What the episodes may support educators to explore</th></tr></thead>
            <tbody>{frameworkRows.map(([context, framework, connection]) => <tr key={context}><th>{context}</th><td>{framework}</td><td>{connection}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="framework-links">
          <a href="https://www.australiancurriculum.edu.au/curriculum-information/understand-this-general-capability/personal-and-social-capability" target="_blank" rel="noreferrer">Australian Curriculum: Personal and Social capability ↗</a>
          <a href="https://www.australiancurriculum.edu.au/curriculum-information/understand-this-curriculum-connection/respectful-relationships" target="_blank" rel="noreferrer">Australian Curriculum: Respectful relationships ↗</a>
          <a href="https://www.acecqa.gov.au/national-quality-framework/guide-nqf/section-3-national-quality-standard-and-assessment-and-rating/quality-area-5-relationships-children" target="_blank" rel="noreferrer">ACECQA: NQS Quality Area 5 ↗</a>
          <a href="https://www.edresearch.edu.au/guides-resources/practice-resources/clear-communication-classroom-management-skill" target="_blank" rel="noreferrer">AERO: Clear communication ↗</a>
        </div>
      </section>

      <section className="section educator-resource-preview">
        <div><p className="eyebrow">Consistent resource anatomy</p><h2>Know what is inside every worksheet.</h2><ul><li>Episode purpose, age lens and intended setting</li><li>Pressure line, tone cue and possible word-weather</li><li>Boundary that remains non-negotiable</li><li>Replacement line and visible, credible response</li><li>5–8 minute discussion and practice sequence</li><li>Possible curriculum links, adaptation prompts and safeguarding note</li><li>General-information and non-endorsement notice</li></ul><a className="button button-primary" href="/episodes" target="_top">Preview the complete library</a></div>
        <Image src="/resources/episode-001-educator-worksheet-preview.webp" width={900} height={1273} sizes="(max-width: 760px) 80vw, 38vw" alt="Preview cover of an illustrated Words Have Weather educator worksheet" />
      </section>

      <section className="section classroom-use-cards">
        <div className="section-heading"><p className="eyebrow">Three ways to use the material</p><h2>Short enough to be useful. Structured enough to review.</h2></div>
        <div>
          <article><span>5–8 minutes</span><h3>Staff reflection</h3><p>Identify observable language, consider more than one possible student perception and rewrite while preserving the expectation.</p></article>
          <article><span>10–15 minutes</span><h3>Class modelling</h3><p>Use an age-appropriate story to name a communication move, rehearse a safer option and identify when adult help is needed.</p></article>
          <article><span>Home–school bridge</span><h3>Shared language</h3><p>Offer a voluntary, plain-language practice page that families can adapt without implying one universal family routine.</p></article>
        </div>
      </section>

      <section className="section educator-governance">
        <div><p className="eyebrow">Professional judgement stays visible</p><h2>Alignment is documented—not claimed.</h2></div>
        <div><p>Each resource still needs local curriculum selection, age and context review. Safeguarding, accessibility, cultural authority and school policy may require additional review.</p><p>Stories are general educational information. They do not replace school procedures, specialist advice, mandatory reporting duties or an immediate safety instruction.</p><a href="/journey?audience=educators" target="_top">Use the stage and curriculum overview <span aria-hidden="true">→</span></a></div>
      </section>

      <section className="member-cta educator-member-cta">
        <div><p className="eyebrow">Free educational membership</p><h2>Download released educator and parent resources.</h2></div>
        <div><p>Sign in once, provide your name and email, accept the education-use terms and choose whether to receive release updates.</p><a className="button button-light" href="/join" target="_top">Join free</a></div>
      </section>
      <SiteFooter />
    </main>
  );
}
