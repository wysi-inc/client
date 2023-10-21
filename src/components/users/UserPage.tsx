import BarPanel from "./u_panels/BarPanel";
import TopPanel from "./u_panels/TopPanel";
import SkinPanel from "./u_panels/SkinPanel";
import SetupPanel from "./u_panels/SetupPanel";
import MedalsPanel from "./u_panels/MedalsPanel";
import ScoresPanel from "./u_panels/ScoresPanel";
import HistoryPanel from "./u_panels/HistoryPanel";
import BeatmapsPanel from "./u_panels/BeatmapsPanel";
import { GameMode } from "../../resources/types/general";
import { useGetUser } from "../../resources/hooks/userHooks";
import { useDivSize } from "../../resources/hooks/globalHooks";

interface Props {
    userId: string;
    userMode: GameMode;
}

const UserPage = (p: Props) => {

    const { user, mode, scores, setScores, beatmaps, setBeatmaps } = useGetUser(p.userId, p.userMode);

    const { divPx, divRef } = useDivSize('h', 700);

    if (user === undefined) return <div className="loading loading-dots loading-md"></div>
    if (user === null) return <></>

    const CSS = "bg-custom-950 overflow-hidden rounded-lg drop-shadow-lg flex flex-col col-span-5";

    return <>
        <TopPanel user={user} mode={mode} />
        <BarPanel user={user} />
        <div className="grid grid-cols-5 gap-4 p-4">
            <HistoryPanel className={`${CSS} xl:col-span-3`} ref={divRef} user={user} best={scores.best} />
            <ScoresPanel className={`${CSS} xl:col-span-2`} heigth={divPx} user={user} mode={mode} scores={scores} setScores={setScores} />
            <SkinPanel className={`${CSS} xl:col-span-2`} />
            <SetupPanel className={`${CSS} xl:col-span-3`} id={user.id} setup={user.db_info.setup} playstyle={user.playstyle} />
            <MedalsPanel className={`${CSS} xl:col-span-3`} heigth={divPx} user={user} />
            <BeatmapsPanel className={`${CSS} xl:col-span-2`} height={divPx} user={user} beatmaps={beatmaps} setBeatmaps={setBeatmaps} />
        </div>
    </>
}

export default UserPage;
