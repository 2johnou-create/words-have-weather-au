"use client";

import { useState } from "react";

export function UnsubscribeForm({ token }: { token: string }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function unsubscribe() {
    setBusy(true);
    const response = await fetch("/api/email/unsubscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }) });
    const payload = await response.json() as { error?: string };
    setBusy(false);
    setMessage(response.ok ? "You have been unsubscribed from learning updates." : payload.error ?? "We could not update your preference.");
  }
  return <><button className="button button-primary" type="button" disabled={busy || !token} onClick={() => void unsubscribe()}>{busy ? "Updating…" : "Unsubscribe from learning emails"}</button><p className="form-status" role="status">{message}</p></>;
}
