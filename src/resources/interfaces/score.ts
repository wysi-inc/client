import { Beatmap, BeatmapSet } from "./beatmapset";
import { UserCompact } from "./user";
export interface Score {
  position: number;
  mods_id: number;
  accuracy: number;
  best_id: number;
  created_at: string;
  id: number;
  max_combo: number;
  mode: string;
  mode_int: number;
  mods: string[];
  passed: boolean;
  perfect: boolean;
  pp: string;
  rank: string;
  replay: boolean;
  score: number;
  statistics: ScoreStatistics;
  type: string;
  user_id: number;
  beatmap: Beatmap;
  beatmapset: BeatmapSet;
  user: UserCompact;
}
// export interface Score {
//   accuracy: number;
//   beatmap_id: number;
//   ended_at: Date;
//   max_combo: number;
//   mods: ModsEntity[];
//   passed: boolean;
//   rank: string;
//   ruleset_id: number;
//   statistics: ScoreStatistics;
//   total_score: number;
//   user_id: number;
//   best_id: number;
//   id: number;
//   legacy_perfect: boolean;
//   pp: number;
//   replay: boolean;
//   type: string;
//   beatmap: Beatmap;
//   beatmapset: BeatmapSet;
//   user: UserCompact;
//   weight: Weight;
// }

export interface Weight {
  percentage: number;
  pp: number;
}

export interface ScoreStatistics {
  count_geki: number;
  count_300: number;
  count_katu: number;
  count_100: number;
  count_50: number;
  count_miss: number;
}

export interface ModsEntity {
  acronym: string;
}