import { Beatmap, Beatmapset } from "./beatmapset";
import { UserCompact } from "./user";

export type ScoreCategory = 'pinned' | 'best' | 'firsts' | 'recent';
export const ScoreCategories: ScoreCategory[] = ['pinned', 'best', 'firsts', 'recent'];

export type ScoreListItem = {
  tabId: number,
  limit: number,
  category: ScoreCategory,
}

export type ScoresObj = {
  pinned: Score[];
  best: Score[];
  firsts: Score[];
  recent: Score[];
}

export type Score = {
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
  beatmapset: Beatmapset;
  user: UserCompact;
}

export type Weight = {
  percentage: number;
  pp: number;
}

export type ScoreStatistics = {
  count_geki?: number;
  count_300?: number;
  count_katu?: number;
  count_100?: number;
  count_50?: number;
  count_miss?: number;
}

export type ModsEntity = {
  acronym: string;
}