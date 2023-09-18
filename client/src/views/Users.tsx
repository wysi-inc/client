import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GameModeType } from "../resources/types";
import UserPage from "../pages/UserPage";
import axios from "../resources/axios-config";
import { UserRanks } from "../resources/interfaces";
import UserCard from "../cards/UserCard";

const Users = () => {
    const { urlUser } = useParams();
    const { urlMode } = useParams();

    const [userId, setUserId] = useState<undefined | string>();
    const [userMode, setUserMode] = useState<undefined | GameModeType>();

    const [users, setUsers] = useState<UserRanks[]>([]);
    const [page, setPage] = useState<number>(0);

    useEffect((): void => {
        if (urlUser === undefined) {
            setUserId(undefined);
            setUserMode(undefined);
            getUsers()
            return;
        }
        const checkedMode: GameModeType = urlMode?.toLowerCase() as GameModeType;
        setUserMode(checkedMode ? checkedMode : 'default');
        setUserId(urlUser);
    }, [urlUser, urlMode]);


    if (userId && userMode) {
        return (
            <UserPage userId={userId} userMode={userMode} />
        );
    }

    async function getUsers() {
        const res = await axios.post('/users',
            {
                mode: 'osu',
                type: 'score',
            }
        );
        const data = res.data;
        console.log(data);
        setUsers(data.ranking);
    }

    return (
        <div className="grid grid-cols-1 gap-2 p-3">
            {users.map((user, index) =>
                <UserCard user={user} index={index + (50 * page) + 1} key={index} />
            )}
        </div>
    );
}
export default Users;