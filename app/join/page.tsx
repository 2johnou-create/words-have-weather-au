import { chatGPTSignInPath, getChatGPTUser } from "../chatgpt-auth";
import { getMember } from "@/db/episode-state";
import { MemberSignupForm } from "../components/MemberSignupForm";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const dynamic = "force-dynamic";

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
          <ul><li>120 episode previews remain free to browse</li><li>Parent and educator PDFs unlock after joining</li><li>Release updates are optional</li></ul>
        </div>
        <div className="signup-panel">
          {!user ? (
            <>
              <p className="eyebrow">Step 1 of 2</p>
              <h2>Confirm who you are.</h2>
              <p>Use the secure ChatGPT sign-in, then complete your name, email and educational-use agreement. Words Have Weather does not receive your ChatGPT password.</p>
              <a className="button button-primary" href={chatGPTSignInPath(`/join?return_to=${encodeURIComponent(returnTo)}`)} target="_top">Continue with ChatGPT</a>
              <small>Already signed in? The next page opens automatically.</small>
            </>
          ) : (
            <>
              <p className="eyebrow">{member ? "Your membership" : "Step 2 of 2"}</p>
              <h2>{member ? "Review your details." : "Create your free account."}</h2>
              <MemberSignupForm
                defaultFirstName={defaultFirstName}
                defaultLastName={defaultLastName}
                defaultEmail={member?.email ?? user.email}
                defaultUpdatesOptIn={Boolean(member?.updates_opt_in)}
                returnTo={returnTo}
                existing={Boolean(member)}
              />
            </>
          )}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
