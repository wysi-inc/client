import { useEffect, useState } from "react";
import fina from "../../helpers/fina";
import { alertManager, alertManagerInterface } from "../global/tools";
import { GameModeType, User } from "../interfaces/user";
import { Score, ScoreType, ScoresObj } from "../interfaces/score";
import { BeatmapsObj } from "../interfaces/beatmapset";

export function useGetUser(id: string, m: GameModeType) {
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
    const [mode, setMode] = useState<GameModeType>('osu');
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
            let searchMode: GameModeType;

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

    async function getBest(id: number, m: GameModeType, t: ScoreType, l: number, o: number) {
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