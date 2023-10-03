import { FaListUl, FaMapPin, FaChartBar, FaStar, FaStopwatch } from "react-icons/fa";
import { ScoresObj, scoreCategoryType, scoreListItem, tabInterface } from "../u_interfaces";
import { User } from "../../resources/interfaces/user";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroller';
import ScoreCard from "../../c_scores/ScoreCard";
import { Score } from "../../resources/interfaces/score";
import { GameModeType } from "../../resources/types";
import { GlobalSettings, GlobalSettingsInterface } from "../../env";


interface ScoresPanelProps {
    user: User,
    mode: GameModeType,
    scores: ScoresObj,
    setScores: Dispatch<SetStateAction<ScoresObj>>,
    heigth: number,
    css: string,
}

const ScoresPanel = (p: ScoresPanelProps) => {
    const settings = GlobalSettings((state: GlobalSettingsInterface) => state);


    const [tabIndex, setTabIndex] = useState<number>(getTabIndex());
    const [bestRenderIndex, setBestRenderIndex] = useState<number>(0);

    const scoresTabs: tabInterface[] = [
        { num: 1, title: 'Pinned', icon: <FaMapPin />, count: p.user.scores_pinned_count },
        { num: 2, title: 'Best', icon: <FaChartBar />, count: p.user.scores_best_count },
        { num: 3, title: 'Firsts', icon: <FaStar />, count: p.user.scores_first_count },
        { num: 4, title: 'Recent', icon: <FaStopwatch />, count: p.user.scores_recent_count },
    ]
    const scoresList: scoreListItem[] = [
        { id: 1, scores: p.scores.pinned, len: p.user.scores_pinned_count, type: 'pinned' },
        { id: 2, scores: p.scores.best, len: p.user.scores_best_count, type: 'best' },
        { id: 3, scores: p.scores.firsts, len: p.user.scores_first_count, type: 'firsts' },
        { id: 4, scores: p.scores.recent, len: p.user.scores_recent_count, type: 'recent' },
    ]
    return (
        <div className={p.css} style={{ height: p.heigth }}>
            <div className="flex flex-row gap-2 justify-center items-center p-2 bg-custom-800 4">
                <FaListUl />
                <div>Scores</div>
            </div>
            <div className="justify-center content-center rounded-none tabs tabs-boxed bg-custom-900">
                {scoresTabs.map((tab: tabInterface, i: number) => tab.count > 0 &&
                    <button className={`tab flex flex-row gap-2 ${tabIndex === tab.num && 'tab-active text-base-100'}`}
                        onClick={() => setTabIndex(tab.num)} key={i}>
                        {tab.icon}
                        <div>{tab.title}</div>
                        <div className="badge">{tab.count}</div>
                    </button>)}
            </div>
            {scoresList.map((s: scoreListItem, i: number) =>
                <div hidden={tabIndex !== s.id} style={{ height: 620 }} className="overflow-x-hidden overflow-y-scroll" key={i}>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={() => s.type !== 'best' ? getScores(s.type, 15, s.scores.length) : setBestRenderIndex((p) => p + 15)}
                        hasMore={s.type !== 'best' ? s.scores.length < s.len : bestRenderIndex < s.len}
                        loader={<div key={0} className="loading loading-dots loading-md"></div>}
                        useWindow={false}
                    >
                        {s.scores.map((sc: Score, ind: number) => (
                            s.type !== 'best' ?
                                <ScoreCard index={ind} score={sc} key={ind} /> :
                                ind < bestRenderIndex && <ScoreCard index={ind} score={sc} key={ind} />
                        )
                        )}
                    </InfiniteScroll>
                </div>
            )}
        </div>
    )

    async function getScores(t: scoreCategoryType, l: number, o: number) {
        try {
            const r = await fetch(`${settings.api_url}/userscores`, {
                ...settings.fetch_settings,
                body: JSON.stringify({
                    id: p.user.id,
                    mode: p.mode,
                    limit: l,
                    offset: o,
                    type: t
                })
            });
            const d: Score[] = await r.json();
            if (d.length < 1) return;
            switch (t) {
                case 'pinned': p.setScores((prev) => ({ ...prev, pinned: [...prev.pinned, ...d] })); break;
                case 'best': p.setScores((prev) => ({ ...prev, best: [...prev.best, ...d] })); break;
                case 'firsts': p.setScores((prev) => ({ ...prev, firsts: [...prev.firsts, ...d] })); break;
                case 'recent': p.setScores((prev) => ({ ...prev, recent: [...prev.recent, ...d] })); break;
                default: break;
            }
        } catch (err) {
            console.error(err);
        }
    }

    function getTabIndex() {
        let scoresTab: number = 0;
        if (p.user.scores_pinned_count > 0) scoresTab = 1;
        else if (p.user.scores_best_count > 0) scoresTab = 2;
        else if (p.user.scores_first_count > 0) scoresTab = 3;
        else if (p.user.scores_recent_count > 0) scoresTab = 4;
        return scoresTab;
    }
}

export default ScoresPanel;