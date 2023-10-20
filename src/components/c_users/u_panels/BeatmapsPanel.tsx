import { FaAngleDoubleUp, FaHeart, FaHourglassHalf, FaListUl, FaSkull, FaStar, FaTrophy, FaUserFriends } from "react-icons/fa";
import { User, tabInterface } from "../../../resources/interfaces/user";
import { BeatmapSet, BeatmapsObj, BeatmapsetType, beatmapListItem } from "../../../resources/interfaces/beatmapset";
import BeatmapsetCard from "../../c_beatmaps/BeatmapsetCard";
import InfiniteScroll from 'react-infinite-scroller';
import { Dispatch, SetStateAction, useState } from "react";
import fina from "../../../helpers/fina";
import { useTranslation } from "react-i18next";

interface BeatmapsPanelProps {
    user: User,
    beatmaps: BeatmapsObj,
    setBeatmaps: Dispatch<SetStateAction<BeatmapsObj>>,
    height: number
    className: string,
}

const BeatmapsPanel = (p: BeatmapsPanelProps) => {
    const { t } = useTranslation();

    const [tabIndex, setTabIndex] = useState<number>(getTabIndex());

    const beatmapsTabs: tabInterface[] = [
        { num: 1, title: t('beatmapset.status.favourite'), icon: <FaStar />, count: p.user.favourite_beatmapset_count, },
        { num: 2, title: t('beatmapset.status.ranked'), icon: <FaAngleDoubleUp />, count: p.user.ranked_and_approved_beatmapset_count },
        { num: 3, title: t('beatmapset.status.guest'), icon: <FaUserFriends />, count: p.user.guest_beatmapset_count },
        { num: 4, title: t('beatmapset.status.loved'), icon: <FaHeart />, count: p.user.loved_beatmapset_count },
        { num: 5, title: t('beatmapset.status.nominated'), icon: <FaTrophy />, count: p.user.nominated_beatmapset_count },
        { num: 6, title: t('beatmapset.status.pending'), icon: <FaHourglassHalf />, count: p.user.pending_beatmapset_count },
        { num: 7, title: t('beatmapset.status.graveyard'), icon: <FaSkull />, count: p.user.graveyard_beatmapset_count },
    ]
    const beatmapsList: beatmapListItem[] = [
        { id: 1, beatmaps: p.beatmaps.favourite, len: p.user.favourite_beatmapset_count, type: 'favourite' },
        { id: 2, beatmaps: p.beatmaps.ranked, len: p.user.ranked_beatmapset_count, type: 'ranked' },
        { id: 3, beatmaps: p.beatmaps.guest, len: p.user.guest_beatmapset_count, type: 'guest' },
        { id: 4, beatmaps: p.beatmaps.loved, len: p.user.loved_beatmapset_count, type: 'loved' },
        { id: 5, beatmaps: p.beatmaps.nominated, len: p.user.nominated_beatmapset_count, type: 'nominated' },
        { id: 6, beatmaps: p.beatmaps.pending, len: p.user.pending_beatmapset_count, type: 'pending' },
        { id: 7, beatmaps: p.beatmaps.graveyard, len: p.user.graveyard_beatmapset_count, type: 'graveyard' },
    ]

    return (
        <div className={p.className} style={{ height: p.height }}>
            <div className="flex flex-row items-center justify-center gap-2 p-2 bg-custom-800">
                <FaListUl />
                <div>{t('user.sections.beatmaps.title')}</div>
            </div>
            <div className="content-center justify-center rounded-none tabs tabs-boxed bg-custom-900">
                {beatmapsTabs.map((tab: tabInterface, i: number) => tab.count > 0 &&
                    <button className={`tab flex flex-row gap-2 ${tabIndex === tab.num && 'tab-active'}`}
                        onClick={() => setTabIndex(tab.num)} key={i}>
                        {tab.icon}
                        <div>{tab.title}</div>
                        <div className="badge">{tab.count}</div>
                    </button>)}
            </div>
            {beatmapsList.map((b: beatmapListItem, i: number) =>
                <div hidden={tabIndex !== b.id} style={{ height: 620 }} className="overflow-x-hidden overflow-y-scroll" key={i}>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={() => getBeatmaps(b.type, 15, b.beatmaps.length)}
                        hasMore={b.beatmaps.length < b.len}
                        loader={<div key={0} className="loading loading-dots loading-md"></div>}
                        useWindow={false}
                    >
                        {b.beatmaps.map((bs: BeatmapSet, ind: number) =>
                            <BeatmapsetCard key={ind} index={ind} beatmapset={bs} />
                        )}
                    </InfiniteScroll>
                </div>
            )}
        </div>
    )
    async function getBeatmaps(t: BeatmapsetType, l: number, o: number) {
        try {
            const d: BeatmapSet[] = await fina.post('/userbeatmaps', {
                id: p.user.id,
                limit: l,
                offset: o,
                type: t,
            });
            if (d.length < 1) return;
            switch (t) {
                case 'favourite': p.setBeatmaps((prev) => ({ ...prev, favourite: [...prev.favourite, ...d] })); break;
                case 'ranked': p.setBeatmaps((prev) => ({ ...prev, ranked: [...prev.ranked, ...d] })); break;
                case 'guest': p.setBeatmaps((prev) => ({ ...prev, guest: [...prev.guest, ...d] })); break;
                case 'loved': p.setBeatmaps((prev) => ({ ...prev, loved: [...prev.loved, ...d] })); break;
                case 'nominated': p.setBeatmaps((prev) => ({ ...prev, nominated: [...prev.loved, ...d] })); break;
                case 'pending': p.setBeatmaps((prev) => ({ ...prev, pending: [...prev.pending, ...d] })); break;
                case 'graveyard': p.setBeatmaps((prev) => ({ ...prev, graveyard: [...prev.graveyard, ...d] })); break;
                default: break;
            }
        } catch (err) {
            console.error(err);
        }
    }
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