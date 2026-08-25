"use client";

import { useEffect, useState } from "react";
import type { SiteNotice } from "@/db/site-notice";

const emptyNotice: SiteNotice = { id: "main", enabled: true, message: "", linkLabel: "", linkHref: "", tone: "sage", startsAt: "", endsAt: "", updatedAt: "" };

function toLocalInput(value: string) {
  return value ? value.slice(0, 16) : "";
}

export function SiteNoticeAdmin() {
  const [notice, setNotice] = useState<SiteNotice>(emptyNotice);
  const [message, setMessage] = useState("Loading notification...");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void fetch("/api/admin/notice", { cache: "no-store" })
      .then(async (response) => ({ response, payload: await response.json() as { notice?: SiteNotice; error?: string } }))
      .then(({ response, payload }) => {
        if (!response.ok) throw new Error(payload.error ?? "Could not load the notification.");
        if (payload.notice) setNotice(payload.notice);
        setMessage("Changes appear at the very top of every public page.");
      })
      .catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Could not load the notification."));
  }, []);

  async function save() {
    setBusy(true);
    setMessage("Saving notification...");
    const response = await fetch("/api/admin/notice", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(notice) });
    const payload = await response.json() as { notice?: SiteNotice; error?: string };
    setBusy(false);
    if (!response.ok) { setMessage(payload.error ?? "The notification could not be saved."); return; }
    if (payload.notice) setNotice(payload.notice);
    setMessage("Notification saved. New visitors will see the updated message.");
  }

  return (
    <section className="notice-admin-panel">
      <div><p className="eyebrow">Top-of-site notification</p><h2>Make one timely message visible everywhere.</h2><p>Use this for a new Story eBook, an important release or a short education update. Keep it useful and brief.</p></div>
      <div className="notice-admin-form">
        <label className="notice-message-field"><span>Message</span><input maxLength={180} value={notice.message} onChange={(event) => setNotice({ ...notice, message: event.target.value })} placeholder="Six illustrated Story eBooks are ready to read." /></label>
        <label><span>Link label</span><input maxLength={48} value={notice.linkLabel} onChange={(event) => setNotice({ ...notice, linkLabel: event.target.value })} placeholder="Explore Story eBooks" /></label>
        <label><span>Link</span><input value={notice.linkHref} onChange={(event) => setNotice({ ...notice, linkHref: event.target.value })} placeholder="/ebooks" /></label>
        <label><span>Tone</span><select value={notice.tone} onChange={(event) => setNotice({ ...notice, tone: event.target.value as SiteNotice["tone"] })}><option value="sage">Sage</option><option value="sun">Sun</option><option value="terracotta">Terracotta</option></select></label>
        <label><span>Starts (optional)</span><input type="datetime-local" value={toLocalInput(notice.startsAt)} onChange={(event) => setNotice({ ...notice, startsAt: event.target.value ? new Date(event.target.value).toISOString() : "" })} /></label>
        <label><span>Ends (optional)</span><input type="datetime-local" value={toLocalInput(notice.endsAt)} onChange={(event) => setNotice({ ...notice, endsAt: event.target.value ? new Date(event.target.value).toISOString() : "" })} /></label>
        <label className="notice-enabled"><input type="checkbox" checked={notice.enabled} onChange={(event) => setNotice({ ...notice, enabled: event.target.checked })} /><span>Show this notification</span></label>
        <button className="button button-primary" type="button" disabled={busy || notice.message.trim().length < 3} onClick={() => void save()}>{busy ? "Saving..." : "Save notification"}</button>
      </div>
      <p className="admin-message" role="status">{message}</p>
    </section>
  );
}
