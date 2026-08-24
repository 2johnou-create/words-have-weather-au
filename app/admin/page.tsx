import { notFound } from "next/navigation";
import { episodes } from "@/data/episodes";
import { requireChatGPTUser } from "../chatgpt-auth";
import { isAdmin } from "../admin-access";
import { AdminConsole } from "../components/AdminConsole";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { loadEpisodeOverrides } from "@/db/episode-state";

export const dynamic = "force-dynamic";

async function AdminBody() {
  const user = await requireChatGPTUser("/admin");
  if (!isAdmin(user)) notFound();
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
        <p>Enable, pause, remove or reschedule episodes. Select any filtered group to download complete educator, parent, preview and metadata packs.</p>
      </section>
      <section className="admin-shell"><AdminBody /></section>
      <SiteFooter />
    </main>
  );
}
