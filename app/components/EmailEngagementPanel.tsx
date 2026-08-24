"use client";

import { useEffect, useState } from "react";

type Status = {
  providerConfigured: boolean;
  from: string | null;
  members: number;
  subscribers: number;
  outbox: Record<string, number>;
  cadence: { weekly: string; monthly: string };
};

export function EmailEngagementPanel() {
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/admin/email", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json() as Status & { error?: string };
        if (!response.ok) throw new Error(payload.error ?? "Could not load engagement status.");
        setStatus(payload);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load engagement status."));
  }, []);
  return (
    <section className="email-admin-panel" aria-labelledby="email-engagement-heading">
      <div><p className="eyebrow">Engagement journey</p><h2 id="email-engagement-heading">Useful emails, never a noisy sales funnel.</h2><p>Every new member receives a welcome. People who actively opt in receive one weekly episode practice and one combined monthly learning-and-release note.</p></div>
      {status ? <div className="email-status-grid">
        <article><strong>{status.members}</strong><span>members</span></article>
        <article><strong>{status.subscribers}</strong><span>opted in</span></article>
        <article><strong>{status.outbox.queued ?? 0}</strong><span>queued</span></article>
        <article className={status.providerConfigured ? "provider-live" : "provider-pending"}><strong>{status.providerConfigured ? "Connected" : "Ready to connect"}</strong><span>{status.from ?? "Verified sender needed"}</span></article>
      </div> : <p className="admin-message">{error || "Loading email status…"}</p>}
      <div className="email-cadence"><span><strong>Weekly highlight</strong>{status?.cadence.weekly ?? "Monday morning (Australia/Sydney)"}</span><span><strong>Monthly note + next releases</strong>{status?.cadence.monthly ?? "Last day of each month"}</span></div>
    </section>
  );
}
