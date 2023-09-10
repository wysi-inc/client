import React, { useEffect, useState, useRef, useMemo, Dispatch, SetStateAction } from "react";
import { useParams } from "react-router-dom";
import axios from '../resources/axios-config';
import { Chart, registerables } from 'chart.js';
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
    MonthlyData, SortedMedals,
    UserAchievement,
    UserBadge,
    userData, UserGroup, UserBeatmapSets, BeatThings
} from "../resources/interfaces";

import { colors } from "../resources/store";
import { BeatmapType, GameModeType, ScoreType } from "../resources/types";
import { addDefaultSrc, secondsToTime } from "../resources/functions";
import ScoreCard from "../components/ScoreCard";
import TopScoresPanel from "../components/TopScoresPanel";
import Medal from "../components/Medal";
import Badge from "../components/Badge";
import CountryShape from "../components/CountryShape";
import ModeSelector from "../components/ModeSelector";
import SupporterIcon from "../components/SupporterIcon";
import GroupBadge from "../components/GroupBadge";
import BeatmapsetCard from "../components/BeatmapsetCard";

Chart.register(zoomPlugin, ...registerables);
Chart.defaults.plugins.legend.display = false;
Chart.defaults.font.family = "IBM Plex Mono";
Chart.defaults.color = colors.ui.font;
Chart.defaults.animation = false;
Chart.defaults.elements.point.radius = 0;
Chart.defaults.interaction.intersect = false;
Chart.defaults.interaction.mode = 'index';
Chart.defaults.indexAxis = 'x';
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.plugins.tooltip.displayColors = false;

interface tabInterface {
    num: number,
    title: string,
    icon: string,
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

const UserPage = () => {
    const { urlUser } = useParams();
    const { urlMode } = useParams();

    const [userData, setUserData] = useState<userData | null>(null);
    const [gameMode, setGameMode] = useState<GameModeType>('osu');

    const [medals, setMedals] = useState<MedalInterface[]>([]);
    const [medalsByCategory, setMedalsByCategory] = useState<SortedMedals>({});
    const [lastMedals, setLastMedals] = useState<MedalInterface[]>([]);
    const [rarestMedal, setRarestMedal] = useState<MedalInterface | null>(null);

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

    const [historyTabIndex, setHistoryTabIndex] = useState<number>(0);
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
    }, [window.innerWidth, div1Ref.current?.clientHeight]);

    useEffect((): void => {
        clearData();
        const checkedMode: GameModeType = urlMode?.toLowerCase() as GameModeType;
        if (urlUser !== undefined) {
            getUser(checkedMode ? checkedMode : 'default').then();
        }
    }, [urlUser, urlMode]);

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

    if (urlUser === undefined) {
        return (
            <div>Search a user on the top bar</div>
        )
    }
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

    const globalHistoryData: any = {
        labels: getGlobalLabels(),
        datasets: [{
            label: 'Rank',
            data: getGlobalData(),
            fill: false,
            borderColor: colors.charts.global,
            tension: 0.1,
        }],
    };
    const countryHistoryData: any = {
        labels: getCountryLabels(),
        datasets: [{
            label: 'Rank',
            data: getCountryData(),
            fill: false,
            borderColor: colors.charts.global,
            tension: 0.1,
        }],
    };
    const playsHistoryData: any = {
        labels: getPlaysLabels(),
        datasets: [{
            label: 'Play Count',
            data: getPlaysData(),
            fill: false,
            borderColor: colors.charts.plays,
            tension: 0.1
        }]
    };
    const replaysHistoryData: any = {
        labels: getReplaysPlaysLabels(),
        datasets: [{
            label: 'Replays Watched',
            data: getReplaysData(),
            fill: false,
            borderColor: colors.charts.plays,
            tension: 0.1
        }]
    };

    const lineOptions: any = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            y: {
                reverse: false,
                ticks: {
                    precision: 0
                }
            },
        },
    };
    const lineOptionsReverse: any = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            y: {
                reverse: true,
                ticks: {
                    precision: 0
                }
            },
        },
    };

    const scoresTabs: tabInterface[] = [
        {
            num: 1,
            title: 'Pinned',
            icon: 'bi-pin-angle-fill',
            count: userData.scores_pinned_count,
            setTabs: setScoresTabIndex
        },
        {
            num: 2,
            title: 'Best',
            icon: 'bi-bar-chart-fill',
            count: userData.scores_best_count,
            setTabs: setScoresTabIndex
        },
        { num: 3, title: 'Firsts', icon: 'bi-star-fill', count: userData.scores_first_count, setTabs: setScoresTabIndex },
        { num: 4, title: 'Recent', icon: 'bi bi-alarm', count: userData.scores_recent_count, setTabs: setScoresTabIndex },
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
            icon: 'bi-star-fill',
            count: userData.favourite_beatmapset_count,
            setTabs: setBeatmapsTabIndex
        },
        {
            num: 2,
            title: 'Ranked',
            icon: 'bi bi-chevron-double-up',
            count: userData.ranked_and_approved_beatmapset_count,
            setTabs: setBeatmapsTabIndex
        },
        {
            num: 3,
            title: 'Loved',
            icon: 'bi-suit-heart-fill',
            count: userData.loved_beatmapset_count,
            setTabs: setBeatmapsTabIndex
        },
        {
            num: 4,
            title: 'Guest',
            icon: 'bi-person-lines-fill',
            count: userData.guest_beatmapset_count,
            setTabs: setBeatmapsTabIndex
        },
        {
            num: 5,
            title: 'Graveyard',
            icon: 'bi-x-circle',
            count: userData.graveyard_beatmapset_count,
            setTabs: setBeatmapsTabIndex
        },
        {
            num: 6,
            title: 'Nominated',
            icon: 'bi-trophy-fill',
            count: userData.nominated_beatmapset_count,
            setTabs: setBeatmapsTabIndex
        },
        {
            num: 7,
            title: 'Pending',
            icon: 'bi-hourglass-bottom',
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
        <>
            <div className="d-flex" style={{ backgroundImage: `url(${userData.cover_url})`, backgroundSize: "cover" }}>
                <div className="flex-grow-1" style={{ backgroundColor: "#00000099", backdropFilter: "blur(4px)" }}>
                    <div className="d-flex flex-row flex-wrap gap-5 p-4">
                        <div className="d-flex flex-column justify-content-center gap-2">
                            <img src={userData.avatar_url}
                                onError={addDefaultSrc}
                                alt='pfp' className="rounded-5 mb-3"
                                style={{ width: 256, height: 256 }} />
                            <div className="d-flex flex-row gap-2 align-items-center">
                                <div>{userData.statistics.level.current}</div>
                                <div className="progress flex-grow-1" style={{ height: 4 }}>
                                    <div className="progress-bar bg-warning"
                                        style={{ width: `${userData.statistics.level.progress}%` }}></div>
                                </div>
                                <div>{userData.statistics.level.current + 1}</div>
                            </div>
                            <div className="text-center h6"
                                data-tooltip-id="tooltip"
                                data-tooltip-content={moment(userData.join_date).fromNow()}>
                                Joined at {moment(userData.join_date).format("DD/MM/YYYY")}
                            </div>
                        </div>
                        <div className="d-flex flex-row justify-content-between flex-grow-1">
                            <div className="d-flex flex-column gap-2">
                                <div className="d-flex flex-row gap-3 align-items-center">
                                    <a className="h1 m-0 d-flex flex-row align-items-center gap-2 text-decoration-none"
                                        target={"_blank"}
                                        href={`https://osu.ppy.sh/users/${userData.id}`}>
                                        {userData.username}
                                    </a>
                                    {userData.groups.map((group: UserGroup, index: number) =>
                                        <GroupBadge group={group}
                                            key={index + 1} />
                                    )}
                                    {userData.is_supporter && <SupporterIcon size={32} />}
                                </div>
                                <div className="profileTitle">{userData.title}</div>
                                <div data-tooltip-id="tooltip"
                                    data-tooltip-html={`${maniaG}`}
                                    className="d-flex flex-column gap-1">
                                    <div className="h6">Global Rank:</div>
                                    <div className="h3 d-flex flex-row align-items-center gap-2">
                                        <i className="bi bi-globe2"></i>
                                        <div>#{userData.statistics.global_rank?.toLocaleString()}</div>
                                    </div>
                                </div>
                                <div data-tooltip-id="tooltip"
                                    data-tooltip-html={`${maniaC}`}
                                    className="d-flex flex-column gap-1">
                                    <div className="h6">Country Rank:</div>
                                    <div className="h4 d-flex flex-row align-items-center gap-2">
                                        <CountryShape code={userData.country.code} width={32} height={32} />
                                        <div>#{userData.statistics.country_rank?.toLocaleString()}</div>
                                        <ReactCountryFlag countryCode={userData.country.code}
                                            data-tooltip-id="tooltip"
                                            data-tooltip-content={userData.country.name} />
                                    </div>
                                </div>
                                <div data-tooltip-id="tooltip"
                                    data-tooltip-html={`${maniaPP}`}
                                    className="d-flex flex-column gap-1">
                                    <div className="h6">Performance:</div>
                                    <div className="h4 d-flex flex-row align-items-center gap-2">
                                        <div>{Math.round(userData.statistics.pp).toLocaleString()}pp</div>
                                    </div>
                                </div>
                                <div className="d-flex flex-column gap-1">
                                    <div className="h6">Accuracy:</div>
                                    <div className="h4 d-flex flex-row align-items-center gap-2">
                                        <div>{(userData.statistics.hit_accuracy).toFixed(2)}%</div>
                                    </div>
                                </div>
                                <div className="d-flex flex-column gap-1">
                                    <div className="h6">Play Time:</div>
                                    <div className="h4 d-flex flex-row align-items-center gap-2">
                                        <i className="bi bi-clock"></i>
                                        <div data-tooltip-id="tooltip"
                                            data-tooltip-content={secondsToTime(userData.statistics.play_time)}>
                                            {Math.round((userData.statistics.play_time / 60 / 60)).toLocaleString()}h
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-column gap-2">
                                <ModeSelector mode={gameMode} userId={userData.id} />
                                <div className="d-flex flex-row align-items-center gap-3">
                                    <div className="h5 d-flex flex-column align-items-center">
                                        <div style={{ color: colors.ranks.xh }}>XH</div>
                                        <div>{userData.statistics.grade_counts.ssh}</div>
                                    </div>
                                    <div className="h5 d-flex flex-column align-items-center">
                                        <div style={{ color: colors.ranks.x }}>X</div>
                                        <div>{userData.statistics.grade_counts.ss}</div>
                                    </div>
                                    <div className="h5 d-flex flex-column align-items-center">
                                        <div style={{ color: colors.ranks.sh }}>SH</div>
                                        <div>{userData.statistics.grade_counts.sh}</div>
                                    </div>
                                    <div className="h5 d-flex flex-column align-items-center">
                                        <div style={{ color: colors.ranks.s }}>S</div>
                                        <div>{userData.statistics.grade_counts.s}</div>
                                    </div>
                                    <div className="h5 d-flex flex-column align-items-center">
                                        <div style={{ color: colors.ranks.a }}>A</div>
                                        <div>{userData.statistics.grade_counts.a}</div>
                                    </div>
                                </div>
                                <div className="d-flex flex-column gap-1">
                                    <div className="h6">Ranked Score:</div>
                                    <div className="h3 d-flex flex-row align-items-center gap-2">
                                        <i className="bi bi-chevron-double-up"></i>
                                        <div data-tooltip-id="tooltip"
                                            data-tooltip-content={`Total Score: ${userData.statistics.total_score.toLocaleString()}`}>
                                            {(userData.statistics.ranked_score).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex flex-column gap-1">
                                    <div className="h6">Max Combo:</div>
                                    <div className="h4 d-flex flex-row align-items-center gap-2">
                                        <i className="bi bi-fire"></i>
                                        <div>{userData.statistics.maximum_combo.toLocaleString()}x</div>
                                    </div>
                                </div>
                                <div className="d-flex flex-column gap-1">
                                    <div className="h6">Play Count:</div>
                                    <div className="h4 d-flex flex-row align-items-center gap-2">
                                        <i className="bi bi-arrow-counterclockwise"></i>
                                        <div>{userData.statistics.play_count.toLocaleString()}</div>
                                    </div>
                                </div>
                                <div className="d-flex flex-column gap-1">
                                    <div className="h6">Hits x Play:</div>
                                    <div className="h4 d-flex flex-row align-items-center gap-2">
                                        <i className="bi bi-x"></i>
                                        <div>{Math.round((userData.statistics.count_50 + userData.statistics.count_100 + userData.statistics.count_300) / userData.statistics.play_count)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="d-flex flex-row flex-wrap gap-2 px-5 py-4 align-items-center justify-content-start">
                        {userData.badges.map((badge: UserBadge, index: number) =>
                            <Badge badge={badge} key={index + 1} />
                        )}
                    </div>
                </div>
            </div>
            <div className="p-4 m-0 d-flex flex-row flex-wrap align-items-center gap-3 h6 shadow darkColor">
                <div className="d-flex flex-row align-items-center gap-2">
                    <i className="bi bi-people-fill"></i>
                    <div>Followers: {userData.follower_count.toLocaleString()}</div>
                </div>
                {userData.discord !== null &&
                    <div className="d-flex flex-row align-items-center gap-2">
                        <i className="bi bi-discord"></i>
                        <div>{userData.discord}</div>
                    </div>}
                {userData.twitter !== null && <div className="d-flex flex-row align-items-center gap-2">
                    <i className="bi bi-twitter"></i>
                    <div>{userData.twitter}</div>
                </div>}
                {userData.website !== null && <div className="d-flex flex-row align-items-center gap-2">
                    <i className="bi bi-globe"></i>
                    <div>{userData.website}</div>
                </div>}
                {userData.discord !== null && <div className="d-flex flex-row align-items-center gap-2">
                    <i className="bi bi-geo-alt-fill"></i>
                    <div>{userData.location}</div>
                </div>}
                {userData.interests !== null && <div className="d-flex flex-row align-items-center gap-2">
                    <i className="bi bi-suit-heart-fill"></i>
                    <div>{userData.interests}</div>
                </div>}
                {userData.occupation !== null && <div className="d-flex flex-row align-items-center gap-2">
                    <i className="bi bi-buildings"></i>
                    <div>{userData.occupation}</div>
                </div>}
            </div>
            <div className="row gap-4 p-4 justify-content-center">
                <div className="col-12 col-xl-7 d-flex flex-column gap-4 p-0 m-0" ref={div1Ref}>
                    <div className="rounded-3 overflow-hidden darkColor shadow">
                        <div className="h4 p-2 m-0 titleColor d-flex flex-row gap-2 justify-content-center">
                            <i className="bi bi-graph-up"></i>
                            <div>History</div>
                        </div>
                        <nav className="row">
                            {userData.db_info.global_rank?.length > 0 &&
                                <button
                                    className={`col border-0 rounded-0 p-2 d-flex flex-row gap-2 align-items-center justify-content-center ${historyTabIndex === 1 ? 'accentColor' : 'midColor'}`}
                                    onClick={() => setHistoryTabIndex(1)}>
                                    <i className="bi bi-globe2"></i>
                                    <div>Global Rank</div>
                                </button>}
                            {userData.db_info.country_rank?.length > 0 &&
                                <button
                                    className={`col border-0 rounded-0 p-2 d-flex flex-row gap-2 align-items-center justify-content-center ${historyTabIndex === 2 ? 'accentColor' : 'midColor'}`}
                                    onClick={() => setHistoryTabIndex(2)}>
                                    <CountryShape code={userData.country.code} width={24} height={24} />
                                    <div>Country Rank</div>
                                </button>}
                            {userData.monthly_playcounts?.length > 0 &&
                                <button
                                    className={`col border-0 rounded-0 p-2 d-flex flex-row gap-2 align-items-center justify-content-center ${historyTabIndex === 3 ? 'accentColor' : 'midColor'}`}
                                    onClick={() => setHistoryTabIndex(3)}>
                                    <i className="bi bi-arrow-counterclockwise"></i>
                                    <div>Play Count</div>
                                </button>}
                            {userData.replays_watched_counts?.length > 0 &&
                                <button
                                    className={`col border-0 rounded-0 p-2 d-flex flex-row gap-2 align-items-center justify-content-center ${historyTabIndex === 4 ? 'accentColor' : 'midColor'}`}
                                    onClick={() => setHistoryTabIndex(4)}>
                                    <i className="bi bi-arrow-counterclockwise"></i>
                                    <div>Replays Watched</div>
                                </button>}
                        </nav>
                        <div style={{ height: 250 }} className="d-flex justify-content-center align-items-center">
                            <div className="flex-grow-1 p-3" hidden={historyTabIndex !== 1}
                                style={{ height: 250 }}>
                                <Line data={globalHistoryData} options={lineOptionsReverse} />
                            </div>
                            <div className="flex-grow-1 p-3 text-center h1" hidden={historyTabIndex !== 2}
                                style={{ height: 250 }}>
                                <Line data={countryHistoryData} options={lineOptionsReverse} />
                            </div>
                            <div className="flex-grow-1 p-3" hidden={historyTabIndex !== 3}
                                style={{ height: 250 }}>
                                <Line data={playsHistoryData} options={lineOptions} />
                            </div>
                            <div className="flex-grow-1 p-3" hidden={historyTabIndex !== 4}
                                style={{ height: 250 }}>
                                <Line data={replaysHistoryData} options={lineOptions} />
                            </div>
                        </div>
                    </div>
                    <div className="rounded-3 overflow-hidden darkColor shadow">
                        <div className="h4 p-2 m-0 titleColor d-flex flex-row gap-2 justify-content-center">
                            <i className="bi bi-bar-chart-line"></i>
                            <div>Top Play Stats</div>
                        </div>
                        <div className="p-3">
                            <TopScoresPanel data={userData} best={bestScores} />
                        </div>
                    </div>
                </div>
                <div
                    className="col-12 col-xl-4 overflow-hidden d-flex flex-column rounded-3 overflow-hidden darkColor shadow p-0 m-0"
                    ref={div2Ref} style={{ height: div1Height }}>
                    <div className="h4 p-2 m-0 row titleColor align-items-center">
                        <div className="col-2"></div>
                        <div className="col-8 d-flex flex-row gap-2 align-items-center justify-content-center">
                            <i className="bi bi-controller"></i>
                            <div>Scores</div>
                        </div>
                        <div className="col-2 d-flex justify-content-end">
                            <button className="btn darkenOnHover m-0 p-0"
                                onClick={() => {
                                    getScores(userData.id, gameMode, false);
                                }}>
                                <i className="bi bi-arrow-clockwise"></i>
                            </button>
                        </div>
                    </div>
                    <nav className="row">
                        {scoresTabs.map((tab: tabInterface, i: number) => tab.count > 0 &&
                            <button
                                className={`col border-0 rounded-0 p-2 d-flex flex-row gap-2 align-items-center justify-content-center ${scoresTabIndex === tab.num ? 'accentColor' : 'midColor'}`}
                                onClick={() => tab.setTabs(tab.num)} key={i + 1}>
                                <i className={`bi ${tab.icon}`}></i>
                                <div>{tab.title}</div>
                                <div className="badge darkColor rounded-pill">{tab.count}</div>
                            </button>)}
                    </nav>
                    <div className="flex-grow-1 overflow-y-scroll overflow-x-hidden">
                        {scoresData.map((dat: dataInterface, i: number) =>
                            <div hidden={dat.tab !== dat.num} key={i + 1}>
                                {dat.maps.length === 0 && dat.count !== 0 &&
                                    <Spinner animation="border" role="status" className="mx-auto mt-4">
                                        <div className="visually-hidden">Loading...</div>
                                    </Spinner>}
                                {(dat.maps as Score[])[0]?.ended_at &&
                                    (dat.maps as Score[]).map((score: Score, index: number) =>
                                        <ScoreCard index={index + 1} score={score} key={index + 1} />)}
                                {dat.maps.length < dat.count &&
                                    <button
                                        className="btn btn-success d-flex flex-row gap-2 justify-content-center w-100 rounded-0"
                                        onClick={() => getThings(userData.id, gameMode, dat.group, dat.thing, dat.maps.length, beatmapReqLimit, dat.maps, dat.setMore)}>
                                        <i className="bi bi-caret-down-fill"></i>
                                        <div>Expand</div>
                                        <i className="bi bi-caret-down-fill"></i>
                                    </button>}
                            </div>)}
                    </div>
                </div>
                <div
                    className="col-12 col-xl-4 overflow-hidden d-flex flex-column rounded-3 overflow-hidden darkColor shadow p-0 m-0"
                    ref={div2Ref} style={{ height: div1Height }}>
                    <div className="h4 p-2 m-0 row titleColor align-items-center">
                        <div className="col-2"></div>
                        <div className="col-8 d-flex flex-row gap-2 align-items-center justify-content-center">
                            <i className="bi bi-file-earmark-music"></i>
                            <div>Beatmaps</div>
                        </div>
                        <div className="col-2 d-flex justify-content-end">
                            <button className="btn darkenOnHover m-0 p-0"
                                onClick={() => {
                                    getBeatmaps(userData.id, gameMode, false);
                                }}>
                                <i className="bi bi-arrow-clockwise"></i>
                            </button>
                        </div>
                    </div>
                    <nav className="row">
                        {beatmapsTabs.map((tab: tabInterface, i: number) => tab.count > 0 &&
                            <button
                                className={`col border-0 rounded-0 p-2 d-flex flex-row gap-2 align-items-center justify-content-center ${beatmapsTabIndex === tab.num ? 'accentColor' : 'midColor'}`}
                                onClick={() => tab.setTabs(tab.num)} key={i + 1}>
                                <i className={`bi ${tab.icon}`}></i>
                                <div>{tab.title}</div>
                                <div className="badge darkColor rounded-pill">{tab.count}</div>
                            </button>)}
                    </nav>
                    <div className="flex-grow-1 overflow-y-scroll overflow-x-hidden">
                        {beatmapsData.map((dat: dataInterface, i: number) =>
                            <div hidden={dat.tab !== dat.num} key={i + 1}>
                                {dat.maps.length === 0 && dat.count !== 0 &&
                                    <Spinner animation="border" role="status" className="mx-auto mt-4">
                                        <div className="visually-hidden">Loading...</div>
                                    </Spinner>}
                                {(dat.maps as BeatmapSet[])[0]?.title &&
                                    (dat.maps as BeatmapSet[]).map((beatmapset: BeatmapSet, index: number) =>
                                        <BeatmapsetCard index={index + 1} data={beatmapset} key={index + 1} />)}
                                {dat.maps.length < dat.count &&
                                    <button
                                        className="btn btn-success d-flex flex-row gap-2 justify-content-center w-100 rounded-0"
                                        onClick={() => getThings(userData.id, gameMode, dat.group, dat.thing, dat.maps.length, beatmapReqLimit, dat.maps, dat.setMore)}>
                                        <i className="bi bi-caret-down-fill"></i>
                                        <div>Expand</div>
                                        <i className="bi bi-caret-down-fill"></i>
                                    </button>}
                            </div>)}
                    </div>
                </div>
                <div className="col-12 col-xl-7 d-flex flex-column gap-4 p-0 m-0" ref={div2Ref}
                    style={{ height: div1Height }}>
                    <div className="rounded-3 overflow-hidden darkColor shadow p-0 d-flex flex-column">
                        <div className="h4 p-2 m-0 titleColor d-flex flex-row gap-2 justify-content-center">
                            <i className="bi bi-award"></i>
                            <div>Medals</div>
                        </div>
                        <div className="flex-grow-1 overflow-y-scroll overflow-x-hidden">
                            <div className="row">
                                <div className="col-12 col-lg p-0">
                                    <div className="text-center p-2 h5 midColor">
                                        Recent Medals
                                    </div>
                                    <div className="p-3 pt-2">
                                        <div className="d-flex flex-row justify-content-between pb-1 px-2"
                                            style={{ fontSize: 14, top: -8 }}>
                                            <div>most recent</div>
                                            <div>least recent</div>
                                        </div>
                                        <div
                                            className="d-flex flex-row gap-1 overflow-hidden backgroundColor p-3 rounded">
                                            {lastMedals.map((medal: MedalInterface, index: number) => (
                                                <Medal thisMedal={medal} userMedals={userData.user_achievements}
                                                    key={index} />))}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-2 p-0">
                                    <div className="text-center p-2 h5 midColor">
                                        Rarest Medal
                                    </div>
                                    <div className="p-3 pt-2">
                                        <div className="pb-1 px-2 text-center"
                                            style={{ fontSize: 14, top: -8 }}>
                                            Rarity: {parseFloat(rarestMedal?.Rarity ? rarestMedal.Rarity : '0').toFixed(2)}%
                                        </div>
                                        <div className="backgroundColor p-3 rounded d-grid justify-content-center">
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
                                            className="text-center p-2 d-flex flex-row justify-content-center align-items-center midColor">
                                            <div className="h5 m-0 text-center">
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
                                                className="d-flex flex-row flex-wrap gap-1 justify-content-center backgroundColor p-3 rounded">
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
    }

    async function getUser(mode: GameModeType) {
        const res = await axios.post('/user', {
            id: urlUser,
            mode: mode
        })
        const data: userData = res.data;
        if (!data.id) return;
        if (data.is_bot) return;
        console.log(data);
        let searchMode: GameModeType;
        if (mode === "default") {
            searchMode = data.playmode;
        } else {
            searchMode = mode;
        }
        window.history.pushState({}, '', `/users/${data.id}/${searchMode}`);
        setUserData(data);
        setGameMode(searchMode);
        getScores(data.id, searchMode, true);
        getBeatmaps(data.id, searchMode, true);
        setHistoryTab(data.replays_watched_counts?.length, data.monthly_playcounts?.length, data.db_info.country_rank?.length, data.db_info.global_rank?.length);
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
        if (offset === 0) console.log(`get more ${thing}`, url);
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

    function getGlobalLabels(): string[] {
        if (!userData?.db_info.global_rank) return [];
        return userData?.db_info.global_rank.map(obj => moment(obj.date).format('DD MMM YYYY'));
    }

    function getGlobalData(): number[] {
        if (!userData?.db_info.global_rank) return [];
        return userData?.db_info.global_rank.map(obj => obj.rank);
    }

    function getCountryLabels(): string[] {
        if (!userData?.db_info.country_rank) return [];
        return userData?.db_info.country_rank.map(obj => moment(obj.date).format('DD MMM YYYY'));
    }

    function getCountryData(): number[] {
        if (!userData?.db_info.country_rank) return [];
        return userData?.db_info.country_rank.map(obj => obj.rank);
    }

    function getPlaysData(): number[] {
        if (!userData) {
            return [];
        }
        return userData.monthly_playcounts.map((obj: MonthlyData) => obj.count);
    }

    function getPlaysLabels(): string[] {
        if (!userData) {
            return [];
        }
        return userData.monthly_playcounts.map((obj: MonthlyData) => {
            return moment(new Date(obj.start_date)).format('MMM YYYY');
        });
    }

    function getReplaysData(): number[] {
        if (!userData) {
            return [];
        }
        return userData.replays_watched_counts.map((obj: MonthlyData) => obj.count);
    }

    function getReplaysPlaysLabels(): string[] {
        if (!userData) {
            return [];
        }
        return userData.replays_watched_counts.map((obj: MonthlyData) => {
            return moment(new Date(obj.start_date)).format('MMM YYYY');
        });
    }

    function setHistoryTab(replays: number, plays: number, country: number, global: number): void {
        let tab: number = 0;
        if (replays > 0) tab = 4;
        if (plays > 0) tab = 3;
        if (country > 0) tab = 2;
        if (global > 0) tab = 1;
        setHistoryTabIndex(tab);
    }

    function generateStatisticsMarkup(userData: userData | null, type: string) {
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

        return `<div class="d-flex flex-column g-2">${markup}</div>`;
    }
}
export default UserPage;