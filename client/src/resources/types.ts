export type GameModeType = 'osu' | 'mania' | 'fruits' | 'taiko' | 'default';
export type BeatmapType = 'pinned' | 'firsts' | 'recent' | 'best';
export type SongLanguageType =
    | ""
    | "English"
    | "Chinese"
    | "French"
    | "German"
    | "Italian"
    | "Japanese"
    | "Korean"
    | "Spanish"
    | "Swedish"
    | "Russian"
    | "Polish"
    | "Instrumental"
    | "Unspecified"
    | "Other";

export type SongGenreType =
    | ""
    | "Video Game"
    | "Anime"
    | "Rock"
    | "Pop"
    | "Other"
    | "Novelty"
    | "Hip Hop"
    | "Electronic"
    | "Metal"
    | "Classical"
    | "Folk"
    | "Jazz"
    | "Unspecified";

export type SongSectionType =
    | ""
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
