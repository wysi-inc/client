import { useEffect } from "react";
import { UserStore, UserStoreInt } from "../resources/global/user";
import { User } from "../resources/types/user";
import { alertManager, alertManagerInterface } from "../resources/global/tools";
import { useNavigate } from "react-router-dom";
import fina from "../helpers/fina";

const OAuth = () => {
    const login = UserStore((state: UserStoreInt) => state.login);
    const addAlert = alertManager((state: alertManagerInterface) => state.addAlert);
    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(window.location.search)
        const code = query.get('code');
        if (code === undefined) sendHome();
        window.history.replaceState({}, '', '/oauth-redirect');
        sendUrl(`${code}`);
    }, [])

    async function sendUrl(code: string) {
        try {
            const d = await fina.post('/login', { code: code });
            if (d.authentication) {
                addAlert('error', 'OAuth failed :(');
                sendHome();
                return;
            }
            const u: User = d.user;
            const t = d.jwtUser;
            login(u.id, u.username, u.avatar_url, t);
            sendHome();
        } catch (err) {
            console.error(err);
            addAlert('error', 'OAuth failed :(');
            sendHome();
        }
    }

    function sendHome() {
        navigate("/");
    }

    return (
        <span className="loading loading-dots loading-lg"></span>
    )
}

export default OAuth;