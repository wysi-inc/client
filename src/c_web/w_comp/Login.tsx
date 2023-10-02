import { useEffect } from "react";
import { UserStore, UserStoreInt } from "../../resources/store/user";
import { Link } from "react-router-dom";
import axios from "../../resources/axios-config";
import { alertManager, alertManagerInterface } from "../../resources/store/tools";
import env from "react-dotenv";

const Login = () => {
    const user = UserStore((state: UserStoreInt) => state.user);
    const logout = UserStore((state: UserStoreInt) => state.logout);
    const login = UserStore((state: UserStoreInt) => state.login);
    const addAlert = alertManager((state: alertManagerInterface) => state.addAlert);

    useEffect(() => {
        if (user.id === 0) {
            isLogged()
        }
    }, []);

    if (user.id === 0) {
        return (
            <a href={encodeURI(`https://osu.ppy.sh/oauth/authorize?client_id=${env.CLIENT_ID}&redirect_uri=${env.CLIENT_REDIRECT}&response_type=code&scope=identify`)}
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
            logout();
        }
        try {
            const d = (await axios.post('/isLogged')).data;
            if (d.logged) {
                const t = d.jwtUser;
                localStorage.setItem('jwt', t);
                const payload: string = t.split('.')[1];
                const decodedString = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
                const jsonData = JSON.parse(decodedString);
                login(jsonData.id, jsonData.name, jsonData.pfp);
            } else {
                logout();
            }
        } catch (err) {
            addAlert('error', 'Failed to validate login');
            console.error(err);
            logout();
        }
    }
}

export default Login;