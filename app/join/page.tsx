import Image from "next/image";
import type { Metadata } from "next";
import { getChatGPTUser } from "../chatgpt-auth";
import { getMember } from "@/db/episode-state";
import { MemberSignupForm } from "../components/MemberSignupForm";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Join free for educational workbooks", description: "Create a direct free Words Have Weather membership with no GitHub or ChatGPT sign-in.", alternates: { canonical: "/join" } };

function safeReturnTo(value: string | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/episodes";
  return value;
}

export default async function JoinPage({ searchParams }: { searchParams: Promise<{ return_to?: string }> }) {
  const params = await searchParams;
  const returnTo = safeReturnTo(params.return_to);
  const user = await getChatGPTUser();
  const member = user ? await getMember(user.userId).catch(() => null) : null;
  const names = (user?.fullName ?? "").trim().split(/\s+/);
  const defaultFirstName = member?.first_name ?? names[0] ?? "";
  const defaultLastName = member?.last_name ?? names.slice(1).join(" ") ?? "";

  return (
    <main>
      <SiteHeader />
      <section className="signup-shell">
        <div className="signup-story">
          <p className="eyebrow">Free educational membership</p>
          <h1>Join once.<em>Use every released workbook.</em></h1>
          <p>Membership keeps the resources free, helps us understand who the library serves and gives you a clear education-use agreement.</p>
          <ul><li>120 episode previews remain free to browse</li><li>Parent and educator PDFs unlock after joining</li><li>Release updates are optional</li><li>No GitHub or ChatGPT sign-in</li></ul>
          <div className="signup-illustrations" aria-label="Story moments from the Words Have Weather library">
            <Image src="/episodes/episode-001-hero.webp" width={900} height={600} alt="Mina and Willo pause during a rushed transition" />
            <Image src="/episodes/episode-046-hero.webp" width={900} height={600} alt="A calm adult and child practise a clearer next sentence" />
          </div>
        </div>
        <div className="signup-panel">
          <p className="eyebrow">{member ? "Your membership" : "Free and direct"}</p>
          <h2>{member ? "Review your details." : "Create your free membership."}</h2>
          <p>Enter your details here. There is no social login and no extra account layer.</p>
          <MemberSignupForm
            defaultFirstName={defaultFirstName}
            defaultLastName={defaultLastName}
            defaultEmail={member?.email ?? user?.email ?? ""}
            defaultUpdatesOptIn={Boolean(member?.updates_opt_in)}
            returnTo={returnTo}
            existing={Boolean(member)}
          />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
