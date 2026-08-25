import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ebooks, getEbook } from "@/data/ebooks";
import { getMember } from "@/db/episode-state";
import { isAdmin } from "@/app/admin-access";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { EbookReader } from "@/app/components/EbookReader";
import { SiteFooter, SiteHeader } from "@/app/components/SiteChrome";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return ebooks.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const book = getEbook((await params).slug);
  if (!book) return { title: "Story eBook not found" };
  return {
    title: book.title,
    description: `${book.hook} ${book.blurb}`,
    alternates: { canonical: `/ebooks/${book.slug}` },
    openGraph: { title: `${book.title} | Words Have Weather`, description: book.blurb, type: "book", images: [{ url: book.pages[0].image, width: 520, height: 430, alt: book.pages[0].imageAlt }] },
  };
}

export default async function EbookPage({ params }: { params: Promise<{ slug: string }> }) {
  const book = getEbook((await params).slug);
  if (!book) notFound();
  const user = await getChatGPTUser();
  const member = user ? await getMember(user.userId).catch(() => null) : null;
  const canDownload = Boolean(member) || isAdmin(user);

  return (
    <main>
      <a className="skip-link" href="#reader">Skip to eBook reader</a>
      <SiteHeader />
      <article className="ebook-detail">
        <header className="ebook-detail-header">
          <a className="episode-back-link" href="/ebooks" target="_top">← All Story eBooks</a>
          <p className="eyebrow">{book.category} · Ages {book.ages} · {book.characters.join(" · ")}</p>
          <h1>{book.title}</h1>
          <blockquote>{book.hook}</blockquote>
          <p>{book.blurb}</p>
          <div className="category-counts"><span>12 illustrated pages</span><span>Touch-friendly reader</span><span>Adult notes on final page</span><span>PDF + EPUB 3</span></div>
        </header>
        <div id="reader"><EbookReader book={book} /></div>

        <section className="ebook-learning-panel">
          <div><p className="eyebrow">Key message</p><h2>{book.keyMessage}</h2></div>
          <div><h3>Learning focus</h3><ul>{book.learningFocus.map((item) => <li key={item}>{item}</li>)}</ul><h3>Possible framework connections</h3><ul>{book.curriculum.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </section>

        <section className="ebook-download-panel">
          <div><p className="eyebrow">Education editions</p><h2>Keep the story ready for your next shared-reading moment.</h2><p>The landscape PDF is designed for classroom display and printing. The fixed-layout EPUB 3 is designed for iPad and is the master format for Kindle quality review.</p></div>
          <div className="ebook-download-actions">
            {canDownload ? <><a className="button button-primary" href={book.pdfPath}>Download landscape PDF</a><a className="button button-secondary" href={book.epubPath}>Download EPUB 3</a></> : <><a className="button button-primary" href={`/join?return_to=${encodeURIComponent(book.pdfPath)}`} target="_top">Join free to download</a><span>No payment. Education-use terms apply.</span></>}
          </div>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
