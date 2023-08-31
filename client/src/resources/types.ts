export type GameModeType = 'any' | 'osu' | 'mania' | 'fruits' | 'taiko' | 'default';
export type BeatmapType = 'pinned' | 'firsts' | 'recent' | 'best';
export type SongLanguageType =
    | "any"
    | "english"
    | "chinese"
    | "french"
    | "german"
    | "italian"
    | "japanese"
    | "korean"
    | "spanish"
    | "swedish"
    | "russian"
    | "polish"
    | "instrumental"
    | "unspecified"
    | "other";

export type SongGenreType =
    | "any"
    | "video game"
    | "anime"
    | "rock"
    | "pop"
    | "novelty"
    | "hip hop"
    | "electronic"
    | "metal"
    | "classical"
    | "folk"
    | "jazz"
    | "unspecified"
    | "other";

export type BeatmapsetStatusType =
    | "any"
    | "ranked"
    | "qualified"
    | "loved"
    | "pending"
    | "wip"
    | "graveyard";

export type SongSortType =
    | "title_desc"
    | "title_asc"
    | "artist_desc"
    | "artist_asc"
    | "difficulty_desc"
    | "difficulty_asc"
    | "updated_desc"
    | "updated_asc"
    | "ranked_desc"
    | "ranked_asc"
    | "rating_desc"
    | "rating_asc"
    | "plays_desc"
    | "plays_asc"
    | "favourites_desc"
    | "favourites_asc";
