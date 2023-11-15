import { useEffect, useMemo, useState } from "react";

import { FaMedal } from "react-icons/fa";

import fina from "../../../helpers/fina";
import MedalBadge from "../u_comp/MedalBadge";
import { User, UserAchievement } from "../../../resources/types/user";
import { Medal, MedalCategories, SortedMedals } from "../../../resources/types/medals";
import TitleBar from "./TitleBar";
import { useTranslation } from "react-i18next";

interface Props {
    user: User,
    className: string,
}

const MedalsPanel = (p: Props) => {

    const {t} = useTranslation();

    const medals: Medal[] = useMedals();
    const medalsByCategory: SortedMedals = useMemo(() => getMedalsByCategory(medals), [medals]);
    const lastMedals: Medal[] = useMemo(() => getLastMedals(p.user.user_achievements, medals, 15), [medals]);
    const rarestMedal: Medal | null = useMemo(() => getRarestMedal(p.user.user_achievements, medals), [medals]);
    const achievedMedalsCount = useMemo(() => getAchievedMedalsCount(p.user.user_achievements, medalsByCategory), [medals]);

    return (
        <div className={p.className}>
            <TitleBar title={t('user.sections.medals.title')} icon={<FaMedal />} />
            <div className="flex flex-col grow">
                <div className="grid grid-cols-6">
                    <div className="col-span-5">
                        <div className="p-2 text-center bg-custom-900">
                            Recent Medals
                        </div>
                        <div className="p-3 pt-2">
                            <div className="flex flex-row justify-between px-2 pb-1"
                                style={{ fontSize: 14, top: -8 }}>
                                <div>most recent</div>
                                <div>least recent</div>
                            </div>
                            <div className="flex flex-row gap-1">
                                {lastMedals.map((medal: Medal, index: number) => (
                                    <MedalBadge thisMedal={medal} userMedals={p.user.user_achievements}
                                        key={index} />))}
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <div className="p-2 text-center bg-custom-900">
                            Rarest Medal
                        </div>
                        <div className="p-3 pt-2">
                            <div className="px-2 pb-1 text-center"
                                style={{ fontSize: 14, top: -8 }}>
                                Rarity: {rarestMedal?.rarity.toFixed(2)}%
                            </div>
                            <div className="grid justify-center">
                                {rarestMedal &&
                                    <MedalBadge thisMedal={rarestMedal}
                                        userMedals={p.user.user_achievements} />}
                            </div>
                        </div>
                    </div>
                </div>
                {Object.entries(medalsByCategory).map(([category, medals]: [string, Medal[]], key: number) => (
                    <div key={key} className="grow">
                        <div className="flex flex-row items-center justify-center p-2 text-center bg-custom-900">
                            <div className="text-center">
                                {category}:
                            </div>
                        </div>
                        <div className="flex flex-col p-3 pt-2 grow">
                            <div className="px-2 pb-1 text-center"
                                style={{ fontSize: 14, top: -8 }}>
                                {(achievedMedalsCount[category] / medals.length * 100).toFixed(2)}%
                                ({achievedMedalsCount[category]}/{medals.length})
                            </div>
                            <div className="flex flex-row flex-wrap justify-center gap-1 grow">
                                {medals.map((medal: Medal, index: number) => (
                                    <MedalBadge thisMedal={medal} userMedals={p.user.user_achievements}
                                        key={index} />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
    
    function useMedals() {
        const [m, setM] = useState<Medal[]>([]);
        useEffect(() => {
            getM();
        }, [])
        return m;
        async function getM() {
            try {
                const d: Medal[]  = await fina.get('/medals');
                setM(d);
            } catch (err) {
                console.error(err)
            }
        }
    }

    function getMedalsByCategory(data: Medal[]) {
        data.sort((a: Medal, b: Medal) => {
            if (a.grouping === b.grouping) {
                return a.medal_id - b.medal_id;
            }
            return a.grouping.localeCompare(b.grouping);
        });
        const categoryArrays: SortedMedals = {};
        for (const obj of data) {
            if (categoryArrays[obj.grouping]) {
                categoryArrays[obj.grouping].push(obj);
            } else {
                categoryArrays[obj.grouping] = [obj];
            }
        }
        return categoryArrays;
    }

    function getLastMedals(userMedals: UserAchievement[] | undefined, medals: Medal[], num: number) {
        if (!userMedals) return [];
        const sortedArray = userMedals
            .sort((a: UserAchievement, b: UserAchievement) => {
                const dateA: Date = new Date(a.achieved_at);
                const dateB: Date = new Date(b.achieved_at);
                return dateA.getTime() - dateB.getTime();
            }).reverse().slice(0, num)
            .map((obj: UserAchievement) => obj.achievement_id)
            .map((id: number) => medals.find((medal: Medal): boolean => medal.medal_id === id))
            .filter((medal: Medal | undefined): medal is Medal => medal !== undefined);
        return sortedArray;
    }

    function getAchievedMedalsCount(userMedals: UserAchievement[] | undefined, obj: SortedMedals): MedalCategories {
        if (!userMedals) return {};
        const achievedMedalsCount: MedalCategories = {};
        Object.entries(obj)
            .forEach(([category, medals]: [string, Medal[]]) => {
                achievedMedalsCount[category] = 0;
                userMedals.forEach((achievedMedal: UserAchievement): void => {
                    if (medals.find((medal: Medal): boolean => medal.medal_id === achievedMedal.achievement_id)) {
                        achievedMedalsCount[category]++;
                    }
                });
            });
        return achievedMedalsCount;
    }

    function getRarestMedal(userMedals: UserAchievement[] | undefined, medals: Medal[]) {
        if (!userMedals) return null;
        const data = userMedals.map((obj: UserAchievement) => obj.achievement_id)
            .map((id: number) => medals.find((medal: Medal): boolean => String(medal.medal_id) === String(id)))
            .reduce((rarest: Medal | null, medal: Medal | undefined): Medal => {
                if (!rarest || (medal && medal.rarity < rarest.rarity)) {
                    return medal as Medal;
                }
                return rarest;
            }, null)
        return data;
    }
}

export default MedalsPanel;


