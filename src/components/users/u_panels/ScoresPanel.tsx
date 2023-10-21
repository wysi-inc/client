import { FaListUl, FaMapPin, FaChartBar, FaStar, FaStopwatch } from "react-icons/fa";
import { User, MapTab } from "../../../resources/types/user";
import { useTranslation } from "react-i18next";
import TitleBar from "./TitleBar";
import { GameMode } from "../../../resources/types/general";
import { ScoreListItem } from "../../../resources/types/score";
import { useState } from "react";
import UserMapsList from "./setup_comp/UserMapsList";


interface ScoresPanelProps {
    user: User,
    mode: GameMode,
    heigth: number,
    className: string,
}

const ScoresPanel = (p: ScoresPanelProps) => {
    const { t } = useTranslation();

    const [tabIndex, setTabIndex] = useState<number>(getTabIndex());

    const scoresTabs: MapTab[] = [
        { tabId: 1, title: t('score.status.pinned'), icon: <FaMapPin />, count: p.user.scores_pinned_count },
        { tabId: 2, title: t('score.status.best'), icon: <FaChartBar />, count: p.user.scores_best_count },
        { tabId: 3, title: t('score.status.firsts'), icon: <FaStar />, count: p.user.scores_first_count },
        { tabId: 4, title: t('score.status.recent'), icon: <FaStopwatch />, count: p.user.scores_recent_count },
    ]
    const scoresList: ScoreListItem[] = [
        { tabId: 1, limit: p.user.scores_pinned_count, category: 'pinned' },
        { tabId: 2, limit: p.user.scores_best_count, category: 'best' },
        { tabId: 3, limit: p.user.scores_first_count, category: 'firsts' },
        { tabId: 4, limit: p.user.scores_recent_count, category: 'recent' },
    ]

    return (
        <div className={p.className} style={{ height: p.heigth }}>
            <TitleBar title={t('user.sections.scores')} icon={<FaListUl />} />
            <div className="content-center justify-center rounded-none tabs tabs-boxed bg-custom-900">
                {scoresTabs.map((tab: MapTab, i: number) => tab.count > 0 &&
                    <button className={`tab flex flex-row gap-2 ${tabIndex === tab.tabId && 'tab-active text-base-100'}`}
                        onClick={() => setTabIndex(tab.tabId)} key={i}>
                        {tab.icon}
                        <div>{tab.title}</div>
                        <div className="badge">{tab.count}</div>
                    </button>)}
            </div>
            {scoresList.map((s: ScoreListItem, i: number) =>
                <div hidden={tabIndex !== s.tabId} className="overflow-x-hidden overflow-y-scroll grow" key={i}>
                <UserMapsList section="scores" playmode={p.mode} limit={s.limit} category={s.category} userId={p.user.id} /> 
            </div>
            )}
        </div>
    )

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