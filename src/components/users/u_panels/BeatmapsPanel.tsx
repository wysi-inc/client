import { useState } from "react";

import { useTranslation } from "react-i18next";

import { FaAngleDoubleUp, FaHeart, FaHourglassHalf, FaListUl, FaSkull, FaStar, FaTrophy, FaUserFriends } from "react-icons/fa";

import { MapTab, User } from "../../../resources/types/user";
import { BeatmapsetListItem } from "../../../resources/types/beatmapset";
import UserMapsList from "./setup_comp/UserMapsList";

interface Props {
    user: User,
    height: number
    className: string,
}

const BeatmapsPanel = (p: Props) => {
    const { t } = useTranslation();

    const [tabIndex, setTabIndex] = useState<number>(getTabIndex());

    const beatmapsTabs: MapTab[] = [
        { tabId: 1, title: t('beatmapset.status.favourite'), icon: <FaStar />, count: p.user.favourite_beatmapset_count, },
        { tabId: 2, title: t('beatmapset.status.ranked'), icon: <FaAngleDoubleUp />, count: p.user.ranked_and_approved_beatmapset_count },
        { tabId: 3, title: t('beatmapset.status.guest'), icon: <FaUserFriends />, count: p.user.guest_beatmapset_count },
        { tabId: 4, title: t('beatmapset.status.loved'), icon: <FaHeart />, count: p.user.loved_beatmapset_count },
        { tabId: 5, title: t('beatmapset.status.nominated'), icon: <FaTrophy />, count: p.user.nominated_beatmapset_count },
        { tabId: 6, title: t('beatmapset.status.pending'), icon: <FaHourglassHalf />, count: p.user.pending_beatmapset_count },
        { tabId: 7, title: t('beatmapset.status.graveyard'), icon: <FaSkull />, count: p.user.graveyard_beatmapset_count },
    ]

    const beatmapsList: BeatmapsetListItem[] = [
        { tabId: 1, limit: p.user.favourite_beatmapset_count, category: 'favourite' },
        { tabId: 2, limit: p.user.ranked_beatmapset_count, category: 'ranked' },
        { tabId: 3, limit: p.user.guest_beatmapset_count, category: 'guest' },
        { tabId: 4, limit: p.user.loved_beatmapset_count, category: 'loved' },
        { tabId: 5, limit: p.user.nominated_beatmapset_count, category: 'nominated' },
        { tabId: 6, limit: p.user.pending_beatmapset_count, category: 'pending' },
        { tabId: 7, limit: p.user.graveyard_beatmapset_count, category: 'graveyard' },
    ]

    return (
        <div className={p.className} style={{ height: p.height }}>
            <div className="flex flex-row items-center justify-center gap-2 p-2 bg-custom-800">
                <FaListUl />
                <div>{t('user.sections.beatmaps.title')}</div>
            </div>
            <div className="content-center justify-center rounded-none tabs tabs-boxed bg-custom-900">
                {beatmapsTabs.map((tab: MapTab, i: number) => tab.count > 0 &&
                    <button className={`tab flex flex-row gap-2 ${tabIndex === tab.tabId && 'tab-active'}`}
                        onClick={() => setTabIndex(tab.tabId)} key={i}>
                        {tab.icon}
                        <div>{tab.title}</div>
                        <div className="badge">{tab.count}</div>
                    </button>)}
            </div>
            {beatmapsList.map((b: BeatmapsetListItem, i: number) =>
                <div hidden={tabIndex !== b.tabId} className="overflow-x-hidden overflow-y-scroll grow" key={i}>
                    <UserMapsList section="beatmapsets" mode={"osu"} limit={b.limit} category={b.category} userId={p.user.id} /> 
                </div>
            )}
        </div>
    )

    function getTabIndex() {
        let beatmapsTab: number = 0;
        if (p.user.favourite_beatmapset_count > 0) beatmapsTab = 1;
        else if (p.user.ranked_beatmapset_count > 0) beatmapsTab = 2;
        else if (p.user.guest_beatmapset_count > 0) beatmapsTab = 3;
        else if (p.user.loved_beatmapset_count > 0) beatmapsTab = 4;
        else if (p.user.nominated_beatmapset_count > 0) beatmapsTab = 5;
        else if (p.user.pending_beatmapset_count > 0) beatmapsTab = 6;
        else if (p.user.graveyard_beatmapset_count > 0) beatmapsTab = 7;
        return beatmapsTab;
    }
}

export default BeatmapsPanel;