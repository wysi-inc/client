export interface ColorsInterface {
    ui: {
        font: string,
        bg: string,
        main: string,
    }
    judgements: {
        x320: string,
        x300: string,
        x200: string,
        x100: string,
        x50: string,
        xMiss: string,
    },
    beatmap: {
        graveyard: string,
        wip: string,
        pending: string,
        ranked: string,
        approved: string,
        qualified: string,
        loved: string,
    },
    ranks: {
        xh: string,
        x: string,
        sh: string,
        s: string,
        a: string,
        b: string,
        c: string,
        d: string,
        f: string
    },
    charts: {
        lvl: string,
        skills: string,
        global: string,
        country: string,
        plays: string,
        topPp: string
    }
}

export interface userData {
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
    playmode: string;
    playstyle: string;
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
    groups: UserGroups;
    guest_beatmapset_count: number;
    loved_beatmapset_count: number;
    mapping_follower_count: number;
    monthly_playcounts: MonthlyData[];
    nominated_beatmapset_count: number;
    page: UserPage;
    pending_beatmapset_count: number;
    previous_usernames: string[];
    rank_highest: HighestRank;
    ranked_beatmapset_count: number;
    replays_watched_counts: MonthlyData[];
    scores_best_count: number;
    scores_first_count: number;
    scores_pinned_count: number;
    scores_recent_count: number;
    statistics: UserStatistics;
    support_level: number;
    user_achievements: UserAchievement[];
    rank_history: RankHistory;
    rankHistory: RankHistory;
    ranked_and_approved_beatmapset_count: number;
    unranked_beatmapset_count: number;
}

export interface UserCountry {
    code: string;
    name: string;
}

export interface UserCover {
    custom_url: string;
    url: string;
    id: number;
}

export interface UserBadge {
    awarded_at: string;
    description: string;
    image_url: string;
    url: string;
}

export interface UserGroups {
    colour: string;
    has_listing: boolean;
    has_playmodes: boolean;
    id: number;
    identifier: string;
    is_probationary: boolean;
    name: string;
    short_name: string;
    playmodes: string[];
}

export interface UserPage {
    html: string;
    raw: string;
}

export interface HighestRank {
    rank: number;
    updated_at: Date;
}

export interface MonthlyData {
    start_date: string;
    count: number;
}

export interface UserStatistics {
    count_100: number;
    count_300: number;
    count_50: number;
    count_miss: number;
    level: UserLevel;
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
}

export interface UserLevel {
    current: number;
    progress: number;
}

export interface UserGradeCounts {
    ss: number;
    ssh: number;
    s: number;
    sh: number;
    a: number;
}

export interface UserAchievement {
    achieved_at: Date;
    achievement_id: number;
}

export interface RankHistory {
    mode: string;
    data: number[];
}

export interface Kudosu {
    total: number;
    available: number;
}

export interface BeatmapScore {
    accuracy: number;
    beatmap_id: number;
    ended_at: Date;
    max_combo: number;
    maximum_statistics: MaximumStatistics;
    mods?: ModsEntity[] | null;
    passed: boolean;
    rank: string;
    ruleset_id: number;
    statistics: Statistics;
    total_score: number;
    user_id: number;
    best_id: number;
    id: number;
    legacy_perfect: boolean;
    pp: number;
    replay: boolean;
    type: string;
    current_user_attributes: CurrentUserAttributes;
    beatmap: Beatmap;
    beatmapset: Beatmapset;
    user: User;
    weight: Weight;
}

export interface MaximumStatistics {
    miss: number;
}

export interface ModsEntity {
    acronym: string;
}

export interface Statistics {
    perfect?: number | null;
    great?: number | null;
    good?: number | null;
    ok?: number | null;
    meh?: number | null;
    miss?: number | null;
}

export interface CurrentUserAttributes {
    pin?: null;
}

export interface Beatmap {
    beatmapset_id: number;
    difficulty_rating: number;
    id: number;
    mode: string;
    status: string;
    total_length: number;
    user_id: number;
    version: string;
    accuracy: number;
    ar: number;
    bpm: number;
    convert: boolean;
    count_circles: number;
    count_sliders: number;
    count_spinners: number;
    cs: number;
    deleted_at?: Date;
    drain: number;
    hit_length: number;
    is_scoreable: boolean;
    last_updated: Date;
    mode_int: number;
    passcount: number;
    playcount: number;
    ranked: number;
    url: string;
    checksum: string;
}

export interface Beatmapset {
    artist: string;
    artist_unicode: string;
    covers: Covers;
    creator: string;
    favourite_count: number;
    hype?: null;
    id: number;
    nsfw: boolean;
    offset: number;
    play_count: number;
    preview_url: string;
    source: string;
    spotlight: boolean;
    status: string;
    title: string;
    title_unicode: string;
    track_id?: number | null;
    user_id: number;
    video: boolean;
}

export interface Covers {
    cover: string;
    card: string;
    list: string;
    slimcover: string;
}

export interface User {
    avatar_url: string;
    country_code: string;
    default_group: string;
    id: number;
    is_active: boolean;
    is_bot: boolean;
    is_deleted: boolean;
    is_online: boolean;
    is_supporter: boolean;
    last_visit: Date;
    pm_friends_only: boolean;
    profile_colour?: null;
    username: string;
}

export interface Weight {
    percentage: number;
    pp: number;
}

export interface MedalInterface {
    MedalID: string;
    Name: string;
    Link: string;
    Description: string;
    Restriction: string;
    Grouping: string;
    Instructions?: string | null;
    Solution: string;
    Mods?: string | null;
    Locked?: string | null;
    Video?: string | null;
    Date: string;
    PackID?: string | null;
    FirstAchievedDate?: string | null;
    FirstAchievedBy?: string | null;
    ModeOrder: string;
    Ordering: string;
    Rarity: string;
}

export interface MedalCategories {
    [category: string]: number
}

export interface SortedMedals {
    [key: string]: MedalInterface[]
}