/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";

import moment from "moment";
import Twemoji from 'react-twemoji';
import { Line, Radar } from "react-chartjs-2";
import zoomPlugin from 'chartjs-plugin-zoom';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';

import { FaSkull, FaRegClock } from "react-icons/fa";
import Spinner from 'react-bootstrap/Spinner';
import { BiSolidTrophy, BiSolidUserDetail } from "react-icons/bi";
import { HiCalculator, HiChevronDoubleUp, HiFire, HiGlobeAlt, HiOutlineStar } from "react-icons/hi";
import { BsBarChartLine, BsFillPinAngleFill, BsHourglassSplit, BsStopwatch, BsSuitHeartFill } from "react-icons/bs";
import { ImSpinner11 } from "react-icons/im";

import Badge from "../components/Badge";
import ScoreCard from "../cards/ScoreCard";
import { colors } from "../resources/store";
import axios from '../resources/axios-config';
import GroupBadge from "../components/GroupBadge";
import BarPieChart from "../components/BarPieChart";
import BeatmapsetCard from "../cards/BeatmapsetCard";
import CountryShape from "../components/CountryShape";
import ModeSelector from "../components/ModeSelector";
import SupporterIcon from "../components/SupporterIcon";
import { addDefaultSrc, secondsToTime } from "../resources/functions";
import { BeatmapType, GameModeType, ScoreType } from "../resources/types";
import TopScoresPanel, { BarPieChartData } from "../components/TopScoresPanel";

import 'chartjs-adapter-date-fns';
import { Score } from "../resources/interfaces/score";
import { BeatmapSet } from "../resources/interfaces/beatmapset";
import { MonthlyData, User, UserAchievement, UserBadge, UserGroup } from "../resources/interfaces/user";
import { Medal, MedalCategories, SortedMedals } from "../resources/interfaces/medals";
import MedalBadge from "../components/MedalBadge";

import InfiniteScroll from 'react-infinite-scroller';
import CountryFlag from "../components/CountryFlag";

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
type cardType = 'scores' | 'beatmapsets';
type categoryType = 'pinned' | 'best' | 'firsts' | 'recent' | 'favourite' | 'graveyard' | 'ranked' | 'loved' | 'guest' | 'nominated' | 'pending';

export interface tabGroup {
    setTabs: Dispatch<SetStateAction<number>>,
    items: tabInterface[],
}

export interface tabInterface {
    num: number,
    title: string,
    icon: JSX.Element,
    count: number,
}

export interface dataInterface {
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

const UserPage = (props: UserPageProps) => {
    const [userData, setUserData] = useState<User | null | undefined>(undefined);
    const [gameMode, setGameMode] = useState<GameModeType>('osu');

    const medals: Medal[] = useMedals();
    const medalsByCategory: SortedMedals = useMemo(() => getMedalsByCategory(medals), [medals]);
    const lastMedals: Medal[] = useMemo(() => getLastMedals(userData?.user_achievements, medals, 15), [userData]);
    const rarestMedal: Medal | null = useMemo(() => getRarestMedal(userData?.user_achievements, medals), [userData]);
    const achievedMedalsCount = useMemo(() => getAchievedMedalsCount(userData?.user_achievements, medalsByCategory), [userData]);

    const [bestCalc, setBestCalc] = useState<Score[]>([]);

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

    const div1Ref = useRef<HTMLDivElement | null>(null);

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

    const [globalHistoryData, setGlobalHistoryData] = useState<ChartData<'line'>>(LINE_CHART_INITIAL);
    const [countryHistoryData, setCountryHistoryData] = useState<ChartData<'line'>>(LINE_CHART_INITIAL);
    const [playsHistoryData, setPlaysHistoryData] = useState<ChartData<'line'>>(LINE_CHART_INITIAL);
    const [replaysHistoryData, setReplaysHistoryData] = useState<ChartData<'line'>>(LINE_CHART_INITIAL);
    const [skillsData, setSkillsData] = useState<ChartData<'radar'>>(RADAR_CHART_INITIAL);

    if (userData === undefined) {
        return (
            <Spinner animation="border" role="status" className="mx-auto my-3">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
    }
    if (userData === null) {
        return (
            <div>User not found</div>
        )
    }
    if (userData.is_bot) {
        return (
            <div>User is a bot, bots are not supported yet</div>
        )
    }


    const scoresRanksLabels: BarPieChartData[] = [
        { label: 'XH', color: colors.ranks.xh, value: userData.statistics.grade_counts.ssh },
        { label: 'X', color: colors.ranks.x, value: userData.statistics.grade_counts.ss },
        { label: 'SH', color: colors.ranks.sh, value: userData.statistics.grade_counts.sh },
        { label: 'S', color: colors.ranks.s, value: userData.statistics.grade_counts.sh },
        { label: 'A', color: colors.ranks.a, value: userData.statistics.grade_counts.a },
    ];

    const scoresTabs: tabGroup =
    {
        setTabs: setScoresTabIndex,
        items: [
            { num: 1, title: 'Pinned', icon: <BsFillPinAngleFill />, count: userData.scores_pinned_count },
            { num: 2, title: 'Best', icon: <BsBarChartLine />, count: userData.scores_best_count },
            { num: 3, title: 'Firsts', icon: <HiOutlineStar />, count: userData.scores_first_count },
            { num: 4, title: 'Recent', icon: <BsStopwatch />, count: userData.scores_recent_count },
        ]
    }

    const beatmapsTabs: tabGroup = {
        setTabs: setBeatmapsTabIndex,
        items: [
            { num: 1, title: 'Favourites', icon: <HiOutlineStar />, count: userData.favourite_beatmapset_count, },
            { num: 2, title: 'Ranked', icon: <HiChevronDoubleUp />, count: userData.ranked_and_approved_beatmapset_count },
            { num: 3, title: 'Guest', icon: <BiSolidUserDetail />, count: userData.guest_beatmapset_count },
            { num: 4, title: 'Loved', icon: <BsSuitHeartFill />, count: userData.loved_beatmapset_count },
            { num: 5, title: 'Nominated', icon: <BiSolidTrophy />, count: userData.nominated_beatmapset_count },
            { num: 6, title: 'Pending', icon: <BsHourglassSplit />, count: userData.pending_beatmapset_count },
            { num: 7, title: 'Graveyard', icon: <FaSkull />, count: userData.graveyard_beatmapset_count },
        ]
    }

    return (
        <>
            <div style={{ background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${userData.cover_url}) center / cover no-repeat` }}>
                <div style={{ backdropFilter: "blur(2px)" }}
                    className="flex flex-col p-8 gap-8 card-body rounded-none">
                    <div className="grid grid-cols-7 flex-wrap gap-4 xl:gap-8">
                        <div className="col-span-9 md:col-span-2 xl:col-span-1 gap-3 flex flex-col items-center justify-start">
                            <img src={userData.avatar_url}
                                onError={addDefaultSrc}
                                alt='pfp' className="aspect-square mb-2 rounded-lg"
                                style={{ width: '100%' }} />
                            <div className="flex flex-row gap-2 items-center w-full">
                                <div className="text-neutral-content">{userData.statistics.level.current}</div>
                                <progress className="progress progress-warning" value={userData.statistics.level.progress} max="100"></progress>
                                <div>{userData.statistics.level.current + 1}</div>
                            </div>
                            <div className="text-center text-lg tooltip tooltip-bottom"
                                data-tip={moment(userData.join_date).fromNow()}>
                                Joined at {moment(userData.join_date).format("DD/MM/YYYY")}
                            </div>
                        </div>
                        <div className="col-span-7 md:col-span-2 gap-3 flex flex-col items-center md:items-start justify-between">
                            <div className="flex flex-row gap-3 items-center">
                                <a className="text-4xl font-bold"
                                    target={"_blank"} rel="noreferrer"
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
                            <div className="flex flex-col gap-1">
                                <div className="text-lg">Global Rank:</div>
                                <div className="text-2xl flex flex-row items-center gap-2">
                                    <HiGlobeAlt />
                                    <div>#{userData.statistics.global_rank ? userData.statistics.global_rank.toLocaleString() : '-'}</div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-lg">Country Rank:</div>
                                <div className="text-2xl flex flex-row items-center gap-2">
                                    <CountryShape code={userData.country.code} size={26} />
                                    <div>#{userData.statistics.country_rank ? userData.statistics.country_rank.toLocaleString() : '-'}</div>
                                    {userData.country.code === 'CAT' ?
                                        <div className="tooltip tooltip-right" data-tip={userData.country.name}>
                                            <img alt={userData.country.code} className="emoji-flag"
                                                src={require(`../assets/extra-flags/${userData.country.code.toLowerCase()}.png`)} />
                                        </div> :
                                        <CountryFlag size={24} name={userData.country.name} code={userData.country.code} />
                                    }
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-lg">Performance:</div>
                                <div className="text-xl flex flex-row items-center gap-2">
                                    <div>{Math.round(userData.statistics.pp).toLocaleString()}pp</div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-lg">Accuracy:</div>
                                <div className="text-xl flex flex-row items-center gap-2">
                                    <div>{userData.statistics.hit_accuracy.toFixed(2).toLocaleString()}%</div>
                                </div>
                            </div>
                            <BarPieChart data={scoresRanksLabels} width={250} />
                        </div>
                        <div className="col-span-7 md:col-span-2">
                            <Radar data={skillsData} options={radarOptions} />
                        </div>
                        <div className="col-span-7 md:col-span-3 xl:col-span-2 flex col-start-4 xl:col-start-6 flex-col items-center md:items-end gap-3 xl:justify-between">
                            <ModeSelector mode={gameMode} userId={userData.id} />
                            <div className="flex flex-col gap-1 justify-end">
                                <div className="text-lg">Ranked Score:</div>
                                <div className="tooltip tooltip-left text-xl flex flex-row items-center gap-2"
                                    data-tip={`Total Score: ${userData.statistics.total_score.toLocaleString()}`}>
                                    <HiChevronDoubleUp />
                                    <div>
                                        {userData.statistics.ranked_score.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-lg">Max Combo:</div>
                                <div className="text-xl flex flex-row items-center gap-2">
                                    <HiFire />
                                    <div>{userData.statistics.maximum_combo.toLocaleString()}x</div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-lg">Play Time:</div>
                                <div className="text-xl flex flex-row items-center gap-2 tooltip tooltip-left"
                                    data-tip={secondsToTime(userData.statistics.play_time)}>
                                    <FaRegClock />
                                    <div>
                                        {Math.round((userData.statistics.play_time / 60 / 60)).toLocaleString()}h
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-lg">Play Count:</div>
                                <div className="text-xl flex flex-row items-center gap-2">
                                    <ImSpinner11 />
                                    <div>{userData.statistics.play_count.toLocaleString()}</div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-lg">Hits x Play:</div>
                                <div className="text-xl flex flex-row items-center gap-2">
                                    <HiCalculator />
                                    <div>
                                        {Math.round((userData.statistics.count_50 + userData.statistics.count_100 + userData.statistics.count_300) / userData.statistics.play_count).toLocaleString()}
                                    </div>
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
            <div className="grid grid-cols-5 gap-4 md:p-4 justify-center">
                <div className="flex flex-col bg-accent-950 col-span-5 xl:col-span-3 drop-shadow-lg" ref={div1Ref}>
                    <div className="shadow">
                        <div className="p-2 bg-accent-800 flex flex-row gap-2 justify-center">
                            <i className="bi bi-graph-up"></i>
                            <div>History</div>
                        </div>
                        <div className="tabs tabs-boxed content-center rounded-none justify-center bg-accent-900">
                            <button
                                className={`tab flex flex-row gap-2 ${historyTabIndex === 1 && 'tab-active text-base-100'}`}
                                onClick={() => setHistoryTabIndex(1)}>
                                <HiGlobeAlt />
                                <div>Global Rank</div>
                            </button>
                            <button
                                className={`tab flex flex-row gap-2 ${historyTabIndex === 2 && 'tab-active text-base-100'}`}
                                onClick={() => setHistoryTabIndex(2)}>
                                <CountryShape code={userData.country.code} size={18} />
                                <div>Country Rank</div>
                            </button>
                            <button
                                className={`tab flex flex-row gap-2 ${historyTabIndex === 3 && 'tab-active text-base-100'}`}
                                onClick={() => setHistoryTabIndex(3)}>
                                <i className="bi bi-arrow-counterclockwise"></i>
                                <div>Play Count</div>
                            </button>
                            <button
                                className={`tab flex flex-row gap-2 ${historyTabIndex === 4 && 'tab-active text-base-100'}`}
                                onClick={() => setHistoryTabIndex(4)}>
                                <i className="bi bi-arrow-counterclockwise"></i>
                                <div>Replays Watched</div>
                            </button>
                        </div>
                        <div className="flex justify-center items-center">
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
                    <div className="shadow">
                        <div className="p-2 bg-accent-800 flex flex-row gap-2 justify-center">
                            <i className="bi bi-bar-chart-line"></i>
                            <div>Top Play Stats</div>
                        </div>
                        <div className="p-4">
                            <TopScoresPanel data={userData} best={bestCalc} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col bg-accent-950 col-span-5 xl:col-span-2 drop-shadow-lg" style={{ height: div1Ref.current?.clientHeight }}>
                    <div className="p-2 bg-accent-800 4 flex flex-row gap-2 justify-center">
                        <i className="bi bi-controller"></i>
                        <div>Scores</div>
                    </div>
                    <div className="tabs tabs-boxed content-center rounded-none justify-center bg-accent-900">
                        {scoresTabs.items.map((tab: tabInterface, i: number) => tab.count > 0 &&
                            <button className={`tab flex flex-row gap-2 ${scoresTabIndex === tab.num && 'tab-active text-base-100'}`}
                                onClick={() => scoresTabs.setTabs(tab.num)} key={i + 1}>
                                {tab.icon}
                                <div>{tab.title}</div>
                                <div className="badge">{tab.count}</div>
                            </button>)}
                    </div>
                    <div style={{ height: 602 }} className={`${scoresTabIndex !== 1 && 'hidden'} overflow-y-scroll overflow-x-hidden`}>
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={() => getThings(userData.id, gameMode, 10, pinnedScores.length, 'scores', 'pinned', setPinnedScores, pinnedScores)}
                            hasMore={pinnedScores.length < userData.scores_pinned_count}
                            loader={<div key={0} className="loading loading-dots loading-md"></div>}
                            useWindow={false}
                        >
                            {pinnedScores.map((s: Score, i: number) =>
                                <ScoreCard index={i + 1} score={s} />
                            )}
                        </InfiniteScroll>
                    </div>
                    <div hidden={scoresTabIndex !== 2} style={{ height: 602 }} className={`${scoresTabIndex !== 2 && 'hidden'} overflow-y-scroll overflow-x-hidden`}>
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={() => getThings(userData.id, gameMode, 10, bestScores.length, 'scores', 'best', setBestScores, bestScores)}
                            hasMore={bestScores.length < userData.scores_best_count}
                            loader={<div key={0} className="loading loading-dots loading-md"></div>}
                            useWindow={false}
                        >
                            {bestScores.map((s: Score, i: number) =>
                                <ScoreCard index={i + 1} score={s} key={i} />
                            )}
                        </InfiniteScroll>
                    </div>
                    <div hidden={scoresTabIndex !== 3} style={{ height: 602 }} className={`${scoresTabIndex !== 3 && 'hidden'} overflow-y-scroll overflow-x-hidden`}>
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={() => getThings(userData.id, gameMode, 5, firstsScores.length, 'scores', 'firsts', setFirstsScores, firstsScores)}
                            hasMore={firstsScores.length < userData.scores_first_count}
                            loader={<div key={0} className="loading loading-dots loading-md"></div>}
                            useWindow={false}
                        >
                            {firstsScores.map((s: Score, i: number) =>
                                <ScoreCard index={i + 1} score={s} />
                            )}
                        </InfiniteScroll>
                    </div>
                    <div hidden={scoresTabIndex !== 4} style={{ height: 602 }} className={`${scoresTabIndex !== 4 && 'hidden'} overflow-y-scroll overflow-x-hidden`}>
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={() => getThings(userData.id, gameMode, 5, recentScores.length, 'scores', 'recent', setRecentScores, recentScores)}
                            hasMore={recentScores.length < userData.scores_recent_count}
                            loader={<div key={0} className="loading loading-dots loading-md"></div>}
                            useWindow={false}
                        >
                            {recentScores.map((s: Score, i: number) =>
                                <ScoreCard index={i + 1} score={s} />
                            )}
                        </InfiniteScroll>
                    </div>
                </div>
                <div className="flex flex-col bg-accent-950 col-span-5 xl:col-span-2 drop-shadow-lg" style={{ height: div1Ref.current?.clientHeight }}>
                    <div className="p-2 flex flex-row gap-2 justify-center bg-accent-800">
                        <i className="bi bi-file-earmark-music"></i>
                        <div>Beatmaps</div>
                    </div>
                    <div className="tabs tabs-boxed content-center rounded-none justify-center bg-accent-900">
                        {beatmapsTabs.items.map((tab: tabInterface, i: number) => tab.count > 0 &&
                            <button className={`tab flex flex-row gap-2 ${beatmapsTabIndex === tab.num && 'tab-active'}`}
                                onClick={() => beatmapsTabs.setTabs(tab.num)} key={i + 1}>
                                {tab.icon}
                                <div>{tab.title}</div>
                                <div className="badge">{tab.count}</div>
                            </button>)}
                    </div>
                    <div hidden={beatmapsTabIndex !== 1} style={{ height: 602 }} className={`${beatmapsTabIndex !== 1 && 'hidden'} overflow-y-scroll overflow-x-hidden`}>
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={() => getThings(userData.id, gameMode, 10, favouriteBeatmaps.length, 'beatmapsets', 'favourite', setFavouriteBeatmaps, favouriteBeatmaps)}
                            hasMore={favouriteBeatmaps.length < userData.favourite_beatmapset_count}
                            loader={<div key={0} className="loading loading-dots loading-md"></div>}
                            useWindow={false}
                        >
                            {favouriteBeatmaps.map((b: BeatmapSet, i: number) =>
                                <BeatmapsetCard index={i + 1} data={b} />
                            )}
                        </InfiniteScroll>
                    </div>
                    <div hidden={beatmapsTabIndex !== 2} style={{ height: 602 }} className={`${beatmapsTabIndex !== 2 && 'hidden'} overflow-y-scroll overflow-x-hidden`}>
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={() => getThings(userData.id, gameMode, 10, rankedBeatmaps.length, 'beatmapsets', 'ranked', setRankedBeatmaps, rankedBeatmaps)}
                            hasMore={rankedBeatmaps.length < userData.ranked_and_approved_beatmapset_count}
                            loader={<div key={0} className="loading loading-dots loading-md"></div>}
                            useWindow={false}
                        >
                            {rankedBeatmaps.map((b: BeatmapSet, i: number) =>
                                <BeatmapsetCard index={i + 1} data={b} />
                            )}
                        </InfiniteScroll>
                    </div>
                    <div hidden={beatmapsTabIndex !== 3} style={{ height: 602 }} className={`${beatmapsTabIndex !== 3 && 'hidden'} overflow-y-scroll overflow-x-hidden`}>
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={() => getThings(userData.id, gameMode, 10, guestBeatmaps.length, 'beatmapsets', 'guest', setGuestBeatmaps, guestBeatmaps)}
                            hasMore={guestBeatmaps.length < userData.guest_beatmapset_count}
                            loader={<div key={0} className="loading loading-dots loading-md"></div>}
                            useWindow={false}
                        >
                            {guestBeatmaps.map((b: BeatmapSet, i: number) =>
                                <BeatmapsetCard index={i + 1} data={b} />
                            )}
                        </InfiniteScroll>
                    </div>
                    <div hidden={beatmapsTabIndex !== 4} style={{ height: 602 }} className={`${beatmapsTabIndex !== 4 && 'hidden'} overflow-y-scroll overflow-x-hidden`}>
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={() => getThings(userData.id, gameMode, 10, lovedBeatmaps.length, 'beatmapsets', 'loved', setLovedBeatmaps, lovedBeatmaps)}
                            hasMore={lovedBeatmaps.length < userData.loved_beatmapset_count}
                            loader={<div key={0} className="loading loading-dots loading-md"></div>}
                            useWindow={false}
                        >
                            {lovedBeatmaps.map((b: BeatmapSet, i: number) =>
                                <BeatmapsetCard index={i + 1} data={b} />
                            )}
                        </InfiniteScroll>
                    </div>
                    <div hidden={beatmapsTabIndex !== 5} style={{ height: 602 }} className={`${beatmapsTabIndex !== 5 && 'hidden'} overflow-y-scroll overflow-x-hidden`}>
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={() => getThings(userData.id, gameMode, 10, nominatedBeatmaps.length, 'beatmapsets', 'nominated', setNominatedBeatmaps, nominatedBeatmaps)}
                            hasMore={nominatedBeatmaps.length < userData.guest_beatmapset_count}
                            loader={<div key={0} className="loading loading-dots loading-md"></div>}
                            useWindow={false}
                        >
                            {nominatedBeatmaps.map((b: BeatmapSet, i: number) =>
                                <BeatmapsetCard index={i + 1} data={b} />
                            )}
                        </InfiniteScroll>
                    </div>
                    <div hidden={beatmapsTabIndex !== 6} style={{ height: 602 }} className={`${beatmapsTabIndex !== 6 && 'hidden'} overflow-y-scroll overflow-x-hidden`}>
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={() => getThings(userData.id, gameMode, 10, pendingBeatmaps.length, 'beatmapsets', 'pending', setPendingBeatmaps, pendingBeatmaps)}
                            hasMore={pendingBeatmaps.length < userData.pending_beatmapset_count}
                            loader={<div key={0} className="loading loading-dots loading-md"></div>}
                            useWindow={false}
                        >
                            {pendingBeatmaps.map((b: BeatmapSet, i: number) =>
                                <BeatmapsetCard index={i + 1} data={b} />
                            )}
                        </InfiniteScroll>
                    </div>
                    <div hidden={beatmapsTabIndex !== 7} style={{ height: 602 }} className={`${beatmapsTabIndex !== 7 && 'hidden'} overflow-y-scroll overflow-x-hidden`}>
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={() => getThings(userData.id, gameMode, 10, graveyardBeatmaps.length, 'beatmapsets', 'graveyard', setGraveyardBeatmaps, graveyardBeatmaps)}
                            hasMore={graveyardBeatmaps.length < userData.graveyard_beatmapset_count}
                            loader={<div key={0} className="loading loading-dots loading-md"></div>}
                            useWindow={false}
                        >
                            {graveyardBeatmaps.map((b: BeatmapSet, i: number) =>
                                <BeatmapsetCard index={i + 1} data={b} />
                            )}
                        </InfiniteScroll>
                    </div>
                </div>
                <div className="flex flex-col bg-accent-950 col-span-5 xl:col-span-3 drop-shadow-lg" style={{ height: div1Ref.current?.clientHeight }}>
                    <div className="p-2 bg-accent-800 flex flex-row gap-2 justify-center">
                        <i className="bi bi-award"></i>
                        <div>Medals</div>
                    </div>
                    <div className="flex flex-col grow overflow-y-scroll overflow-x-hidden">
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
                                    <div className="flex flex-row gap-1">
                                        {lastMedals.map((medal: Medal, index: number) => (
                                            <MedalBadge thisMedal={medal} userMedals={userData.user_achievements}
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
                                    <div className="p-3 grid justify-center">
                                        {rarestMedal &&
                                            <MedalBadge thisMedal={rarestMedal}
                                                userMedals={userData.user_achievements} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {Object.entries(medalsByCategory).map(([category, medals]: [string, Medal[]], key: number) => (
                            <div key={key} className="grow">
                                <div className="text-center p-2 flex flex-row justify-center items-center bg-accent-900">
                                    <div className="text-center">
                                        {category}:
                                    </div>
                                </div>
                                <div className="p-3 pt-2 flex flex-col grow">
                                    <div className="pb-1 px-2 text-center"
                                        style={{ fontSize: 14, top: -8 }}>
                                        {(achievedMedalsCount[category] / medals.length * 100).toFixed(2)}%
                                        ({achievedMedalsCount[category]}/{medals.length})
                                    </div>
                                    <div className="flex flex-row flex-wrap gap-1 justify-center grow">
                                        {medals.map((medal: Medal, index: number) => (
                                            <MedalBadge thisMedal={medal} userMedals={userData.user_achievements}
                                                key={index} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
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
        setGlobalHistoryData(LINE_CHART_INITIAL);
        setCountryHistoryData(LINE_CHART_INITIAL);
        setPlaysHistoryData(LINE_CHART_INITIAL);
        setReplaysHistoryData(LINE_CHART_INITIAL);
    }

    async function getUser() {
        try {
            const res = await axios.post('/user', {
                id: props.userId,
                mode: props.userMode,
            })
            const data = res.data;
            if (data.error === null) {
                setUserData(null);
                return;
            };
            const user: User = data;
            setUserData(data);
            if (user.is_bot) return;
            let searchMode: GameModeType;
            if (props.userMode === "default") {
                searchMode = user.playmode;
            } else {
                searchMode = props.userMode;
            }
            window.history.replaceState({}, '', `/users/${user.id}/${searchMode}`);

            getBestCalc(user.id, searchMode);
            getGlobalData(user);
            getCountryData(user);
            getPlaysData(user);
            getReplaysData(user);
            setGameMode(searchMode);

            let scoresTab: number = 0;
            let beatmapsTab: number = 0;

            if (user.scores_pinned_count > 0) {
                scoresTab = 1;
            } else if (user.scores_best_count > 0) {
                scoresTab = 2;
            } else if (user.scores_first_count > 0) {
                scoresTab = 3;
            } else if (user.scores_recent_count > 0) {
                scoresTab = 4;
            }
            if (user.favourite_beatmapset_count > 0) {
                beatmapsTab = 1;
            } else if (user.ranked_beatmapset_count > 0) {
                beatmapsTab = 2;
            } else if (user.guest_beatmapset_count > 0) {
                beatmapsTab = 3;
            } else if (user.loved_beatmapset_count > 0) {
                beatmapsTab = 4;
            } else if (user.nominated_beatmapset_count > 0) {
                beatmapsTab = 5;
            } else if (user.pending_beatmapset_count > 0) {
                beatmapsTab = 6;
            } else if (user.graveyard_beatmapset_count > 0) {
                beatmapsTab = 7;
            }
            setScoresTabIndex(scoresTab);
            setBeatmapsTabIndex(beatmapsTab);
        } catch (err) {
            console.error(err);
            setUserData(null);
        }
    }

    async function getBestCalc(id: number, m: GameModeType) {
        try {
            const res = await axios.post('/proxy', { url: `https://osu.ppy.sh/users/${id}/scores/best?mode=${m}&limit=100&offset=0` });
            const scores: Score[] = res.data;
            setBestCalc(scores);
            // const len = 100;
            // scores.length = len;
            // const r = await axios.post('/skill', {
            //     scores: scores,
            //     mode: m
            // })
            // console.log(r.data);
            // setSkillsData({
            //     labels: ['Agility', 'Precision', 'Reaction', 'Stamina', 'Tenacity', 'Timing'],
            //     datasets: [
            //         {
            //             label: 'Skills',
            //             data: [
            //                 r.data.agility / len * 10,
            //                 r.data.precision / len * 10,
            //                 r.data.reaction / len * 10 / 1.5,
            //                 r.data.stamina / len * 10,
            //                 r.data.tenacity / len * 10,
            //                 r.data.timing / len * 10 / 1.5],
            //             backgroundColor: 'rgba(255, 99, 132, 0.2)',
            //             borderColor: 'rgba(255, 99, 132, 1)',
            //             borderWidth: 1,
            //         }
            //     ],
            // })
        } catch (err) {
            console.error(err);
        }
    }

    async function getThings(id: number, m: GameModeType, l: number, o: number, t: cardType, c: categoryType, set: Dispatch<SetStateAction<any[]>>, get: Score[] | BeatmapSet[]) {
        try {
            const url = `https://osu.ppy.sh/users/${id}/${t}/${c}?mode=${m}&limit=${l}&offset=${o}`;
            console.log(`loading ${c}...`, url)
            const res = await axios.post('/proxy', { url: url });
            const d = res.data;
            if (d.length < 1) return;
            set([...get, ...d]);
            return;
        } catch (err) {
            console.error(err);
            return;
        }
    }

    function getGlobalData(user: User) {
        if (!user?.db_info.global_rank) return;
        setGlobalHistoryData({
            labels: user.db_info.global_rank.map(obj => new Date(obj.time * 1000)),
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
            labels: user.db_info.country_rank.map(obj => new Date(obj.time * 1000)),
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
export default UserPage;

function useMedals() {
    const [m, setM] = useState<Medal[]>([]);
    getM();
    return m;
    async function getM() {
        try {
            const r = await axios.post('/getMedals');
            const data: Medal[] = r.data;
            data.sort((a: any, b: any) => parseInt(a.MedalID) - parseInt(b.MedalID));
            setM(data);
        } catch (err) {
            console.error(err)
        }
    }
}

function getMedalsByCategory(data: Medal[]) {
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
    return categoryArrays;
}

function getLastMedals(userMedals: UserAchievement[] | undefined, medals: Medal[], num: number) {
    if (!userMedals) return [];
    const sortedArray = userMedals
        .sort((a: UserAchievement, b: UserAchievement) => {
            const dateA: Date = new Date(a.achieved_at);
            const dateB: Date = new Date(b.achieved_at);
            return dateA.getTime() - dateB.getTime();
        }).reverse().slice(0, num)
        .map((obj: UserAchievement) => obj.achievement_id)
        .map((id: number) => medals.find((medal: any): boolean => parseInt(medal.MedalID) === id))
        .filter((medal: Medal | undefined): medal is Medal => medal !== undefined);
    return sortedArray;
}

function getAchievedMedalsCount(userMedals: UserAchievement[] | undefined, obj: SortedMedals): MedalCategories {
    if (!userMedals) return {};
    const achievedMedalsCount: MedalCategories = {};
    Object.entries(obj)
        .forEach(([category, medals]: [string, Medal[]]) => {
            achievedMedalsCount[category] = 0;
            userMedals.forEach((achievedMedal: UserAchievement): void => {
                if (medals.find((medal: Medal): boolean => parseInt(medal.MedalID) === achievedMedal.achievement_id)) {
                    achievedMedalsCount[category]++;
                }
            });
        });
    return achievedMedalsCount;
}

function getRarestMedal(userMedals: UserAchievement[] | undefined, medals: Medal[]) {
    if (!userMedals) return null;
    const data = userMedals.map((obj: UserAchievement) => obj.achievement_id)
        .map((id: number) => medals.find((medal: Medal): boolean => String(medal.MedalID) === String(id)))
        .reduce((rarest: Medal | null, medal: Medal | undefined): Medal => {
            if (!rarest || (medal && medal.Rarity < rarest.Rarity)) {
                return medal as Medal;
            }
            return rarest;
        }, null)
    return data;
}