import moment from "moment";
import { Link } from "react-router-dom";

import { FaDownload, FaFileDownload, FaHeadphonesAlt, FaHeart, FaItunesNote, FaRegClock, FaUndo } from "react-icons/fa";

import DiffIcon from "./b_comp/DiffIcon";
import StatusBadge from "./b_comp/StatusBadge";
import { Beatmap, BeatmapPlays } from "../../resources/types/beatmapset";
import { addDefaultSrc, secondsToTime } from "../../resources/global/functions";
import { playerStore, PlayerStoreInterface } from "../../resources/global/tools";

interface Props {
    index: number,
    beatmap: BeatmapPlays
}

const BeatmapCard = (p: Props) => {

    const play = playerStore((state: PlayerStoreInterface) => state.play);

    const beatmap = p.beatmap.beatmap;
    const beatmapset = p.beatmap.beatmapset;

    const listImg = `https://assets.ppy.sh/beatmaps/${beatmapset.id}/covers/list.jpg?${beatmapset.id}`;
    const coverImg = `https://assets.ppy.sh/beatmaps/${beatmapset.id}/covers/cover.jpg?${beatmapset.id}`;

    const submitted_date = typeof beatmapset.submitted_date === "number" ? beatmapset.submitted_date * 1000 : beatmapset.submitted_date;

    return (
        <div className="flex flex-row rounded-lg card bg-custom-600">
            <div className="flex flex-col gap-3 p-3 rounded-lg shadow-xl grow bg-custom-900">
                <div className="flex flex-row justify-between gap-3">
                    <div className="flex flex-row gap-3 grow">
                        <img src={listImg}
                            onError={addDefaultSrc}
                            alt="cover" className="rounded-lg" loading="lazy"
                            style={{ width: 120, height: 84, objectFit: 'cover' }} />
                        <div className="flex flex-col gap-2 grow">
                            <div className="flex flex-row items-center justify-between gap-2">
                                <Link to={`/beatmaps/${beatmapset.id}/${beatmap.id}`}
                                    className="text-xl text-decoration-none">
                                    {beatmapset.title} <br /> <small>by {beatmapset.artist}</small>
                                </Link>
                            </div>
                            <div className="flex flex-row items-center gap-2 text-sm">
                                <Link to={`/users/${beatmapset.user_id}`} className="inline-block">
                                    Mapper: {beatmapset.creator}
                                </Link>
                                <div>|</div>
                                <div className="tooltip" data-tip={moment(submitted_date).format('DD MMM YYYY')}>
                                    {moment(submitted_date).fromNow()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-row items-center gap-2 text-xl">
                            <FaUndo /><div>{p.beatmap.count}</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row flex-wrap items-center justify-start gap-2">
                    <StatusBadge status={beatmapset.status} />
                    <DiffIcon setId={beatmapset.id} diffId={beatmap.id}
                        diff={beatmap.difficulty_rating} size={24}
                        mode={beatmap.mode} name={beatmap.version} />
                </div>
            </div>
            <div className="flex flex-col items-center justify-between p-1 rounded-lg">
                <div>
                    #{p.index + 1}
                </div>
                <div className="tooltip" data-tip="listen">
                    <button className="btn btn-circle btn-ghost btn-sm"
                        onClick={() => play(beatmapset.id, beatmapset.title, beatmapset.artist)}>
                        <FaHeadphonesAlt />
                    </button>
                </div>
                <a href={`https://catboy.best/d/${beatmapset.id}`}
                    className="tooltip" data-tip="download">
                    <button className="btn btn-circle btn-ghost btn-sm">
                        <FaDownload />
                    </button>
                </a>
                <a href={`osu://b/${beatmap.id}`}
                    className="tooltip" data-tip="osu!direct">
                    <button className="btn btn-circle btn-ghost btn-sm">
                        <FaFileDownload />
                    </button>
                </a>
            </div>
        </div>
    )
}

export default BeatmapCard;