import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Words Have Weather home">
        <span className="brand-mark" aria-hidden="true"><span /></span>
        <span>Words Have Weather<small>Australian education media</small></span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/episodes">120 episodes</Link>
        <Link href="/journey">Learning journey</Link>
        <Link href="/journey?audience=parents">For parents</Link>
        <Link href="/journey?audience=educators">For educators</Link>
        <Link className="nav-cta" href="/join">Join free</Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link className="brand footer-brand" href="/">
        <span className="brand-mark" aria-hidden="true"><span /></span>
        <span>Words Have Weather<small>Keep the boundary. Change the weather.</small></span>
      </Link>
      <p>
        General educational information for adults, not individual advice.
        Curriculum links describe possible connections, not approval or endorsement.
      </p>
      <div className="footer-links">
        <Link href="/terms">Education-use terms</Link>
        <Link href="/admin">Admin</Link>
      </div>
    </footer>
  );
}
