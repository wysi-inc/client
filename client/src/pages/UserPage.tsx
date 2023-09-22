/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import moment from "moment";
import Twemoji from 'react-twemoji';
import { Line } from "react-chartjs-2";
import zoomPlugin from 'chartjs-plugin-zoom';
import ReactCountryFlag from "react-country-flag";
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';

import { FaSkull } from "react-icons/fa";
import Spinner from 'react-bootstrap/Spinner';
import { BiSolidTrophy, BiSolidUserDetail } from "react-icons/bi";
import { HiCalculator, HiChevronDoubleUp, HiFire, HiGlobeAlt, HiOutlineStar, HiReply } from "react-icons/hi";
import { BsBarChartLine, BsFillPinAngleFill, BsHourglassSplit, BsStopwatch, BsSuitHeartFill } from "react-icons/bs";

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

import List from 'react-virtualized/dist/commonjs/List';
import InfiniteLoader from "react-virtualized/dist/commonjs/InfiniteLoader";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";

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

const UserPage = (props: UserPageProps) => {
    const [userData, setUserData] = useState<User | null>(null);
    const [gameMode, setGameMode] = useState<GameModeType>('osu');

    const [medals, setMedals] = useState<Medal[]>([]);
    const [medalsByCategory, setMedalsByCategory] = useState<SortedMedals>({});
    const [lastMedals, setLastMedals] = useState<Medal[]>([]);
    const [rarestMedal, setRarestMedal] = useState<Medal | null>(null);

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

    const scoresData: dataInterface[] = [
        { num: 1, thing: 'pinned', group: 'scores', tab: scoresTabIndex, maps: pinnedScores, count: userData.scores_pinned_count, setMore: setPinnedScores },
        { num: 2, thing: 'best', group: 'scores', tab: scoresTabIndex, maps: bestScores, count: userData.scores_best_count, setMore: setBestScores },
        { num: 3, thing: 'firsts', group: 'scores', tab: scoresTabIndex, maps: firstsScores, count: userData.scores_first_count, setMore: setFirstsScores },
        { num: 4, thing: 'recent', group: 'scores', tab: scoresTabIndex, maps: recentScores, count: userData.scores_recent_count, setMore: setRecentScores },
    ]

    const beatmapsTabs: tabGroup = {
        setTabs: setBeatmapsTabIndex,
        items: [
            { num: 1, title: 'Favourites', icon: <HiOutlineStar />, count: userData.favourite_beatmapset_count, },
            { num: 2, title: 'Ranked', icon: <HiChevronDoubleUp />, count: userData.ranked_and_approved_beatmapset_count },
            { num: 3, title: 'Loved', icon: <BsSuitHeartFill />, count: userData.loved_beatmapset_count },
            { num: 4, title: 'Guest', icon: <BiSolidUserDetail />, count: userData.guest_beatmapset_count },
            { num: 5, title: 'Graveyard', icon: <FaSkull />, count: userData.graveyard_beatmapset_count },
            { num: 6, title: 'Nominated', icon: <BiSolidTrophy />, count: userData.nominated_beatmapset_count },
            { num: 7, title: 'Pending', icon: <BsHourglassSplit />, count: userData.pending_beatmapset_count },
        ]
    }

    const beatmapsData: dataInterface[] = [
        { num: 1, thing: 'favourite', group: 'beatmapsets', tab: beatmapsTabIndex, maps: favouriteBeatmaps, count: userData.favourite_beatmapset_count, setMore: setFavouriteBeatmaps },
        { num: 2, thing: 'ranked', group: 'beatmapsets', tab: beatmapsTabIndex, maps: rankedBeatmaps, count: userData.ranked_and_approved_beatmapset_count, setMore: setRankedBeatmaps },
        { num: 3, thing: 'loved', group: 'beatmapsets', tab: beatmapsTabIndex, maps: lovedBeatmaps, count: userData.loved_beatmapset_count, setMore: setLovedBeatmaps },
        { num: 4, thing: 'guest', group: 'beatmapsets', tab: beatmapsTabIndex, maps: guestBeatmaps, count: userData.guest_beatmapset_count, setMore: setGuestBeatmaps },
        { num: 5, thing: 'graveyard', group: 'beatmapsets', tab: beatmapsTabIndex, maps: graveyardBeatmaps, count: userData.graveyard_beatmapset_count, setMore: setGraveyardBeatmaps },
        { num: 6, thing: 'nominated', group: 'beatmapsets', tab: beatmapsTabIndex, maps: nominatedBeatmaps, count: userData.nominated_beatmapset_count, setMore: setNominatedBeatmaps },
        { num: 7, thing: 'pending', group: 'beatmapsets', tab: beatmapsTabIndex, maps: pendingBeatmaps, count: userData.pending_beatmapset_count, setMore: setPendingBeatmaps },
    ]

    return (
        <div>
            <div style={{ background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${userData.cover_url}) center / cover no-repeat` }}>
                <div style={{ backdropFilter: "blur(2px)" }}
                    className="flex flex-col p-8 gap-8 card-body rounded-none">
                    <div className="grid grid-cols-7 flex-wrap gap-4 xl:gap-8">
                        <div className="col-span-7 md:col-span-2 xl:col-span-1 gap-3 flex flex-col items-center justify-start">
                            <img src={userData.avatar_url}
                                onError={addDefaultSrc}
                                alt='pfp' className="aspect-square mb-2"
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
                        <div className="col-span-7 md:col-span-2 xl:col-span-2 gap-3 flex flex-col items-center md:items-start justify-between">
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
                                    <i className="bi bi-clock"></i>
                                    <div>
                                        {Math.round((userData.statistics.play_time / 60 / 60)).toLocaleString()}h
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-lg">Play Count:</div>
                                <div className="text-xl flex flex-row items-center gap-2">
                                    <HiReply />
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
                            <TopScoresPanel data={userData} best={bestScores} />
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
                    <div style={{ height: 602 }}>
                        {scoresSwitch()}
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
                    <div style={{ height: 602 }}>
                        {beatmapsSwitch()}
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
                                        {(getAchievedMedalsCount()[category] / medals.length * 100).toFixed(2)}%
                                        ({getAchievedMedalsCount()[category]}/{medals.length})
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
        const data: User = res.data;
        if (!data.id) return;
        if (data.is_bot) return;
        console.log(data);
        let searchMode: GameModeType;
        if (props.userMode === "default") {
            searchMode = data.playmode;
        } else {
            searchMode = props.userMode;
        }
        window.history.replaceState({}, '', `/users/${data.id}/${searchMode}`);
        setUserData(data);
        setCharts(data);
        setGameMode(searchMode);
        getScores(data.id, data.playmode);
        getBeatmaps(data.id, data.playmode);

        let tab = 0;
        if (data.scores_pinned_count > 0) {
            tab = 1;
        } else if (data.scores_best_count > 0) {
            tab = 2;
        } else if (data.scores_first_count > 0) {
            tab = 3;
        } else if (data.scores_recent_count > 0) {
            tab = 4;
        }
        setScoresTabIndex(tab);
    }

    async function getScores(id: number, mode: GameModeType,) {
        try {
            const url: string = `https://osu.ppy.sh/users/${id}/extra-pages/top_ranks?mode=${mode}`
            const res = await axios.post('/proxy', { url: url });
            const d = res.data;
            setPinnedScores(d.pinned.items);
            setFirstsScores(d.firsts.items);
        } catch (err) {
            console.error(err);
        }
        try {
            const url: string = `https://osu.ppy.sh/users/${id}/scores/best?mode=${mode}&limit=100&offset=0`
            const res = await axios.post('/proxy', { url: url });
            const d: Score[] = res.data;
            setBestScores(d);
        } catch (err) {
            console.error(err);
        }
        try {
            const url: string = `https://osu.ppy.sh/users/${id}/scores/recent?mode=${mode}&limit=5&offset=0`
            const res = await axios.post('/proxy', { url: url });
            const d: Score[] = res.data;
            setRecentScores(d);
        } catch (err) {
            console.error(err);
        }
    }

    async function getBeatmaps(id: number, mode: GameModeType) {
        const url: string = `https://osu.ppy.sh/users/${id}/extra-pages/beatmaps?mode=${mode}`;
        try {
            const res = await axios.post('/proxy', { url: url });
            const data = res.data;
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

    async function getMedals() {
        try {
            const res = await axios.post('/getMedals')
            const data: Medal[] = res.data;
            data.sort((a: any, b: any) => {
                return parseInt(a.MedalID) - parseInt(b.MedalID);
            });
            setMedals(data);
            getMedalsByCategory(data);
        } catch (e) {
            console.error(e);
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
        setMedalsByCategory(categoryArrays);
    }

    function getLastMedals(userMedals: UserAchievement[], medals: Medal[], num: number) {
        const sortedArray = userMedals
            .sort((a: UserAchievement, b: UserAchievement) => {
                const dateA: Date = new Date(a.achieved_at);
                const dateB: Date = new Date(b.achieved_at);
                return dateA.getTime() - dateB.getTime();
            }).reverse().slice(0, num)
            .map((obj: UserAchievement) => obj.achievement_id)
            .map((id: number) => medals.find((medal: any): boolean => parseInt(medal.MedalID) === id))
            .filter((medal: Medal | undefined): medal is Medal => medal !== undefined);
        setLastMedals(sortedArray);
    }

    function getAchievedMedalsCount(): MedalCategories {
        const achievedMedalsCount: MedalCategories = {};
        Object.entries(medalsByCategory)
            .forEach(([category, medals]: [string, Medal[]]) => {
                achievedMedalsCount[category] = 0;
                userData?.user_achievements.forEach((achievedMedal: UserAchievement): void => {
                    if (medals.find((medal: Medal): boolean => parseInt(medal.MedalID) === achievedMedal.achievement_id)) {
                        achievedMedalsCount[category]++;
                    }
                });
            });
        return achievedMedalsCount;
    }

    function getRarestMedal(userMedals: UserAchievement[], medals: Medal[]) {
        const data = userMedals.map((obj: UserAchievement) => obj.achievement_id)
            .map((id: number) => medals.find((medal: Medal): boolean => String(medal.MedalID) === String(id)))
            .reduce((rarest: Medal | null, medal: Medal | undefined): Medal => {
                if (!rarest || (medal && medal.Rarity < rarest.Rarity)) {
                    return medal as Medal;
                }
                return rarest;
            }, null)
        setRarestMedal(data);
    }

    function setCharts(user: User) {
        getGlobalData(user);
        getCountryData(user);
        getPlaysData(user);
        getReplaysData(user);
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

    function scoresSwitch() {
        const rowHeight = 270;
        if (!userData) return <></>;
        switch (scoresTabIndex) {
            case 1:
                return <InfiniteLoader
                    isRowLoaded={isPinnedRowLoaded}
                    loadMoreRows={loadPinnedRows}
                    rowCount={userData.scores_pinned_count}>
                    {({ onRowsRendered, registerChild }) => (
                        <AutoSizer>
                            {({ height, width }) => (
                                <List width={width}
                                    height={height}
                                    rowCount={pinnedScores.length}
                                    rowHeight={rowHeight}
                                    onRowsRendered={onRowsRendered}
                                    ref={registerChild}
                                    rowRenderer={PinnedScoreRenderer} />)}
                        </AutoSizer>
                    )}</InfiniteLoader>;
            case 2:
                return <InfiniteLoader
                    isRowLoaded={isBestRowLoaded}
                    loadMoreRows={loadBestRows}
                    rowCount={userData.scores_best_count}>
                    {({ onRowsRendered, registerChild }) => (
                        <AutoSizer>
                            {({ height, width }) => (
                                <List width={width}
                                    height={height}
                                    rowCount={bestScores.length}
                                    rowHeight={rowHeight}
                                    onRowsRendered={onRowsRendered}
                                    ref={registerChild}
                                    rowRenderer={BestScoreRenderer}
                                />)}
                        </AutoSizer>
                    )}</InfiniteLoader>;
            case 3:
                return <InfiniteLoader
                    isRowLoaded={isFirstsRowLoaded}
                    loadMoreRows={loadFirstsRows}
                    rowCount={userData.scores_first_count}>
                    {({ onRowsRendered, registerChild }) => (
                        <AutoSizer>
                            {({ height, width }) => (
                                <List width={width}
                                    height={height}
                                    rowCount={firstsScores.length}
                                    onRowsRendered={onRowsRendered}
                                    ref={registerChild}
                                    rowHeight={rowHeight}
                                    rowRenderer={FirstsScoreRenderer} />)}
                        </AutoSizer>
                    )}</InfiniteLoader>;
            case 4:
                return <InfiniteLoader
                    isRowLoaded={isRecentRowLoaded}
                    loadMoreRows={loadRecentRows}
                    rowCount={userData.scores_recent_count}>
                    {({ onRowsRendered, registerChild }) => (
                        <AutoSizer>
                            {({ height, width }) => (
                                <List width={width}
                                    height={height}
                                    rowCount={recentScores.length}
                                    onRowsRendered={onRowsRendered}
                                    ref={registerChild}
                                    rowHeight={rowHeight}
                                    rowRenderer={RecentScoreRenderer}
                                />)}
                        </AutoSizer>
                    )}</InfiniteLoader>;
            default:
                return <></>;
        }
    }

    function beatmapsSwitch() {
        if (!userData) return <></>;
        const rowHeight = 200;
        switch (beatmapsTabIndex) {
            case 1:
                return <InfiniteLoader
                    isRowLoaded={isFavouriteRowLoaded}
                    loadMoreRows={loadFavouriteRows}
                    rowCount={userData.favourite_beatmapset_count}>
                    {({ onRowsRendered, registerChild }) => (
                        <AutoSizer>
                            {({ height, width }) => (
                                <List width={width}
                                    height={height}
                                    rowCount={favouriteBeatmaps.length}
                                    rowHeight={rowHeight}
                                    onRowsRendered={onRowsRendered}
                                    ref={registerChild}
                                    rowRenderer={FavouriteBeatmapRenderer} />)}
                        </AutoSizer>
                    )}</InfiniteLoader>;
            case 2:
                return <InfiniteLoader
                    isRowLoaded={isRankedRowLoaded}
                    loadMoreRows={loadRankedRows}
                    rowCount={userData.ranked_beatmapset_count}>
                    {({ onRowsRendered, registerChild }) => (
                        <AutoSizer>
                            {({ height, width }) => (
                                <List width={width}
                                    height={height}
                                    rowCount={rankedBeatmaps.length}
                                    rowHeight={rowHeight}
                                    onRowsRendered={onRowsRendered}
                                    ref={registerChild}
                                    rowRenderer={RankedBeatmapRenderer}
                                />)}
                        </AutoSizer>)}</InfiniteLoader>;
            case 3:
                return <InfiniteLoader
                    isRowLoaded={isLovedRowLoaded}
                    loadMoreRows={loadLovedRows}
                    rowCount={userData.loved_beatmapset_count}>
                    {({ onRowsRendered, registerChild }) => (
                        <AutoSizer>
                            {({ height, width }) => (
                                <List width={width}
                                    height={height}
                                    rowCount={lovedBeatmaps.length}
                                    rowHeight={rowHeight}
                                    onRowsRendered={onRowsRendered}
                                    ref={registerChild}
                                    rowRenderer={LovedBeatmapRenderer}
                                />)}
                        </AutoSizer>
                    )}
                </InfiniteLoader>;
            case 4:
                return <InfiniteLoader
                    isRowLoaded={isGuestRowLoaded}
                    loadMoreRows={loadGuestRows}
                    rowCount={userData.guest_beatmapset_count}>
                    {({ onRowsRendered, registerChild }) => (
                        <AutoSizer>
                            {({ height, width }) => (
                                <List width={width}
                                    height={height}
                                    rowCount={guestBeatmaps.length}
                                    rowHeight={rowHeight}
                                    onRowsRendered={onRowsRendered}
                                    ref={registerChild}
                                    rowRenderer={GuestBeatmapRenderer}
                                />)}
                        </AutoSizer>
                    )}
                </InfiniteLoader>;
            case 5:
                return <InfiniteLoader
                    isRowLoaded={isGraveyardRowLoaded}
                    loadMoreRows={loadGraveyardRows}
                    rowCount={userData.graveyard_beatmapset_count}>
                    {({ onRowsRendered, registerChild }) => (
                        <AutoSizer>
                            {({ height, width }) => (
                                <List width={width}
                                    height={height}
                                    rowCount={graveyardBeatmaps.length}
                                    rowHeight={rowHeight}
                                    onRowsRendered={onRowsRendered}
                                    ref={registerChild}
                                    rowRenderer={GraveyardedBeatmapRenderer}
                                />)}
                        </AutoSizer>
                    )}
                </InfiniteLoader>;
            case 6:
                return <InfiniteLoader
                    isRowLoaded={isNominatedRowLoaded}
                    loadMoreRows={loadNominatedRows}
                    rowCount={userData.nominated_beatmapset_count}>
                    {({ onRowsRendered, registerChild }) => (
                        <AutoSizer>
                            {({ height, width }) => (
                                <List width={width}
                                    height={height}
                                    rowCount={nominatedBeatmaps.length}
                                    rowHeight={rowHeight}
                                    onRowsRendered={onRowsRendered}
                                    ref={registerChild}
                                    rowRenderer={NominatedBeatmapRenderer}
                                />)}
                        </AutoSizer>
                    )}
                </InfiniteLoader>;
            case 7:
                return <InfiniteLoader
                    isRowLoaded={isPendingRowLoaded}
                    loadMoreRows={loadPendingRows}
                    rowCount={userData.pending_beatmapset_count}>
                    {({ onRowsRendered, registerChild }) => (
                        <AutoSizer>
                            {({ height, width }) => (
                                <List width={width}
                                    height={height}
                                    rowCount={pendingBeatmaps.length}
                                    rowHeight={rowHeight}
                                    onRowsRendered={onRowsRendered}
                                    ref={registerChild}
                                    rowRenderer={PendingBeatmapRenderer}
                                />)}
                        </AutoSizer>
                    )}
                </InfiniteLoader>;
            default:
                return <></>;
        }
    }

    function PinnedScoreRenderer({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }: any) {
        return (
            <div key={key} style={style}>
                <ScoreCard index={index + 1} score={pinnedScores[index]} />
            </div>
        );
    }

    function BestScoreRenderer({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }: any) {
        return (
            <div key={key} style={style}>
                <ScoreCard index={index + 1} score={bestScores[index]} />
            </div>
        );
    }

    function FirstsScoreRenderer({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }: any) {
        return (
            <div key={key} style={style}>
                <ScoreCard index={index + 1} score={firstsScores[index]} />
            </div>
        );
    }

    function RecentScoreRenderer({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }: any) {
        return (
            <div key={key} style={style}>
                <ScoreCard index={index + 1} score={recentScores[index]} />
            </div>
        );
    }

    function FavouriteBeatmapRenderer({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }: any) {
        return (
            <div key={key} style={style}>
                <BeatmapsetCard index={index + 1} data={favouriteBeatmaps[index]} />
            </div>
        );
    }

    function RankedBeatmapRenderer({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }: any) {
        return (
            <div key={key} style={style}>
                <BeatmapsetCard index={index + 1} data={rankedBeatmaps[index]} />
            </div>
        );
    }

    function LovedBeatmapRenderer({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }: any) {
        return (
            <div key={key} style={style}>
                <BeatmapsetCard index={index + 1} data={favouriteBeatmaps[index]} />
            </div>
        );
    }

    function GuestBeatmapRenderer({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }: any) {
        return (
            <div key={key} style={style}>
                <BeatmapsetCard index={index + 1} data={guestBeatmaps[index]} />
            </div>
        );
    }

    function GraveyardedBeatmapRenderer({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }: any) {
        return (
            <div key={key} style={style}>
                <BeatmapsetCard index={index + 1} data={graveyardBeatmaps[index]} />
            </div>
        );
    }

    function NominatedBeatmapRenderer({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }: any) {
        return (
            <div key={key} style={style}>
                <BeatmapsetCard index={index + 1} data={nominatedBeatmaps[index]} />
            </div>
        );
    }

    function PendingBeatmapRenderer({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }: any) {
        return (
            <div key={key} style={style}>
                <BeatmapsetCard index={index + 1} data={pendingBeatmaps[index]} />
            </div>
        );
    }

    function isPinnedRowLoaded({ index }: any) {
        return !!pinnedScores[index];
    }

    function isBestRowLoaded({ index }: any) {
        return !!bestScores[index];
    }

    function isFirstsRowLoaded({ index }: any) {
        return !!firstsScores[index];
    }

    function isRecentRowLoaded({ index }: any) {
        return !!recentScores[index];
    }

    function isFavouriteRowLoaded({ index }: any) {
        return !!favouriteBeatmaps[index];
    }
    function isRankedRowLoaded({ index }: any) {
        return !!rankedBeatmaps[index];
    }
    function isLovedRowLoaded({ index }: any) {
        return !!lovedBeatmaps[index];
    }
    function isGuestRowLoaded({ index }: any) {
        return !!guestBeatmaps[index];
    }
    function isPendingRowLoaded({ index }: any) {
        return !!pendingBeatmaps[index];
    }
    function isGraveyardRowLoaded({ index }: any) {
        return !!graveyardBeatmaps[index];
    }
    function isNominatedRowLoaded({ index }: any) {
        return !!nominatedBeatmaps[index];
    }

    async function loadPinnedRows({ startIndex, stopIndex }: any) {
        if (!userData) return;
        const url: string = `https://osu.ppy.sh/users/${userData.id}/scores/pinned?mode=${userData.playmode}&limit=${stopIndex}&offset=${startIndex}`
        try {
            const res = await axios.post('/proxy', { url: url });
            const data: Score[] = res.data;
            setPinnedScores([...pinnedScores, ...data]);
        } catch (err) {
            console.error(err);
        }
        return;
    }
    async function loadBestRows({ startIndex, stopIndex }: any) {
        if (!userData) return;
        const url: string = `https://osu.ppy.sh/users/${userData.id}/scores/best?mode=${userData.playmode}&limit=${stopIndex}&offset=${startIndex}`
        try {
            const res = await axios.post('/proxy', { url: url });
            const data: Score[] = res.data;
            setBestScores([...bestScores, ...data]);
        } catch (err) {
            console.error(err);
        }
        return;
    }
    async function loadFirstsRows({ startIndex, stopIndex }: any) {
        if (!userData) return;
        const url: string = `https://osu.ppy.sh/users/${userData.id}/scores/firsts?mode=${userData.playmode}&limit=${stopIndex}&offset=${startIndex}`
        try {
            const res = await axios.post('/proxy', { url: url });
            const data: Score[] = res.data;
            setFirstsScores([...firstsScores, ...data]);
        } catch (err) {
            console.error(err);
        }
        return;
    }
    async function loadRecentRows({ startIndex, stopIndex }: any) {
        if (!userData) return;
        const url: string = `https://osu.ppy.sh/users/${userData.id}/scores/recent?mode=${userData.playmode}&limit=${stopIndex}&offset=${startIndex}`
        try {
            const res = await axios.post('/proxy', { url: url });
            const data: Score[] = res.data;
            setRecentScores([...recentScores, ...data]);
        } catch (err) {
            console.error(err);
        }
        return;
    }
    async function loadFavouriteRows({ startIndex, stopIndex }: any) {
        if (!userData) return;
        const url: string = `https://osu.ppy.sh/users/${userData.id}/beatmapsets/favourite?limit=${stopIndex}&offset=${startIndex}`;
        try {
            const res = await axios.post('/proxy', { url: url });
            const data: BeatmapSet[] = res.data;
            setFavouriteBeatmaps([...favouriteBeatmaps, ...data]);
        } catch (err) {
            console.error(err);
        }
    }
    async function loadGraveyardRows({ startIndex, stopIndex }: any) {
        if (!userData) return;
        const url: string = `https://osu.ppy.sh/users/${userData.id}/beatmapsets/graveyard?limit=${stopIndex}&offset=${startIndex}`;
        try {
            const res = await axios.post('/proxy', { url: url });
            const data: BeatmapSet[] = res.data;
            setGraveyardBeatmaps([...graveyardBeatmaps, ...data]);
        } catch (err) {
            console.error(err);
        }
    }
    async function loadGuestRows({ startIndex, stopIndex }: any) {
        if (!userData) return;
        const url: string = `https://osu.ppy.sh/users/${userData.id}/beatmapsets/guest?limit=${stopIndex}&offset=${startIndex}`;
        try {
            const res = await axios.post('/proxy', { url: url });
            const data: BeatmapSet[] = res.data;
            setGuestBeatmaps([...guestBeatmaps, ...data]);
        } catch (err) {
            console.error(err);
        }
    }
    async function loadLovedRows({ startIndex, stopIndex }: any) {
        if (!userData) return;
        const url: string = `https://osu.ppy.sh/users/${userData.id}/beatmapsets/loved?limit=${stopIndex}&offset=${startIndex}`;
        try {
            const res = await axios.post('/proxy', { url: url });
            const data: BeatmapSet[] = res.data;
            setLovedBeatmaps([...lovedBeatmaps, ...data]);
        } catch (err) {
            console.error(err);
        }
    }
    async function loadNominatedRows({ startIndex, stopIndex }: any) {
        if (!userData) return;
        const url: string = `https://osu.ppy.sh/users/${userData.id}/beatmapsets/nominated?limit=${stopIndex}&offset=${startIndex}`;
        try {
            const res = await axios.post('/proxy', { url: url });
            const data: BeatmapSet[] = res.data;
            setNominatedBeatmaps([...nominatedBeatmaps, ...data]);
        } catch (err) {
            console.error(err);
        }
    }
    async function loadPendingRows({ startIndex, stopIndex }: any) {
        if (!userData) return;
        const url: string = `https://osu.ppy.sh/users/${userData.id}/beatmapsets/pending?limit=${stopIndex}&offset=${startIndex}`;
        try {
            const res = await axios.post('/proxy', { url: url });
            const data: BeatmapSet[] = res.data;
            setPendingBeatmaps([...pendingBeatmaps, ...data]);
        } catch (err) {
            console.error(err);
        }
    }
    async function loadRankedRows({ startIndex, stopIndex }: any) {
        if (!userData) return;
        const url: string = `https://osu.ppy.sh/users/${userData.id}/beatmapsets/ranked?limit=${stopIndex}&offset=${startIndex}`;
        try {
            const res = await axios.post('/proxy', { url: url });
            const data: BeatmapSet[] = res.data;
            setRankedBeatmaps([...rankedBeatmaps, ...data]);
        } catch (err) {
            console.error(err);
        }
    }

}
export default UserPage;