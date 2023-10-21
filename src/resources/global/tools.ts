import { create } from "zustand";
import { ColorsInterface } from "../types/general";
import { alertProps, alertType } from "../../web/w_comp/AlertManager";

export const colors: ColorsInterface = {
    ui: {
        font: '#f5f5f5',
        bg: '#212529',
        main: '#b74757',
        accent: '#ffb86b',
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
        qualified: '#4cb6ff',
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
    play: (id: number, title: string, artist: string) => void;
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
        play: (id: number, title: string, artist: string) => {
            set({ playing: true, mp3: `https://catboy.best/preview/audio/${id}?set=1`, title: title, artist: artist })
        },
        pause: () => {
            set({ playing: false, mp3: '' })
        }
    })
)

export const modsInt = {
    "NM": 0,
    "NF": 1,
    "EZ": 2,
    "TD": 4,
    "HD": 8,
    "HR": 16,
    "SD": 32,
    "DT": 64,
    "RX": 128,
    "HT": 256,
    "NC": 512,
    "FL": 1024,
    "Autoplay": 2048,
    "SO": 4096,
    "AP": 8192,
    "PF": 16384,
    "4K": 32768,
    "5K": 65536,
    "6K": 131072,
    "7K": 262144,
    "8K": 524288,
    "FI": 1048576,
    "RD": 2097152,
    "LastMod": 4194304,
    "9K": 16777216,
    "10K": 33554432,
    "1K": 67108864,
    "3K": 134217728,
    "2K": 268435456,
    "ScoreV2": 536870912,
    "MR": 1073741824
}


export interface alertManagerInterface {
    lastId: number,
    alerts: alertProps[],
    addAlert: (ty: alertType, txt: string) => void,
    delAlert: (id: number) => void,
}

export const alertManager = create<alertManagerInterface>(
    (set) => ({
        lastId: 0,
        alerts: [],
        addAlert: (ty: alertType, txt: string) => set((s) => ({ lastId: s.lastId + 1, alerts: [...s.alerts, { id: s.lastId + 1, type: ty, text: txt }] })),
        delAlert: (id: number) => set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
    })
)