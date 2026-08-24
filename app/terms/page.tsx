import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export default function TermsPage() {
  return (
    <main>
      <SiteHeader />
      <article className="terms-page">
        <p className="eyebrow">Education-use terms</p>
        <h1>Free to teach with.<em>Careful about context.</em></h1>
        <p className="terms-lead">Last updated 24 August 2026</p>
        <section><h2>Permitted educational use</h2><p>Members may download, print and use Words Have Weather resources with families, staff groups and learners for non-commercial education, reflection and discussion. You may adapt spoken prompts to age, language, culture, access needs and local safety procedures.</p></section>
        <section><h2>What the resources are not</h2><p>The stories and workbooks provide general educational information for adults. They do not assess or diagnose a child, replace professional care, constitute individual advice or promise that one phrase will produce cooperation.</p></section>
        <section><h2>Safeguarding and privacy</h2><p>Do not require children or colleagues to disclose private family experiences, harm or distress in a public activity. Follow local safeguarding, incident, privacy and mandatory-reporting procedures. Offer a private or opt-out response route.</p></section>
        <section><h2>Curriculum descriptions</h2><p>Curriculum references identify possible planning connections only. They do not imply approval, endorsement or a complete curriculum program. Educators remain responsible for local planning, review and accessibility.</p></section>
        <section><h2>Membership information</h2><p>We collect the name, email, education-use acceptance and optional update preference supplied at sign-up. Release emails are optional and may be unsubscribed from. Membership information is used to provide and improve the free educational library.</p></section>
        <section><h2>Not permitted</h2><p>Do not sell the files, remove authorship or safety notices, present them as clinical advice, use them to assess an individual child, or imply government endorsement. Contact the project before redistributing a modified public edition.</p></section>
      </article>
      <SiteFooter />
    </main>
  );
}
