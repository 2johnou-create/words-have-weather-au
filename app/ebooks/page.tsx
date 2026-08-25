import type { Metadata } from "next";
import Image from "next/image";
import { ebooksByCategory } from "@/data/ebooks";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Story eBooks for shared reading",
  description: "Explore six illustrated Words Have Weather Story eBooks for iPad, home and classroom reading across Sprout, All Ages and Trail.",
  alternates: { canonical: "/ebooks" },
};

const categoryCopy = {
  Sprout: "Short, concrete stories for early shared reading, with one boundary and one next sentence.",
  "All Ages": "Family and classroom moments that invite children and adults to notice the same weather together.",
  Trail: "Deeper stories about participation, repair, digital meaning, dignity and the right to need time.",
};

export default function EbooksPage() {
  return (
    <main>
      <a className="skip-link" href="#ebook-library">Skip to Story eBooks</a>
      <SiteHeader />
      <section className="page-hero ebook-hero page-hero-with-art">
        <div className="page-hero-copy">
          <p className="eyebrow">New · Story eBooks</p>
          <h1>A story gives the next sentence <em>somewhere to live.</em></h1>
          <p>Children rarely learn useful language from a rule alone. These richly illustrated stories let an adult and child notice the pressure, watch the weather change and rehearse one practical move together.</p>
          <div className="hero-actions"><a className="button button-primary" href="#ebook-library">Open the six-book launch shelf</a><a className="button button-secondary" href="/join" target="_top">Join free for education editions</a></div>
        </div>
        <div className="page-hero-art ebook-hero-art"><Image src="/ebooks/art/zahra-and-the-group-chat-storm/scene-06.jpg" width={520} height={430} sizes="(max-width: 900px) 92vw, 42vw" alt="Zahra, Leo, Arthur and Willo sharing a calmer conversation around a library table" priority /></div>
      </section>

      <section className="section ebook-why">
        <div className="section-heading heading-row"><div><p className="eyebrow">Why read the weather?</p><h2>The page creates a pause real life often cannot.</h2></div><p>Adults can stop before the pressure line, ask what might land and turn the page only when the child is ready. The story holds the complexity without putting a real child on display.</p></div>
        <div className="ebook-benefit-grid">
          <article><span>01</span><h3>See it</h3><p>Illustrations make pace, posture and possible word-weather visible without claiming to know exactly what a character feels.</p></article>
          <article><span>02</span><h3>Say it</h3><p>Each story places the pressure line beside one clearer next sentence, so adults can hear the practical difference.</p></article>
          <article><span>03</span><h3>Try it</h3><p>The final adult page turns the story into low-pressure discussion, drawing, role-play and rehearsal ideas.</p></article>
        </div>
      </section>

      <section className="section ebook-format-note">
        <div><p className="eyebrow">Built for iPad and shared reading</p><h2>Big art. Live text. Twelve purposeful pages.</h2></div>
        <div><p>Use the touch-friendly web reader now. Member education editions include a landscape PDF and fixed-layout EPUB 3 master with selectable text, image descriptions and a consistent adult-notes page.</p><p>The same EPUB master is prepared for Kindle Previewer and Amazon KDP quality review. The free education edition remains outside KDP Select exclusivity.</p></div>
      </section>

      <section className="section ebook-library" id="ebook-library">
        <div className="section-heading"><p className="eyebrow">Six-book launch shelf</p><h2>Two stories at every depth.</h2><p>Start with the pathway that fits the moment, not the most advanced language.</p></div>
        {ebooksByCategory.map((group) => (
          <section className={`ebook-category ebook-category-${group.category.toLowerCase().replaceAll(" ", "-")}`} key={group.category} aria-labelledby={`ebook-${group.category.replaceAll(" ", "-")}`}>
            <div className="ebook-category-heading"><div><p className="eyebrow">{group.category}</p><h2 id={`ebook-${group.category.replaceAll(" ", "-")}`}>{group.category} Story eBooks</h2></div><p>{categoryCopy[group.category]}</p></div>
            <div className="ebook-grid">
              {group.books.map((book) => (
                <article className="ebook-card" key={book.slug}>
                  <a className="ebook-card-cover" href={`/ebooks/${book.slug}`} target="_top" aria-label={`Read ${book.title}`}>
                    <Image src={book.pages[0].image} width={520} height={430} sizes="(max-width: 760px) 92vw, 42vw" alt={book.pages[0].imageAlt} />
                    <span>{book.category} · Ages {book.ages}</span>
                  </a>
                  <div className="ebook-card-copy"><p className="eyebrow">{book.characters.join(" · ")}</p><h3><a href={`/ebooks/${book.slug}`} target="_top">{book.title}</a></h3><blockquote>{book.hook}</blockquote><p>{book.blurb}</p><div className="ebook-card-actions"><a className="button button-primary" href={`/ebooks/${book.slug}`} target="_top">Read on iPad</a><span>12 pages · illustrated · adult notes</span></div></div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}
