import React, { useEffect } from "react";
import { UserStore } from "../../resources/store/user";
import { Link } from "react-router-dom";
import axios from "../../resources/axios-config";

const Login = () => {
    const user = UserStore((state: UserStore) => state.user);
    const logout = UserStore((state: UserStore) => state.logout);

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
            <label tabIndex={0} className="m-1 normal-case btn">
                <div>{user.name}</div>
                <div className="avatar">
                    <div className="w-8 rounded">
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
            const d = await(await axios.post('/isLogged')).data;
            console.log(d);
        } catch (err) {
            console.error(err);
        }
    }
}

export default Login;