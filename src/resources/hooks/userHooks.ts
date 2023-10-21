import { useEffect, useState } from "react";

import { User } from "../types/user";
import fina from "../../helpers/fina";
import { GameMode } from "../types/general";
import { BeatmapsObj } from "../types/beatmapset";
import { Score, ScoresObj, ScoreCategory } from "../types/score";
import { alertManager, alertManagerInterface } from "../global/tools";
export function useGetUser(id: string, m: GameMode) {
    const addAlert = alertManager((state: alertManagerInterface) => state.addAlert);

    const BEATMAPS_INITIAL: BeatmapsObj = {
        favourite: [],
        ranked: [],
        guest: [],
        loved: [],
        nominated: [],
        pending: [],
        graveyard: [],
    }
    const SCORES_INITIAL: ScoresObj = {
        pinned: [],
        best: [],
        firsts: [],
        recent: [],
    }

    const [user, setUser] = useState<User | null | undefined>(undefined);
    const [mode, setMode] = useState<GameMode>('osu');
    const [scores, setScores] = useState<ScoresObj>(SCORES_INITIAL);
    const [beatmaps, setBeatmaps] = useState<BeatmapsObj>(BEATMAPS_INITIAL);

    useEffect(() => {
        clearData();
        getUser();
    }, [id, m]);

    function clearData(): void {
        setUser(undefined);
        setMode('default');
        setScores(SCORES_INITIAL);
        setBeatmaps(BEATMAPS_INITIAL);
    }

    async function getUser() {
        try {
            const d = await fina.post('/user', {
                id, mode
            });
            if (d.error === null) {
                setUser(null);
                addAlert('warning', "This user doesn't exist");
                return;
            };
            const user: User = d;
            console.log(user);
            if (user.is_bot) {
                addAlert('warning', 'This user is a bot, bots are not supported yet :(');
                setUser(null);
                return;
            };
            setUser(d);
            let searchMode: GameMode;

            if (mode === "default") searchMode = user.playmode;
            else searchMode = mode;

            window.history.replaceState({}, '', `/users/${user.id}/${searchMode}`);

            getBest(user.id, searchMode, 'best', 100, 0);
            setMode(searchMode);
        } catch (err) {
            addAlert('warning', "This user doesn't exist");
            console.error(err);
            setUser(null);
        }
    }

    async function getBest(id: number, m: GameMode, t: ScoreCategory, l: number, o: number) {
        try {
            const d: Score[] = await fina.post('/userscores', {
                id: id,
                mode: m,
                limit: l,
                offset: o,
                type: t
            });
            if (d.length < 1) return;
            setScores((prev) => ({ ...prev, best: [...prev.best, ...d] }));
        } catch (err) {
            console.error(err);
        }
    }

    return { user, mode, scores, setScores, beatmaps, setBeatmaps };
}