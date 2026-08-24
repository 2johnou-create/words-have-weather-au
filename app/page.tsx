const stories = [
  {
    id: "01",
    context: "Home · ages 4–6",
    title: "The spill is not the child",
    image: "/stories/spill-repair.webp",
    imageAlt:
      "Mina looks disappointed beside spilled milk while Alex pauses and begins cleaning with Willo nearby",
    hook: "Mina! You’re so careless.",
    weather: "She may hear: careless is who I am.",
    principle: "Keep the clean-up. Lose the label.",
    next:
      "The milk spilled. Cups stay on the table. Grab the cloth; I’ll hold the bowl.",
    end: "Name what happened—not who the child is.",
    tone: "rain",
  },
  {
    id: "04",
    context: "Safety · all ages",
    title: "Stop first, explain second",
    image: "/stories/kerb-safety.webp",
    imageAlt:
      "Leo stands safely behind a kerb as Alex gives a protective stop signal and a bicycle passes at a distance",
    hook: "STOP. Kerb.",
    weather: "Direct can be safe. The first job is stopping harm.",
    principle: "Calm does not always mean quiet.",
    next:
      "I shouted because the road was dangerous. Stop at the kerb and check with me.",
    end: "Safety first. Teaching second.",
    tone: "sun",
  },
  {
    id: "06",
    context: "Classroom · ages 7–9",
    title: "Correct in private",
    image: "/stories/private-correction.webp",
    imageAlt:
      "Ms Chen quietly points to Leo’s worksheet at his desk while classmates continue working in the background",
    hook: "Are you planning to do any work today?",
    weather: "A public correction can make the audience the lesson.",
    principle: "Private where possible. Clear either way.",
    next:
      "The first two questions aren’t started. Point to the part that’s blocking you.",
    end: "Dignity supports participation.",
    tone: "plum",
  },
];

const pressurePoints = [
  {
    number: "01",
    moment: "Rushed mornings",
    adult: "The clock, lunches, work and several instructions are all competing at once.",
    child: "A child may need fewer words and one visible place to begin.",
    direction: "One clear step · predictable transitions",
  },
  {
    number: "02",
    moment: "Strong feelings + firm limits",
    adult: "The unsafe action needs to stop now, without turning the moment into a lecture.",
    child: "The feeling can be noticed while hitting, throwing or running still stops.",
    direction: "Safety voice · emotion plus boundary",
  },
  {
    number: "03",
    moment: "Screens and stopping",
    adult: "Repeated negotiations can make an ordinary limit feel exhausting.",
    child: "A warning and a real choice inside the limit can make the ending less surprising.",
    direction: "Warn · choose · follow through",
  },
  {
    number: "04",
    moment: "Mistakes and schoolwork",
    adult: "Concern about effort or progress can come out as a label, comparison or public correction.",
    child: "Specific feedback and a manageable first step can keep the learner in the learning.",
    direction: "Find the barrier · teach the strategy",
  },
  {
    number: "05",
    moment: "Truth, fairness and conflict",
    adult: "The impact matters, and the adult still needs honest information and repair.",
    child: "Being heard is not the same as avoiding accountability.",
    direction: "Curiosity + consequence · truth + repair",
  },
  {
    number: "06",
    moment: "Adult overload and repair",
    adult: "A capable, loving adult can still speak too sharply on a stretched day.",
    child: "A real apology can own the delivery without making the child manage the adult’s feelings.",
    direction: "Own it · apologise · restate the limit",
  },
];

const ageLenses = [
  {
    name: "Sprout",
    ages: "Ages 4–6",
    character: "With Mina",
    summary: "Short language, concrete actions and co-regulation during transitions, play and big feelings.",
    topics: ["morning routines", "waiting", "mess and clean-up", "feelings + safety"],
  },
  {
    name: "Trail",
    ages: "Ages 7–9",
    character: "With Leo",
    summary: "Curiosity before labels, private correction and a usable starting point for mistakes and effort.",
    topics: ["fairness", "homework barriers", "friendship conflict", "truth and repair"],
  },
  {
    name: "Horizon",
    ages: "Ages 10–12",
    character: "With Zahra",
    summary: "Respectful autonomy, privacy and genuine choices as school, peers and online life grow more complex.",
    topics: ["screen endings", "school belonging", "feedback", "listening before solving"],
  },
];

const storyShelf = [
  ["02", "One clear morning step", "Before louder, try shorter."],
  ["03", "Feelings can stay; hitting stops", "Name the feeling. Hold the limit."],
  ["05", "Replace accusation with curiosity", "Ask for information you can use."],
  ["07", "Praise that teaches", "Make the successful strategy reusable."],
  ["08", "Teach the waiting signal", "Say what to do, then follow through."],
  ["09", "Find the homework barrier", "Describe, check and start small."],
  ["10", "Truth, impact, repair", "Accountability without an identity label."],
  ["11", "Check before “you’re okay”", "Notice, check, then comfort."],
  ["12", "A wrong answer is information", "Correct the work, not the worth."],
  ["13", "The boundary survives an apology", "Repair changes the weather—not the rule."],
  ["14", "“I hate school” is a doorway", "Understand before trying to solve."],
  ["15", "End the screen without a surprise", "Predictable does not mean negotiable."],
];

const evidenceNotes = [
  {
    figure: "59%",
    title: "Parenting can be exhausting",
    text: "In HILDA Wave 23, 59% of participating parents of children aged 0–5 agreed they often felt tired, worn out or exhausted in their parenting role.",
    source: "Australian Institute of Family Studies",
    href: "https://aifs.gov.au/all-research/research-reports/understanding-social-wellbeing-and-supports-australian-families",
  },
  {
    figure: "45%",
    title: "Sleep and routines carry pressure",
    text: "A November 2024 national poll found 45% of primary-school children had a parent-reported problem with their sleep pattern.",
    source: "RCH National Child Health Poll",
    href: "https://rchpoll.org.au/polls/are-kids-sleeping-soundly-views-of-australian-parents/",
  },
  {
    figure: "3,520",
    title: "Digital parenting needs usable support",
    text: "Australian parents in eSafety research described concerns about privacy, unwanted contact and confidence responding to negative online experiences.",
    source: "eSafety Commissioner",
    href: "https://www.esafety.gov.au/research/parenting-digital-age",
  },
  {
    figure: "300+",
    title: "Children want voice and fairness",
    text: "Children consulted nationally described positive relationships as supportive, respectful and kind, built on trust, communication and fairness.",
    source: "Australian Human Rights Commission",
    href: "https://humanrights.gov.au/about-us/media-centre/media-releases/children-and-youth-rights/new-national-report-find-childrens-voices-are-the-key-to-ending-violence-before-it-begins",
  },
];

const cast = [
  ["Willo", "Word-weather guide", "Makes possible communication impact visible—never reads minds."],
  ["Mina", "Age 5 · Sprout", "Transitions, play, waiting and one clear next step."],
  ["Leo", "Age 8 · Trail", "Mistakes, fairness, effort and curiosity before labels."],
  ["Zahra", "Age 11 · Horizon", "Autonomy, privacy, peers and genuine choices."],
  ["Alex", "Adaptable caregiver", "A loving adult under real pressure who can repair."],
  ["Ms Chen", "Reflective teacher", "Clear expectations, private correction and useful feedback."],
  ["Arthur", "Age 89 · Quiet elder", "One useful question when a longer view genuinely helps."],
];

const seasonResources = [
  ["01", "The spill is not the child", "Sprout · home", "Describe the event, keep responsibility and give one next step."],
  ["02", "One clear morning step", "Sprout · home", "Shorten the instruction before increasing volume."],
  ["03", "Feelings can stay; hitting stops", "Sprout · home safety", "Acknowledge emotion while stopping unsafe behaviour."],
  ["04", "Stop first, explain second", "All ages · safety", "Use the voice the safety moment needs, then reconnect."],
  ["05", "Replace accusation with curiosity", "Trail · home", "Ask for information that can guide consequence and repair."],
  ["06", "Correct in private", "Trail · classroom", "Preserve dignity with a known cue or private correction."],
  ["07", "Praise that teaches", "Trail · classroom", "Make the successful effort, strategy or evidence reusable."],
  ["08", "Teach the waiting signal", "Trail · classroom", "Teach the expected action and follow through."],
  ["09", "Find the homework barrier", "Trail · home", "Describe, check the barrier and make the first step visible."],
  ["10", "Truth, impact, repair", "Trail · home", "Keep evidence, consequence and repair without an identity label."],
  ["11", "Check before ‘you’re okay’", "Sprout · care + safety", "Notice, check and then offer accurate comfort."],
  ["12", "A wrong answer is information", "Horizon · classroom", "Correct the work while keeping the learner in the learning."],
  ["13", "The boundary survives an apology", "Cross-age · home", "Own adult delivery without withdrawing a reasonable limit."],
  ["14", "‘I hate school’ is a doorway", "Horizon · home", "Reflect and narrow the concern before solving."],
  ["15", "End the screen without a surprise", "Horizon · home", "Warn, offer a real choice and follow through calmly."],
];

export default function Home() {
  return (
    <main>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Words Have Weather home">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>
            Words Have Weather
            <small>Australian education media</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#method">The method</a>
          <a href="#real-moments">Real moments</a>
          <a href="#stories">Stories</a>
          <a href="#resources">Resources</a>
          <a href="#evidence">Evidence</a>
          <a className="nav-cta" href="#educators">
            For educators
          </a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="weather-shape weather-shape-one" aria-hidden="true" />
        <div className="weather-shape weather-shape-two" aria-hidden="true" />
        <div className="hero-copy" id="main-content">
          <p className="eyebrow">For Australian parents, carers and educators</p>
          <h1>
            The rule can be right.
            <em>The weather can still change.</em>
          </h1>
          <p className="hero-lead">
            Short animated stories that show how tone, timing and words may
            change what a child hears—then offer one useful next sentence that
            keeps the boundary.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#stories">
              Preview the stories
            </a>
            <a className="button button-secondary" href="#method">
              See how it works
            </a>
          </div>
          <p className="hero-note">
            Warm. Firm. Clear. Repairable. Written to adults; safe for shared
            viewing.
          </p>
        </div>

        <div className="hero-art" aria-label="The Words Have Weather cast">
          <div className="speech-card">
            <span className="tiny-weather" aria-hidden="true">☁</span>
            <p>Same boundary.</p>
            <strong>Different landing.</strong>
          </div>
          <img
            src="/character-lineup.png"
            alt="Willo with Mina, Leo, Zahra, Alex, Ms Chen and Arthur in a warm illustrated character lineup"
          />
        </div>
      </section>

      <section className="trust-strip" aria-label="Series format">
        <div><strong>35–45 sec</strong><span>one useful adult move</span></div>
        <div><strong>Every 2nd day</strong><span>15 shorts each month</span></div>
        <div><strong>Ages 4–12</strong><span>three developmental lenses</span></div>
        <div><strong>Adult-facing</strong><span>parents, carers and educators</span></div>
      </section>

      <section className="section method" id="method">
        <div className="section-heading">
          <p className="eyebrow">The repeatable story engine</p>
          <h2>One pressured moment. One useful next sentence.</h2>
          <p>
            Each short turns a familiar interaction into something an adult can
            recognise, remember and practise—without promising instant
            cooperation.
          </p>
        </div>
        <ol className="method-grid">
          <li>
            <span>01</span>
            <h3>Pressure</h3>
            <p>Open inside a real home or classroom moment.</p>
          </li>
          <li>
            <span>02</span>
            <h3>Weather</h3>
            <p>Willo shows what the words may sound or feel like.</p>
          </li>
          <li>
            <span>03</span>
            <h3>Pause</h3>
            <p>Keep the safety need, expectation or consequence.</p>
          </li>
          <li>
            <span>04</span>
            <h3>Next sentence</h3>
            <p>Try one clear, respectful replacement and a credible result.</p>
          </li>
        </ol>
        <aside className="safety-callout">
          <span aria-hidden="true">!</span>
          <p>
            <strong>Immediate danger?</strong> Use a short, direct safety
            instruction first. Reconnect and explain when everyone is safe.
          </p>
        </aside>
      </section>

      <section className="section pressure-section" id="real-moments">
        <div className="section-heading pressure-heading">
          <p className="eyebrow">The moments families keep meeting</p>
          <h2>Start with the pressure—not a perfect-parent fantasy.</h2>
          <p>
            Research tells us where the strain often gathers. Each story then
            narrows that broad theme to one ordinary moment, one possible child
            experience and one adult move worth practising.
          </p>
        </div>
        <div className="pressure-grid">
          {pressurePoints.map((point) => (
            <article className="pressure-card" key={point.number}>
              <header>
                <span>{point.number}</span>
                <h3>{point.moment}</h3>
              </header>
              <dl>
                <div>
                  <dt>The adult may be carrying</dt>
                  <dd>{point.adult}</dd>
                </div>
                <div>
                  <dt>The child may need</dt>
                  <dd>{point.child}</dd>
                </div>
              </dl>
              <p className="story-direction">{point.direction}</p>
            </article>
          ))}
        </div>
        <p className="interpretation-note">
          These are story lenses, not claims about an individual child. The
          same behaviour can have many explanations.
        </p>
      </section>

      <section className="section stories" id="stories">
        <div className="section-heading heading-row">
          <div>
            <p className="eyebrow">Story previews</p>
            <h2>Watch the weather change—not the boundary.</h2>
          </div>
          <p className="draft-note">Production drafts · review required before release</p>
        </div>

        <div className="story-grid">
          {stories.map((story) => (
            <article className={`story-card ${story.tone}`} key={story.id}>
              <div className="story-image">
                <img loading="lazy" src={story.image} alt={story.imageAlt} />
              </div>
              <header>
                <span>Episode {story.id}</span>
                <span>{story.context}</span>
              </header>
              <h3>{story.title}</h3>
              <div className="line-box pressure-line">
                <small>The pressure line</small>
                <blockquote>“{story.hook}”</blockquote>
              </div>
              <div className="weather-line">
                <span aria-hidden="true" />
                <p>{story.weather}</p>
              </div>
              <p className="story-principle">{story.principle}</p>
              <details>
                <summary>Reveal the next sentence</summary>
                <div className="next-sentence">
                  <small>Try instead</small>
                  <blockquote>“{story.next}”</blockquote>
                  <p>{story.end}</p>
                </div>
              </details>
            </article>
          ))}
        </div>
      </section>

      <section className="section emotion-section" id="emotions">
        <div className="emotion-image">
          <img
            loading="lazy"
            src="/stories/emotional-moments.webp"
            alt="Watercolour emotional studies of Mina disappointed, Leo uncertain, Zahra guarded, Alex reflective, Ms Chen attentive, Arthur listening and Willo observing"
          />
        </div>
        <div className="emotion-copy">
          <p className="eyebrow">Emotion is weather—not identity</p>
          <h2>A feeling can fill the moment without defining the person.</h2>
          <p>
            The characters are allowed to look disappointed, uncertain,
            guarded, worried or reflective. Willo shows one possible experience;
            nobody’s weather becomes a permanent character trait.
          </p>
          <ul className="emotion-notes" aria-label="Emotional storytelling principles">
            <li>No distressed face as clickbait</li>
            <li>No instant smile required</li>
            <li>No diagnosis from expression</li>
          </ul>
        </div>
      </section>

      <section className="section age-section" id="age-lenses">
        <div className="section-heading heading-row">
          <div>
            <p className="eyebrow">Same dignity · different development</p>
            <h2>Three age lenses keep the advice specific.</h2>
          </div>
          <p className="age-intro-note">
            Age is a starting point—not a test. Language, access, culture,
            neurodiversity and the individual child still matter.
          </p>
        </div>
        <div className="age-grid">
          {ageLenses.map((lens) => (
            <article key={lens.name}>
              <header>
                <span>{lens.ages}</span>
                <small>{lens.character}</small>
              </header>
              <h3>{lens.name}</h3>
              <p>{lens.summary}</p>
              <ul>
                {lens.topics.map((topic) => <li key={topic}>{topic}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section cast-section" id="characters">
        <div className="cast-intro">
          <p className="eyebrow">Meet the cast</p>
          <h2>Different ages. Different pressures. Shared dignity.</h2>
          <p>
            Willo guides the weather. Three children bring age-specific
            perspectives. The adults remain capable, imperfect and able to
            repair.
          </p>
        </div>
        <div className="lineup-frame">
          <img
            src="/character-lineup.png"
            alt="The seven Words Have Weather characters, from Willo through to Arthur"
          />
        </div>
        <div className="cast-grid">
          {cast.map(([name, role, description]) => (
            <article key={name}>
              <span className="cast-dot" aria-hidden="true" />
              <h3>{name}</h3>
              <p className="cast-role">{role}</p>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section pathways" id="educators">
        <div className="pathway-card family-path">
          <p className="eyebrow">For families</p>
          <h2>A sentence for the moment you’re actually in.</h2>
          <p>
            Home stories cover mornings, mess, strong feelings, homework,
            honesty, screens and adult repair—without expecting perfect
            parenting.
          </p>
          <a href="#resources">Open the parent workbook <span aria-hidden="true">→</span></a>
        </div>
        <div className="pathway-card teacher-path">
          <p className="eyebrow">For educators</p>
          <h2>Short discussion tools for real classrooms.</h2>
          <p>
            Teacher material focuses on clear directions, private correction,
            useful feedback and student dignity. Resources remain commercially
            neutral and require education review before release.
          </p>
          <a href="#resources">Open the educator worksheet <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className="section resources-section" id="resources">
        <div className="section-heading heading-row">
          <div>
            <p className="eyebrow">Season 1 · printable practice library</p>
            <h2>Take the story off-screen.</h2>
          </div>
          <p className="resource-sample-note">
            15 stories · 30 illustrated A4 resources · one shared reflection
            system for educators and families.
          </p>
        </div>

        <div className="resource-story-bridge">
          <div className="resource-bridge-image">
            <img
              loading="lazy"
              src="/stories/spill-repair.webp"
              alt="Mina and Alex begin cleaning spilled milk while Willo watches nearby"
            />
          </div>
          <div>
            <p className="eyebrow">The shared adult move</p>
            <blockquote>“Keep the clean-up. Lose the label.”</blockquote>
            <p>
              Every resource follows its short: notice the event, consider
              possible word-weather, keep the boundary or safety need, prepare
              one usable next sentence and know when more support is needed.
            </p>
          </div>
        </div>

        <div className="resource-library-heading">
          <div>
            <p className="eyebrow">Complete Season 1 collection</p>
            <h3>Choose the moment you are meeting now.</h3>
          </div>
          <p>
            Each episode includes a five-page educator worksheet and a six-page
            parent practice workbook.
          </p>
        </div>

        <div className="resource-library-grid">
          {seasonResources.map(([id, title, lens, skill]) => (
            <article className="resource-library-card" key={id}>
              <div className="resource-library-preview">
                <img
                  loading="lazy"
                  src={`/resources/episode-${id}-educator-worksheet-preview.webp`}
                  alt={`Cover preview for Episode ${id}, ${title}`}
                />
                <span>Episode {id}</span>
              </div>
              <div className="resource-library-copy">
                <p className="resource-audience">{lens}</p>
                <h3>{title}</h3>
                <p>{skill}</p>
                <div className="resource-actions">
                  <a
                    href={`/downloads/episode-${id}-educator-worksheet.pdf`}
                    download
                  >
                    <small>5 pages</small>
                    Educator PDF <span aria-hidden="true">↓</span>
                  </a>
                  <a
                    href={`/downloads/episode-${id}-parent-practice-workbook.pdf`}
                    download
                  >
                    <small>6 pages</small>
                    Parent PDF <span aria-hidden="true">↓</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="resource-review-note">
          <strong>Use with context</strong>
          <p>
            These resources offer general education for adults. Adapt language
            to the child, setting, culture, access needs and safety context.
            Curriculum links describe possible alignment—not endorsement.
          </p>
        </aside>
      </section>

      <section className="section shelf-section" id="story-shelf">
        <div className="section-heading heading-row">
          <div>
            <p className="eyebrow">Season 1 · complete story shelf</p>
            <h2>Every moment now has a practice pack.</h2>
          </div>
          <p className="shelf-note">
            Keep local educator, safeguarding, accessibility and claims review
            in the loop as the series grows.
          </p>
        </div>
        <div className="shelf-grid">
          {storyShelf.map(([id, title, takeaway]) => (
            <article key={id}>
              <span>Episode {id}</span>
              <h3>{title}</h3>
              <p>{takeaway}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section evidence-section" id="evidence">
        <div className="evidence-intro">
          <p className="eyebrow">Why these stories · evidence reviewed 24 August 2026</p>
          <h2>Research chooses the problem. A story makes one response usable.</h2>
          <p>
            We look for recurring Australian family and school pressures, then
            check each short against child voice, development, safety and the
            limits of the evidence. We do not turn a statistic into a diagnosis
            or a universal script.
          </p>
        </div>
        <div className="evidence-grid">
          {evidenceNotes.map((note) => (
            <article key={note.figure}>
              <strong>{note.figure}</strong>
              <h3>{note.title}</h3>
              <p>{note.text}</p>
              <a href={note.href} target="_blank" rel="noreferrer">
                Read the source: {note.source} <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
        <div className="evidence-footer">
          <p>
            Children’s social and emotional wellbeing is shaped by relationships
            across family, school and community—not by one sentence alone.
          </p>
          <a
            href="https://www.aihw.gov.au/reports/children-youth/australias-children/contents/health/social-emotional-wellbeing"
            target="_blank"
            rel="noreferrer"
          >
            Australian Institute of Health and Welfare source <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="section scope-section" aria-labelledby="scope-title">
        <div>
          <p className="eyebrow">Where a short story stops</p>
          <h2 id="scope-title">Some moments need more than a next sentence.</h2>
        </div>
        <div>
          <p>
            Persistent sleep difficulty, school distress, bullying, online
            harm, safety concerns or a marked change in wellbeing deserve
            context-specific support from the child’s school, GP or an
            appropriately qualified service.
          </p>
          <p>
            Words Have Weather offers general education for adults. It does not
            assess a child, replace professional care or promise that one phrase
            will produce cooperation.
          </p>
        </div>
      </section>

      <section className="section release" id="release">
        <div className="release-copy">
          <p className="eyebrow">Release rhythm</p>
          <h2>A useful story every second day.</h2>
          <p>
            Social channels help adults discover the work. The website holds
            the durable version: transcript, practical takeaway, source note
            and educator context.
          </p>
          <div className="release-metrics">
            <div><strong>15</strong><span>shorts per month</span></div>
            <div><strong>1</strong><span>weekly adult email</span></div>
            <div><strong>1</strong><span>monthly educator discussion clip</span></div>
          </div>
        </div>
        <div className="calendar-card" aria-label="Fourteen-day release cycle">
          {[1, 3, 5, 7, 9, 11, 13].map((day, index) => (
            <div key={day}>
              <span>Day {day}</span>
              <strong>{["Home", "Classroom", "Trail", "Repair", "Horizon", "Safety", "Feedback"][index]}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="closing">
        <div>
          <p className="eyebrow">Try the next sentence</p>
          <h2>You do not need to be a perfect adult to repair the weather.</h2>
        </div>
        <a className="button button-light" href="#stories">
          Preview a story
        </a>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>Words Have Weather<small>Keep the boundary. Change the weather.</small></span>
        </a>
        <p>
          General educational information for adults—not individual advice.
          Working title and production concept; not yet a published service.
        </p>
        <p>Australian English · Adult-facing · Commercially neutral stories</p>
      </footer>
    </main>
  );
}
