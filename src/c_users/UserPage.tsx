import { useEffect, useRef, useState } from "react";
import { GameModeType } from "../resources/types";
import { Score } from "../resources/interfaces/score";
import { User } from "../resources/interfaces/user";
import { alertManager, alertManagerInterface } from "../resources/store/tools";
import { BeatmapsObj, ScoresObj, scoreCategoryType, } from "./u_interfaces";
import SetupPanel from "./u_panels/SetupPanel";
import HistoryPanel from "./u_panels/HistoryPanel";
import MedalsPanel from "./u_panels/MedalsPanel";
import ScoresPanel from "./u_panels/ScoresPanel";
import BeatmapsPanel from "./u_panels/BeatmapsPanel";
import fina from "../helpers/fina";
import SkinPanel from "./u_panels/SkinPanel";
import BarPanel from "./u_panels/BarPanel";
import TopPanel from "./u_panels/TopPanel";

interface UserPageProps {
    userId: string;
    userMode: GameModeType;
}

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

const UserPage = (props: UserPageProps) => {
    const addAlert = alertManager((state: alertManagerInterface) => state.addAlert);

    const [userData, setUserData] = useState<User | null | undefined>(undefined);
    const [gameMode, setGameMode] = useState<GameModeType>('osu');

    const [scores, setScores] = useState<ScoresObj>(SCORES_INITIAL);
    const [beatmaps, setBeatmaps] = useState<BeatmapsObj>(BEATMAPS_INITIAL);

    const ref = useRef<HTMLDivElement | null>(null);
    const [height, setHeight] = useState(700);

    useEffect(() => {
        const handleResize = () => {
            console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
            if (ref) if (ref.current)
            setHeight(ref.current?.clientHeight);
        }
        window.addEventListener('resize', handleResize)
    }, []);

    useEffect((): void => {
        clearData();
        getUser();
    }, [props.userId, props.userMode]);

    if (userData === undefined) {
        return (
            <span className="loading loading-dots loading-md"></span>
        )
    }
    if (userData === null) {
        return (
            <></>
        )
    }

    const CSS = "bg-custom-950 overflow-hidden rounded-lg drop-shadow-lg flex flex-col col-span-5";

    return (<>
        <TopPanel user={userData} mode={gameMode} />
        <div className="flex flex-row flex-wrap gap-4 items-center p-4 m-0 drop-shadow-lg bg-custom-800">
            <BarPanel user={userData} />
        </div>
        <div className="grid grid-cols-5 gap-4 p-4">
            <SkinPanel className={`${CSS} xl:col-span-2`} />
            <SetupPanel className={`${CSS} xl:col-span-3`} id={userData.id} setup={userData.db_info.setup} />
            <HistoryPanel className={`${CSS} xl:col-span-3`} ref={ref} user={userData} best={scores.best} />
            <ScoresPanel className={`${CSS} xl:col-span-2`} heigth={height} user={userData} mode={gameMode} scores={scores} setScores={setScores} />
            <BeatmapsPanel className={`${CSS} xl:col-span-2`} height={height} user={userData} beatmaps={beatmaps} setBeatmaps={setBeatmaps} />
            <MedalsPanel className={`${CSS} xl:col-span-3`} heigth={height} user={userData} />
        </div>
    </>)

    function clearData(): void {
        setUserData(undefined);
        setGameMode('default');
        setScores(SCORES_INITIAL);
        setBeatmaps(BEATMAPS_INITIAL);
    }

    async function getUser() {
        try {
            const d = await fina.post('/user', {
                id: props.userId,
                mode: props.userMode,
            });
            if (d.error === null) {
                setUserData(null);
                addAlert('warning', "This user doesn't exist");
                return;
            };
            const user: User = d;
            console.log(user);
            if (user.is_bot) {
                addAlert('warning', 'This user is a bot, bots are not supported yet :(');
                setUserData(null);
                return;
            };
            setUserData(d);
            let searchMode: GameModeType;

            if (props.userMode === "default") searchMode = user.playmode;
            else searchMode = props.userMode;

            window.history.replaceState({}, '', `/users/${user.id}/${searchMode}`);

            getBest(user.id, searchMode, 'best', 100, 0);
            setGameMode(searchMode);
        } catch (err) {
            addAlert('warning', "This user doesn't exist");
            console.error(err);
            setUserData(null);
        }
    }

    async function getBest(id: number, m: GameModeType, t: scoreCategoryType, l: number, o: number) {
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

}
export default UserPage;