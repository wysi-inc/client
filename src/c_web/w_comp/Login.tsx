import { useEffect } from "react";
import { UserStore, UserStoreInt } from "../../resources/store/user";
import { Link } from "react-router-dom";
import { alertManager, alertManagerInterface } from "../../resources/store/tools";
import fina from "../../helpers/fina";
import { settings } from "../../env";
import { useTranslation } from "react-i18next";

const Login = () => {
    const { t } = useTranslation();
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
        return <a href={encodeURI(url)} className="normal-case btn btn-primary text-base-100">{t('nav.log.login')}</a>
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
                    {t('nav.log.osu')}
                </Link></li>
                <li><a href={`https://osu.ppy.sh/users/${user.id}`} target="_blank" rel="noreferrer">
                    {t('nav.log.wysi')}
                </a></li>
                <hr />
                <li><button onClick={logout}>{t('nav.log.logout')}</button></li>
            </ul>
        </div>
    )

    async function isLogged() {
        const token = localStorage.getItem('jwt');
        const id = Number(localStorage.getItem('id'));
        const name = `${localStorage.getItem('name')}`;
        const pfp = `${localStorage.getItem('pfp')}`;
        if (!token || !id || !name || !pfp) return;
        login(id, name, pfp);
        try {
            const d = await fina.post("/isLogged", { token });
            if (d.logged) {
                const { user } = d;
                login(user.id, user.name, user.pfp);
                fina.defaults.token = token;
            } else {
                addAlert('error', 'Failed to validate login');
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