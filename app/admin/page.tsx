import { redirect } from "next/navigation";
import { episodes } from "@/data/episodes";
import { getChatGPTUser } from "../chatgpt-auth";
import { isAdmin } from "../admin-access";
import { AdminConsole } from "../components/AdminConsole";
import { EmailEngagementPanel } from "../components/EmailEngagementPanel";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { SiteNoticeAdmin } from "../components/SiteNoticeAdmin";
import { loadEpisodeOverrides } from "@/db/episode-state";

export const dynamic = "force-dynamic";

async function AdminBody() {
  const user = await getChatGPTUser();
  if (!isAdmin(user)) redirect("/admin/login");
  const initialOverrides = await loadEpisodeOverrides();
  return <AdminConsole episodes={episodes} initialOverrides={initialOverrides} today={new Date().toISOString().slice(0, 10)} />;
}

export default function AdminPage() {
  return (
    <main className="admin-page">
      <SiteHeader />
      <section className="page-hero admin-hero">
        <p className="eyebrow">Owner release console</p>
        <h1>Plan the journey.<em>Control every release.</em></h1>
        <p>Preview first, review the learning record, then enable, pause, remove or reschedule. Select any filtered group to download complete educator, parent, artwork and metadata packs.</p>
      </section>
      <section className="admin-workflow" aria-label="Content management workflow">
        <article><span>01</span><div><strong>Content record</strong><p>Story preview, age lens, learning stage, key learning, framework mapping and both resource files stay together.</p></div></article>
        <article><span>02</span><div><strong>Human review gate</strong><p>Education, safeguarding, accessibility and claims review remain visible work—not an automatic publishing status.</p></div></article>
        <article><span>03</span><div><strong>Release control</strong><p>Set the date and status here. Removed items leave the public library but remain recoverable in the project.</p></div></article>
      </section>
      <section className="admin-shell"><SiteNoticeAdmin /><AdminBody /><EmailEngagementPanel /></section>
      <SiteFooter />
    </main>
  );
}
