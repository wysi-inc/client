import { useState } from "react";

import { useTranslation } from "react-i18next";

import UserCard from "./UserCard";
import fina from "../../helpers/fina";
import PageTabs from "../../web/w_comp/PageTabs";
import { modes } from "../../resources/global/user";
import { UserRanks } from "../../resources/types/user";
import { GameMode } from "../../resources/types/general";
import { alertManager, alertManagerInterface } from "../../resources/global/tools";
import { useQuery } from "react-query";
import Loading from "../../web/w_comp/Loading";
import { useDebounce } from "@uidotdev/usehooks";
import { useUpdateEffect } from "usehooks-ts";

const Users = () => {

    const { t } = useTranslation();
    const addAlert = alertManager((state: alertManagerInterface) => state.addAlert);

    const [page, setPage] = useState<number>(1);
    const [actualPage, setActualPage] = useState<number>(1);

    const debounce = useDebounce(page, 1000);

    useUpdateEffect(() => {
        setActualPage(page);
    }, [debounce])

    const [section, setSection] = useState<'performance' | 'score'>('performance');
    const [mode, setMode] = useState<GameMode>('osu');

    const { data: usersData, status: usersStatus } = useQuery(['rankings', actualPage, section, mode], getUsers);
    const users: UserRanks[] = (usersData as any)?.ranking;

    if (usersStatus === 'error') {
        addAlert('error', t('alerts.users_fail'));
        return <div></div>;
    }

    return (
        <div className="flex flex-col gap-3 p-3">
            <div className="grid grid-cols-3">
                <div className="justify-start join">
                    <button className="font-bold join-item btn btn-secondary text-base-100"
                        onClick={() => {
                            setSection('performance');
                        }}>{t('user.performance')}</button>
                    <button className="font-bold join-item btn btn-secondary text-base-100"
                        onClick={() => {
                            setSection('score');
                        }}>{t('score.ranked_score')}</button>
                </div>
                <div className="flex justify-center">
                    <PageTabs setNewPage={setPage} current={page} min={1} max={200} />
                </div>
                <div className="justify-end join">
                    {modes.map(m =>
                        <button key={m}
                            className="font-bold join-item btn btn-secondary text-base-100"
                            onClick={() => setMode(m)}>
                            {m}
                        </button>
                    )}
                </div>
            </div>
            <div className="p-3 rounded-xl bg-custom-900">
                <table className="w-full border-separate border-spacing-y-1">
                    <thead>
                        <tr>
                            <th className="table-cell text-left"></th>
                            <th className="table-cell text-left"></th>
                            <th className="table-cell text-left"></th>
                            <th className="table-cell text-left">PP</th>
                            <th className="hidden text-left lg:table-cell">{t('score.acc')}</th>
                            <th className="hidden text-left lg:table-cell">{t('user.play_time')}</th>
                            <th className="hidden text-left lg:table-cell">{t('user.play_count')}</th>
                            <th className="hidden text-left md:table-cell">{t('score.ranked_score')}</th>
                            <th className="hidden text-left xl:table-cell">{t('score.grades')}</th>
                            <th className="table-cell text-right">{t('user.online')}</th>
                        </tr>
                    </thead>
                    <tbody className="mt-3">
                        {usersStatus === 'loading' || !users ? <Loading /> :
                            users.map((user, index) =>
                                <UserCard mode={mode} user={user} section={section} index={index + (50 * (actualPage - 1) + 1)} key={index} />
                            )}
                    </tbody>
                </table>
            </div>
            {usersStatus === 'success' || users ? <PageTabs setNewPage={setPage} current={page} min={1} max={200} /> : ''}
        </div>
    );

    function getUsers() {
        return fina.post('/users', {
            mode: mode,
            type: section,
            page: page,
        });
    }
}
export default Users;