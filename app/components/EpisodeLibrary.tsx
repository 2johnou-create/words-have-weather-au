"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { EffectiveEpisode } from "@/data/episodes";
import { formatReleaseDate, monthLabel } from "@/data/episodes";

type Props = {
  episodes: EffectiveEpisode[];
  initialCategory: string;
  today: string;
};

function releaseState(episode: EffectiveEpisode, today: string) {
  if (episode.effectiveStatus === "disabled") return { label: "Paused", className: "paused", available: false };
  if (episode.effectiveReleaseDate > today) {
    return { label: `Releases ${formatReleaseDate(episode.effectiveReleaseDate)}`, className: "scheduled", available: false };
  }
  return { label: "Available now", className: "available", available: true };
}

export function EpisodeLibrary({ episodes, initialCategory, today }: Props) {
  const safeInitial = ["All", "Sprout", "All Ages", "Trail"].includes(initialCategory)
    ? initialCategory
    : "All";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(safeInitial);
  const [stage, setStage] = useState("All");
  const [depth, setDepth] = useState("All");
  const [month, setMonth] = useState("All");

  const months = useMemo(
    () => Array.from(new Set(episodes.map((episode) => episode.effectiveReleaseDate.slice(0, 7)))),
    [episodes],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return episodes.filter((episode) => {
      if (episode.effectiveStatus === "removed") return false;
      if (category !== "All" && episode.category !== category) return false;
      if (stage !== "All" && String(episode.stage) !== stage) return false;
      if (depth !== "All" && episode.depth !== depth) return false;
      if (month !== "All" && episode.effectiveReleaseDate.slice(0, 7) !== month) return false;
      if (!needle) return true;
      return [episode.code, episode.title, episode.setting, episode.keyLearning, ...episode.curriculum]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [episodes, query, category, stage, depth, month]);

  function reset() {
    setQuery("");
    setCategory("All");
    setStage("All");
    setDepth("All");
    setMonth("All");
  }

  return (
    <>
      <section className="library-controls" aria-label="Filter the episode library">
        <label className="search-field">
          <span>Search by moment, learning or curriculum</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try: repair, safety, friendship..." />
        </label>
        <label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>All</option><option>Sprout</option><option>All Ages</option><option>Trail</option></select></label>
        <label><span>Journey stage</span><select value={stage} onChange={(event) => setStage(event.target.value)}><option>All</option>{Array.from({ length: 8 }, (_, index) => <option key={index + 1} value={index + 1}>Stage {index + 1}</option>)}</select></label>
        <label><span>Depth</span><select value={depth} onChange={(event) => setDepth(event.target.value)}><option>All</option><option>Foundation</option><option>Guided practice</option><option>Applied practice</option><option>Transfer</option><option>Integration</option></select></label>
        <label><span>Release month</span><select value={month} onChange={(event) => setMonth(event.target.value)}><option>All</option>{months.map((value) => <option key={value} value={value}>{monthLabel(value)}</option>)}</select></label>
        <button type="button" className="filter-reset" onClick={reset}>Reset filters</button>
      </section>

      <div className="library-result-bar">
        <p><strong>{visible.length}</strong> of 120 episodes shown</p>
        <p>Each available episode includes two illustrated resources.</p>
      </div>

      <section className="episode-grid" aria-live="polite">
        {visible.map((episode) => {
          const state = releaseState(episode, today);
          return (
            <article className={`episode-card category-${episode.category.toLowerCase().replaceAll(" ", "-")}`} key={episode.id}>
              <div className="episode-cover">
                <Image width={900} height={600} sizes="(max-width: 760px) 100vw, (max-width: 1050px) 50vw, 33vw" src={episode.heroImage} alt={`Story illustration for Episode ${episode.code}, ${episode.title}`} />
                <span className={`release-badge ${state.className}`}>{state.label}</span>
              </div>
              <div className="episode-card-copy">
                <header><span>Episode {episode.code}</span><span>{episode.category} · {episode.ages}</span></header>
                <p className="episode-depth">Stage {episode.stage}: {episode.stageTitle} · {episode.depth}</p>
                <h2>{episode.title}</h2>
                <p>{episode.keyLearning}</p>
                <details>
                  <summary>Preview the story move</summary>
                  <dl>
                    <div><dt>Pressure line</dt><dd>“{episode.pressureLine}”</dd></div>
                    <div><dt>Keep</dt><dd>{episode.boundary}</dd></div>
                    <div><dt>Try next</dt><dd>“{episode.nextSentence}”</dd></div>
                  </dl>
                </details>
                <div className="episode-actions">
                  {state.available ? (
                    <>
                      <a href={episode.educatorPdf} download><small>5-page PDF</small>Educator worksheet <span aria-hidden="true">↓</span></a>
                      <a href={episode.parentPdf} download><small>6-page PDF</small>Parent workbook <span aria-hidden="true">↓</span></a>
                    </>
                  ) : (
                    <p className="not-yet">Resources unlock automatically on the indicated release date.</p>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>
      {visible.length === 0 && <div className="empty-state"><h2>No episodes match those filters.</h2><button type="button" onClick={reset}>Show the full journey</button></div>}
    </>
  );
}
