import { useEffect } from "react";
import { UserStore } from "../../resources/store/user";
import { Link } from "react-router-dom";
import axios from "../../resources/axios-config";
import { User } from "../../resources/interfaces/user";
import { alertManager, alertManagerInterface } from "../../resources/store/tools";

const Login = () => {
    const user = UserStore((state: UserStore) => state.user);
    const logout = UserStore((state: UserStore) => state.logout);
    const login = UserStore((state: UserStore) => state.login);
    const addAlert = alertManager((state: alertManagerInterface) => state.addAlert);

    const client_id = 22795;
    const redirect_uri = 'https://wysi727.com/oauth-redirect';
    const response_type = 'code';
    const scope = 'identify';

    const url = `https://osu.ppy.sh/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`

    useEffect(() => {
        if (user.id === 0) {
            isLogged()
        }
    }, []);

    if (user.id === 0) {
        return (
            <a href={encodeURI(url)}
                className="normal-case btn btn-primary text-base-100">
                Login with osu!
            </a>
        )
    }

    return (
        <div className="dropdown dropdown-bottom dropdown-end">
            <label tabIndex={0} className="cursor-pointer darkenOnHover">
                <div className="avatar">
                    <div className="w-10 rounded-lg">
                        <img src={user.pfp} alt="pfp" />
                    </div>
                </div>
            </label>
            <ul tabIndex={0} className="dropdown-content z-[10] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><Link to={`/users/${user.id}`}>
                    wysi!profile
                </Link></li>
                <li><a href={`https://osu.ppy.sh/users/${user.id}`} target="_blank" rel="noreferrer">
                    osu!profile
                </a></li>
                <hr />
                <li><button onClick={logout}>Logout</button></li>
            </ul>
        </div>
    )

    async function isLogged() {
        try {
            const token: string = `${localStorage.getItem('jwt')}`;
            const payload: string = token.split('.')[1];
            const decodedString = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
            const jsonData = JSON.parse(decodedString);
            login(jsonData.id, jsonData.name, jsonData.pfp);
        } catch (err) {
            console.error(err);
            logout();
        }
        try {
            const d = (await axios.post('/isLogged')).data;
            if (d.logged) {
                const u: User = (await axios.post('/user', {
                    id: d.user,
                    mode: "default",
                })).data;
                login(u.id, u.username, u.avatar_url);
            }
        } catch (err) {
            addAlert('error', 'Failed to validate logi');
            console.error(err);
            logout();
        }
    }
}

export default Login;