import { Beatmap, BeatmapSet } from "./beatmapset";
import { UserCompact } from "./user";

export interface Score {
    accuracy: number;
    beatmap_id: number;
    ended_at: Date;
    max_combo: number;
    mods: ModsEntity[];
    passed: boolean;
    rank: string;
    ruleset_id: number;
    statistics: ScoreStatistics;
    total_score: number;
    user_id: number;
    best_id: number;
    id: number;
    legacy_perfect: boolean;
    pp: number;
    replay: boolean;
    type: string;
    beatmap: Beatmap;
    beatmapset: BeatmapSet;
    user: UserCompact;
    weight: Weight;
}

export interface Weight {
    percentage: number;
    pp: number;
  }

export interface ScoreStatistics {
    perfect?: number | null;
    great?: number | null;
    large_tick_hit?: number | null;
    small_tick_hit?: number | null;
    small_tick_miss?: number | null;
    good?: number | null;
    ok?: number | null;
    meh?: number | null;
    miss?: number | null;
  }

export interface ModsEntity {
    acronym: string;
}