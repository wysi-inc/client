import { useEffect, useState } from "react";
import moment from "moment";

import { Radar } from "react-chartjs-2";
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import Twemoji from 'react-twemoji';

import { FaRegClock, FaCalculator, FaAngleDoubleUp, FaUsers, FaTwitter, FaDiscord, FaUndo, FaMapMarkerAlt, FaHeart, FaGlobe, FaGlobeAfrica, FaRegBuilding, FaFireAlt, FaQuestion } from "react-icons/fa";

import Badge from "./u_comp/Badge";
import GroupBadge from "./u_comp/GroupBadge";
import BarPieChart from "./u_comp/BarPieChart";
import CountryShape from "./u_comp/CountryShape";
import ModeSelector from "./u_comp/ModeSelector";
import SupporterIcon from "./u_comp/SupporterIcon";
import CountryFlag from "./u_comp/CountryFlag";
import { addDefaultSrc, secondsToTime } from "../resources/functions";
import { GameModeType } from "../resources/types";

import { Score } from "../resources/interfaces/score";
import { User, UserBadge, UserGroup } from "../resources/interfaces/user";

import { alertManager, alertManagerInterface, colors } from "../resources/store/tools";
import { BeatmapsObj, ScoresObj, scoreCategoryType, } from "./u_interfaces";
import SetupPanel from "./u_panels/SetupPanel";
import HistoryPanel from "./u_panels/HistoryPanel";
import MedalsPanel from "./u_panels/MedalsPanel";
import ScoresPanel from "./u_panels/ScoresPanel";
import BeatmapsPanel from "./u_panels/BeatmapsPanel";
import { BarPieChartData } from "./u_panels/setup_comp/TopScoresPanel";
import { GlobalSettings, GlobalSettingsInterface } from "../env";

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

const UserPage = (props: UserPageProps) => {
    const settings = GlobalSettings((state: GlobalSettingsInterface) => state);

    const addAlert = alertManager((state: alertManagerInterface) => state.addAlert);

    const [userData, setUserData] = useState<User | null | undefined>(undefined);
    const [gameMode, setGameMode] = useState<GameModeType>('osu');

    const [scores, setScores] = useState<ScoresObj>(SCORES_INITIAL);
    const [beatmaps, setBeatmaps] = useState<BeatmapsObj>(BEATMAPS_INITIAL);

    useEffect((): void => {
        clearData();
        getUser();
    }, [props.userId, props.userMode]);

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
    const scoresRanksLabels: BarPieChartData[] = [
        { label: 'XH', color: colors.ranks.xh, value: userData.statistics.grade_counts.ssh },
        { label: 'X', color: colors.ranks.x, value: userData.statistics.grade_counts.ss },
        { label: 'SH', color: colors.ranks.sh, value: userData.statistics.grade_counts.sh },
        { label: 'S', color: colors.ranks.s, value: userData.statistics.grade_counts.sh },
        { label: 'A', color: colors.ranks.a, value: userData.statistics.grade_counts.a },
    ];

    const css = "flex overflow-hidden flex-col col-span-5 rounded-lg drop-shadow-lg bg-custom-950 xl:col-span-";
    const height = 700;

    return (<>
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
        </div >
        <div className="flex flex-row flex-wrap gap-4 items-center p-4 m-0 drop-shadow-lg bg-custom-800">
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
            <div className="flex overflow-hidden flex-col col-span-5 rounded-lg drop-shadow-lg bg-custom-950 xl:col-span-2">
                <div className="flex flex-row gap-2 justify-center items-center p-2 bg-custom-800">
                    <FaQuestion />
                    <div>Dont know yet</div>
                </div>
                <div className="flex flex-col gap-3 p-3">

                </div>
            </div>
            <SetupPanel user={userData} />
            <HistoryPanel user={userData} best={scores.best} height={height} css={css + 3} />
            <ScoresPanel user={userData} mode={gameMode} scores={scores} setScores={setScores} heigth={height} css={css + 2} />
            <BeatmapsPanel user={userData} beatmaps={beatmaps} setBeatmaps={setBeatmaps} height={height} css={css + 2} />
            <MedalsPanel user={userData} heigth={height} css={css + 3} />
        </div>
    </>)

    function clearData(): void {
        setUserData(undefined);
        setGameMode('default');
        setScores(SCORES_INITIAL);
        setBeatmaps(BEATMAPS_INITIAL);
    }

    async function getUser() {
        try {
            const r = await fetch(`${settings.api_url}/user`, {
                ...settings.fetch_settings,
                body: JSON.stringify({
                    id: props.userId,
                    mode: props.userMode,
                })
            })
            const d = await r.json();
            console.log(d)
            if (d.error === null) {
                setUserData(null);
                addAlert('warning', "This user doesn't exist");
                return;
            };
            const user: User = d;
            if (user.is_bot) {
                addAlert('warning', 'This user is a bot, bots are not supported yet :(');
                setUserData(null);
                return;
            };
            setUserData(d);
            let searchMode: GameModeType;

            if (props.userMode === "default") searchMode = user.playmode;
            else searchMode = props.userMode;

            window.history.replaceState({}, '', `/users/${user.id}/${searchMode}`);

            getBest(user.id, searchMode, 'best', 100, 0);
            setGameMode(searchMode);
        } catch (err) {
            addAlert('warning', "This user doesn't exist");
            console.error(err);
            setUserData(null);
        }
    }

    async function getBest(id: number, m: GameModeType, t: scoreCategoryType, l: number, o: number) {
        try {
            const r = await fetch(`${settings.api_url}/userscores`, {
                ...settings.fetch_settings,
                body: JSON.stringify({
                    id: id,
                    mode: m,
                    limit: l,
                    offset: o,
                    type: t
                })
            });
            const d: Score[] = await r.json();
            if (d.length < 1) return;
            setScores((prev) => ({ ...prev, best: [...prev.best, ...d] }));
        } catch (err) {
            console.error(err);
        }
    }

}
export default UserPage;