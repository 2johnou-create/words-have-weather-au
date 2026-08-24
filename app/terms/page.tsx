import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = { title: "Education-use terms", description: "Permitted educational use, safeguarding, curriculum, privacy and email preference terms for Words Have Weather.", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <main>
      <SiteHeader />
      <article className="terms-page">
        <Image className="terms-illustration" src="/episodes/episode-103-hero.webp" width={900} height={600} priority alt="Willo and Arthur share a quiet moment of reflection about responsible educational use" />
        <p className="eyebrow">Education-use terms</p>
        <h1>Free to teach with.<em>Careful about context.</em></h1>
        <p className="terms-lead">Last updated 25 August 2026</p>
        <section><h2>Permitted educational use</h2><p>Members may download, print and use Words Have Weather resources with families, staff groups and learners for non-commercial education, reflection and discussion. You may adapt spoken prompts to age, language, culture, access needs and local safety procedures.</p></section>
        <section><h2>What the resources are not</h2><p>The stories and workbooks provide general educational information for adults. They do not assess or diagnose a child, replace professional care, constitute individual advice or promise that one phrase will produce cooperation.</p></section>
        <section><h2>Safeguarding and privacy</h2><p>Do not require children or colleagues to disclose private family experiences, harm or distress in a public activity. Follow local safeguarding, incident, privacy and mandatory-reporting procedures. Offer a private or opt-out response route.</p></section>
        <section><h2>Curriculum descriptions</h2><p>Curriculum references identify possible planning connections only. They do not imply approval, endorsement or a complete curriculum program. Educators remain responsible for local planning, review and accessibility.</p></section>
        <section><h2>Membership information</h2><p>We collect the name, email, education-use acceptance and optional update preference supplied at sign-up. Release emails are optional and may be unsubscribed from. Membership information is used to provide and improve the free educational library.</p></section>
        <section><h2>Email choices</h2><p>A transactional welcome confirms a new membership. Optional learning updates include one weekly episode highlight and one combined monthly learning and release note, sent on the last day of the month. Every optional message includes an unsubscribe link; unsubscribing does not remove workbook access.</p></section>
        <section><h2>Not permitted</h2><p>Do not sell the files, remove authorship or safety notices, present them as clinical advice, use them to assess an individual child, or imply government endorsement. Contact the project before redistributing a modified public edition.</p></section>
      </article>
      <SiteFooter />
    </main>
  );
}
