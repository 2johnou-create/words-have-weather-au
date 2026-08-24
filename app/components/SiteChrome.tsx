import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/" target="_top" aria-label="Words Have Weather home">
        <span className="brand-mark" aria-hidden="true"><span /></span>
        <span>Words Have Weather<small>Australian education media</small></span>
      </a>
      <nav aria-label="Main navigation">
        <a href="/#how-it-works" target="_top">How it works</a>
        <a href="/episodes" target="_top">Stories</a>
        <a href="/parents" target="_top">Parents</a>
        <a href="/educators" target="_top">Educators</a>
        <a href="/journey" target="_top">Learning map</a>
        <a className="nav-cta" href="/join" target="_top">Join free</a>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-story">
        <a className="brand footer-brand" href="/" target="_top">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>Words Have Weather<small>Keep the boundary. Change the weather.</small></span>
        </a>
        <p>Short, illustrated communication stories for Australian parents, carers and educators.</p>
        <Image src="/character-lineup.png" width={1280} height={720} sizes="(max-width: 760px) 90vw, 330px" alt="Willo, Mina, Leo, Zahra, Alex, Ms Chen and Arthur together" />
      </div>
      <nav className="footer-sitemap" aria-label="Footer sitemap">
        <div><strong>Understand</strong><a href="/" target="_top">Home</a><a href="/#how-it-works" target="_top">How words change weather</a><a href="/#weather-shift" target="_top">Try a next sentence</a></div>
        <div><strong>Explore</strong><a href="/episodes" target="_top">All 120 stories</a><a href="/journey" target="_top">Learning journey</a><a href="/parents" target="_top">For parents</a><a href="/educators" target="_top">For educators</a></div>
        <div><strong>Resources</strong><a href="/join" target="_top">Join free</a><a href="/episodes?category=Sprout" target="_top">Sprout</a><a href="/episodes?category=All%20Ages" target="_top">All Ages</a><a href="/episodes?category=Trail" target="_top">Trail</a></div>
        <div><strong>Project</strong><a href="/terms" target="_top">Education-use terms</a><a href="/robots.txt" target="_top">Robots</a><a href="/sitemap.xml" target="_top">XML sitemap</a><a href="/admin/login" target="_top">Admin</a></div>
      </nav>
      <div className="footer-legal">
        <p>General educational information for adults, not individual advice. Curriculum links describe possible connections, not approval or endorsement.</p>
        <span>© {new Date().getFullYear()} Words Have Weather · Australia</span>
      </div>
    </footer>
  );
}
