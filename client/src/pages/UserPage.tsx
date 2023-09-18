import React, { useEffect, useState, useRef, useMemo, Dispatch, SetStateAction } from "react";
import { useParams } from "react-router-dom";
import axios from '../resources/axios-config';
import { Chart, registerables, ChartOptions, ChartData } from 'chart.js';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line } from "react-chartjs-2";
import Spinner from 'react-bootstrap/Spinner';
import ReactCountryFlag from "react-country-flag";
import moment from "moment";

import {
    Score,
    BeatmapSet,
    MedalCategories,
    MedalInterface,
    MonthlyData,
    SortedMedals,
    UserAchievement,
    UserBadge,
    UserData,
    UserGroup,
} from "../resources/interfaces";

import {
    HiChevronDoubleUp,
    HiFire,
    HiReply,
    HiCalculator,
    HiGlobeAlt,
    HiOutlineStar
} from "react-icons/hi";
import {
    BiSolidTrophy,
    BiSolidUserDetail
} from "react-icons/bi";
import { FaSkull } from "react-icons/fa";
import {
    BsFillPinAngleFill,
    BsSuitHeartFill,
    BsHourglassSplit,
    BsBarChartLine,
    BsStopwatch
} from "react-icons/bs";

import { colors } from "../resources/store";
import { BeatmapType, GameModeType, ScoreType } from "../resources/types";
import { addDefaultSrc, secondsToTime } from "../resources/functions";
import ScoreCard from "../cards/ScoreCard";
import TopScoresPanel, { BarPieChartData } from "../components/TopScoresPanel";
import Medal from "../components/Medal";
import Badge from "../components/Badge";
import CountryShape from "../components/CountryShape";
import ModeSelector from "../components/ModeSelector";
import SupporterIcon from "../components/SupporterIcon";
import GroupBadge from "../components/GroupBadge";
import BeatmapsetCard from "../cards/BeatmapsetCard";

import Twemoji from 'react-twemoji';
import CountUp from "react-countup";
import BarPieChart from "../components/BarPieChart";

Chart.register(zoomPlugin, ...registerables);
Chart.defaults.plugins.legend.display = false;
Chart.defaults.animation = false;
Chart.defaults.elements.point.radius = 2;
Chart.defaults.interaction.intersect = false;
Chart.defaults.interaction.mode = 'index';
Chart.defaults.indexAxis = 'x';
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.plugins.tooltip.displayColors = false;
Chart.defaults.borderColor = colors.ui.font + '22';

type AxisType = "time" | undefined;

interface tabInterface {
    num: number,
    title: string,
    icon: JSX.Element,
    count: number,
    setTabs: Dispatch<SetStateAction<number>>
}

interface dataInterface {
    num: number,
    thing: ScoreType | BeatmapType,
    group: 'scores' | 'beatmapsets',
    tab: number,
    maps: Score[] | BeatmapSet[],
    count: number,
    setMore: Dispatch<SetStateAction<Score[]>> | Dispatch<SetStateAction<BeatmapSet[]>>,
}
interface UserPageProps {
    userId: string;
    userMode: GameModeType;
}

const UserPage = (props: UserPageProps) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [gameMode, setGameMode] = useState<GameModeType>('osu');

    const [medals, setMedals] = useState<MedalInterface[]>([]);
    const [medalsByCategory, setMedalsByCategory] = useState<SortedMedals>({});
    const [lastMedals, setLastMedals] = useState<MedalInterface[]>([]);
    const [rarestMedal, setRarestMedal] = useState<MedalInterface | null>(null);

    const [globalData, setGlobalData] = useState<number[]>([]);
    const [countryData, setCountryData] = useState<number[]>([]);
    const [playsData, setPlaysData] = useState<number[]>([]);
    const [replaysData, setReplaysData] = useState<number[]>([]);

    const [globalLabels, setGlobalLabels] = useState<Date[]>([]);
    const [countryLabels, setCountryLabels] = useState<Date[]>([]);
    const [playsLabels, setPlaysLabels] = useState<Date[]>([]);
    const [replaysLabels, setReplaysLabels] = useState<Date[]>([]);

    const [bestScores, setBestScores] = useState<Score[]>([])
    const [recentScores, setRecentScores] = useState<Score[]>([])
    const [pinnedScores, setPinnedScores] = useState<Score[]>([])
    const [firstsScores, setFirstsScores] = useState<Score[]>([])

    const [favouriteBeatmaps, setFavouriteBeatmaps] = useState<BeatmapSet[]>([]);
    const [graveyardBeatmaps, setGraveyardBeatmaps] = useState<BeatmapSet[]>([]);
    const [guestBeatmaps, setGuestBeatmaps] = useState<BeatmapSet[]>([]);
    const [lovedBeatmaps, setLovedBeatmaps] = useState<BeatmapSet[]>([]);
    const [nominatedBeatmaps, setNominatedBeatmaps] = useState<BeatmapSet[]>([]);
    const [pendingBeatmaps, setPendingBeatmaps] = useState<BeatmapSet[]>([]);
    const [rankedBeatmaps, setRankedBeatmaps] = useState<BeatmapSet[]>([]);

    const [historyTabIndex, setHistoryTabIndex] = useState<number>(1);
    const [scoresTabIndex, setScoresTabIndex] = useState<number>(0);
    const [beatmapsTabIndex, setBeatmapsTabIndex] = useState<number>(0);
    const beatmapReqLimit: number = 20;

    const div1Ref = useRef<HTMLDivElement | null>(null);
    const div2Ref = useRef<HTMLDivElement | null>(null);
    const [div1Height, setDiv1Height] = useState<number>(675);

    const maniaPP = useMemo(() => generateStatisticsMarkup(userData, 'PP'), [userData]);
    const maniaG = useMemo(() => generateStatisticsMarkup(userData, 'G'), [userData]);
    const maniaC = useMemo(() => generateStatisticsMarkup(userData, 'C'), [userData]);

    useEffect(() => {
        if (div1Ref.current && div2Ref.current) {
            const height: number = div1Ref.current.clientHeight;
            div2Ref.current.style.height = `${height}px`;
            setDiv1Height(height);
        }
    }, [div1Ref.current?.clientHeight]);

    useEffect((): void => {
        clearData();
        getUser();
    }, [props.userId, props.userMode]);

    useEffect(() => {
        if (!userData) return;
        if (medals.length < 1) return;
        getLastMedals(userData.user_achievements, medals, 10);
        getRarestMedal(userData.user_achievements, medals);
    }, [userData, medals]);

    //ONLY ONCE!!!!!
    useEffect(() => {
        getMedals();
    }, [])

    const globalHistoryDataInitial = {
        labels: [],
        datasets: [{
            label: 'Rank',
            data: [],
            fill: false,
            borderColor: colors.ui.accent,
            tension: 0.1,
        }],
    }
    const countryHistoryDataInitial = {
        labels: [],
        datasets: [{
            label: 'Rank',
            data: [],
            fill: false,
            borderColor: colors.ui.accent,
            tension: 0.1,
        }],
    }
    const playsHistoryDataInitial = {
        labels: [],
        datasets: [{
            label: 'Play Count',
            data: [],
            fill: false,
            borderColor: colors.ui.accent,
            tension: 0.1
        }]
    }
    const replaysHistoryDataInitial = {
        labels: [],
        datasets: [{
            label: 'Replays Watched',
            data: [],
            fill: false,
            borderColor: colors.ui.accent,
            tension: 0.1
        }]
    }
    const [globalHistoryData, setGlobalHistoryData] = useState<ChartData<'line'>>(globalHistoryDataInitial);
    const [countryHistoryData, setCountryHistoryData] = useState<ChartData<'line'>>(countryHistoryDataInitial);
    const [playsHistoryData, setPlaysHistoryData] = useState<ChartData<'line'>>(playsHistoryDataInitial);
    const [replaysHistoryData, setReplaysHistoryData] = useState<ChartData<'line'>>(replaysHistoryDataInitial);

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
                type: 'time' as AxisType,
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
                type: 'time' as AxisType,
                time: {
                    displayFormats: {
                        day: 'dd/mm/yy',
                    },
                },
            }
        },
    };

    if (!userData) {
        return (
            <Spinner animation="border" role="status" className="mx-auto my-3">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
    }
    if (userData.is_bot) {
        return (
            <div>User is a bot, bots are not supported yet</div>
        )
    }
    if (userData.id === undefined) {
        return (
            <div>User not found</div>
        )
    }

    const scoresRanksLabels: BarPieChartData[] = [
        { label: 'XH', color: colors.ranks.xh, value: userData.statistics.grade_counts.ssh },
        { label: 'X', color: colors.ranks.x, value: userData.statistics.grade_counts.ss },
        { label: 'SH', color: colors.ranks.sh, value: userData.statistics.grade_counts.sh },
        { label: 'S', color: colors.ranks.s, value: userData.statistics.grade_counts.sh },
        { label: 'A', color: colors.ranks.a, value: userData.statistics.grade_counts.a },
    ];

    const scoresTabs: tabInterface[] = [
        {
            num: 1,
            title: 'Pinned',
            icon: <BsFillPinAngleFill />,
            count: userData.scores_pinned_count,
            setTabs: setScoresTabIndex
        },
        {
            num: 2,
            title: 'Best',
            icon: <BsBarChartLine />,
            count: userData.scores_best_count,
            setTabs: setScoresTabIndex
        },
        { num: 3, title: 'Firsts', icon: <HiOutlineStar />, count: userData.scores_first_count, setTabs: setScoresTabIndex },
        { num: 4, title: 'Recent', icon: <BsStopwatch />, count: userData.scores_recent_count, setTabs: setScoresTabIndex },
    ]

    const scoresData: dataInterface[] = [
        {
            num: 1,
            thing: 'pinned',
            group: 'scores',
            tab: scoresTabIndex,
            maps: pinnedScores,
            count: userData.scores_pinned_count,
            setMore: setPinnedScores
        },
        {
            num: 2,
            thing: 'best',
            group: 'scores',
            tab: scoresTabIndex,
            maps: bestScores,
            count: userData.scores_best_count,
            setMore: setBestScores
        },
        {
            num: 3,
            thing: 'firsts',
            group: 'scores',
            tab: scoresTabIndex,
            maps: firstsScores,
            count: userData.scores_first_count,
            setMore: setFirstsScores
        },
        {
            num: 4,
            thing: 'recent',
            group: 'scores',
            tab: scoresTabIndex,
            maps: recentScores,
            count: userData.scores_recent_count,
            setMore: setRecentScores
        },
    ]

    const beatmapsTabs: tabInterface[] = [
        {
            num: 1,
            title: 'Favourites',
            icon: <HiOutlineStar />,
            count: userData.favourite_beatmapset_count,
            setTabs: setBeatmapsTabIndex
        },
        {
            num: 2,
            title: 'Ranked',
            icon: <HiChevronDoubleUp />,
            count: userData.ranked_and_approved_beatmapset_count,
            setTabs: setBeatmapsTabIndex
        },
        {
            num: 3,
            title: 'Loved',
            icon: <BsSuitHeartFill />,
            count: userData.loved_beatmapset_count,
            setTabs: setBeatmapsTabIndex
        },
        {
            num: 4,
            title: 'Guest',
            icon: <BiSolidUserDetail />,
            count: userData.guest_beatmapset_count,
            setTabs: setBeatmapsTabIndex
        },
        {
            num: 5,
            title: 'Graveyard',
            icon: <FaSkull />,
            count: userData.graveyard_beatmapset_count,
            setTabs: setBeatmapsTabIndex
        },
        {
            num: 6,
            title: 'Nominated',
            icon: <BiSolidTrophy />,
            count: userData.nominated_beatmapset_count,
            setTabs: setBeatmapsTabIndex
        },
        {
            num: 7,
            title: 'Pending',
            icon: <BsHourglassSplit />,
            count: userData.pending_beatmapset_count,
            setTabs: setBeatmapsTabIndex
        },
    ]

    const beatmapsData: dataInterface[] = [
        {
            num: 1,
            thing: 'favourite',
            group: 'beatmapsets',
            tab: beatmapsTabIndex,
            maps: favouriteBeatmaps,
            count: userData.favourite_beatmapset_count,
            setMore: setFavouriteBeatmaps
        },
        {
            num: 2,
            thing: 'ranked',
            group: 'beatmapsets',
            tab: beatmapsTabIndex,
            maps: rankedBeatmaps,
            count: userData.ranked_and_approved_beatmapset_count,
            setMore: setRankedBeatmaps
        },
        {
            num: 3,
            thing: 'loved',
            group: 'beatmapsets',
            tab: beatmapsTabIndex,
            maps: lovedBeatmaps,
            count: userData.loved_beatmapset_count,
            setMore: setLovedBeatmaps
        },
        {
            num: 4,
            thing: 'guest',
            group: 'beatmapsets',
            tab: beatmapsTabIndex,
            maps: guestBeatmaps,
            count: userData.guest_beatmapset_count,
            setMore: setGuestBeatmaps
        },
        {
            num: 5,
            thing: 'graveyard',
            group: 'beatmapsets',
            tab: beatmapsTabIndex,
            maps: graveyardBeatmaps,
            count: userData.graveyard_beatmapset_count,
            setMore: setGraveyardBeatmaps
        },
        {
            num: 6,
            thing: 'nominated',
            group: 'beatmapsets',
            tab: beatmapsTabIndex,
            maps: nominatedBeatmaps,
            count: userData.nominated_beatmapset_count,
            setMore: setNominatedBeatmaps
        },
        {
            num: 7,
            thing: 'pending',
            group: 'beatmapsets',
            tab: beatmapsTabIndex,
            maps: pendingBeatmaps,
            count: userData.pending_beatmapset_count,
            setMore: setPendingBeatmaps
        },
    ]

    return (
        <div>
            <div style={{ background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${userData.cover_url})`, backgroundSize: "cover", backgroundPosition: 'center' }}>
                <div style={{ backdropFilter: "blur(2px)" }}
                    className="flex flex-col p-8 gap-8 card-body rounded-none">
                    <div className="grid grid-cols-7 flex-wrap gap-4 xl:gap-8">
                        <div className="col-span-7 md:col-span-2 xl:col-span-1 gap-3 flex flex-col items-center justify-start">
                            <img src={userData.avatar_url}
                                onError={addDefaultSrc}
                                alt='pfp' className="rounded-xl aspect-square mb-2"
                                style={{ width: '100%' }} />
                            <div className="flex flex-row gap-2 items-center w-full">
                                <div className="text-neutral-content">{userData.statistics.level.current}</div>
                                <progress className="progress progress-warning" value={userData.statistics.level.progress} max="100"></progress>
                                <div>{userData.statistics.level.current + 1}</div>
                            </div>
                            <div className="text-center text-lg tooltip"
                                data-tip={moment(userData.join_date).fromNow()}>
                                Joined at {moment(userData.join_date).format("DD/MM/YYYY")}
                            </div>
                        </div>
                        <div className="col-span-7 md:col-span-2 xl:col-span-2 gap-3 flex flex-col items-center md:items-start justify-between">
                            <div className="flex flex-row gap-3 items-center">
                                <a className="text-4xl font-bold"
                                    target={"_blank"}
                                    href={`https://osu.ppy.sh/users/${userData.id}`}>
                                    {userData.username}
                                </a>
                                {userData.groups.map((group: UserGroup, index: number) =>
                                    <GroupBadge group={group}
                                        key={index + 1} />
                                )}
                                {userData.is_supporter && <SupporterIcon size={32} level={userData.support_level} />}
                            </div>
                            <div className="profileTitle">{userData.title}</div>
                            <div data-tooltip-id="tooltip"
                                data-tooltip-html={`${maniaG}`}
                                className="flex flex-col gap-1">
                                <div className="text-lg">Global Rank:</div>
                                <div className="text-2xl flex flex-row items-center gap-2">
                                    <HiGlobeAlt />
                                    <div>#{userData.statistics.global_rank ? <CountUp end={userData.statistics.global_rank} duration={1} /> : '-'}</div>
                                </div>
                            </div>
                            <div data-tooltip-id="tooltip"
                                data-tooltip-html={`${maniaC}`}
                                className="flex flex-col gap-1">
                                <div className="text-lg">Country Rank:</div>
                                <div className="text-2xl flex flex-row items-center gap-2">
                                    <CountryShape code={userData.country.code} size={32} />
                                    <div>#{userData.statistics.country_rank ? <CountUp end={userData.statistics.country_rank} duration={1} /> : '-'}</div>
                                    {userData.country.code === 'CAT' ?
                                        <div className="tooltip tooltip-right" data-tip={userData.country.name}>
                                            <img alt={userData.country.code} className="emoji-flag"
                                                src={require(`../assets/extra-flags/${userData.country.code.toLowerCase()}.png`)} />
                                        </div> :
                                        <Twemoji options={{ className: 'emoji-flag', noWrapper: true }}>
                                            <ReactCountryFlag countryCode={userData.country.code}
                                                className="tooltip tooltip-right"
                                                data-tip={userData.country.name} />
                                        </Twemoji>}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-lg">Performance:</div>
                                <div className="text-xl flex flex-row items-center gap-2">
                                    <div><CountUp end={Math.round(userData.statistics.pp)} duration={1} />pp</div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-lg">Accuracy:</div>
                                <div className="text-xl flex flex-row items-center gap-2">
                                    <div><CountUp end={userData.statistics.hit_accuracy} decimals={2} duration={1} />%</div>
                                </div>
                            </div>
                            <BarPieChart data={scoresRanksLabels} width={250} />
                        </div>
                        <div className="col-span-7 md:col-span-3 xl:col-span-2 flex col-start-4 xl:col-start-6 flex-col items-center md:items-end gap-3 xl:justify-between">
                            <ModeSelector mode={gameMode} userId={userData.id} />
                            <div className="flex flex-col gap-1">
                                <div className="text-lg">Ranked Score:</div>
                                <div className="tooltip tooltip-left text-xl flex flex-row items-center gap-2"
                                    data-tip={`Total Score: ${userData.statistics.total_score.toLocaleString()}`}>
                                    <HiChevronDoubleUp />
                                    <div>
                                        <CountUp end={userData.statistics.ranked_score} duration={1} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-lg">Max Combo:</div>
                                <div className="text-xl flex flex-row items-center gap-2">
                                    <HiFire />
                                    <div><CountUp end={userData.statistics.maximum_combo} duration={1} />x</div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-lg">Play Time:</div>
                                <div className="text-xl flex flex-row items-center gap-2 tooltip tooltip-left"
                                    data-tip={secondsToTime(userData.statistics.play_time)}>
                                    <i className="bi bi-clock"></i>
                                    <div>
                                        <CountUp end={Math.round((userData.statistics.play_time / 60 / 60))} duration={1} />h
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-lg">Play Count:</div>
                                <div className="text-xl flex flex-row items-center gap-2">
                                    <HiReply />
                                    <div><CountUp end={userData.statistics.play_count} duration={1} /></div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-lg">Hits x Play:</div>
                                <div className="text-xl flex flex-row items-center gap-2">
                                    <HiCalculator />
                                    <div><CountUp end={Math.round((userData.statistics.count_50 + userData.statistics.count_100 + userData.statistics.count_300) / userData.statistics.play_count)} duration={1} /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {userData.badges.length > 0 &&
                        <div className="flex flex-row flex-wrap gap-2 items-center justify-content-start">
                            {userData.badges.map((badge: UserBadge, index: number) =>
                                <Badge badge={badge} key={index + 1} />
                            )}
                        </div>}
                </div>
            </div>
            <div className="bg-accent-800 drop-shadow-lg p-4 m-0 flex flex-row flex-wrap items-center gap-4">
                <div className="flex flex-row items-center gap-2">
                    <i className="bi bi-people-fill"></i>
                    <div>Followers: {userData.follower_count.toLocaleString()}</div>
                </div>
                {userData.discord !== null &&
                    <div className="flex flex-row items-center gap-2">
                        <i className="bi bi-discord"></i>
                        <Twemoji options={{ className: 'emoji', noWrapper: true }}>
                            {userData.discord}
                        </Twemoji>
                    </div>}
                {userData.twitter !== null &&
                    <div className="flex flex-row items-center gap-2">
                        <i className="bi bi-twitter"></i>
                        <Twemoji options={{ className: 'emoji' }}>
                            {userData.twitter}
                        </Twemoji>
                    </div>}
                {userData.website !== null &&
                    <div className="flex flex-row items-center gap-2">
                        <i className="bi bi-globe"></i>
                        <Twemoji options={{ className: 'emoji' }}>
                            {userData.website}
                        </Twemoji>
                    </div>}
                {userData.discord !== null &&
                    <div className="flex flex-row items-center gap-2">
                        <i className="bi bi-geo-alt-fill"></i>
                        <Twemoji options={{ className: 'emoji' }}>
                            {userData.location}
                        </Twemoji>
                    </div>}
                {userData.interests !== null &&
                    <div className="flex flex-row items-center gap-2">
                        <i className="bi bi-suit-heart-fill"></i>
                        <Twemoji options={{ className: 'emoji' }}>
                            {userData.interests}
                        </Twemoji>
                    </div>}
                {userData.occupation !== null &&
                    <div className="flex flex-row items-center gap-2">
                        <i className="bi bi-buildings"></i>
                        <Twemoji options={{ className: 'emoji' }}>
                            {userData.occupation}
                        </Twemoji>
                    </div>}
            </div>
            <div className="grid grid-cols-5 gap-4 p-4 justify-center">
                <div className="drop-shadow-lg col-span-5 xl:col-span-3 flex flex-col gap-4 p-0 m-0" ref={div1Ref}>
                    <div className="rounded-lg overflow-hidden shadow">
                        <div className="p-2 bg-accent-800 flex flex-row gap-2 justify-center">
                            <i className="bi bi-graph-up"></i>
                            <div>History</div>
                        </div>
                        <div className="tabs tabs-boxed content-center rounded-none justify-center bg-accent-900">
                            <button
                                className={`tab flex flex-row gap-2  ${historyTabIndex === 1 && 'tab-active text-base-100'}`}
                                onClick={() => setHistoryTabIndex(1)}>
                                <HiGlobeAlt />
                                <div>Global Rank</div>
                            </button>
                            <button
                                className={`tab flex flex-row gap-2  ${historyTabIndex === 2 && 'tab-active text-base-100'}`}
                                onClick={() => setHistoryTabIndex(2)}>
                                <CountryShape code={userData.country.code} size={18} />
                                <div>Country Rank</div>
                            </button>
                            <button
                                className={`tab flex flex-row gap-2  ${historyTabIndex === 3 && 'tab-active text-base-100'}`}
                                onClick={() => setHistoryTabIndex(3)}>
                                <i className="bi bi-arrow-counterclockwise"></i>
                                <div>Play Count</div>
                            </button>
                            <button
                                className={`tab flex flex-row gap-2  ${historyTabIndex === 4 && 'tab-active text-base-100'}`}
                                onClick={() => setHistoryTabIndex(4)}>
                                <i className="bi bi-arrow-counterclockwise"></i>
                                <div>Replays Watched</div>
                            </button>
                        </div>
                        <div style={{ height: 250 }} className="bg-accent-950 flex justify-center items-center">
                            <div className="grow p-4" hidden={historyTabIndex !== 1}
                                style={{ height: 250 }}>
                                <Line data={globalHistoryData} options={lineOptionsReverse} />
                            </div>
                            <div className="grow p-4" hidden={historyTabIndex !== 2}
                                style={{ height: 250 }}>
                                <Line data={countryHistoryData} options={lineOptionsReverse} />
                            </div>
                            <div className="grow p-4" hidden={historyTabIndex !== 3}
                                style={{ height: 250 }}>
                                <Line data={playsHistoryData} options={lineOptions} />
                            </div>
                            <div className="grow p-4" hidden={historyTabIndex !== 4}
                                style={{ height: 250 }}>
                                <Line data={replaysHistoryData} options={lineOptions} />
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg overflow-hidden shadow">
                        <div className="p-2 bg-accent-800 flex flex-row gap-2 justify-center">
                            <i className="bi bi-bar-chart-line"></i>
                            <div>Top Play Stats</div>
                        </div>
                        <div className="p-4 bg-accent-950">
                            <TopScoresPanel data={userData} best={bestScores} />
                        </div>
                    </div>
                </div>
                <div className="drop-shadow-lg col-span-5 xl:col-span-2 flex flex-col overflow-hidden rounded-lg shadow grow"
                    style={{ height: div1Height }}>
                    <div className="p-2 grid grid-cols-6 items-center bg-accent-800">
                        <div className="col-start-2 col-span-4 flex flex-row gap-2 justify-center">
                            <i className="bi bi-controller"></i>
                            <div>Scores</div>
                        </div>
                        <div className="col-span-1 flex justify-content-end">
                            <button className="darkenOnHover"
                                onClick={() => {
                                    getScores(userData.id, gameMode, false);
                                }}>
                                <i className="bi bi-argrid grid-cols-12-clockwise"></i>
                            </button>
                        </div>
                    </div>
                    <div className="tabs tabs-boxed content-center rounded-none justify-center bg-accent-900">
                        {scoresTabs.map((tab: tabInterface, i: number) => tab.count > 0 &&
                            <button className={`tab flex flex-row gap-2 ${scoresTabIndex === tab.num && 'tab-active text-base-100'}`}
                                onClick={() => tab.setTabs(tab.num)} key={i + 1}>
                                {tab.icon}
                                <div>{tab.title}</div>
                                <div className="badge">{tab.count}</div>
                            </button>)}
                    </div>
                    <div className="overflow-y-scroll p-4 bg-accent-950 grow">
                        {scoresData.map((dat: dataInterface, i: number) =>
                            <div className={`${dat.tab === dat.num ? 'flex' : 'hidden'} flex-col gap-3`} key={i + 1}>
                                {dat.maps.length === 0 && dat.count !== 0 &&
                                    <Spinner animation="border" role="status" className="mx-auto mt-4">
                                        <div className="visually-hidden">Loading...</div>
                                    </Spinner>}
                                {(dat.maps as Score[])[0]?.ended_at &&
                                    (dat.maps as Score[]).map((score: Score, index: number) =>
                                        <ScoreCard index={index + 1} score={score} key={index + 1} />)}
                                {dat.maps.length < dat.count &&
                                    <button
                                        className="btn btn-success flex flex-row gap-2 justify-center w-full rounded-0"
                                        onClick={() => getThings(userData.id, gameMode, dat.group, dat.thing, dat.maps.length, beatmapReqLimit, dat.maps, dat.setMore)}>
                                        <i className="bi bi-caret-down-fill"></i>
                                        <div>Expand</div>
                                        <i className="bi bi-caret-down-fill"></i>
                                    </button>}
                            </div>)}
                    </div>
                </div>
                <div className="drop-shadow-lg col-span-5 xl:col-span-2 flex flex-col overflow-hidden rounded-lg shadow grow"
                    style={{ height: div1Height }}>
                    <div className="p-2 grid grid-cols-6 items-center bg-accent-800">
                        <div className="col-start-2 col-span-4 flex flex-row gap-2 justify-center">
                            <i className="bi bi-file-earmark-music"></i>
                            <div>Beatmaps</div>
                        </div>
                        <div className="col-span-1 flex justify-content-end">
                            <button className=""
                                onClick={() => {
                                    getBeatmaps(userData.id, gameMode, false);
                                }}>
                                <i className="bi bi-argrid grid-cols-12-clockwise"></i>
                            </button>
                        </div>
                    </div>
                    <div className="tabs tabs-boxed content-center rounded-none justify-center bg-accent-900">
                        {beatmapsTabs.map((tab: tabInterface, i: number) => tab.count > 0 &&
                            <button className={`tab flex flex-row gap-2 ${beatmapsTabIndex === tab.num && 'tab-active'}`}
                                onClick={() => tab.setTabs(tab.num)} key={i + 1}>
                                {tab.icon}
                                <div>{tab.title}</div>
                                <div className="badge">{tab.count}</div>
                            </button>)}
                    </div>
                    <div className="overflow-y-scroll p-4 bg-accent-950 grow">
                        {beatmapsData.map((dat: dataInterface, i: number) =>
                            <div className={`${dat.tab === dat.num ? 'flex' : 'hidden'} flex-col gap-3`} key={i + 1}>
                                {dat.maps.length === 0 && dat.count !== 0 &&
                                    <Spinner animation="border" role="status" className="mx-auto">
                                        <div className="visually-hidden">Loading...</div>
                                    </Spinner>}
                                {(dat.maps as BeatmapSet[])[0]?.title &&
                                    (dat.maps as BeatmapSet[]).map((beatmapset: BeatmapSet, index: number) =>
                                        <BeatmapsetCard index={index + 1} data={beatmapset} key={index + 1} />)}
                                {dat.maps.length < dat.count &&
                                    <button
                                        className="btn btn-success flex flex-row gap-2 justify-center w-full rounded-0"
                                        onClick={() => getThings(userData.id, gameMode, dat.group, dat.thing, dat.maps.length, beatmapReqLimit, dat.maps, dat.setMore)}>
                                        <i className="bi bi-caret-down-fill"></i>
                                        <div>Expand</div>
                                        <i className="bi bi-caret-down-fill"></i>
                                    </button>}
                            </div>)}
                    </div>
                </div>
                <div className="drop-shadow-lg col-span-5 xl:col-span-3 flex flex-col gap-4 p-0 m-0" ref={div2Ref}
                    style={{ height: div1Height }}>
                    <div className="grow rounded-lg overflow-hidden p-0 flex flex-col">
                        <div className="p-2 bg-accent-800 flex flex-row gap-2 justify-center">
                            <i className="bi bi-award"></i>
                            <div>Medals</div>
                        </div>
                        <div className="flex flex-col overflow-y-scroll bg-accent-950 overflow-x-hidden">
                            <div className="grid grid-cols-6 ">
                                <div className="col-span-5">
                                    <div className="text-center p-2 bg-accent-900">
                                        Recent Medals
                                    </div>
                                    <div className="p-3 pt-2">
                                        <div className="flex flex-row justify-between pb-1 px-2"
                                            style={{ fontSize: 14, top: -8 }}>
                                            <div>most recent</div>
                                            <div>least recent</div>
                                        </div>
                                        <div
                                            className="flex flex-row gap-1">
                                            {lastMedals.map((medal: MedalInterface, index: number) => (
                                                <Medal thisMedal={medal} userMedals={userData.user_achievements}
                                                    key={index} />))}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <div className="text-center p-2 bg-accent-900">
                                        Rarest Medal
                                    </div>
                                    <div className="p-3 pt-2">
                                        <div className="pb-1 px-2 text-center"
                                            style={{ fontSize: 14, top: -8 }}>
                                            Rarity: {parseFloat(rarestMedal?.Rarity ? rarestMedal.Rarity : '0').toFixed(2)}%
                                        </div>
                                        <div className="p-3 rounded-lg grid justify-center">
                                            {rarestMedal &&
                                                <Medal thisMedal={rarestMedal}
                                                    userMedals={userData.user_achievements} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {Object.entries(medalsByCategory).map(([category, medals]: [string, MedalInterface[]], key: number) => (
                                    <div key={key}>
                                        <div
                                            className="text-center p-2 flex flex-row justify-center items-center bg-accent-900">
                                            <div className="text-center">
                                                {category}:
                                            </div>
                                        </div>
                                        <div className="p-3 pt-2">
                                            <div className="pb-1 px-2 text-center"
                                                style={{ fontSize: 14, top: -8 }}>
                                                {(getAchievedMedalsCount()[category] / medals.length * 100).toFixed(2)}%
                                                ({getAchievedMedalsCount()[category]}/{medals.length})
                                            </div>
                                            <div
                                                className="flex flex-row flex-wrap gap-1 justify-center">
                                                {medals.map((medal: MedalInterface, index: number) => (
                                                    <Medal thisMedal={medal} userMedals={userData.user_achievements}
                                                        key={index} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    function clearData(): void {
        setUserData(null);
        setGameMode('default');
        setPinnedScores([]);
        setBestScores([]);
        setFirstsScores([]);
        setRecentScores([]);
        setFavouriteBeatmaps([]);
        setRankedBeatmaps([]);
        setGuestBeatmaps([]);
        setLovedBeatmaps([]);
        setGraveyardBeatmaps([]);
        setPendingBeatmaps([]);
        setNominatedBeatmaps([]);
        setGlobalHistoryData(globalHistoryDataInitial);
        setCountryHistoryData(countryHistoryDataInitial);
        setPlaysHistoryData(playsHistoryDataInitial);
        setReplaysHistoryData(replaysHistoryDataInitial);
    }

    async function getUser() {
        const res = await axios.post('/user', {
            id: props.userId,
            mode: props.userMode,
        })
        const data: UserData = res.data;
        if (!data.id) return;
        if (data.is_bot) return;
        console.log(data);
        let searchMode: GameModeType;
        if (props.userMode === "default") {
            searchMode = data.playmode;
        } else {
            searchMode = props.userMode;
        }
        window.history.pushState({}, '', `/users/${data.id}/${searchMode}`);
        setUserData(data);
        setCharts(data);
        setGameMode(searchMode);
        getScores(data.id, searchMode, true);
        getBeatmaps(data.id, searchMode, true);
    }

    async function getScores(id: number, mode: GameModeType, changeTab: boolean) {
        const url: string = `https://osu.ppy.sh/users/${id}/extra-pages/top_ranks?mode=${mode}`
        const urlR: string = `https://osu.ppy.sh/users/${id}/extra-pages/historical?mode=${mode}`
        try {
            const res = await axios.post('/proxy', { url: url });
            const data = res.data;
            const resR = await axios.post('/proxy', { url: urlR });
            const dataR = resR.data;
            if (!data || !dataR) return;
            let tab: number = 0;
            if (dataR.recent.count > 0) {
                setRecentScores(dataR.recent.items);
                tab = 4;
            }
            if (data.firsts.count > 0) {
                setFirstsScores(data.firsts.items);
                tab = 3;
            }
            if (data.best.count > 0) {
                getThings(id, mode, 'scores', 'best', 0, 100, [], setBestScores);
                tab = 2;
            }
            if (data.pinned.count > 0) {
                setPinnedScores(data.pinned.items);
                tab = 1;
            }
            if (changeTab) setScoresTabIndex(tab);
        } catch (err) {
            console.error(err);
        }
    }

    async function getBeatmaps(id: number, mode: GameModeType, changeTab: boolean) {
        const url: string = `https://osu.ppy.sh/users/${id}/extra-pages/beatmaps?mode=${mode}`;
        try {
            const res = await axios.post('/proxy', { url: url });
            const data = res.data;
            if (!data) return;
            let tab: number = 0;
            if (data.pending.count > 0) {
                setPendingBeatmaps(data.pending.items)
                tab = 7;
            }
            if (data.nominated.count > 0) {
                setNominatedBeatmaps(data.nominated.items)
                tab = 6;
            }
            if (data.graveyard.count > 0) {
                setGraveyardBeatmaps(data.graveyard.items)
                tab = 5;
            }
            if (data.guest.count > 0) {
                setGuestBeatmaps(data.guest.items)
                tab = 4;
            }
            if (data.loved.count > 0) {
                setLovedBeatmaps(data.loved.items);
                tab = 3;
            }
            if (data.ranked.count > 0) {
                setRankedBeatmaps(data.ranked.items);
                tab = 2;
            }
            if (data.favourite.count > 0) {
                setFavouriteBeatmaps(data.favourite.items);
                tab = 1;
            }
            setBeatmapsTabIndex(tab);
        } catch (err) {
            console.error(err);
        }
    }

    async function getThings(id: number, mode: GameModeType, thing: 'scores' | 'beatmapsets', type: string, offset: number, limit: number, things: any[], setThings: Dispatch<SetStateAction<any[]>>) {
        const url: string = `https://osu.ppy.sh/users/${id}/${thing}/${type}?mode=${mode}&limit=${limit}&offset=${offset}`
        try {
            const res = await axios.post('/proxy', { url: url });
            const data: any[] = res.data;
            if (offset === 0) {
                setThings(data);
            } else {
                setThings([...things, ...data])
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function getMedals() {
        try {
            const res = await axios.post('/getMedals')
            const data: MedalInterface[] = res.data;
            data.sort((a: any, b: any) => {
                return parseInt(a.MedalID) - parseInt(b.MedalID);
            });
            setMedals(data);
            getMedalsByCategory(data);
        } catch (e) {
            console.error(e);
        }
    }

    function getMedalsByCategory(data: MedalInterface[]) {
        data.sort((a: any, b: any) => {
            if (a.Grouping === b.Grouping) {
                return parseInt(a.value, 10) - parseInt(b.value, 10);
            }
            return a.Grouping.localeCompare(b.Grouping);
        });
        const categoryArrays: SortedMedals = {};
        for (const obj of data) {
            if (categoryArrays[obj.Grouping]) {
                categoryArrays[obj.Grouping].push(obj);
            } else {
                categoryArrays[obj.Grouping] = [obj];
            }
        }
        setMedalsByCategory(categoryArrays);
    }

    function getLastMedals(userMedals: UserAchievement[], medals: MedalInterface[], num: number) {
        const sortedArray = userMedals
            .sort((a: UserAchievement, b: UserAchievement) => {
                const dateA: Date = new Date(a.achieved_at);
                const dateB: Date = new Date(b.achieved_at);
                return dateA.getTime() - dateB.getTime();
            }).reverse().slice(0, num)
            .map((obj: UserAchievement) => obj.achievement_id)
            .map((id: number) => medals.find((medal: any): boolean => parseInt(medal.MedalID) === id))
            .filter((medal: MedalInterface | undefined): medal is MedalInterface => medal !== undefined);
        setLastMedals(sortedArray);
    }

    function getAchievedMedalsCount(): MedalCategories {
        const achievedMedalsCount: MedalCategories = {};
        Object.entries(medalsByCategory)
            .forEach(([category, medals]: [string, MedalInterface[]]) => {
                achievedMedalsCount[category] = 0;
                userData?.user_achievements.forEach((achievedMedal: UserAchievement): void => {
                    if (medals.find((medal: MedalInterface): boolean => parseInt(medal.MedalID) === achievedMedal.achievement_id)) {
                        achievedMedalsCount[category]++;
                    }
                });
            });
        return achievedMedalsCount;
    }

    function getRarestMedal(userMedals: UserAchievement[], medals: MedalInterface[]) {
        const data = userMedals.map((obj: UserAchievement) => obj.achievement_id)
            .map((id: number) => medals.find((medal: MedalInterface): boolean => String(medal.MedalID) === String(id)))
            .reduce((rarest: MedalInterface | null, medal: MedalInterface | undefined): MedalInterface => {
                if (!rarest || (medal && medal.Rarity < rarest.Rarity)) {
                    return medal as MedalInterface;
                }
                return rarest;
            }, null)
        setRarestMedal(data);
    }

    function setCharts(user: UserData) {
        getGlobalData(user);
        getCountryData(user);
        getPlaysData(user);
        getReplaysData(user);
    }

    function getGlobalData(user: UserData) {
        if (!user?.db_info.global_rank) return;
        setGlobalHistoryData({
            labels: user.db_info.global_rank.map(obj => new Date(obj.date)),
            datasets: [{
                label: 'Global Rank',
                data: user.db_info.global_rank.map(obj => obj.rank),
                fill: false,
                borderColor: colors.ui.accent,
                tension: 0.1,
            }],
        })
    }

    function getCountryData(user: UserData) {
        if (!user?.db_info.country_rank) return;
        setCountryHistoryData({
            labels: user.db_info.country_rank.map(obj => new Date(obj.date)),
            datasets: [{
                label: 'Country Rank',
                data: user.db_info.country_rank.map(obj => obj.rank),
                fill: false,
                borderColor: colors.ui.accent,
                tension: 0.1,
            }],
        })
    }

    function getPlaysData(user: UserData) {
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

    function getReplaysData(user: UserData) {
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

    function generateStatisticsMarkup(userData: UserData | null, type: string) {
        if (userData === null) return '';
        if (!userData.statistics?.variants) return '';

        const markup = userData.statistics.variants.map((v) =>
            `<div>${v.variant}: ${type === 'PP'
                ? `${Math.round(v.pp)}pp`
                : `#${Math.round(
                    type === 'G' ? v.global_rank : v.country_rank
                ).toLocaleString()}`
            }</div>`
        ).join('');

        return `<div class="flex flex-col g-2">${markup}</div>`;
    }
}
export default UserPage;