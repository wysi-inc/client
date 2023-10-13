import { useEffect, useState } from "react";
import { FaChartLine, FaChartPie, FaEye, FaGlobeAfrica, FaRegClock } from "react-icons/fa";
import CountryShape from "../u_comp/CountryShape";
import { ChartData, ChartOptions } from "chart.js";
import { colors } from "../../resources/store/tools";
import { MonthlyData, User } from "../../resources/interfaces/user";
import { Line } from "react-chartjs-2";
import TopScoresPanel from "./setup_comp/TopScoresPanel";
import { Score } from "../../resources/interfaces/score";
import { useTranslation } from "react-i18next";

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

interface HistoryPanelProps {
    user: User,
    best: Score[],
    height: number,
    css: string,
}

const HistoryPanel = (p: HistoryPanelProps) => {
    const { t } = useTranslation();
    const [tabIndex, setTabIndex] = useState<number>(1);

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

    return (
        <div className={p.css} style={{ height: p.height }}>
            <div className="flex flex-row gap-2 justify-center items-center p-2 bg-custom-800">
                <FaChartLine />
                <div>{t('user.sections.history.title')}</div>
            </div>
            <div className="justify-center content-center rounded-none tabs tabs-boxed bg-custom-900">
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
            <div className="flex justify-center items-center">
                <div className="p-4 grow" hidden={tabIndex !== 1}
                    style={{ height: 250 }}>
                    <Line data={globalHistoryData} options={lineOptionsReverse} />
                </div>
                <div className="p-4 grow" hidden={tabIndex !== 2}
                    style={{ height: 250 }}>
                    <Line data={countryHistoryData} options={lineOptionsReverse} />
                </div>
                <div className="p-4 grow" hidden={tabIndex !== 3}
                    style={{ height: 250 }}>
                    <Line data={playsHistoryData} options={lineOptions} />
                </div>
                <div className="p-4 grow" hidden={tabIndex !== 4}
                    style={{ height: 250 }}>
                    <Line data={replaysHistoryData} options={lineOptions} />
                </div>
            </div>
            <div className="flex flex-row gap-2 justify-center items-center p-2 bg-custom-800">
                <FaChartPie />
                <div>{t('user.sections.scores_summary.title')}</div>
            </div>
            <TopScoresPanel data={p.user} best={p.best} />
        </div>
    )

    function getGlobalData(user: User) {
        if (!user?.db_info.global_rank) return;
        setGlobalHistoryData({
            labels: user.db_info.global_rank.map(obj => obj.date),
            datasets: [{
                label: 'Global Rank',
                data: user.db_info.global_rank.map(obj => obj.rank),
                fill: false,
                borderColor: colors.ui.accent,
                tension: 0.1,
            }],
        })
    }

    function getCountryData(user: User) {
        if (!user?.db_info.country_rank) return;
        setCountryHistoryData({
            labels: user.db_info.country_rank.map(obj => obj.date),
            datasets: [{
                label: 'Country Rank',
                data: user.db_info.country_rank.map(obj => obj.rank),
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
}

export default HistoryPanel;