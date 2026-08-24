export type EmailEnvironment = {
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  SITE_URL?: string;
};

export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  kind: "welcome" | "weekly-highlight" | "monthly-release";
};

const defaultSiteUrl = "https://words-have-weather-au.misty-jelly-1931.chatgpt.site";

export function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]!);
}

function shell(title: string, intro: string, body: string, siteUrl: string, unsubscribeToken?: string): string {
  const unsubscribe = unsubscribeToken
    ? `<p style="margin-top:28px;font-size:12px;color:#66716c">You are receiving learning updates because you opted in. <a href="${siteUrl}/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}" style="color:#41584d">Unsubscribe</a>.</p>`
    : "";
  return `<!doctype html><html lang="en-AU"><body style="margin:0;background:#f6efe3;color:#29312e;font-family:Arial,sans-serif"><div style="max-width:640px;margin:0 auto;padding:36px 22px"><div style="margin-bottom:24px;color:#41584d;font-weight:700">Words Have Weather</div><div style="background:#fffdf8;border:1px solid #d9d2c7;border-radius:22px;padding:30px"><p style="margin:0 0 8px;color:#c06f4f;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">Keep the boundary. Change the weather.</p><h1 style="font-family:Georgia,serif;font-size:32px;line-height:1.1;margin:0 0 16px">${title}</h1><p style="font-size:17px;line-height:1.6">${intro}</p>${body}<p style="margin-top:26px"><a href="${siteUrl}/episodes" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#41584d;color:white;text-decoration:none;font-weight:700">Explore the story library</a></p>${unsubscribe}</div><p style="font-size:12px;color:#66716c;line-height:1.6">General educational information for adults. Possible curriculum connections do not imply government approval or endorsement.</p></div></body></html>`;
}

export function welcomeEmail(firstName: string, email: string, siteUrl = defaultSiteUrl): EmailMessage {
  return {
    to: email,
    subject: "Welcome to Words Have Weather",
    kind: "welcome",
    html: shell(
      `Welcome, ${escapeHtml(firstName)}.`,
      "Your free educational membership is ready. You can now download every released parent workbook and educator worksheet.",
      "<p style=\"line-height:1.6\"><strong>A gentle place to begin:</strong> choose one familiar moment, preview the possible word-weather, keep the boundary and borrow one next sentence.</p>",
      siteUrl,
    ),
  };
}

export function weeklyHighlightEmail(input: { firstName: string; email: string; title: string; keyLearning: string; code: string; unsubscribeToken: string; siteUrl?: string }): EmailMessage {
  const siteUrl = input.siteUrl ?? defaultSiteUrl;
  return {
    to: input.email,
    subject: `This week’s one useful sentence: Episode ${input.code}`,
    kind: "weekly-highlight",
    html: shell(
      `A small practice for this week, ${escapeHtml(input.firstName)}.`,
      `<strong>Episode ${escapeHtml(input.code)}: ${escapeHtml(input.title)}</strong>`,
      `<p style="line-height:1.6">${escapeHtml(input.keyLearning)}</p><p><a href="${siteUrl}/episodes/${input.code}" style="color:#41584d;font-weight:700">Preview this episode →</a></p>`,
      siteUrl,
      input.unsubscribeToken,
    ),
  };
}

export function monthlyReleaseEmail(input: { firstName: string; email: string; month: string; releases: Array<{ code: string; title: string }>; unsubscribeToken: string; siteUrl?: string }): EmailMessage {
  const siteUrl = input.siteUrl ?? defaultSiteUrl;
  const list = input.releases.length
    ? `<ul style="line-height:1.7">${input.releases.slice(0, 15).map((episode) => `<li><a href="${siteUrl}/episodes/${episode.code}" style="color:#41584d">Episode ${escapeHtml(episode.code)}: ${escapeHtml(episode.title)}</a></li>`).join("")}</ul>`
    : "<p>Use the learning map to revisit an earlier stage and choose the depth that fits your setting.</p>";
  return {
    to: input.email,
    subject: `Your ${input.month} Words Have Weather learning note`,
    kind: "monthly-release",
    html: shell(
      `${escapeHtml(input.month)}: the learning journey continues.`,
      `Hello ${escapeHtml(input.firstName)}. Here are this month’s new releases and one clear place to continue.`,
      list,
      siteUrl,
      input.unsubscribeToken,
    ),
  };
}

export async function deliverEmail(environment: EmailEnvironment, message: EmailMessage): Promise<{ sent: boolean; error: string | null }> {
  if (!environment.RESEND_API_KEY || !environment.EMAIL_FROM) return { sent: false, error: "Email provider is not connected yet." };
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${environment.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ from: environment.EMAIL_FROM, to: [message.to], subject: message.subject, html: message.html }),
    });
    if (!response.ok) return { sent: false, error: `Email provider returned ${response.status}.` };
    return { sent: true, error: null };
  } catch {
    return { sent: false, error: "Email provider could not be reached." };
  }
}
