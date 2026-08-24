import Image from "next/image";
import { episodes } from "@/data/episodes";
import { JourneyExplorer } from "../components/JourneyExplorer";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export default async function JourneyPage({
  searchParams,
}: {
  searchParams: Promise<{ audience?: string }>;
}) {
  const params = await searchParams;
  const initialAudience = params.audience === "educators" ? "educators" : "parents";
  return (
    <main>
      <a className="skip-link" href="#journey-tool">Skip to learning journey tool</a>
      <SiteHeader />
      <section className="page-hero journey-hero page-hero-with-art">
        <div className="page-hero-copy">
          <p className="eyebrow">For parents, carers and educators</p>
          <h1>See the learning.<em>Choose the right depth.</em></h1>
          <p>This eight-stage map shows what each group of episodes practises, how the learning grows and where it may connect with Australian curriculum frameworks.</p>
        </div>
        <div className="page-hero-art">
          <Image src="/stories/emotional-moments.webp" width={1672} height={941} sizes="(max-width: 760px) 100vw, 42vw" priority alt="The Words Have Weather characters noticing different emotional weather with Willo nearby" />
        </div>
      </section>
      <section className="section journey-section" id="journey-tool">
        <JourneyExplorer episodes={episodes} initialAudience={initialAudience} />
      </section>
      <section className="section curriculum-sources">
        <div><p className="eyebrow">Curriculum language</p><h2>Possible connections, not a packaged curriculum.</h2></div>
        <div>
          <p>Educators should select only the framework elements genuinely addressed in their local learning design. These links do not imply government approval, mandate or endorsement.</p>
          <ul>
            <li><a href="https://v9.australiancurriculum.edu.au/curriculum-information/understand-this-general-capability/personal-and-social-capability" target="_blank" rel="noreferrer">Australian Curriculum v9.0: Personal and Social capability</a></li>
            <li><a href="https://v9.australiancurriculum.edu.au/curriculum-information/understand-this-learning-area/health-and-physical-education" target="_blank" rel="noreferrer">Australian Curriculum v9.0: Health and Physical Education</a></li>
            <li><a href="https://www.acecqa.gov.au/sites/default/files/2023-01/EYLF-2022-V2.0.pdf" target="_blank" rel="noreferrer">Early Years Learning Framework V2.0</a></li>
          </ul>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
