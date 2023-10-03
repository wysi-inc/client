import React, { useEffect, useState } from "react";
import { addDefaultSrc, secondsToTime } from "../resources/functions";
import { colors, playerStore, PlayerStoreInterface } from "../resources/store/tools";
import ModIcon from "./s_comp/ModIcon";
import moment from "moment/moment";
import StatusBadge from "../c_beatmaps/b_comp/StatusBadge";
import DiffIcon from "../c_beatmaps/b_comp/DiffIcon";
import { FaHeadphonesAlt, FaDownload, FaFileDownload, FaStar, FaRegClock, FaItunesNote } from "react-icons/fa";
import { Score } from "../resources/interfaces/score";
import { Link } from "react-router-dom";
import fina from "../helpers/fina";

interface ScoreProps {
    index: number;
    score: Score;
}

const ScoreCard = (props: ScoreProps) => {
    const play = playerStore((state: PlayerStoreInterface) => state.play);

    const stats = useStats(props.score);

    function playSong() {
        play(props.score.beatmapset.id, props.score.beatmapset.title, props.score.beatmapset.artist);
    }

    return (
        <div className="flex grow bg-custom-900"
            style={{ background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(https://assets.ppy.sh/beatmaps/${props.score.beatmapset.id}/covers/cover.jpg?${props.score.beatmapset.id}) center / cover no-repeat` }}>
            <div className="flex flex-col gap-2 p-3 grow"
                style={{ backdropFilter: "blur(2px)" }}>
                <div className="flex flex-row gap-3 justify-between items-center">
                    <div className="flex flex-row gap-3 grow">
                        <img src={`https://assets.ppy.sh/beatmaps/${props.score.beatmapset.id}/covers/list.jpg?${props.score.beatmapset.id}`}
                            onError={addDefaultSrc}
                            alt="cover" className="rounded-lg" loading="lazy"
                            style={{ height: 80, width: 60, objectFit: 'cover' }} />
                        <div className="flex flex-col gap-1 grow">
                            <div className="truncate">
                                <Link to={`/beatmaps/${props.score.beatmapset.id}/${props.score.beatmap.id}`}
                                    className="truncate text-light h5 text-decoration-none">
                                    {props.score.beatmapset.title}
                                </Link>
                            </div>
                            <div className="flex flex-row gap-2 items-center truncate text-light">
                                <div className="flex justify-center w-6">
                                    <FaItunesNote />
                                </div>
                                <div className="truncate">{props.score.beatmapset.artist}</div>
                            </div>
                            <div className="flex flex-row gap-2 items-center truncate text-light">
                                <img src={`https://a.ppy.sh/${props.score.beatmapset.user_id}`} className="w-6 h-6 rounded-md" alt="img" loading="lazy" onError={addDefaultSrc} />
                                <Link to={`/users/${props.score.beatmapset.user_id}`} className="inline-block">
                                    {props.score.beatmapset.creator}
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        fontSize: '74px',
                        lineHeight: '74px',
                        marginTop: -24,
                        color: (colors.ranks as any)[props.score.rank.toLowerCase()]
                    }} className="col-span-1 font-semibold">
                        <div className="text-end">{props.score.rank}</div>
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-4 items-center">
                        <div className="tooltip"
                            data-tip={moment(props.score.created_at).format('DD MMM YYYY')}>
                            {moment(props.score.created_at).fromNow()}
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 content-end items-center">
                        <div className="p-1">
                            #{props.index + 1}
                        </div>
                        <a href={`https://catboy.best/d/${props.score.beatmapset.id}`}
                            className="tooltip" data-tip="download">
                            <button className="btn btn-ghost btn-circle btn-sm">
                                <FaDownload />
                            </button>
                        </a>
                        <a href={`osu://b/${props.score.beatmap.id}`}
                            className="tooltip" data-tip="osu!direct">
                            <button className="btn btn-ghost btn-circle btn-sm">
                                <FaFileDownload />
                            </button>
                        </a>
                        <div className="tooltip" data-tip="listen">
                            <button className="btn btn-ghost btn-circle btn-sm"
                                onClick={playSong}>
                                <FaHeadphonesAlt />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row flex-wrap gap-4 items-center"
                    style={{ fontSize: 14 }}>
                    <div className="flex flex-row gap-1 items-center">
                        <FaStar />
                        {stats.sr}
                    </div>
                    <div className="flex flex-row gap-1 items-center">
                        <FaRegClock />
                        {secondsToTime(stats.len)}
                    </div>
                    <div className="flex flex-row gap-1 items-center">
                        {stats.bpm}bpm
                    </div>
                    <div>CS: {stats.cs}</div>
                    <div>AR: {stats.ar}</div>
                    <div>OD: {stats.od}</div>
                    <div>HP: {stats.hp}</div>
                </div>
                <div className="flex flex-row justify-between items-center"
                    style={{ fontSize: 16 }}>
                    <div className="flex flex-row gap-4">
                        <div>{(props.score.accuracy * 100).toFixed(2)}%</div>
                        <div>{props.score.max_combo}x</div>
                        <div>{props.score.score.toLocaleString()}</div>
                    </div>
                    <div className="flex flex-row gap-4">
                        {props.score.mode !== 'osu' && props.score.statistics.count_geki !== 0 &&
                            <div style={{ color: colors.judgements.x320 }}>
                                {props.score.statistics.count_geki}
                            </div>}
                        {props.score.statistics.count_300 &&
                            <div style={{ color: colors.judgements.x300 }}>
                                {props.score.statistics.count_300}
                            </div>}
                        {props.score.mode !== 'osu' && props.score.statistics.count_katu !== 0 &&
                            <div style={{ color: colors.judgements.x200 }}>
                                {props.score.statistics.count_katu}
                            </div>}
                        {props.score.statistics.count_100 !== 0 &&
                            <div style={{ color: colors.judgements.x100 }}>
                                {props.score.statistics.count_100}
                            </div>}
                        {props.score.statistics.count_50 !== 0 &&
                            <div style={{ color: colors.judgements.x50 }}>
                                {props.score.statistics.count_50}
                            </div>}
                        {props.score.statistics.count_miss !== 0 &&
                            <div style={{ color: colors.judgements.xMiss }}>
                                {props.score.statistics.count_miss}
                            </div>}
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center p-2 rounded-lg"
                    style={{ backgroundColor: '#ffffff22' }}>
                    <div className="flex flex-row gap-2 items-center">
                        <StatusBadge status={props.score.beatmapset.status} />
                        <DiffIcon diffId={props.score.beatmap.id} setId={props.score.beatmapset.id}
                            diff={props.score.beatmap.difficulty_rating} size={24}
                            mode={props.score.beatmap.mode} name={props.score.beatmap.version} />
                    </div>
                    <div className="flex flex-row gap-1 items-center fw-bold justify-content-end">
                        <div className="flex flex-row gap-2 me-2">
                            {props.score.mods?.map((mod: string, i: number) =>
                                <ModIcon acronym={mod} size={24} key={i} />
                            )}
                        </div>
                        <div className="flex flex-row gap-2 align-items-end">
                            <div className="h5">{props.score.pp ? Math.round(parseInt(props.score.pp)) : 0}pp</div>
                            <div className="h6" style={{ color: '#cccccc' }}>{stats.pp !== undefined ? `(${stats.pp}pp if FC)` : `FC`}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function useStats(score: Score) {

    interface INITIAL {
        pp: number | undefined,
        bpm: number,
        len: number,
        sr: number,
        ar: number,
        cs: number,
        od: number,
        hp: number,
    }
    
    const INITIAL_SET_STATS: INITIAL = {
        pp: undefined,
        bpm: score.beatmap.bpm,
        len: score.beatmap.total_length,
        sr: score.beatmap.difficulty_rating,
        ar: score.beatmap.ar,
        cs: score.beatmap.cs,
        od: score.beatmap.accuracy,
        hp: score.beatmap.drain,
    }

    const [stats, setStats] = useState(INITIAL_SET_STATS);

    useEffect(() => {
        getStats();
    }, [])

    async function getStats() {
        try {
            const acc = score.accuracy * 100;
            const d = await fina.nget(`https://catboy.best/api/meta/${score.beatmap.id}?misses=0&acc=${acc}&mods=${score.mods_id}`);
            d.pp[acc]?.pp && setStats(prev => ({ ...prev, pp: Math.round(d.pp[acc].pp) }))
            setStats(prev => ({ ...prev, sr: d.difficulty.stars.toFixed(2) }))
            setStats(prev => ({ ...prev, bpm: Math.round(d.map.bpm) }))

            setStats(prev => ({ ...prev, ar: d.map.ar.toFixed(1) }))
            setStats(prev => ({ ...prev, cs: d.map.cs.toFixed(1) }))
            setStats(prev => ({ ...prev, od: d.map.od.toFixed(1) }))
            setStats(prev => ({ ...prev, hp: d.map.hp.toFixed(1) }))

            if (score.mods.includes('DT')) setStats(prev => ({ ...prev, len: score.beatmap.total_length * 0.75 }));
            else if (score.mods.includes('HT')) setStats(prev => ({ ...prev, len: score.beatmap.total_length * 1.5 }));
            else setStats(prev => ({ ...prev, len: score.beatmap.total_length }));
        } catch (err) {
            console.error(err);
        }
    }

    return stats;
}

export default ScoreCard;