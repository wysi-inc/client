import BarPanel from "./u_panels/BarPanel";
import TopPanel from "./u_panels/TopPanel";
import SkinPanel from "./u_panels/SkinPanel";
import SetupPanel from "./u_panels/SetupPanel";
import MedalsPanel from "./u_panels/MedalsPanel";
import ScoresPanel from "./u_panels/ScoresPanel";
import HistoryPanel from "./u_panels/HistoryPanel";
import BeatmapsPanel from "./u_panels/BeatmapsPanel";
import { useDivSize } from "../../resources/hooks/globalHooks";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import fina from "../../helpers/fina";
import { alertManager, alertManagerInterface } from "../../resources/global/tools";
import { User } from "../../resources/types/user";
import { Score } from "../../resources/types/score";
import { GameMode } from "../../resources/types/general";
import Loading from "../../web/w_comp/Loading";

const UserPage = () => {
    const addAlert = alertManager((state: alertManagerInterface) => state.addAlert);

    const { urlUser } = useParams();
    const { urlMode } = useParams();

    const { data: userData, status: userStatus } = useQuery('user', getUser);

    const mode = urlMode as GameMode;

    function getUser() {
        return fina.post('/user', { id: urlUser, mode: urlMode });
    }

    const { divPx, divRef } = useDivSize('h', 700);

    if (userStatus === 'loading') return <Loading/>
    
    if (userStatus === 'error') {
        addAlert('warning', "This user doesn't exist");
        return <></>
    }

    const user: User = userData as any;
    
    const CSS = "bg-custom-950 overflow-hidden rounded-lg drop-shadow-lg flex flex-col col-span-5";

    return <>
        <TopPanel user={user} mode={user.playmode} />
        <BarPanel user={user} />
        <div className="grid grid-cols-5 gap-4 p-4">
            <HistoryPanel className={`${CSS} xl:col-span-3`} ref={divRef} user={user} />
            <ScoresPanel className={`${CSS} xl:col-span-2`} heigth={divPx} user={user} mode={mode} />
            <SkinPanel className={`${CSS} xl:col-span-2`} />
            <SetupPanel className={`${CSS} xl:col-span-3`} id={user.id} setup={user.db_info.setup} playstyle={user.playstyle} />
            <MedalsPanel className={`${CSS} xl:col-span-3`} heigth={divPx} user={user} />
            <BeatmapsPanel className={`${CSS} xl:col-span-2`} height={divPx} user={user} />
        </div>
    </>
}

export default UserPage;