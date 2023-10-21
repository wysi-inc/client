import { useEffect, useState } from "react";
import { Beatmap } from "../types/beatmapset";
import fina from "../../helpers/fina";
import { getModsInt } from "../global/functions";

export function useStats(beatmap: Beatmap | undefined, acc: number, mods: string[]) {    
    interface INITIAL {
        pp: number | undefined,
        bpm: number,
        len: number,
        sr: number,
        ar: number,
        cs: number,
        od: number,
        hp: number,
    }
    
    const INITIAL_SET_STATS: INITIAL = {
        pp: undefined,
        bpm: 0,
        len: 0,
        sr: 0,
        ar: 0,
        cs: 0,
        od: 0,
        hp: 0,
    }

    const [stats, setStats] = useState(INITIAL_SET_STATS);

    useEffect(() => {
        getStats();
    }, [beatmap, acc, mods])

    async function getStats() {
        if (!beatmap) return;
        try {
            const url = `https://catboy.best/api/meta/${beatmap.id}?misses=0&acc=${acc}&mods=${getModsInt(mods)}`;
            const d = await fina.nget(url);
            d.pp[acc]?.pp && setStats(prev => ({ ...prev, pp: Math.round(d.pp[acc].pp) }));
            setStats(prev => ({ ...prev, sr: d.difficulty.stars.toFixed(2) }))
            setStats(prev => ({ ...prev, bpm: Math.round(d.map.bpm) }))

            setStats(prev => ({ ...prev, ar: d.map.ar.toFixed(1) }))
            setStats(prev => ({ ...prev, cs: d.map.cs.toFixed(1) }))
            setStats(prev => ({ ...prev, od: d.map.od.toFixed(1) }))
            setStats(prev => ({ ...prev, hp: d.map.hp.toFixed(1) }))

            if (mods.includes('DT')) setStats(prev => ({ ...prev, len: beatmap.total_length * 0.75 }));
            else if (mods.includes('HT')) setStats(prev => ({ ...prev, len: beatmap.total_length * 1.5 }));
            else setStats(prev => ({ ...prev, len: beatmap.total_length }));
        } catch (err) {
            console.error(err);
        }
    }

    return stats;
}