import catalog from "./episode-catalog.json";

export type EpisodeCategory = "Sprout" | "All Ages" | "Trail";
export type EpisodeStatus = "enabled" | "disabled" | "removed";

export type Episode = {
  id: number;
  code: string;
  title: string;
  category: EpisodeCategory;
  ages: string;
  character: string;
  categoryContext: string;
  stage: number;
  stageTitle: string;
  stageSummary: string;
  depth: string;
  depthLevel: number;
  releaseDate: string;
  setting: string;
  pressureLine: string;
  possibleWeather: string;
  boundary: string;
  practice: string;
  principle: string;
  nextSentence: string;
  keyLearning: string;
  curriculum: string[];
  defaultStatus: EpisodeStatus;
  educatorPdf: string;
  parentPdf: string;
  educatorPreview: string;
  parentPreview: string;
  contentJson: string;
};

export type EpisodeOverride = {
  episodeId: number;
  status: EpisodeStatus;
  releaseDate: string | null;
  updatedAt?: string;
};

export type EffectiveEpisode = Episode & {
  effectiveStatus: EpisodeStatus;
  effectiveReleaseDate: string;
};

export const episodes = catalog as Episode[];

export const stages = Array.from(
  new Map(
    episodes.map((episode) => [
      episode.stage,
      {
        number: episode.stage,
        title: episode.stageTitle,
        summary: episode.stageSummary,
        depth: episode.depth,
        depthLevel: episode.depthLevel,
        releaseMonth: episode.releaseDate.slice(0, 7),
        curriculum: episode.curriculum,
      },
    ]),
  ).values(),
);

export function applyOverrides(
  source: Episode[],
  overrides: Record<number, EpisodeOverride>,
): EffectiveEpisode[] {
  return source.map((episode) => {
    const override = overrides[episode.id];
    return {
      ...episode,
      effectiveStatus: override?.status ?? episode.defaultStatus,
      effectiveReleaseDate: override?.releaseDate ?? episode.releaseDate,
    };
  });
}

export function formatReleaseDate(value: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function monthLabel(value: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}-01T00:00:00Z`));
}
