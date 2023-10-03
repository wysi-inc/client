import { useEffect } from "react";
import { UserStore, UserStoreInt } from "../../resources/store/user";
import { Link } from "react-router-dom";
import { alertManager, alertManagerInterface } from "../../resources/store/tools";
import fina from "../../helpers/fina";
import { settings } from "../../env";

const Login = () => {
    const user = UserStore((state: UserStoreInt) => state.user);
    const logout = UserStore((state: UserStoreInt) => state.logout);
    const login = UserStore((state: UserStoreInt) => state.login);
    const addAlert = alertManager((state: alertManagerInterface) => state.addAlert);

    const url = `https://osu.ppy.sh/oauth/authorize?client_id=${settings.client_id}&redirect_uri=${settings.client_redirect}&response_type=code&scope=identify`

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

            const id = Number(localStorage.getItem('id'));
            const name = `${localStorage.getItem('name')}`;
            const pfp = `${localStorage.getItem('pfp')}`;

            if(!id){
                throw new Error('No login');
            }

            login(id, name, pfp);
        } catch (err) {
            logout();
        }
        const token = localStorage.getItem('jwt');
        if(!token) return;
        console.log('paso');

        try {
            const d = await fina.post("/isLogged", {
                token
            });

            console.log(d);

            if (d.logged) {
                const { user } = d;
                login(user.id, user.name, user.pfp);
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