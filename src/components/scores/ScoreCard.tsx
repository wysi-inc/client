import moment from "moment/moment";
import { FaDownload, FaFileDownload, FaHeadphonesAlt, FaRegClock, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { addDefaultSrc, secondsToTime } from "../../resources/global/functions";
import { PlayerStoreInterface, colors, playerStore } from "../../resources/global/tools";
import { useStats } from "../../resources/hooks/scoreHooks";
import { Score } from "../../resources/types/score";
import DiffIcon from "../beatmaps/b_comp/DiffIcon";
import StatusBadge from "../beatmaps/b_comp/StatusBadge";
import ModIcon from "./s_comp/ModIcon";

interface Props {
    index: number;
    score: Score;
}

const ScoreCard = (p: Props) => {
    const play = playerStore((state: PlayerStoreInterface) => state.play);

    const stats = useStats(p.score.beatmap, parseFloat((p.score.accuracy * 100).toFixed(2)) * 1, p.score.mods);

    const b = p.score.beatmapset;

    const listImg = `https://assets.ppy.sh/beatmaps/${b.id}/covers/list.jpg?${b.id}`;

    const submitted_date = typeof b.submitted_date === "number" ? b.submitted_date * 1000 : b.submitted_date;

    return (
        <div className="flex flex-row rounded-lg card bg-custom-600">
            <div className="flex flex-col gap-3 p-3 rounded-lg shadow-xl grow bg-custom-900">
                <div className="flex flex-row items-center justify-between gap-3">
                    <div className="flex flex-row gap-3 grow">
                        <img src={listImg}
                            onError={addDefaultSrc}
                            alt="cover" className="rounded-lg" loading="lazy"
                            style={{ width: 120, height: 84, objectFit: 'cover' }} />
                        <div className="flex flex-col gap-2 grow">
                            <div className="flex flex-row items-center justify-between gap-2">
                                <Link to={`/beatmaps/${b.id}`}
                                    className="text-xl text-decoration-none">
                                    {b.title} <br /> <small>by {b.artist}</small>
                                </Link>
                            </div>
                            <div className="flex flex-row items-center gap-2 text-sm">
                                <Link to={`/users/${b.user_id}`} className="inline-block">
                                    Mapper: {b.creator}
                                </Link>
                                <div>|</div>
                                <div className="tooltip" data-tip={moment(submitted_date).format('DD MMM YYYY')}>
                                    {moment(submitted_date).fromNow()}
                                </div>
                            </div>
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
                <div className="flex flex-row items-center justify-between">
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
                        <div>{p.score.pp ? Math.round(parseInt(p.score.pp)) : 0}pp</div>
                        <div style={{ color: '#cccccc' }}>{stats.pp !== undefined ? `(${stats.pp}pp if FC)` : `FC`}</div>
                    </div>
                </div>
                <div className="flex flex-row items-center justify-between"
                    style={{ fontSize: 16 }}>
                    <div className="flex flex-row gap-2">
                        <StatusBadge status={b.status} />
                        <DiffIcon setId={b.id} diffId={p.score.beatmap.id}
                            diff={p.score.beatmap.difficulty_rating} size={24}
                            mode={p.score.beatmap.mode} name={p.score.beatmap.version} />
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
                    </div>
                    <div data-tip={moment(p.score.created_at).format('DD MMM YYYY')}>
                        {moment(p.score.created_at).fromNow()}
                    </div>

                </div>
            </div>
            <div className="flex flex-col items-center justify-between p-1 rounded-lg">
                <div>
                    #{p.index + 1}
                </div>
                <div className="tooltip" data-tip="listen">
                    <button className="btn btn-circle btn-ghost btn-sm"
                        onClick={() => play(b.id, b.title, b.artist)}>
                        <FaHeadphonesAlt />
                    </button>
                </div>
                <a href={`https://catboy.best/d/${b.id}`}
                    className="tooltip" data-tip="download">
                    <button className="btn btn-circle btn-ghost btn-sm">
                        <FaDownload />
                    </button>
                </a>
                <a href={`osu://b/${p.score.beatmap.id}`}
                    className="tooltip" data-tip="osu!direct">
                    <button className="btn btn-circle btn-ghost btn-sm">
                        <FaFileDownload />
                    </button>
                </a>
            </div>
        </div>
    );
}

export default ScoreCard;