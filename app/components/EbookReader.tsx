"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Ebook } from "@/data/ebooks";

export function EbookReader({ book }: { book: Ebook }) {
  const [pageIndex, setPageIndex] = useState(0);
  const page = book.pages[pageIndex];

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") setPageIndex((index) => Math.max(0, index - 1));
      if (event.key === "ArrowRight") setPageIndex((index) => Math.min(book.pages.length - 1, index + 1));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [book.pages.length]);

  function goTo(index: number) {
    setPageIndex(Math.max(0, Math.min(book.pages.length - 1, index)));
  }

  return (
    <section className="ebook-reader" aria-label={`${book.title} tablet reader`}>
      <div className={`ebook-page ebook-page-${page.kind}`} aria-live="polite">
        <div className="ebook-page-art">
          <Image
            key={page.image}
            src={page.image}
            alt={page.imageAlt}
            width={520}
            height={430}
            sizes="(max-width: 900px) 100vw, 60vw"
            priority={pageIndex === 0}
          />
        </div>
        <div className="ebook-page-copy">
          {page.kicker ? <p className="eyebrow">{page.kicker}</p> : null}
          <h2>{page.title}</h2>
          <p>{page.text}</p>
          <span className="ebook-page-number">{page.pageNumber} / {book.pages.length}</span>
        </div>
      </div>
      <div className="ebook-reader-controls">
        <button type="button" onClick={() => goTo(pageIndex - 1)} disabled={pageIndex === 0} aria-label="Previous page">← Previous</button>
        <div className="ebook-progress" aria-label={`Page ${page.pageNumber} of ${book.pages.length}`}>
          {book.pages.map((item, index) => (
            <button
              key={item.pageNumber}
              type="button"
              className={index === pageIndex ? "active" : ""}
              onClick={() => goTo(index)}
              aria-label={`Open page ${item.pageNumber}`}
              aria-current={index === pageIndex ? "page" : undefined}
            />
          ))}
        </div>
        <button type="button" onClick={() => goTo(pageIndex + 1)} disabled={pageIndex === book.pages.length - 1} aria-label="Next page">Next →</button>
      </div>
      <p className="ebook-reader-hint">Tap the page controls or use the left and right arrow keys. The final page contains the adult learning notes.</p>
    </section>
  );
}
