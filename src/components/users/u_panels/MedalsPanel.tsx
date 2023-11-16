import { useEffect, useMemo, useState } from "react";

import { FaMedal } from "react-icons/fa";

import fina from "../../../helpers/fina";
import MedalBadge from "../u_comp/MedalBadge";
import { User, UserAchievement } from "../../../resources/types/user";
import { Medal } from "../../../resources/types/medals";
import TitleBar from "./TitleBar";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import Loading from "../../../web/w_comp/Loading";

interface Props {
    user: User,
    className: string,
}

const MedalsPanel = (p: Props) => {

    const { t } = useTranslation();

    const { data: medalsData, status: medalsStatus } = useQuery(['medals'], getMedals);

    if (medalsStatus !== 'success') return <Loading />;
    if (!medalsData) return <Loading />;

    const medals_grouping: { grouping: string, medals: Medal[] }[] = medalsData;

    const all_medals: Medal[] = medals_grouping.flatMap(grouping => grouping.medals);
    
    const all_medals_map = new Map();
    for (const medal of all_medals) {
        all_medals_map.set(medal.medal_id, medal);
    }

    const usr_medals_map = new Map();
    for (const medal of p.user.user_achievements) {
        usr_medals_map.set(medal.achievement_id, medal);
    }

    const usr_has_medal = (medal_id: number): boolean => usr_medals_map.has(medal_id);

    const get_rarest_id = (): number => p.user.user_achievements.reduce((acc, curr) => (all_medals_map.get(acc.achievement_id).rarity < all_medals_map.get(curr.achievement_id).rarity ? acc : curr)).achievement_id;
    const rarestMedal: Medal | undefined = all_medals_map.get(get_rarest_id());
    const lastMedals: Medal[] = p.user.user_achievements
        .sort((a, b) => (new Date(a.achieved_at)).getTime() - (new Date(b.achieved_at)).getTime())
        .reverse().slice(0, 10)
        .map((obj: UserAchievement) => obj.achievement_id)
        .map((id: number) => all_medals_map.get(id)) || [];

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
                                {lastMedals.map((medal: Medal, i: number) => (
                                    <MedalBadge medal={medal} achieved={true} key={i} />))}
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
                                {rarestMedal && <MedalBadge medal={rarestMedal} achieved={true} />}
                            </div>
                        </div>
                    </div>
                </div>
                {medals_grouping.map((obj, i) => (
                    <div key={i} className="grow">
                        <div className="flex flex-row items-center justify-center p-2 text-center bg-custom-900">
                            <div className="text-center">
                                {obj.grouping}:
                            </div>
                        </div>
                        <div className="flex flex-col p-3 pt-2 grow">
                            <div className="px-2 pb-1 text-center" style={{ fontSize: 14, top: -8 }}>
                                {(obj.medals.length / all_medals.length * 100).toFixed(2)}%
                                ({obj.medals.length} / {all_medals.length})
                            </div>
                            <div className="flex flex-row flex-wrap justify-center gap-1 grow">
                                {obj.medals.map((medal: Medal, j) => (
                                    <MedalBadge medal={medal} achieved={usr_has_medal(medal.medal_id)} key={j} />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    async function getMedals() {
        return fina.get("/medals");
    }
}

export default MedalsPanel;


