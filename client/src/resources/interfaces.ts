import {BeatmapsetStatusType, GameModeType} from "./types";

export interface ColorsInterface {
    ui: {
        font: string,
        bg: string,
        main: string,
    },
    modes: {
        any: string,
        osu: string,
        taiko: string,
        fruits: string,
        mania: string,
    },
    judgements: {
        x320: string,
        x300: string,
        x200: string,
        x100: string,
        x50: string,
        x20: string,
        xMiss: string,
    },
    beatmap: {
        any: string,
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
    },
    difficulty: string[];
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
    playmode: GameModeType;
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
    groups: UserGroup[];
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
    db_info: DbInfo;
}

export interface DbInfo {
    global_rank: DBRankHistory[];
    country_rank: DBRankHistory[];
    setup?: Setup,
    ranks: {
        xh: number,
        x: number,
        sh: number,
        s: number,
        a: number,
        b: number,
        c: number,
        d: number,
    },
}

export interface Setup {
    peripherals?: Peripherals;
    tablet?: TabletDisplayInterface;
    keyboard?: Keyboard;
    mouse?: Mouse
}

export interface Mouse {
    dpi?: number;
}

export interface Peripherals {
    monitor?: string;
    headphones?: string;
    microphone?: string;
    tablet?: string;
    mouse?: string;
    keyboard?: string;
    keypad?: string;
    mousepad?: string;
    chair?: string;
}

export interface Keyboard {
    format: string;
    inputs: string[];
}

export interface TabletDisplayInterface {
    area: {
        width: number,
        height: number,
    },
    position: {
        x: number,
        y: number,
        rotation: number,
    },
    tablet: {
        width: number,
        height: number,
    },
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

export interface UserGroup {
    colour: string;
    has_listing: boolean;
    has_playmodes: boolean;
    id: number;
    identifier: string;
    is_probationary: boolean;
    name: string;
    short_name: string;
    playmodes: GameModeType[];
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
    variants?: Variants[];
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
    mode: GameModeType;
    data: number[];
}
export interface DBRankHistory {
    date: Date,
    rank: number
}

export interface Kudosu {
    total: number;
    available: number;
}

export interface Score {
    accuracy: number;
    beatmap_id: number;
    ended_at: Date;
    max_combo: number;
    maximum_statistics: MaximumStatistics;
    mods: ModsEntity[];
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
    large_tick_hit?: number | null;
    small_tick_hit?: number | null;
    small_tick_miss?: number | null;
    good?: number | null;
    ok?: number | null;
    meh?: number | null;
    miss?: number | null;
}

export interface CurrentUserAttributes {
    pin?: null;
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
    status: BeatmapsetStatusType;
    title: string;
    title_unicode: string;
    track_id?: number | null;
    user_id: number;
    video: boolean;
}

export interface Covers {
    cover: string;
    'cover@2x': string;
    card: string;
    'card@2x': string;
    list: string;
    'list@2x': string;
    slimcover: string;
    'slimcover@2x': string;
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
    Grouping: string;
    Date: string;
    PackID?: string | null;
    Rarity: string;
}

export interface MedalCategories {
    [category: string]: number
}

export interface SortedMedals {
    [key: string]: MedalInterface[]
}

export interface UserCompact {
    avatar_url: string;
    country_code: string;
    id: number;
    is_active: boolean;
    is_bot: boolean;
    is_deleted: boolean;
    is_online: boolean;
    is_supporter: boolean;
    last_visit: string;
    pm_friends_only: boolean;
    username: string;
}

export interface BeatmapSet {
    id: number;
    artist: string;
    artist_unicode: string;
    creator: string;
    source: string;
    tags: string;
    title: string;
    title_unicode: string;
    favourite_count: number;
    hype?: null;
    nsfw: boolean;
    offset: number;
    play_count: number;
    spotlight: boolean;
    status: BeatmapsetStatusType;
    track_id?: null;
    user_id: number;
    video: boolean;
    bpm: number;
    can_be_hyped: boolean;
    deleted_at?: null;
    discussion_enabled: boolean;
    discussion_locked: boolean;
    is_scoreable: boolean;
    last_updated: number;
    legacy_thread_url: string;
    nominations_summary: NominationsSummary;
    ranked: number;
    ranked_date: number;
    storyboard: boolean;
    submitted_date: number | string;
    availability: Availability;
    has_favourited: boolean;
    beatmaps: BeatmapsEntity[];
    converts?: Beatmap[] | null;
    description: Description;
    genre: GenreOrLanguage;
    language: GenreOrLanguage;
    ratings?: number[] | null;
    related_users?: RelatedUsersEntity[] | null;
    last_checked: number;
    rating: number;
}

export interface NominationsSummary {
}

export interface Availability {
    download_disabled: boolean;
    more_information?: null;
}

export interface BeatmapsEntity {
    id: number;
    failed: number;
    exited: number;
    beatmapset_id: number;
    difficulty_rating: number;
    mode: GameModeType;
    status: BeatmapsetStatusType;
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
    deleted_at?: null;
    drain: number;
    hit_length: number;
    is_scoreable: boolean;
    last_updated: number;
    mode_int: number;
    passcount: number;
    playcount: number;
    ranked: number;
    url: string;
    checksum: string;
    max_combo: number;
    last_checked: number;
}

export interface Beatmap {
    beatmapset_id: number;
    difficulty_rating: number;
    id: number;
    mode: GameModeType;
    status: BeatmapsetStatusType;
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
    deleted_at?: null;
    drain: number;
    hit_length: number;
    is_scoreable: boolean;
    last_updated: string;
    mode_int: number;
    passcount: number;
    playcount: number;
    ranked: boolean;
    url: string;
    checksum: string;
    failed: number;
    exited: number;
}

export interface Description {
    description: string;
}

export interface GenreOrLanguage {
    id: number;
    name: string;
}

export interface RelatedUsersEntity {
    id: number;
    username: string;
    country_code: string;
}

export interface Variants {
    mode: string;
    variant: string;
    country_rank: number;
    global_rank: number;
    pp: number;
}

export interface UserBeatmapSets {
    favourite: BeatThings;
    graveyard: BeatThings;
    guest: BeatThings;
    loved: BeatThings;
    nominated: BeatThings;
    ranked: BeatThings;
    pending: BeatThings;
}

export interface BeatThings {
    items: Beatmapset[];
    count: number;
}