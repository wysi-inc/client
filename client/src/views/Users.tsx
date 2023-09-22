import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import UserPage from "../pages/UserPage";
import UserCard from "../cards/UserCard";
import axios from "../resources/axios-config";
import { GameModeType } from "../resources/types";
import PageTabs from "../components/PageTabs";
import { colors } from "../resources/store";
import { UserRanks } from "../resources/interfaces/user";

const Users = () => {
    const { urlUser } = useParams();
    const { urlMode } = useParams();

    const [userId, setUserId] = useState<undefined | string>();
    const [userMode, setUserMode] = useState<undefined | GameModeType>();

    const [users, setUsers] = useState<UserRanks[]>([]);
    const [page, setPage] = useState<number>(1);
    const [category, setCategory] = useState<'performance' | 'score'>('performance');
    const [mode, setMode] = useState<GameModeType>('osu');

    const [loading, setLoading] = useState<boolean>(true);

    useEffect((): void => {
        if (urlUser === undefined) {
            setUserId(undefined);
            setUserMode(undefined);
            getUsers(category, mode);
        } else {
            const checkedMode: GameModeType = urlMode?.toLowerCase() as GameModeType;
            setUserMode(checkedMode ? checkedMode : 'default');
            setUserId(urlUser);
            setLoading(false);
        }
    }, [urlUser, urlMode, page]);

    if (userId && userMode) return (<UserPage userId={userId} userMode={userMode} />);

    async function getUsers(c: 'score' | 'performance', m: GameModeType) {
        setLoading(true);
        setCategory(c)
        setMode(m);
        const res = await axios.post('/users',
            {
                mode: m,
                type: c,
                page: page,
            }
        );
        const data = res.data;
        console.log(data);
        setUsers(data.ranking);
        setLoading(false);
    }

    const cardGrid = "grid-cols-1 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9";

    return (
        <div className="flex flex-col p-3 gap-3">
            <div className="grid grid-cols-3">
                <div className="join justify-start">
                    <button className="join-item btn btn-secondary text-base-100 font-bold"
                        onClick={() => {
                            getUsers('performance', mode);
                        }}>Performance</button>
                    <button className="join-item btn btn-secondary text-base-100 font-bold"
                        onClick={() => {
                            getUsers('score', mode);
                        }}>Ranked Score</button>
                </div>
                <div className="flex justify-center">
                    <PageTabs setNewPage={setPage} current={page} min={1} max={200} />
                </div>
                <div className="join justify-end">
                    <button className="join-item btn btn-secondary text-base-100 font-bold"
                        onClick={() => {
                            getUsers(category, 'osu');
                        }}>osu</button>
                    <button className="join-item btn btn-secondary text-base-100 font-bold"
                        onClick={() => {
                            getUsers(category, 'taiko');
                        }}>taiko</button>
                    <button className="join-item btn btn-secondary text-base-100 font-bold"
                        onClick={() => {
                            getUsers(category, 'fruits');
                        }}>fruits</button>
                    <button className="join-item btn btn-secondary text-base-100 font-bold"
                        onClick={() => {
                            getUsers(category, 'mania');
                        }}>mania</button>
                </div>
            </div>
            <div className="bg-accent-900 p-3 rounded-xl">
                <div className="p-3">
                    <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3 items-center">
                        <div className={`me-9 col-start-2 col-span-2 md:col-start-3 md:col-span-1 lg:col-start-2 lg:col-span-2 grid ${cardGrid} items-center text-accent-300`}>
                            <div className={`${category === 'performance' && 'text-white'}`}>PP:</div>
                            <div className="hidden md:block">Acc:</div>
                            <div className="hidden md:block">Play Time:</div>
                            <div className="hidden md:block">Play Count:</div>
                            <div className={`hidden lg:block col-span-2 ${category === 'score' && 'text-white'}`}>Ranked Score:</div>
                            <div className="hidden xl:grid grid-cols-5 gap-4 col-span-3">
                                <div style={{ color: colors.ranks.xh }}>XH:</div>
                                <div style={{ color: colors.ranks.x }}>X:</div>
                                <div style={{ color: colors.ranks.sh }}>SH:</div>
                                <div style={{ color: colors.ranks.s }}>S:</div>
                                <div style={{ color: colors.ranks.a }}>A:</div>
                            </div>
                        </div>
                    </div>
                </div>
                {loading ? <div>loading...</div> :
                    <div className="grid grid-cols-1 gap-2 grow">
                        {users.map((user, index) =>
                            <UserCard mode={mode} grid={cardGrid} user={user} category={category} index={index + (50 * (page - 1) + 1)} key={index} />
                        )}
                    </div>}
            </div>
            {!loading && <PageTabs setNewPage={setPage} current={page} min={1} max={200} />}
        </div>
    );
}
export default Users;