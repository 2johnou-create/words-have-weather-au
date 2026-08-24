import Image from "next/image";

export function IllustratedMoments({ eyebrow, title, items }: { eyebrow: string; title: string; items: Array<{ code: string; label: string; alt: string }> }) {
  return (
    <section className="section illustrated-moments">
      <div className="section-heading"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>
      <div className="illustrated-moment-grid">
        {items.map((item) => <a href={`/episodes/${item.code}`} target="_top" key={item.code}>
          <Image src={`/episodes/episode-${item.code}-hero.webp`} width={900} height={600} sizes="(max-width: 720px) 90vw, 29vw" alt={item.alt} />
          <span><small>Episode {item.code}</small><strong>{item.label}</strong></span>
        </a>)}
      </div>
    </section>
  );
}
