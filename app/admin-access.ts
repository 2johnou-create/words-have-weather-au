import type { ChatGPTUser } from "./chatgpt-auth";

const ADMIN_EMAILS = new Set(["2johnou@gmail.com"]);

export function isAdmin(user: ChatGPTUser | null): boolean {
  return Boolean(
    user
      && user.userId === "admin:owner"
      && ADMIN_EMAILS.has(user.email.toLowerCase()),
  );
}
