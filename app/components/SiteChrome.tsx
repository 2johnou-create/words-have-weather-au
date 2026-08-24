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
      <a className="brand footer-brand" href="/" target="_top">
        <span className="brand-mark" aria-hidden="true"><span /></span>
        <span>Words Have Weather<small>Keep the boundary. Change the weather.</small></span>
      </a>
      <p>
        General educational information for adults, not individual advice.
        Curriculum links describe possible connections, not approval or endorsement.
      </p>
      <div className="footer-links">
        <a href="/terms" target="_top">Education-use terms</a>
        <a href="/admin" target="_top">Admin</a>
      </div>
    </footer>
  );
}
