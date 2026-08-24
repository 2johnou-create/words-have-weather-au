"use client";

import { FormEvent, useState } from "react";

type Props = {
  defaultFirstName: string;
  defaultLastName: string;
  defaultEmail: string;
  defaultUpdatesOptIn: boolean;
  returnTo: string;
  existing: boolean;
};

export function MemberSignupForm({ defaultFirstName, defaultLastName, defaultEmail, defaultUpdatesOptIn, returnTo, existing }: Props) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/members", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        firstName: form.get("firstName"),
        lastName: form.get("lastName"),
        email: form.get("email"),
        educationTerms: form.get("educationTerms") === "on",
        updatesOptIn: form.get("updatesOptIn") === "on",
      }),
      credentials: "same-origin",
    });
    const payload = await response.json() as { error?: string };
    if (!response.ok) {
      setBusy(false);
      setStatus(payload.error ?? "We could not save your membership. Please try again.");
      return;
    }
    setStatus("Your free membership is ready. Opening your resource...");
    window.setTimeout(() => window.location.assign(returnTo), 400);
  }

  return (
    <form className="signup-form" onSubmit={submit}>
      <div className="form-row">
        <label><span>First name</span><input name="firstName" defaultValue={defaultFirstName} autoComplete="given-name" required maxLength={80} /></label>
        <label><span>Last name</span><input name="lastName" defaultValue={defaultLastName} autoComplete="family-name" required maxLength={80} /></label>
      </div>
      <label><span>Email</span><input name="email" type="email" defaultValue={defaultEmail} autoComplete="email" required maxLength={254} /></label>
      <label className="check-row required-check"><input name="educationTerms" type="checkbox" required defaultChecked={existing} /><span>I agree to use the resources for educational purposes and accept the <a href="/terms" target="_blank">education-use terms</a>.</span></label>
      <label className="check-row"><input name="updatesOptIn" type="checkbox" defaultChecked={defaultUpdatesOptIn} /><span>I would like occasional email updates about new episode and resource releases. I can unsubscribe at any time.</span></label>
      <button className="button button-primary" type="submit" disabled={busy}>{busy ? "Saving..." : existing ? "Update my membership" : "Create my free membership"}</button>
      <small className="form-privacy-note">No GitHub or ChatGPT account is needed. We use your details only to provide the free library, manage your email choice and improve the educational resource.</small>
      <p className="form-status" role="status">{status}</p>
    </form>
  );
}
