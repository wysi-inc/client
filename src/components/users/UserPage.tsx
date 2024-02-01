import BarPanel from "./u_panels/BarPanel";
import TopPanel from "./u_panels/TopPanel";
import SkinPanel from "./u_panels/SkinPanel";
import SetupPanel from "./u_panels/SetupPanel";
import MedalsPanel from "./u_panels/MedalsPanel";
import ScoresPanel from "./u_panels/ScoresPanel";
import HistoryPanel from "./u_panels/HistoryPanel";
import BeatmapsPanel from "./u_panels/BeatmapsPanel";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import fina from "../../helpers/fina";
import { alertManager, alertManagerInterface } from "../../resources/global/tools";
import { User } from "../../resources/types/user";
import { GameMode } from "../../resources/types/general";
import Loading from "../../web/w_comp/Loading";
import MostPlayed from "./u_panels/MostPlayed";
import ScoresSumary from "./u_panels/ScoresSumary";

const UserPage = () => {
    const addAlert = alertManager((state: alertManagerInterface) => state.addAlert);

    const { urlUser } = useParams();
    const { urlMode } = useParams();

    const { data: userData, status: userStatus } = useQuery(['user', urlUser, urlMode], getUser);

    function getUser() {
        return fina.get(`/users/${urlUser}/${urlMode}`);
    }

    console.log(userData);

    if (userStatus === 'loading') return <Loading />

    if (userStatus === 'error') {
        addAlert('warning', "This user doesn't exist");
        return <></>
    }

    const user: User = userData as any;
    const mode: GameMode = (urlMode as GameMode) ? urlMode as GameMode : user.playmode;

    window.history.replaceState({}, '', `/users/${user.id}/${mode}`);

    const CSS = "bg-custom-950 rounded-lg drop-shadow-lg flex flex-col";
    return <>
        <TopPanel user={user} mode={mode} />
        <BarPanel user={user} />
        <div className="flex flex-col gap-4 p-4">
            <HistoryPanel className={CSS} user={user} mode={mode} />
            <ScoresSumary className={CSS} userId={user.id} mode={mode} />
            <SkinPanel className={CSS} />
            <SetupPanel className={CSS} userId={user.id} setup={user.db_info.setup} playstyle={user.playstyle} />
            <ScoresPanel className={CSS} user={user} mode={mode} />
            <BeatmapsPanel className={CSS} user={user} />
            <MostPlayed className={CSS} userId={user.id} />
            <MedalsPanel className={CSS} user={user} />
        </div>
    </>
}

export default UserPage;
