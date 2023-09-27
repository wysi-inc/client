import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import UserPage from "../pages/UserPage";
import UserCard from "../cards/UserCard";
import axios from "../resources/axios-config";
import { GameModeType } from "../resources/types";
import PageTabs from "../components/PageTabs";
import { UserRanks } from "../resources/interfaces/user";
import { useDebounce } from "@uidotdev/usehooks";

const Users = () => {
    const { urlUser } = useParams();
    const { urlMode } = useParams();

    const [userId, setUserId] = useState<undefined | string>();
    const [userMode, setUserMode] = useState<undefined | GameModeType>();

    const [users, setUsers] = useState<UserRanks[]>([]);
    const [page, setPage] = useState<number>(1);
    const [actualPage, setActualPage] = useState<number>(1);
    const [category, setCategory] = useState<'performance' | 'score'>('performance');
    const [mode, setMode] = useState<GameModeType>('osu');

    const debouncedValue = useDebounce(page, 500);

    useEffect((): void => {
        setActualPage(page);
        if (urlUser === undefined) {
            setUserId(undefined);
            setUserMode(undefined);
            getUsers(category, mode);
        } else {
            const checkedMode: GameModeType = urlMode?.toLowerCase() as GameModeType;
            setUserMode(checkedMode ? checkedMode : 'default');
            setUserId(urlUser);
        }
    }, [urlUser, urlMode, debouncedValue]);

    if (userId && userMode) return (<UserPage userId={userId} userMode={userMode} />);

    async function getUsers(c: 'score' | 'performance', m: GameModeType) {
        try {
            setUsers([]);
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
            setUsers(data.ranking);
        } catch (err) {
            console.error(err);
        }
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
                <table className="border-separate border-spacing-y-1 w-full">
                    <thead>
                        <tr>
                            <th className="text-start"></th>
                            <th className="text-start"></th>
                            <th className="text-start"></th>
                            <th className="text-start">PP</th>
                            <th className="text-start">Acc</th>
                            <th className="text-start">Play Time</th>
                            <th className="text-start">Play Count</th>
                            <th className="text-start">Score</th>
                            <th className="text-start">Grades</th>
                        </tr>
                    </thead>
                    <tbody className="mt-3">
                        {users.length > 0 ?
                            users.map((user, index) =>
                                <UserCard mode={mode} grid={cardGrid} user={user} category={category} index={index + (50 * (actualPage - 1) + 1)} key={index} />
                            ) : 
                            <span className="loading loading-dots loading-md"></span>}
                    </tbody>
                </table>
            </div>
            {users.length > 0 && <PageTabs setNewPage={setPage} current={page} min={1} max={200} />}
        </div>
    );
}
export default Users;