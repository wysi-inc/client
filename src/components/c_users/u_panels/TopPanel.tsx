import moment from "moment";
import { addDefaultSrc, secondsToTime } from "../../../resources/global/functions";
import { GameModeType, User, UserBadge, UserGroup } from "../../../resources/interfaces/user";
import ModeSelector from "../u_comp/ModeSelector";
import GroupBadge from "../u_comp/GroupBadge";
import SupporterIcon from "../u_comp/SupporterIcon";
import { FaAngleDoubleUp, FaCalculator, FaFireAlt, FaGlobeAfrica, FaRegClock, FaUndo } from "react-icons/fa";
import CountryShape from "../u_comp/CountryShape";
import CountryFlag from "../u_comp/CountryFlag";
import { useTranslation } from "react-i18next";
import { Radar } from "react-chartjs-2";
import BarPieChart from "../u_comp/BarPieChart";
import Badge from "../u_comp/Badge";
import { ChartData, ChartOptions } from "chart.js";
import { useState } from "react";
import { colors } from "../../../resources/global/tools";
import { BarPieChartData } from "./setup_comp/TopScoresPanel";

interface TopPanelProps {
    user: User,
    mode: GameModeType
}

const TopPanel = (p : TopPanelProps) => {
    const {t} = useTranslation();

    const RADAR_CHART_INITIAL: ChartData<'radar'> = {
        labels: [],
        datasets: [
            {
                label: 'Skills',
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            }
        ],
    };
    const radarOptions: ChartOptions<'radar'> = {
        scales: {
            r: {
                angleLines: {
                    display: false
                },
                min: 0,
                max: 100,
                animate: true,
                beginAtZero: true,
                ticks: {
                    display: false
                }
            }
        }
    }

    const [skillsData, setSkillsData] = useState<ChartData<'radar'>>(RADAR_CHART_INITIAL);

    const scoresRanksLabels: BarPieChartData[] = [
        { label: 'XH', color: colors.ranks.xh, value: p.user.statistics.grade_counts.ssh },
        { label: 'X', color: colors.ranks.x, value: p.user.statistics.grade_counts.ss },
        { label: 'SH', color: colors.ranks.sh, value: p.user.statistics.grade_counts.sh },
        { label: 'S', color: colors.ranks.s, value: p.user.statistics.grade_counts.sh },
        { label: 'A', color: colors.ranks.a, value: p.user.statistics.grade_counts.a },
    ];

    return (
        <div style={{ background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${p.user.cover_url}) center / cover no-repeat` }}>
            <div style={{ backdropFilter: "blur(2px)" }}
                className="flex flex-col gap-8 p-8 rounded-none card-body">
                <div className="grid flex-wrap grid-cols-7 gap-4 xl:gap-8">
                    <div className="flex flex-col col-span-9 gap-3 justify-between items-center md:col-span-2 xl:col-span-1">
                        <div className="avatar">
                            <div className='rounded-lg'>
                                <img src={p.user.avatar_url}
                                    onError={addDefaultSrc}
                                    alt='pfp' style={{ width: '100%' }} />
                            </div>
                        </div>
                        <div className="flex flex-row gap-2 items-center w-full">
                            <div className="text-neutral-content">{p.user.statistics.level.current}</div>
                            <progress className="progress progress-warning" value={p.user.statistics.level.progress} max="100"></progress>
                            <div>{p.user.statistics.level.current + 1}</div>
                        </div>
                        <ModeSelector mode={p.mode} userId={p.user.id} />
                        <div className="text-lg text-center tooltip tooltip-bottom"
                            data-tip={moment(p.user.join_date).fromNow()}>
                            Joined at {moment(p.user.join_date).format("DD/MM/YYYY")}
                        </div>
                    </div>
                    <div className="flex flex-col col-span-7 gap-3 justify-between items-center md:col-span-2 md:items-start">
                        <div className="flex flex-row gap-3 items-center">
                            <a className="text-4xl font-bold"
                                target="_blank" rel="noreferrer"
                                href={`https://osu.ppy.sh/users/${p.user.id}`}>
                                {p.user.username}
                            </a>
                            {p.user.groups.map((group: UserGroup, index: number) =>
                                <GroupBadge group={group}
                                    key={index + 1} />
                            )}
                            {p.user.is_supporter && <SupporterIcon size={32} level={p.user.support_level} />}
                        </div>
                        <div className="profileTitle">{p.user.title}</div>
                        <div className="flex flex-col gap-1">
                            <div className="text-lg">{t('user.global_rank')}:</div>
                            <div className="flex flex-row gap-2 items-center text-2xl">
                                <FaGlobeAfrica />
                                <div>#{p.user.statistics.global_rank ? p.user.statistics.global_rank.toLocaleString() : '-'}</div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-lg">{t('user.country_rank')}:</div>
                            <div className="flex flex-row gap-2 items-center text-2xl">
                                <CountryShape code={p.user.country.code} size={26} />
                                <div>#{p.user.statistics.country_rank ? p.user.statistics.country_rank.toLocaleString() : '-'}</div>
                                <CountryFlag size={24} name={p.user.country.name} code={p.user.country.code} position="r" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-lg">{t('user.performance')}:</div>
                            <div className="flex flex-row gap-2 items-center text-xl">
                                <div>{Math.round(p.user.statistics.pp).toLocaleString()}pp</div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-lg">{t('score.accuracy')}:</div>
                            <div className="flex flex-row gap-2 items-center text-xl">
                                <div>{p.user.statistics.hit_accuracy.toFixed(2).toLocaleString()}%</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-7 gap-3 justify-between items-center md:col-span-2">
                        <div><Radar data={skillsData} options={radarOptions} /></div>
                        <div><BarPieChart data={scoresRanksLabels} width={250} /></div>
                    </div>
                    <div className="flex flex-col col-span-7 col-start-4 gap-3 justify-between items-end md:col-span-3 xl:col-span-2 xl:col-start-6">
                        <div className="flex flex-col gap-1 justify-end text-end">
                            <div className="text-lg">{t('score.ranked_score')}:</div>
                            <div className="flex flex-row gap-2 justify-end items-center text-xl tooltip tooltip-left"
                                data-tip={`Total Score: ${p.user.statistics.total_score.toLocaleString()}`}>
                                <FaAngleDoubleUp />
                                <div>{p.user.statistics.ranked_score.toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 justify-end text-end">
                            <div className="text-lg">{t('score.max_combo')}:</div>
                            <div className="flex flex-row gap-2 justify-end items-center text-xl">
                                <FaFireAlt />
                                <div>{p.user.statistics.maximum_combo.toLocaleString()}x</div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 justify-end text-end">
                            <div className="text-lg">{t('user.play_time')}:</div>
                            <div className="flex flex-row gap-2 justify-end items-center text-xl tooltip tooltip-left"
                                data-tip={secondsToTime(p.user.statistics.play_time)}>
                                <FaRegClock />
                                <div>{Math.round((p.user.statistics.play_time / 60 / 60)).toLocaleString()}h</div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 justify-end text-end">
                            <div className="text-lg">{t('user.play_count')}:</div>
                            <div className="flex flex-row gap-2 justify-end items-center text-xl">
                                <FaUndo />
                                <div>{p.user.statistics.play_count.toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 justify-end text-end">
                            <div className="text-lg">{t('user.hits_x_play')}:</div>
                            <div className="flex flex-row gap-2 justify-end items-center text-xl">
                                <FaCalculator />
                                <div>{Math.round((p.user.statistics.count_50 + p.user.statistics.count_100 + p.user.statistics.count_300) / p.user.statistics.play_count).toLocaleString()}x</div>
                            </div>
                        </div>
                    </div>
                </div>
                {p.user.badges.length > 0 &&
                    <div className="flex flex-row flex-wrap gap-2 items-center">
                        {p.user.badges.map((badge: UserBadge, index: number) =>
                            <Badge badge={badge} key={index + 1} />
                        )}
                    </div>}
            </div>
        </div >
    )
}

export default TopPanel;