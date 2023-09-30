import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from '../resources/axios-config';
import moment from "moment";

import { Line, Radar } from "react-chartjs-2";
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import InfiniteScroll from 'react-infinite-scroller';
import Twemoji from 'react-twemoji';

import { FaSkull, FaRegClock, FaChartBar, FaTrophy, FaMapPin, FaStopwatch, FaUserFriends, FaCalculator, FaHourglassHalf, FaStar, FaAngleDoubleUp, FaUsers, FaTwitter, FaDiscord, FaUndo, FaMapMarkerAlt, FaHeart, FaChartLine, FaMedal, FaEye, FaGlobe, FaGlobeAfrica, FaRegBuilding, FaChartPie, FaListUl, FaFireAlt, FaChevronUp } from "react-icons/fa";

import Badge from "./u_comp/Badge";
import GroupBadge from "./u_comp/GroupBadge";
import BarPieChart from "./u_comp/BarPieChart";
import CountryShape from "./u_comp/CountryShape";
import ModeSelector from "./u_comp/ModeSelector";
import SupporterIcon from "./u_comp/SupporterIcon";
import MedalBadge from "./u_comp/MedalBadge";
import CountryFlag from "./u_comp/CountryFlag";
import ScoreCard from "../c_scores/ScoreCard";
import BeatmapsetCard from "../c_beatmaps/BeatmapsetCard";
import { addDefaultSrc, secondsToTime } from "../resources/functions";
import { GameModeType } from "../resources/types";
import TopScoresPanel, { BarPieChartData } from "./u_comp/TopScoresPanel";

import { Score } from "../resources/interfaces/score";
import { BeatmapSet } from "../resources/interfaces/beatmapset";
import { MonthlyData, User, UserAchievement, UserBadge, UserGroup } from "../resources/interfaces/user";
import { Medal, MedalCategories, SortedMedals } from "../resources/interfaces/medals";

import { alertManager, alertManagerInterface, colors } from "../resources/store/tools";
import { BeatmapsObj, ScoresObj, beatmapCategoryType, beatmapListItem, scoreCategoryType, scoreListItem, tabInterface } from "./u_interfaces";

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

interface UserPageProps {
    userId: string;
    userMode: GameModeType;
}

const BEATMAPS_INITIAL: BeatmapsObj = {
    favourite: [],
    ranked: [],
    guest: [],
    loved: [],
    nominated: [],
    pending: [],
    graveyard: [],
}
const SCORES_INITIAL: ScoresObj = {
    pinned: [],
    best: [],
    firsts: [],
    recent: [],
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

const UserPage = (props: UserPageProps) => {
    const addAlert = alertManager((state: alertManagerInterface) => state.addAlert);

    const [userData, setUserData] = useState<User | null | undefined>(undefined);
    const [gameMode, setGameMode] = useState<GameModeType>('osu');

    const medals: Medal[] = useMedals();
    const medalsByCategory: SortedMedals = useMemo(() => getMedalsByCategory(medals), [medals]);
    const lastMedals: Medal[] = useMemo(() => getLastMedals(userData?.user_achievements, medals, 15), [userData]);
    const rarestMedal: Medal | null = useMemo(() => getRarestMedal(userData?.user_achievements, medals), [userData]);
    const achievedMedalsCount = useMemo(() => getAchievedMedalsCount(userData?.user_achievements, medalsByCategory), [userData]);

    const [scores, setScores] = useState<ScoresObj>(SCORES_INITIAL);
    const [beatmaps, setBeatmaps] = useState<BeatmapsObj>(BEATMAPS_INITIAL);
    const [bestRenderIndex, setBestRenderIndex] = useState<number>(0);

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
            <span className="loading loading-dots loading-md"></span>
        )
    }
    if (userData === null) {
        return (
            <></>
        )
    }
    if (userData.is_bot) {
        return (
            <></>
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
        { num: 1, title: 'Pinned', icon: <FaMapPin />, count: userData.scores_pinned_count },
        { num: 2, title: 'Best', icon: <FaChartBar />, count: userData.scores_best_count },
        { num: 3, title: 'Firsts', icon: <FaStar />, count: userData.scores_first_count },
        { num: 4, title: 'Recent', icon: <FaStopwatch />, count: userData.scores_recent_count },
    ]
    const scoresList: scoreListItem[] = [
        { id: 1, scores: scores.pinned, len: userData.scores_pinned_count, type: 'pinned' },
        { id: 2, scores: scores.best, len: userData.scores_best_count, type: 'best' },
        { id: 3, scores: scores.firsts, len: userData.scores_first_count, type: 'firsts' },
        { id: 4, scores: scores.recent, len: userData.scores_recent_count, type: 'recent' },
    ]
    const beatmapsTabs: tabInterface[] = [
        { num: 1, title: 'Favourites', icon: <FaStar />, count: userData.favourite_beatmapset_count, },
        { num: 2, title: 'Ranked', icon: <FaChevronUp />, count: userData.ranked_and_approved_beatmapset_count },
        { num: 3, title: 'Guest', icon: <FaUserFriends />, count: userData.guest_beatmapset_count },
        { num: 4, title: 'Loved', icon: <FaHeart />, count: userData.loved_beatmapset_count },
        { num: 5, title: 'Nominated', icon: <FaTrophy />, count: userData.nominated_beatmapset_count },
        { num: 6, title: 'Pending', icon: <FaHourglassHalf />, count: userData.pending_beatmapset_count },
        { num: 7, title: 'Graveyard', icon: <FaSkull />, count: userData.graveyard_beatmapset_count },
    ]
    const beatmapsList: beatmapListItem[] = [
        { id: 1, beatmaps: beatmaps.favourite, len: userData.favourite_beatmapset_count, type: 'favourite' },
        { id: 2, beatmaps: beatmaps.ranked, len: userData.ranked_beatmapset_count, type: 'ranked' },
        { id: 3, beatmaps: beatmaps.guest, len: userData.guest_beatmapset_count, type: 'guest' },
        { id: 4, beatmaps: beatmaps.loved, len: userData.loved_beatmapset_count, type: 'loved' },
        { id: 5, beatmaps: beatmaps.nominated, len: userData.nominated_beatmapset_count, type: 'nominated' },
        { id: 6, beatmaps: beatmaps.pending, len: userData.pending_beatmapset_count, type: 'pending' },
        { id: 7, beatmaps: beatmaps.graveyard, len: userData.graveyard_beatmapset_count, type: 'graveyard' },
    ]

    return (
        <>
            <div style={{ background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${userData.cover_url}) center / cover no-repeat` }}>
                <div style={{ backdropFilter: "blur(2px)" }}
                    className="flex flex-col gap-8 p-8 rounded-none card-body">
                    <div className="grid flex-wrap grid-cols-7 gap-4 xl:gap-8">
                        <div className="flex flex-col col-span-9 gap-3 justify-between items-center md:col-span-2 xl:col-span-1">
                            <div className="avatar">
                                <div className='rounded-lg'>
                                    <img src={userData.avatar_url}
                                        onError={addDefaultSrc}
                                        alt='pfp' style={{ width: '100%' }} />
                                </div>
                            </div>
                            <div className="flex flex-row gap-2 items-center w-full">
                                <div className="text-neutral-content">{userData.statistics.level.current}</div>
                                <progress className="progress progress-warning" value={userData.statistics.level.progress} max="100"></progress>
                                <div>{userData.statistics.level.current + 1}</div>
                            </div>
                            <ModeSelector mode={gameMode} userId={userData.id} />
                            <div className="text-lg text-center tooltip tooltip-bottom"
                                data-tip={moment(userData.join_date).fromNow()}>
                                Joined at {moment(userData.join_date).format("DD/MM/YYYY")}
                            </div>
                        </div>
                        <div className="flex flex-col col-span-7 gap-3 justify-between items-center md:col-span-2 md:items-start">
                            <div className="flex flex-row gap-3 items-center">
                                <a className="text-4xl font-bold"
                                    target="_blank" rel="noreferrer"
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
                                <div className="flex flex-row gap-2 items-center text-2xl">
                                    <FaGlobeAfrica />
                                    <div>#{userData.statistics.global_rank ? userData.statistics.global_rank.toLocaleString() : '-'}</div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-lg">Country Rank:</div>
                                <div className="flex flex-row gap-2 items-center text-2xl">
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
                                <div className="flex flex-row gap-2 items-center text-xl">
                                    <div>{Math.round(userData.statistics.pp).toLocaleString()}pp</div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-lg">Accuracy:</div>
                                <div className="flex flex-row gap-2 items-center text-xl">
                                    <div>{userData.statistics.hit_accuracy.toFixed(2).toLocaleString()}%</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col col-span-7 gap-3 justify-between items-center md:col-span-2">
                            <div><Radar data={skillsData} options={radarOptions} /></div>
                            <div><BarPieChart data={scoresRanksLabels} width={250} /></div>
                        </div>
                        <div className="flex flex-col col-span-7 col-start-4 gap-3 justify-between items-end md:col-span-3 xl:col-span-2 xl:col-start-6">
                            <div className="flex flex-col gap-1 justify-end text-end">
                                <div className="text-lg">Ranked Score:</div>
                                <div className="flex flex-row gap-2 justify-end items-center text-xl tooltip tooltip-left"
                                    data-tip={`Total Score: ${userData.statistics.total_score.toLocaleString()}`}>
                                    <FaAngleDoubleUp />
                                    <div>
                                        {userData.statistics.ranked_score.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 justify-end text-end">
                                <div className="text-lg">Max Combo:</div>
                                <div className="flex flex-row gap-2 justify-end items-center text-xl">
                                    <FaFireAlt />
                                    <div>{userData.statistics.maximum_combo.toLocaleString()}x</div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 justify-end text-end">
                                <div className="text-lg">Play Time:</div>
                                <div className="flex flex-row gap-2 justify-end items-center text-xl tooltip tooltip-left"
                                    data-tip={secondsToTime(userData.statistics.play_time)}>
                                    <FaRegClock />
                                    <div>
                                        {Math.round((userData.statistics.play_time / 60 / 60)).toLocaleString()}h
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 justify-end text-end">
                                <div className="text-lg">Play Count:</div>
                                <div className="flex flex-row gap-2 justify-end items-center text-xl">
                                    <FaUndo />
                                    <div>{userData.statistics.play_count.toLocaleString()}</div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 justify-end text-end">
                                <div className="text-lg">Hits x Play:</div>
                                <div className="flex flex-row gap-2 justify-end items-center text-xl">
                                    <FaCalculator />
                                    <div>
                                        {Math.round((userData.statistics.count_50 + userData.statistics.count_100 + userData.statistics.count_300) / userData.statistics.play_count).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {userData.badges.length > 0 &&
                        <div className="flex flex-row flex-wrap gap-2 items-center">
                            {userData.badges.map((badge: UserBadge, index: number) =>
                                <Badge badge={badge} key={index + 1} />
                            )}
                        </div>}
                </div>
            </div>
            <div className="flex flex-row flex-wrap gap-4 items-center p-4 m-0 drop-shadow-lg bg-accent-800">
                <div className="flex flex-row gap-2 items-center">
                    <FaUsers />
                    <div>Followers: {userData.follower_count.toLocaleString()}</div>
                </div>
                {userData.discord !== null &&
                    <div className="flex flex-row gap-2 items-center">
                        <FaDiscord />
                        {userData.discord}
                    </div>}
                {userData.twitter !== null &&
                    <div className="flex flex-row gap-2 items-center">
                        <FaTwitter />
                        {userData.twitter}
                    </div>}
                {userData.website !== null &&
                    <div className="flex flex-row gap-2 items-center">
                        <FaGlobe />
                        <Twemoji options={{ className: 'emoji' }}>
                            {userData.website}
                        </Twemoji>
                    </div>}
                {userData.discord !== null &&
                    <div className="flex flex-row gap-2 items-center">
                        <FaMapMarkerAlt />
                        <Twemoji options={{ className: 'emoji' }}>
                            {userData.location}
                        </Twemoji>
                    </div>}
                {userData.interests !== null &&
                    <div className="flex flex-row gap-2 items-center">
                        <FaHeart />
                        <Twemoji options={{ className: 'emoji' }}>
                            {userData.interests}
                        </Twemoji>
                    </div>}
                {userData.occupation !== null &&
                    <div className="flex flex-row gap-2 items-center">
                        <FaRegBuilding />
                        <Twemoji options={{ className: 'emoji' }}>
                            {userData.occupation}
                        </Twemoji>
                    </div>}
            </div>
            <div className="grid grid-cols-5 gap-4 justify-center md:p-4">
                <div className="flex flex-col col-span-5 drop-shadow-lg bg-accent-950 xl:col-span-3" ref={div1Ref}>
                    <div className="shadow">
                        <div className="flex flex-row gap-2 justify-center items-center p-2 bg-accent-800">
                            <FaChartLine />
                            <div>History</div>
                        </div>
                        <div className="justify-center content-center rounded-none tabs tabs-boxed bg-accent-900">
                            <button
                                className={`tab flex flex-row gap-2 ${historyTabIndex === 1 && 'tab-active text-base-100'}`}
                                onClick={() => setHistoryTabIndex(1)}>
                                <FaGlobeAfrica />
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
                                <FaRegClock />
                                <div>Play Count</div>
                            </button>
                            <button
                                className={`tab flex flex-row gap-2 ${historyTabIndex === 4 && 'tab-active text-base-100'}`}
                                onClick={() => setHistoryTabIndex(4)}>
                                <FaEye />
                                <div>Replays Watched</div>
                            </button>
                        </div>
                        <div className="flex justify-center items-center">
                            <div className="p-4 grow" hidden={historyTabIndex !== 1}
                                style={{ height: 250 }}>
                                <Line data={globalHistoryData} options={lineOptionsReverse} />
                            </div>
                            <div className="p-4 grow" hidden={historyTabIndex !== 2}
                                style={{ height: 250 }}>
                                <Line data={countryHistoryData} options={lineOptionsReverse} />
                            </div>
                            <div className="p-4 grow" hidden={historyTabIndex !== 3}
                                style={{ height: 250 }}>
                                <Line data={playsHistoryData} options={lineOptions} />
                            </div>
                            <div className="p-4 grow" hidden={historyTabIndex !== 4}
                                style={{ height: 250 }}>
                                <Line data={replaysHistoryData} options={lineOptions} />
                            </div>
                        </div>
                    </div>
                    <div className="shadow">
                        <div className="flex flex-row gap-2 justify-center items-center p-2 bg-accent-800">
                            <FaChartPie />
                            <div>Top Play Stats</div>
                        </div>
                        <div className="p-4">
                            <TopScoresPanel data={userData} best={scores.best} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col col-span-5 drop-shadow-lg bg-accent-950 xl:col-span-2" style={{ height: div1Ref.current?.clientHeight }}>
                    <div className="flex flex-row gap-2 justify-center items-center p-2 bg-accent-800 4">
                        <FaListUl />
                        <div>Scores</div>
                    </div>
                    <div className="justify-center content-center rounded-none tabs tabs-boxed bg-accent-900">
                        {scoresTabs.map((tab: tabInterface, i: number) => tab.count > 0 &&
                            <button className={`tab flex flex-row gap-2 ${scoresTabIndex === tab.num && 'tab-active text-base-100'}`}
                                onClick={() => setScoresTabIndex(tab.num)} key={i}>
                                {tab.icon}
                                <div>{tab.title}</div>
                                <div className="badge">{tab.count}</div>
                            </button>)}
                    </div>
                    {scoresList.map((s: scoreListItem, i: number) =>
                        <div hidden={scoresTabIndex !== s.id} style={{ height: 602 }} className="overflow-x-hidden overflow-y-scroll" key={i}>
                            <InfiniteScroll
                                pageStart={0}
                                loadMore={() => s.type !== 'best' ? getScores(s.type, 15, s.scores.length) : setBestRenderIndex((p) => p + 15)}
                                hasMore={s.type !== 'best' ? s.scores.length < s.len : bestRenderIndex < s.len}
                                loader={<div key={0} className="loading loading-dots loading-md"></div>}
                                useWindow={false}
                            >
                                {s.scores.map((sc: Score, ind: number) => (
                                    s.type !== 'best' ?
                                        <ScoreCard index={ind} score={sc} /> :
                                        ind < bestRenderIndex && <ScoreCard index={ind} score={sc} />
                                )
                                )}
                            </InfiniteScroll>
                        </div>
                    )}
                </div>
                <div className="flex flex-col col-span-5 drop-shadow-lg bg-accent-950 xl:col-span-2" style={{ height: div1Ref.current?.clientHeight }}>
                    <div className="flex flex-row gap-2 justify-center items-center p-2 bg-accent-800">
                        <FaListUl />
                        <div>Beatmaps</div>
                    </div>
                    <div className="justify-center content-center rounded-none tabs tabs-boxed bg-accent-900">
                        {beatmapsTabs.map((tab: tabInterface, i: number) => tab.count > 0 &&
                            <button className={`tab flex flex-row gap-2 ${beatmapsTabIndex === tab.num && 'tab-active'}`}
                                onClick={() => setBeatmapsTabIndex(tab.num)} key={i}>
                                {tab.icon}
                                <div>{tab.title}</div>
                                <div className="badge">{tab.count}</div>
                            </button>)}
                    </div>
                    {beatmapsList.map((b: beatmapListItem, i: number) =>
                        <div hidden={beatmapsTabIndex !== b.id} style={{ height: 602 }} className="overflow-x-hidden overflow-y-scroll" key={i}>
                            <InfiniteScroll
                                pageStart={0}
                                loadMore={() => getBeatmaps(b.type, 15, b.beatmaps.length)}
                                hasMore={b.beatmaps.length < b.len}
                                loader={<div key={0} className="loading loading-dots loading-md"></div>}
                                useWindow={false}
                            >
                                {b.beatmaps.map((bs: BeatmapSet, ind: number) =>
                                    <BeatmapsetCard index={ind} beatmapset={bs} />
                                )}
                            </InfiniteScroll>
                        </div>
                    )}
                </div>
                <div className="flex flex-col col-span-5 drop-shadow-lg bg-accent-950 xl:col-span-3" style={{ height: div1Ref.current?.clientHeight }}>
                    <div className="flex flex-row gap-2 justify-center items-center p-2 bg-accent-800">
                        <FaMedal />
                        <div>Medals</div>
                    </div>
                    <div className="flex overflow-x-hidden overflow-y-scroll flex-col grow">
                        <div className="grid grid-cols-6">
                            <div className="col-span-5">
                                <div className="p-2 text-center bg-accent-900">
                                    Recent Medals
                                </div>
                                <div className="p-3 pt-2">
                                    <div className="flex flex-row justify-between px-2 pb-1"
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
                                <div className="p-2 text-center bg-accent-900">
                                    Rarest Medal
                                </div>
                                <div className="p-3 pt-2">
                                    <div className="px-2 pb-1 text-center"
                                        style={{ fontSize: 14, top: -8 }}>
                                        Rarity: {parseFloat(rarestMedal?.Rarity ? rarestMedal.Rarity : '0').toFixed(2)}%
                                    </div>
                                    <div className="grid justify-center p-3">
                                        {rarestMedal &&
                                            <MedalBadge thisMedal={rarestMedal}
                                                userMedals={userData.user_achievements} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {Object.entries(medalsByCategory).map(([category, medals]: [string, Medal[]], key: number) => (
                            <div key={key} className="grow">
                                <div className="flex flex-row justify-center items-center p-2 text-center bg-accent-900">
                                    <div className="text-center">
                                        {category}:
                                    </div>
                                </div>
                                <div className="flex flex-col p-3 pt-2 grow">
                                    <div className="px-2 pb-1 text-center"
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
        setScores(SCORES_INITIAL);
        setBeatmaps(BEATMAPS_INITIAL);
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

            if (props.userMode === "default") searchMode = user.playmode;
            else searchMode = props.userMode;

            window.history.replaceState({}, '', `/users/${user.id}/${searchMode}`);

            getBest(user.id, searchMode, 'best', 100, 0);
            getGlobalData(user);
            getCountryData(user);
            getPlaysData(user);
            getReplaysData(user);
            setGameMode(searchMode);

            let scoresTab: number = 0;
            if (user.scores_pinned_count > 0) scoresTab = 1;
            else if (user.scores_best_count > 0) scoresTab = 2;
            else if (user.scores_first_count > 0) scoresTab = 3;
            else if (user.scores_recent_count > 0) scoresTab = 4;
            setScoresTabIndex(scoresTab);

            let beatmapsTab: number = 0;
            if (user.favourite_beatmapset_count > 0) beatmapsTab = 1;
            else if (user.ranked_beatmapset_count > 0) beatmapsTab = 2;
            else if (user.guest_beatmapset_count > 0) beatmapsTab = 3;
            else if (user.loved_beatmapset_count > 0) beatmapsTab = 4;
            else if (user.nominated_beatmapset_count > 0) beatmapsTab = 5;
            else if (user.pending_beatmapset_count > 0) beatmapsTab = 6;
            else if (user.graveyard_beatmapset_count > 0) beatmapsTab = 7;
            setBeatmapsTabIndex(beatmapsTab);
        } catch (err) {
            console.error(err);
            setUserData(null);
            addAlert('warning', 'This user doesnt exist');
        }
    }

    async function getBest(id: number, m: GameModeType, t: scoreCategoryType, l: number, o: number) {
        try {
            const r = await axios.post('/userscores', {
                id: id,
                mode: m,
                limit: l,
                offset: o,
                type: t
            });
            const d: Score[] = r.data;
            if (d.length < 1) return;
            setScores((prev) => ({ ...prev, best: [...prev.best, ...d] }));
        } catch (err) {
            console.error(err);
        }
    }

    async function getScores(t: scoreCategoryType, l: number, o: number) {
        if (!userData?.id) return;
        if (!gameMode) return;
        try {
            const r = await axios.post('/userscores', {
                id: userData.id,
                mode: gameMode,
                limit: l,
                offset: o,
                type: t
            });
            const d: Score[] = r.data;
            if (d.length < 1) return;
            switch (t) {
                case 'pinned': setScores((prev) => ({ ...prev, pinned: [...prev.pinned, ...d] })); break;
                case 'best': setScores((prev) => ({ ...prev, best: [...prev.best, ...d] })); break;
                case 'firsts': setScores((prev) => ({ ...prev, firsts: [...prev.firsts, ...d] })); break;
                case 'recent': setScores((prev) => ({ ...prev, recent: [...prev.recent, ...d] })); break;
                default: break;
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function getBeatmaps(t: beatmapCategoryType, l: number, o: number) {
        if (!userData?.id) return;
        try {
            const r = await axios.post('/userbeatmaps', {
                id: userData.id,
                limit: l,
                offset: o,
                type: t
            });
            const d: BeatmapSet[] = r.data;
            console.log(d);
            if (d.length < 1) return;
            switch (t) {
                case 'favourite': setBeatmaps((prev) => ({ ...prev, favourite: [...prev.favourite, ...d] })); break;
                case 'ranked': setBeatmaps((prev) => ({ ...prev, ranked: [...prev.ranked, ...d] })); break;
                case 'guest': setBeatmaps((prev) => ({ ...prev, guest: [...prev.guest, ...d] })); break;
                case 'loved': setBeatmaps((prev) => ({ ...prev, loved: [...prev.loved, ...d] })); break;
                case 'nominated': setBeatmaps((prev) => ({ ...prev, nominated: [...prev.loved, ...d] })); break;
                case 'pending': setBeatmaps((prev) => ({ ...prev, pending: [...prev.pending, ...d] })); break;
                case 'graveyard': setBeatmaps((prev) => ({ ...prev, graveyard: [...prev.graveyard, ...d] })); break;
                default: break;
            }
        } catch (err) {
            console.error(err);
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
    useEffect(() => {
        getM();
    }, [])
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