import { SiteFooter, SiteHeader } from "@/app/components/SiteChrome";
import { UnsubscribeForm } from "@/app/components/UnsubscribeForm";

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  return <main><SiteHeader /><section className="simple-status-page"><p className="eyebrow">Email preferences</p><h1>Choose your weather.<em>Your inbox is yours.</em></h1><p>This stops the weekly episode highlight and monthly release note. Your free educational membership and workbook access remain available.</p><UnsubscribeForm token={token} /></section><SiteFooter /></main>;
}
