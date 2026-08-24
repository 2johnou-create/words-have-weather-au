"use client";

import { FormEvent, useState } from "react";

export function AdminLoginForm() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    const payload = await response.json() as { error?: string };
    if (!response.ok) {
      setBusy(false);
      setMessage(payload.error ?? "Login failed. Please try again.");
      return;
    }
    window.location.assign("/admin");
  }

  return (
    <form className="admin-login-form" onSubmit={submit}>
      <label><span>Email</span><input name="email" type="email" autoComplete="username" required /></label>
      <label><span>Password</span><input name="password" type="password" autoComplete="current-password" required /></label>
      <button className="button button-primary" type="submit" disabled={busy}>{busy ? "Checking…" : "Open the admin console"}</button>
      <p className="form-status" role="status">{message}</p>
    </form>
  );
}
