import { useGetUser } from "../../resources/hooks/userHooks";
import { useHeight } from "../../resources/hooks/windowHooks";
import SetupPanel from "./u_panels/SetupPanel";
import HistoryPanel from "./u_panels/HistoryPanel";
import MedalsPanel from "./u_panels/MedalsPanel";
import ScoresPanel from "./u_panels/ScoresPanel";
import BeatmapsPanel from "./u_panels/BeatmapsPanel";
import SkinPanel from "./u_panels/SkinPanel";
import BarPanel from "./u_panels/BarPanel";
import TopPanel from "./u_panels/TopPanel";
import { GameModeType } from "../../resources/interfaces/user";

interface UserPageProps {
    userId: string;
    userMode: GameModeType;
}

const UserPage = (p: UserPageProps) => {

    const { user, mode, scores, setScores, beatmaps, setBeatmaps } = useGetUser(p.userId, p.userMode);

    const height = useHeight(700);

    if (user === undefined) return <div className="loading loading-dots loading-md"></div>
    if (user === null) return <></>

    const CSS = "bg-custom-950 overflow-hidden rounded-lg drop-shadow-lg flex flex-col col-span-5";

    return <>
        <TopPanel user={user} mode={mode} />
        <div className="flex flex-row flex-wrap gap-4 items-center p-4 m-0 drop-shadow-lg bg-custom-800">
            <BarPanel user={user} />
        </div>
        <div className="grid grid-cols-5 gap-4 p-4">
            <SkinPanel className={`${CSS} xl:col-span-2`} />
            <SetupPanel className={`${CSS} xl:col-span-3`} id={user.id} setup={user.db_info.setup} />
            <HistoryPanel className={`${CSS} xl:col-span-3`} ref={height.ref} user={user} best={scores.best} />
            <ScoresPanel className={`${CSS} xl:col-span-2`} heigth={height.px} user={user} mode={mode} scores={scores} setScores={setScores} />
            <BeatmapsPanel className={`${CSS} xl:col-span-2`} height={height.px} user={user} beatmaps={beatmaps} setBeatmaps={setBeatmaps} />
            <MedalsPanel className={`${CSS} xl:col-span-3`} heigth={height.px} user={user} />
        </div>
    </>
}

export default UserPage;