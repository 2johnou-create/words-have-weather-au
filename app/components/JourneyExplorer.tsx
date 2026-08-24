"use client";

import { useMemo, useState } from "react";
import type { Episode } from "@/data/episodes";
import { monthLabel } from "@/data/episodes";

type Props = {
  episodes: Episode[];
  initialAudience: "parents" | "educators";
};

const audienceCopy = {
  parents: {
    label: "Parent and carer view",
    intro: "Start with the moment your family is meeting. The stages show increasing depth, not a test a child must pass.",
    prompt: "At home, look for",
  },
  educators: {
    label: "Educator planning view",
    intro: "Use the map to choose a learning purpose before selecting an episode. Local curriculum planning and review remain essential.",
    prompt: "In planning, look for",
  },
};

export function JourneyExplorer({ episodes, initialAudience }: Props) {
  const [audience, setAudience] = useState(initialAudience);
  const [category, setCategory] = useState("All");
  const [depth, setDepth] = useState("All");

  const rows = useMemo(() => {
    return Array.from({ length: 8 }, (_, index) => index + 1).map((stageNumber) => {
      const stageEpisodes = episodes.filter(
        (episode) =>
          episode.stage === stageNumber &&
          (category === "All" || episode.category === category) &&
          (depth === "All" || episode.depth === depth),
      );
      const sample = episodes.find((episode) => episode.stage === stageNumber)!;
      return { sample, episodes: stageEpisodes };
    }).filter((row) => row.episodes.length > 0);
  }, [episodes, category, depth]);

  const copy = audienceCopy[audience];

  return (
    <>
      <section className="journey-toolbar" aria-label="Learning journey controls">
        <div className="audience-toggle" role="group" aria-label="Choose audience view">
          <button className={audience === "parents" ? "active" : ""} type="button" onClick={() => setAudience("parents")}>Parents and carers</button>
          <button className={audience === "educators" ? "active" : ""} type="button" onClick={() => setAudience("educators")}>Educators</button>
        </div>
        <label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>All</option><option>Sprout</option><option>All Ages</option><option>Trail</option></select></label>
        <label><span>Learning depth</span><select value={depth} onChange={(event) => setDepth(event.target.value)}><option>All</option><option>Foundation</option><option>Guided practice</option><option>Applied practice</option><option>Transfer</option><option>Integration</option></select></label>
      </section>

      <div className="journey-view-intro"><p className="eyebrow">{copy.label}</p><p>{copy.intro}</p></div>

      <section className="journey-stage-grid">
        {rows.map(({ sample, episodes: stageEpisodes }) => (
          <article key={sample.stage}>
            <header><span>Stage {sample.stage}</span><strong>{sample.depth}</strong></header>
            <p className="stage-month">{monthLabel(sample.releaseDate.slice(0, 7))} · {stageEpisodes.length} episodes shown</p>
            <h2>{sample.stageTitle}</h2>
            <p>{sample.stageSummary}</p>
            <div className="depth-meter" aria-label={`Depth level ${sample.depthLevel} of 4`}><span style={{ width: `${sample.depthLevel * 25}%` }} /></div>
            <h3>{copy.prompt}</h3>
            <ul>{stageEpisodes.slice(0, 5).map((episode) => <li key={episode.id}>{episode.keyLearning}</li>)}</ul>
            <details><summary>Possible curriculum connections</summary><ul>{sample.curriculum.map((item) => <li key={item}>{item}</li>)}</ul></details>
          </article>
        ))}
      </section>

      <section className="curriculum-matrix" aria-labelledby="matrix-title">
        <div><p className="eyebrow">At-a-glance planning tool</p><h2 id="matrix-title">Where each stage adds depth.</h2></div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Stage</th><th>Depth</th><th>Key movement</th><th>Sprout</th><th>All Ages</th><th>Trail</th></tr></thead>
            <tbody>
              {Array.from({ length: 8 }, (_, index) => {
                const stageNumber = index + 1;
                const stageEpisodes = episodes.filter((episode) => episode.stage === stageNumber);
                const sample = stageEpisodes[0];
                return <tr key={stageNumber}><th>{stageNumber}. {sample.stageTitle}</th><td>{sample.depth}</td><td>{sample.stageSummary}</td><td>5 episodes</td><td>5 episodes</td><td>5 episodes</td></tr>;
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
