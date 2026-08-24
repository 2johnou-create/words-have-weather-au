"use client";

import { useMemo, useState } from "react";
import { zipSync } from "fflate";
import type { Episode, EpisodeOverride, EpisodeStatus } from "@/data/episodes";
import { applyOverrides, formatReleaseDate, monthLabel } from "@/data/episodes";

type RawOverride = { episode_id: number; status: EpisodeStatus; release_date: string | null; updated_at: string };

export function AdminConsole({ episodes, initialOverrides, today }: { episodes: Episode[]; initialOverrides: Record<number, EpisodeOverride>; today: string }) {
  const [overrides, setOverrides] = useState<Record<number, EpisodeOverride>>(initialOverrides);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [month, setMonth] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [scheduleDate, setScheduleDate] = useState("");
  const [message, setMessage] = useState("Release controls are up to date.");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const response = await fetch("/api/admin/episodes", { cache: "no-store" });
    const payload = await response.json() as { overrides?: RawOverride[]; error?: string };
    if (!response.ok) { setMessage(payload.error ?? "Could not load release controls."); return; }
    setOverrides(Object.fromEntries((payload.overrides ?? []).map((row) => [row.episode_id, { episodeId: row.episode_id, status: row.status, releaseDate: row.release_date, updatedAt: row.updated_at }])));
    setMessage("Release controls are up to date.");
  }

  const effective = useMemo(() => applyOverrides(episodes, overrides), [episodes, overrides]);
  const months = useMemo(() => Array.from(new Set(effective.map((episode) => episode.effectiveReleaseDate.slice(0, 7)))), [effective]);
  const filtered = useMemo(() => effective.filter((episode) => {
    const needle = query.toLowerCase().trim();
    const releaseState = episode.effectiveStatus === "removed" ? "removed" : episode.effectiveStatus === "disabled" ? "disabled" : episode.effectiveReleaseDate > today ? "scheduled" : "released";
    return (category === "All" || episode.category === category)
      && (month === "All" || episode.effectiveReleaseDate.slice(0, 7) === month)
      && (statusFilter === "All" || releaseState === statusFilter)
      && (!needle || `${episode.code} ${episode.title} ${episode.keyLearning}`.toLowerCase().includes(needle));
  }), [effective, query, category, month, statusFilter, today]);

  const summary = useMemo(() => effective.reduce((counts, episode) => {
    const state = episode.effectiveStatus === "removed" ? "removed" : episode.effectiveStatus === "disabled" ? "disabled" : episode.effectiveReleaseDate > today ? "scheduled" : "released";
    counts[state] += 1;
    return counts;
  }, { released: 0, scheduled: 0, disabled: 0, removed: 0 }), [effective, today]);

  function toggle(id: number) {
    setSelected((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }

  async function update(ids: number[], fields: { status?: EpisodeStatus; releaseDate?: string; action?: "reset" }, success: string) {
    if (ids.length === 0) { setMessage("Select at least one episode first."); return; }
    setBusy(true);
    const response = await fetch("/api/admin/episodes", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ids, action: fields.action ?? "update", status: fields.status, releaseDate: fields.releaseDate }) });
    const payload = await response.json() as { error?: string };
    setBusy(false);
    if (!response.ok) { setMessage(payload.error ?? "The update did not save."); return; }
    setMessage(success);
    await refresh();
  }

  async function downloadSelected() {
    const chosen = effective.filter((episode) => selected.has(episode.id));
    if (chosen.length === 0) { setMessage("Select at least one episode to download."); return; }
    setBusy(true);
    setMessage(`Preparing ${chosen.length} complete episode packs...`);
    try {
      const files: Record<string, Uint8Array> = {};
      const paths = chosen.flatMap((episode) => [episode.educatorPdf, episode.parentPdf, episode.educatorPreview, episode.parentPreview, episode.contentJson]);
      for (let index = 0; index < paths.length; index += 6) {
        const group = paths.slice(index, index + 6);
        const results = await Promise.all(group.map(async (path) => {
          const response = await fetch(path);
          if (!response.ok) throw new Error(`Could not fetch ${path}`);
          return [path.split("/").pop()!, new Uint8Array(await response.arrayBuffer())] as const;
        }));
        for (const [name, bytes] of results) files[name] = bytes;
      }
      files["selection.json"] = new TextEncoder().encode(JSON.stringify(chosen, null, 2));
      const archive = zipSync(files, { level: 6 });
      const archiveBuffer = archive.buffer.slice(
        archive.byteOffset,
        archive.byteOffset + archive.byteLength,
      ) as ArrayBuffer;
      const blob = new Blob([archiveBuffer], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `words-have-weather-${chosen.length}-episode-packs.zip`;
      link.click();
      URL.revokeObjectURL(url);
      setMessage(`Downloaded ${chosen.length} complete episode packs.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The ZIP download could not be prepared.");
    } finally {
      setBusy(false);
    }
  }

  const selectedIds = Array.from(selected);

  return (
    <>
      <section className="admin-summary">
        <article><strong>{summary.released}</strong><span>released</span></article>
        <article><strong>{summary.scheduled}</strong><span>scheduled</span></article>
        <article><strong>{summary.disabled}</strong><span>paused</span></article>
        <article><strong>{summary.removed}</strong><span>removed</span></article>
      </section>

      <section className="admin-toolbar">
        <label className="search-field"><span>Find episodes</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Episode, title or key learning" /></label>
        <label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>All</option><option>Sprout</option><option>All Ages</option><option>Trail</option></select></label>
        <label><span>Release month</span><select value={month} onChange={(event) => setMonth(event.target.value)}><option>All</option>{months.map((value) => <option key={value} value={value}>{monthLabel(value)}</option>)}</select></label>
        <label><span>Status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All</option><option value="released">Released</option><option value="scheduled">Scheduled</option><option value="disabled">Paused</option><option value="removed">Removed</option></select></label>
      </section>

      <section className="bulk-panel" aria-label="Bulk episode actions">
        <div className="selection-tools"><strong>{selected.size} selected</strong><button type="button" onClick={() => setSelected(new Set(filtered.map((episode) => episode.id)))}>Select visible group</button><button type="button" onClick={() => setSelected(new Set(effective.map((episode) => episode.id)))}>Select all 120</button><button type="button" onClick={() => setSelected(new Set())}>Clear</button></div>
        <div className="bulk-actions">
          <button disabled={busy} type="button" onClick={() => void update(selectedIds, { status: "enabled" }, "Selected episodes enabled.")}>Enable</button>
          <button disabled={busy} type="button" onClick={() => void update(selectedIds, { status: "disabled" }, "Selected episodes paused.")}>Disable</button>
          <button disabled={busy} type="button" className="danger" onClick={() => window.confirm("Remove the selected episodes from the public library? Their files and records remain recoverable.") && void update(selectedIds, { status: "removed" }, "Selected episodes removed from the public library.")}>Remove</button>
          <label className="schedule-control"><span>Release date</span><input type="date" value={scheduleDate} onChange={(event) => setScheduleDate(event.target.value)} /></label>
          <button disabled={busy || !scheduleDate} type="button" onClick={() => void update(selectedIds, { releaseDate: scheduleDate, status: "enabled" }, `Selected episodes scheduled for ${formatReleaseDate(scheduleDate)}.`)}>Schedule</button>
          <button disabled={busy} type="button" onClick={() => void update(selectedIds, { action: "reset" }, "Selected episodes restored to the planned 15-per-month schedule.")}>Restore plan</button>
          <button disabled={busy} type="button" className="download-bulk" onClick={() => void downloadSelected()}>Download selected contents</button>
        </div>
        <p className="admin-message" role="status">{message}</p>
      </section>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th><span className="sr-only">Select</span></th><th>Episode</th><th>Journey</th><th>Release</th><th>Status</th><th>Resources</th></tr></thead>
          <tbody>{filtered.map((episode) => (
            <tr key={episode.id} className={episode.effectiveStatus === "removed" ? "removed-row" : ""}>
              <td><input type="checkbox" checked={selected.has(episode.id)} onChange={() => toggle(episode.id)} aria-label={`Select Episode ${episode.code}`} /></td>
              <td><strong>{episode.code}</strong><span>{episode.title}</span></td>
              <td><span>{episode.category}</span><small>Stage {episode.stage} · {episode.depth}</small></td>
              <td><input type="date" value={episode.effectiveReleaseDate} onChange={(event) => void update([episode.id], { releaseDate: event.target.value }, `Episode ${episode.code} rescheduled.`)} /></td>
              <td><select value={episode.effectiveStatus} onChange={(event) => void update([episode.id], { status: event.target.value as EpisodeStatus }, `Episode ${episode.code} updated.`)}><option value="enabled">Enabled</option><option value="disabled">Disabled</option><option value="removed">Removed</option></select></td>
              <td><a href={`/episodes/${episode.code}`} target="_top">Preview</a><a href={episode.educatorPdf}>Educator</a><a href={episode.parentPdf}>Parent</a><a href={episode.contentJson}>Metadata</a></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}
