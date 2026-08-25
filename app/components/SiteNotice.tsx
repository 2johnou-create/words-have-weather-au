"use client";

import { useEffect, useState } from "react";
import type { SiteNotice as SiteNoticeRecord } from "@/db/site-notice";

export function SiteNotice({ notice }: { notice: SiteNoticeRecord }) {
  const storageKey = `whw-notice-${notice.id}-${notice.updatedAt}`;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(window.sessionStorage.getItem(storageKey) !== "dismissed"), 0);
    return () => window.clearTimeout(timer);
  }, [storageKey]);

  if (!visible) return null;
  return (
    <aside className={`site-notice site-notice-${notice.tone}`} aria-label="Site notification">
      <div>
        <p>{notice.message}</p>
        {notice.linkHref && notice.linkLabel ? <a href={notice.linkHref} target="_top">{notice.linkLabel} →</a> : null}
      </div>
      <button type="button" onClick={() => { window.sessionStorage.setItem(storageKey, "dismissed"); setVisible(false); }} aria-label="Dismiss notification">×</button>
    </aside>
  );
}
