import {ColorsInterface} from "./interfaces";
import {create} from "zustand";

export const colors: ColorsInterface = {
    ui: {
        font: '#f5f5f5',
        bg: '#212529',
        main: '#b74757',
    },
    modes: {
        any: "#f0f0f0",
        osu: "#e1567d",
        taiko: "#7de17d",
        fruits: "#7db8e1",
        mania: "#9b7de1"
    },
    judgements: {
        x320: '#bbbbbb',
        x300: '#78dcec',
        x200: '#2266ff',
        x100: '#88e55d',
        x50: '#fdfd97',
        x20: '#bbbbbb',
        xMiss: '#f87454',
    },
    ranks: {
        xh: '#f0f0f0',
        x: '#faf56a',
        sh: '#f8f4f4',
        s: '#ffdc4c',
        a: '#88e55d',
        b: '#78dcec',
        c: '#bc64f4',
        d: '#f87454',
        f: '#aaaaaa'
    },
    beatmap: {
        any: '#f0f0f0',
        graveyard: '#cccccc',
        wip: '#fe9967',
        pending: '#ffd966',
        ranked: '#66ccff',
        approved: '#b3ff66',
        qualified: '#b3ff66',
        loved: '#fe67ab',
    },
    charts: {
        lvl: '#ffffff',
        skills: '#ffffff',
        global: '#ffdc4c',
        country: '#ffdc4c',
        plays: '#ffdc4c',
        topPp: '#78dcec'
    },
    difficulty: [
        '#4290fe',
        '#4cb6ff',
        '#4fffd4',
        '#cdf458',
        '#fc9964',
        '#f64d7a',
        '#ad4dc2',
        '#4d4bc4',
        '#12106a',
        '#000000',
        '#000000'
    ]
}

export interface PlayerStoreInterface {
    playing: boolean;
    mp3: string;
    title: string;
    artist: string;
    volume: number;
    muted: boolean;
    play: (mp3: string, title: string, artist: string) => void;
    pause: () => void;
}

export const playerStore = create<PlayerStoreInterface>(
    (set) => ({
        playing: false,
        mp3: '',
        title: '',
        artist: '',
        volume: 10,
        muted: false,
        play: (mp3: string, title: string, artist: string) => {
            set({playing: true, mp3: mp3, title: title, artist: artist})
            console.log(mp3)
        },
        pause: () => {
            set({playing: false, mp3: ''})
        }
    })
)