export type ColorsInterface = {
  ui: {
    font: string;
    bg: string;
    main: string;
    accent: string;
  };
  modes: {
    any: string;
    osu: string;
    taiko: string;
    fruits: string;
    mania: string;
  };
  judgements: {
    x320: string;
    x300: string;
    x200: string;
    x100: string;
    x50: string;
    x20: string;
    xMiss: string;
  };
  beatmap: {
    any: string;
    graveyard: string;
    wip: string;
    pending: string;
    ranked: string;
    approved: string;
    qualified: string;
    loved: string;
  };
  ranks: {
    xh: string;
    x: string;
    sh: string;
    s: string;
    a: string;
    b: string;
    c: string;
    d: string;
    f: string;
  };
  charts: {
    lvl: string;
    skills: string;
    global: string;
    country: string;
    plays: string;
    topPp: string;
  };
  difficulty: string[];
}

export type LanguageProgress = {
  id: string,
  name: string,
  progress: number,
  approval: number,
}

export type GameMode = 'osu' | 'mania' | 'fruits' | 'taiko' | 'default';
export const GameModes: GameMode[] = ['osu', 'mania', 'fruits', 'taiko']