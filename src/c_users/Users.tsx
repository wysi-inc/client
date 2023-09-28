import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import UserPage from "./UserPage";
import UserCard from "./UserCard";
import axios from "../resources/axios-config";
import { GameModeType } from "../resources/types";
import PageTabs from "../c_web/w_comp/PageTabs";
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

    useEffect(() => {
        setUsers([]);
    }, [page])

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

    if (!users) return (
        <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Error! Failed to fetch users</span>
        </div>
    );

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
            const data: UserRanks[] = res.data.ranking;
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    }

    const cardGrid = "grid-cols-1 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9";

    return (
        <div className="flex flex-col gap-3 p-3">
            <div className="grid grid-cols-3">
                <div className="justify-start join">
                    <button className="font-bold join-item btn btn-secondary text-base-100"
                        onClick={() => {
                            getUsers('performance', mode);
                        }}>Performance</button>
                    <button className="font-bold join-item btn btn-secondary text-base-100"
                        onClick={() => {
                            getUsers('score', mode);
                        }}>Ranked Score</button>
                </div>
                <div className="flex justify-center">
                    <PageTabs setNewPage={setPage} current={page} min={1} max={200} />
                </div>
                <div className="justify-end join">
                    <button className="font-bold join-item btn btn-secondary text-base-100"
                        onClick={() => {
                            getUsers(category, 'osu');
                        }}>osu</button>
                    <button className="font-bold join-item btn btn-secondary text-base-100"
                        onClick={() => {
                            getUsers(category, 'taiko');
                        }}>taiko</button>
                    <button className="font-bold join-item btn btn-secondary text-base-100"
                        onClick={() => {
                            getUsers(category, 'fruits');
                        }}>fruits</button>
                    <button className="font-bold join-item btn btn-secondary text-base-100"
                        onClick={() => {
                            getUsers(category, 'mania');
                        }}>mania</button>
                </div>
            </div>
            <div className="p-3 rounded-xl bg-accent-900">
                <table className="w-full border-separate border-spacing-y-1">
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
                            <tr className="loading loading-dots loading-md"></tr>}
                    </tbody>
                </table>
            </div>
            {users.length > 0 && <PageTabs setNewPage={setPage} current={page} min={1} max={200} />}
        </div>
    );
}
export default Users;