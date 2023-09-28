import { Dispatch, SetStateAction } from "react";
import { BeatmapSet } from "../resources/interfaces/beatmapset";
import { Score } from "../resources/interfaces/score";
import { BeatmapType, ScoreType } from "../resources/types";

export type AxisType = "time" | undefined;
export type scoreCategoryType = 'pinned' | 'best' | 'firsts' | 'recent';
export type beatmapCategoryType = 'favourite' | 'graveyard' | 'ranked' | 'loved' | 'guest' | 'nominated' | 'pending';


export interface beatmapListItem {
    id: number,
    beatmaps: BeatmapSet[],
    type: beatmapCategoryType,
    len: number,
}

export interface scoreListItem {
    id: number,
    scores: Score[],
    type: scoreCategoryType,
    len: number,
}

export interface ScoresObj {
    pinned: Score[];
    best: Score[];
    firsts: Score[];
    recent: Score[];
}

export interface BeatmapsObj {
    favourite: BeatmapSet[],
    ranked: BeatmapSet[],
    guest: BeatmapSet[],
    loved: BeatmapSet[],
    nominated: BeatmapSet[],
    pending: BeatmapSet[],
    graveyard: BeatmapSet[],
}

export interface tabInterface {
    num: number,
    title: string,
    icon: JSX.Element,
    count: number,
}

export interface dataInterface {
    num: number,
    thing: ScoreType | BeatmapType,
    group: 'scores' | 'beatmapsets',
    tab: number,
    maps: Score[] | BeatmapSet[],
    count: number,
    setMore: Dispatch<SetStateAction<Score[]>> | Dispatch<SetStateAction<BeatmapSet[]>>,
}