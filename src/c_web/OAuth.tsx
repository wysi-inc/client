import React, { useEffect } from "react";
import axios from "../resources/axios-config";
import { UserStore, UserStoreInt } from "../resources/store/user";
import { User } from "../resources/interfaces/user";
import { alertManager, alertManagerInterface } from "../resources/store/tools";
import { useNavigate } from "react-router-dom";

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
            const d = (await axios.post('/login', { code: code })).data;
            if (d.authentication) {
                addAlert('error', 'OAuth failed :(');
                sendHome();
                return;
            }
            const u: User = d.user;
            const t = d.jwtUser;
            localStorage.setItem('jwt', t);
            login(u.id, u.username, u.avatar_url);
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