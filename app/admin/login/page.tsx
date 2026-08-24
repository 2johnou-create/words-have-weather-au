import Image from "next/image";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { isAdmin } from "@/app/admin-access";
import { AdminLoginForm } from "@/app/components/AdminLoginForm";
import { SiteFooter, SiteHeader } from "@/app/components/SiteChrome";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Administrator login", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  if (isAdmin(await getChatGPTUser())) redirect("/admin");
  return (
    <main>
      <SiteHeader />
      <section className="admin-login-shell">
        <div className="admin-login-art">
          <Image src="/episodes/episode-111-hero.webp" width={900} height={600} priority alt="Arthur, Willo and the story cast pause together before choosing a wise next sentence" />
          <div><p className="eyebrow">Private owner area</p><h1>Careful stories.<em>Clear release control.</em></h1><p>The public website never needs this login. It is only for the private release, resource and engagement console.</p></div>
        </div>
        <div className="admin-login-panel">
          <p className="eyebrow">Administrator login</p>
          <h2>Welcome back.</h2>
          <AdminLoginForm />
          <small>Your password is checked against a one-way security record and is never stored in the website code.</small>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
