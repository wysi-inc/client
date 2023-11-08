import { addDefaultSrc, secondsToTime } from "../../resources/global/functions";
import { colors, playerStore, PlayerStoreInterface } from "../../resources/global/tools";
import ModIcon from "./s_comp/ModIcon";
import moment from "moment/moment";
import StatusBadge from "../beatmaps/b_comp/StatusBadge";
import { FaHeadphonesAlt, FaDownload, FaFileDownload, FaStar, FaRegClock, FaItunesNote } from "react-icons/fa";
import { Score } from "../../resources/types/score";
import { Link } from "react-router-dom";
import { useStats } from "../../resources/hooks/scoreHooks";

interface Props {
    index: number;
    score: Score;
}

const ScoreCard = (p: Props) => {
    const play = playerStore((state: PlayerStoreInterface) => state.play);

    const stats = useStats(p.score.beatmap, parseFloat((p.score.accuracy * 100).toFixed(2)) * 1, p.score.mods);

    const b = p.score.beatmapset;

    const listImg = `https://assets.ppy.sh/beatmaps/${b.id}/covers/list.jpg?${b.id}`;
    const coverImg = `https://assets.ppy.sh/beatmaps/${b.id}/covers/cover.jpg?${b.id}`;

    return (
        <div className="bg-custom-600 rounded-lg flex flex-row card">
            <div className="flex-col justify-between items-center rounded-lg p-1 card_controls">
                <div>
                    #{p.index + 1}
                </div>
                <button className="btn btn-ghost btn-circle btn-sm"
                    onClick={() => play(b.id, b.title, b.artist)}>
                    <FaHeadphonesAlt />
                </button>
                <a href={`https://catboy.best/d/${b.id}`}
                    className="tooltip" data-tip="download">
                    <button className="btn btn-ghost btn-circle btn-sm">
                        <FaDownload />
                    </button>
                </a>
                <a href={`osu://b/${p.score.beatmap.id}`}
                    className="tooltip" data-tip="osu!direct">
                    <button className="btn btn-ghost btn-circle btn-sm">
                        <FaFileDownload />
                    </button>
                </a>
            </div>
            <div className="bg-custom-900 flex flex-col rounded-lg grow gap-3 p-3">
                <div className="flex flex-row items-center justify-between gap-3">
                    <div className="flex flex-row gap-3 grow">
                        <img src={listImg}
                            onError={addDefaultSrc}
                            alt="cover" className="rounded-lg" loading="lazy"
                            style={{ width: 120, height: 84, objectFit: 'cover' }} />
                        <div className="flex flex-col gap-2 grow">
                            <div className="flex flex-row gap-2 items-center justify-between">
                                <div className="flex flex-row flex-wrap gap-2 items-center border-b">
                                    <Link to={`/beatmaps/${b.id}/${p.score.beatmap.id}`}
                                        className="text-xl text-decoration-none">
                                        {b.title}
                                    </Link>
                                    <div className="text-sm">by {b.artist}</div>
                                </div>
                            </div>
                            <div className="flex flex-row gap-2 text-sm">
                                <StatusBadge status={b.status} />
                                <div>[{p.score.beatmap.version}]</div>
                            </div>
                            <Link to={`/users/${b.user_id}`} className="inline-block text-sm">
                                Mapper: {b.creator}
                            </Link>
                        </div>
                    </div>
                    <div style={{
                        fontSize: 64,
                        height: 64,
                        marginTop: -32,
                        color: (colors.ranks as any)[p.score.rank.toLowerCase()]
                    }} className="col-span-1 font-semibold me-2">
                        <div className="text-end">{p.score.rank}</div>
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row flex-wrap items-center gap-4"
                        style={{ fontSize: 14 }}>
                        <div className="flex flex-row items-center gap-1">
                            <FaStar />
                            {stats.sr}
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <FaRegClock />
                            {secondsToTime(stats.len)}
                        </div>
                        <div>{stats.bpm}bpm</div>
                        <div>CS: {stats.cs}</div>
                        <div>AR: {stats.ar}</div>
                        <div>OD: {stats.od}</div>
                        <div>HP: {stats.hp}</div>
                    </div>
                    <div data-tip={moment(p.score.created_at).format('DD MMM YYYY')}>
                        {moment(p.score.created_at).fromNow()}
                    </div>
                </div>
                <div className="flex flex-row items-center justify-between"
                    style={{ fontSize: 16 }}>
                    <div className="flex flex-row gap-4">
                        <div>{(p.score.accuracy * 100).toFixed(2)}%</div>
                        <div>{p.score.max_combo}x</div>
                        <div>{p.score.score.toLocaleString()}</div>
                        <div>|</div>
                        {p.score.mode !== 'osu' && p.score.statistics.count_geki !== 0 &&
                            <div style={{ color: colors.judgements.x320 }}>
                                {p.score.statistics.count_geki}
                            </div>}
                        {p.score.statistics.count_300 &&
                            <div style={{ color: colors.judgements.x300 }}>
                                {p.score.statistics.count_300}
                            </div>}
                        {p.score.mode !== 'osu' && p.score.statistics.count_katu !== 0 &&
                            <div style={{ color: colors.judgements.x200 }}>
                                {p.score.statistics.count_katu}
                            </div>}
                        {p.score.statistics.count_100 !== 0 &&
                            <div style={{ color: colors.judgements.x100 }}>
                                {p.score.statistics.count_100}
                            </div>}
                        {p.score.statistics.count_50 !== 0 &&
                            <div style={{ color: colors.judgements.x50 }}>
                                {p.score.statistics.count_50}
                            </div>}
                        {p.score.statistics.count_miss !== 0 &&
                            <div style={{ color: colors.judgements.xMiss }}>
                                {p.score.statistics.count_miss}
                            </div>}
                    </div>
                    <div className="flex flex-row gap-2 align-items-end">
                        <div className="flex flex-row gap-2 me-2">
                            {p.score.mods?.map((mod: string, i: number) =>
                                <ModIcon acronym={mod} size={24} key={i} />
                            )}
                        </div>
                        <div className="h5">{p.score.pp ? Math.round(parseInt(p.score.pp)) : 0}pp</div>
                        <div className="h6" style={{ color: '#cccccc' }}>{stats.pp !== undefined ? `(${stats.pp}pp if FC)` : `FC`}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScoreCard;