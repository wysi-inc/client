import { FaListUl, FaMapPin, FaChartBar, FaStar, FaStopwatch } from "react-icons/fa";
import { GameModeType, User, tabInterface } from "../../../resources/interfaces/user";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroller';
import ScoreCard from "../../c_scores/ScoreCard";
import { Score, ScoreType, ScoresObj, scoreListItem } from "../../../resources/interfaces/score";
import fina from "../../../helpers/fina";
import { useTranslation } from "react-i18next";
import TitleBar from "./TitleBar";


interface ScoresPanelProps {
    user: User,
    mode: GameModeType,
    scores: ScoresObj,
    setScores: Dispatch<SetStateAction<ScoresObj>>,
    heigth: number,
    className: string,
}

const ScoresPanel = (p: ScoresPanelProps) => {
    const { t } = useTranslation();

    const [tabIndex, setTabIndex] = useState<number>(getTabIndex());
    const [bestRenderIndex, setBestRenderIndex] = useState<number>(0);
    useEffect(() => {
        if (p.scores.best.length === 0) {
            setBestRenderIndex(0);
        }
    }, [p.scores.best.length])

    const scoresTabs: tabInterface[] = [
        { num: 1, title: t('score.status.pinned'), icon: <FaMapPin />, count: p.user.scores_pinned_count },
        { num: 2, title: t('score.status.best'), icon: <FaChartBar />, count: p.user.scores_best_count },
        { num: 3, title: t('score.status.firsts'), icon: <FaStar />, count: p.user.scores_first_count },
        { num: 4, title: t('score.status.recent'), icon: <FaStopwatch />, count: p.user.scores_recent_count },
    ]
    const scoresList: scoreListItem[] = [
        { id: 1, scores: p.scores.pinned, len: p.user.scores_pinned_count, type: 'pinned' },
        { id: 2, scores: p.scores.best, len: p.user.scores_best_count, type: 'best' },
        { id: 3, scores: p.scores.firsts, len: p.user.scores_first_count, type: 'firsts' },
        { id: 4, scores: p.scores.recent, len: p.user.scores_recent_count, type: 'recent' },
    ]
    return (
        <div className={p.className} style={{ height: p.heigth }}>
            <TitleBar title={t('user.sections.scores')} icon={<FaListUl />} />
            <div className="content-center justify-center rounded-none tabs tabs-boxed bg-custom-900">
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

    async function getScores(t: ScoreType, l: number, o: number) {
        try {
            const d: Score[] = await fina.post('/userscores', {
                id: p.user.id,
                mode: p.mode,
                limit: l,
                offset: o,
                type: t
            });
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