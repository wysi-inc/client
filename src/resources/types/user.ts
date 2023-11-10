import { Computer, Keyboard, Mouse, Tablet } from "./setup";
import { Beatmapset, BeatmapsetCategory } from "./beatmapset";
import { Score, ScoreCategory } from "./score";
import { Dispatch, SetStateAction } from 'react';
import { GameMode } from "./general";

export type User = {
    avatar_url: string;
    country_code: string;
    default_group: string;
    id: number;
    is_active: boolean;
    is_bot: boolean;
    is_deleted: boolean;
    is_online: boolean;
    is_supporter: boolean;
    last_visit: string;
    pm_friends_only: boolean;
    profile_colour: string;
    username: string;
    cover_url: string;
    discord: string;
    has_supported: boolean;
    interests: string;
    join_date: Date;
    kudosu: Kudosu;
    location: string;
    max_blocks: number;
    max_friends: number;
    occupation: string;
    playmode: GameMode;
    playstyle: string[] | null;
    post_count: number;
    profile_order: string[];
    title: string;
    title_url: string;
    twitter: string;
    website: string;
    country: UserCountry;
    cover: UserCover;
    account_history: [];
    active_tournament_banner: string;
    badges: UserBadge[];
    beatmap_playcounts_count: number;
    comments_count: number;
    favourite_beatmapset_count: number;
    follower_count: number;
    graveyard_beatmapset_count: number;
    groups: UserGroup[];
    guest_beatmapset_count: number;
    loved_beatmapset_count: number;
    mapping_follower_count: number;
    monthly_playcounts: MonthlyData[];
    nominated_beatmapset_count: number;
    page: UserPage;
    pending_beatmapset_count: number;
    previous_usernames: string[];
    rank_highest: UserHighestRank;
    ranked_beatmapset_count: number;
    replays_watched_counts: MonthlyData[];
    scores_best_count: number;
    scores_first_count: number;
    scores_pinned_count: number;
    scores_recent_count: number;
    statistics: UserStatistics;
    support_level: number;
    user_achievements: UserAchievement[];
    ranked_and_approved_beatmapset_count: number;
    unranked_beatmapset_count: number;
    db_info: DbInfo;
}

export type UserRanks = {
    count_100: number;
    count_300: number;
    count_50: number;
    count_miss: number;
    level: Level;
    global_rank: number;
    global_rank_exp: number;
    pp: number;
    pp_exp: number;
    ranked_score: number;
    hit_accuracy: number;
    play_count: number;
    play_time: number;
    total_score: number;
    total_hits: number;
    maximum_combo: number;
    replays_watched_by_others: number;
    is_ranked: boolean;
    grade_counts: UserGradeCounts;
    user: UserCompact;
}

export type UserCompact = {
    avatar_url: string;
    country_code: string;
    default_group: string;
    id: number;
    is_active: boolean;
    is_bot: boolean;
    is_deleted: boolean;
    is_online: boolean;
    is_supporter: boolean;
    last_visit: string;
    pm_friends_only: boolean;
    profile_colour: string;
    username: string;
    country: UserCountry;
    cover: UserCover;
}

export type UserBeatmapSets = {
    favourite: BeatThings;
    graveyard: BeatThings;
    guest: BeatThings;
    loved: BeatThings;
    nominated: BeatThings;
    ranked: BeatThings;
    pending: BeatThings;
}

export type BeatThings = {
    items: Beatmapset[];
    count: number;
}


export type DBRankHistory = {
    date: number;
    rank: number;
}

export type UserStatistics = {
    count_100: number;
    count_300: number;
    count_50: number;
    count_miss: number;
    level: Level;
    global_rank?: number;
    global_rank_exp: number;
    pp: number;
    pp_exp: number;
    ranked_score: number;
    hit_accuracy: number;
    play_count: number;
    play_time: number;
    total_score: number;
    total_hits: number;
    maximum_combo: number;
    replays_watched_by_others: number;
    is_ranked: boolean;
    grade_counts: UserGradeCounts;
    country_rank?: number;
    rank: {
        country: number;
    };
    variants?: Variants[];
}

export type UserGradeCounts = {
    ss: number;
    ssh: number;
    s: number;
    sh: number;
    a: number;
}

export type Level = {
    current: number;
    progress: number;
}

export type UserCountry = {
    code: string;
    name: string;
}

export type UserCover = {
    custom_url: string;
    url: string;
    id: number;
}

export type UserGroup = {
    colour: string;
    has_listing: boolean;
    has_playmodes: boolean;
    id: number;
    identifier: string;
    is_probationary: boolean;
    name: string;
    short_name: string;
    playmodes: GameMode[];
}

export type UserPage = {
    html: string;
    raw: string;
}

export type UserHighestRank = {
    rank: number;
    updated_at: Date;
}

export type MonthlyData = {
    start_date: string;
    count: number;
}

export type UserBadge = {
    awarded_at: string;
    description: string;
    image_url: string;
    url: string;
}

export type Variants = {
    mode: string;
    variant: string;
    country_rank: number;
    global_rank: number;
    pp: number;
}

export type Kudosu = {
    total: number;
    available: number;
}

export type UserAchievement = {
    achieved_at: Date;
    achievement_id: number;
}

export type DbInfo = {
    ranks: {
        global_rank: DBRankHistory[];
        country_rank: DBRankHistory[];
    },
    setup: Setup | null;
}

export type Setup = {
    peripherals?: Peripherals;
    tablet?: Tablet;
    keyboard?: Keyboard;
    mouse?: Mouse;
    computer?: Computer;
}

export type Peripherals = {
    monitor: string;
    headphones: string;
    microphone: string;
    tablet: string;
    mouse: string;
    keyboard: string;
    keypad: string;
    mousepad: string;
    chair: string;
    camera: string;
    audio: string;
}

export type MapTab = {
    tabId: number,
    title: string,
    icon: JSX.Element,
    count: number,
}

export type Map = {
    tabId: number,
    thing: ScoreCategory | BeatmapsetCategory,
    group: 'scores' | 'beatmapsets',
    tab: number,
    maps: Score[] | Beatmapset[],
    count: number,
    setMore: Dispatch<SetStateAction<Score[]>> | Dispatch<SetStateAction<Beatmapset[]>>,
}