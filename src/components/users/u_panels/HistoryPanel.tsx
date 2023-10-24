import { forwardRef, Ref, useEffect, useState } from "react";

import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { ChartData, ChartOptions } from 'chart.js';

import { FaChartLine, FaChartPie, FaEye, FaGlobeAfrica, FaRegClock } from "react-icons/fa";

import TitleBar from "./TitleBar";
import CountryShape from "../u_comp/CountryShape";
import { Score } from "../../../resources/types/score";
import { colors } from "../../../resources/global/tools";
import TopScoresPanel from "./setup_comp/TopScoresPanel";
import { MonthlyData, User } from "../../../resources/types/user";
import { useQuery } from "react-query";
import Loading from "../../../web/w_comp/Loading";
import fina from "../../../helpers/fina";
import { GameMode } from "../../../resources/types/general";

const LINE_CHART_INITIAL: ChartData<'line'> = {
    labels: [],
    datasets: [{
        label: '',
        data: [],
        fill: false,
        borderColor: colors.ui.accent,
        tension: 0.1
    }]
}
const lineOptions: ChartOptions<'line'> = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
        y: {
            reverse: false,
            ticks: {
                precision: 0
            },
        },
        x: {
            type: 'time',
            time: {
                displayFormats: {
                    day: 'dd/mm/yy',
                },
            },
        }
    }
};
const lineOptionsReverse: ChartOptions<'line'> = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
        y: {
            reverse: true,
            ticks: {
                precision: 0
            }
        },
        x: {
            type: 'time',
            time: {
                displayFormats: {
                    day: 'dd/mm/yy',
                },
            },
        }
    },
};

interface Props {
    user: User,
    mode: GameMode,
    className: string,
}

const HistoryPanel = forwardRef((p: Props, ref: Ref<HTMLDivElement>) => {
    const { t } = useTranslation();
    const [tabIndex, setTabIndex] = useState<number>(1);

    const { data: bestData, status: bestStatus } = useQuery(['bestData', p.user.id, p.mode], getBest);

    const [globalHistoryData, setGlobalHistoryData] = useState<ChartData<'line'>>(LINE_CHART_INITIAL);
    const [countryHistoryData, setCountryHistoryData] = useState<ChartData<'line'>>(LINE_CHART_INITIAL);
    const [playsHistoryData, setPlaysHistoryData] = useState<ChartData<'line'>>(LINE_CHART_INITIAL);
    const [replaysHistoryData, setReplaysHistoryData] = useState<ChartData<'line'>>(LINE_CHART_INITIAL);

    useEffect(() => {
        getGlobalData(p.user);
        getCountryData(p.user);
        getPlaysData(p.user);
        getReplaysData(p.user);
    }, [p.user])

    const topScores = () => {
        switch (bestStatus) {
            case "error":
                return <div>error</div>;
            case "success":
                return <TopScoresPanel data={p.user} best={bestData} />;
            default:
                return <Loading />;
        }
    }

    return (
        <div className={p.className} ref={ref}>
            <TitleBar title={t('user.sections.history.title')} icon={<FaChartLine />} />
            <div className="content-center justify-center rounded-none tabs tabs-boxed bg-custom-900">
                <button
                    className={`tab flex flex-row gap-2 ${tabIndex === 1 && 'tab-active text-base-100'}`}
                    onClick={() => setTabIndex(1)}>
                    <FaGlobeAfrica />
                    <div>{t('user.global_rank')}</div>
                </button>
                <button
                    className={`tab flex flex-row gap-2 ${tabIndex === 2 && 'tab-active text-base-100'}`}
                    onClick={() => setTabIndex(2)}>
                    <CountryShape code={p.user.country.code} size={18} />
                    <div>{t('user.country_rank')}</div>
                </button>
                <button
                    className={`tab flex flex-row gap-2 ${tabIndex === 3 && 'tab-active text-base-100'}`}
                    onClick={() => setTabIndex(3)}>
                    <FaRegClock />
                    <div>{t('user.play_count')}</div>
                </button>
                <button
                    className={`tab flex flex-row gap-2 ${tabIndex === 4 && 'tab-active text-base-100'}`}
                    onClick={() => setTabIndex(4)}>
                    <FaEye />
                    <div>{t('user.replays_watched')}</div>
                </button>
            </div>
            <div className="flex items-center justify-center" style={{ height: 250 }}>
                <div className="w-full h-full p-4 grow" hidden={tabIndex !== 1}>
                    <Line data={globalHistoryData} options={lineOptionsReverse} />
                </div>
                <div className="w-full h-full p-4 grow" hidden={tabIndex !== 2}>
                    <Line data={countryHistoryData} options={lineOptionsReverse} />
                </div>
                <div className="w-full h-full p-4 grow" hidden={tabIndex !== 3}>
                    <Line data={playsHistoryData} options={lineOptions} />
                </div>
                <div className="w-full h-full p-4 grow" hidden={tabIndex !== 4}>
                    <Line data={replaysHistoryData} options={lineOptions} />
                </div>
            </div>
            <TitleBar title={t('user.sections.scores_summary.title')} icon={<FaChartPie />} info="this is a summary of the user's top plays" />
            {topScores()}
        </div>
    )

    function getGlobalData(user: User) {
        if (!user?.db_info.ranks.global_rank) return;
        setGlobalHistoryData({
            labels: user.db_info.ranks.global_rank.map(obj => obj.date),
            datasets: [{
                label: 'Global Rank',
                data: user.db_info.ranks.global_rank.map(obj => obj.rank),
                fill: false,
                borderColor: colors.ui.accent,
                tension: 0.1,
            }],
        })
    }

    function getCountryData(user: User) {
        if (!user?.db_info.ranks.country_rank) return;
        setCountryHistoryData({
            labels: user.db_info.ranks.country_rank.map(obj => obj.date),
            datasets: [{
                label: 'Country Rank',
                data: user.db_info.ranks.country_rank.map(obj => obj.rank),
                fill: false,
                borderColor: colors.ui.accent,
                tension: 0.1,
            }],
        })
    }

    function getPlaysData(user: User) {
        if (!user?.monthly_playcounts) return;
        setPlaysHistoryData({
            labels: user.monthly_playcounts.map((obj: MonthlyData) => new Date(obj.start_date)),
            datasets: [{
                label: 'Plays',
                data: user.monthly_playcounts.map((obj: MonthlyData) => obj.count),
                fill: false,
                borderColor: colors.ui.accent,
                tension: 0.1,
            }],
        })
    }

    function getReplaysData(user: User) {
        if (!user?.replays_watched_counts) return;
        setReplaysHistoryData({
            labels: user.replays_watched_counts.map((obj: MonthlyData) => new Date(obj.start_date)),
            datasets: [{
                label: 'Replays Watched',
                data: user.replays_watched_counts.map((obj: MonthlyData) => obj.count),
                fill: false,
                borderColor: colors.ui.accent,
                tension: 0.1,
            }],
        })
    }

    function getBest() {
        return fina.post('/userscores', {
            id: p.user.id,
            mode: p.mode,
            limit: 100,
            offset: 0,
            type: 'best'
        });
    }
})

export default HistoryPanel;