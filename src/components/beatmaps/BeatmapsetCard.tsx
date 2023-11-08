import { forwardRef, Ref } from "react";

import moment from "moment";
import { Link } from "react-router-dom";

import { FaDownload, FaFileDownload, FaHeadphonesAlt, FaHeart, FaItunesNote, FaRegClock } from "react-icons/fa";

import DiffIcon from "./b_comp/DiffIcon";
import StatusBadge from "./b_comp/StatusBadge";
import { Beatmap, Beatmapset } from "../../resources/types/beatmapset";
import { addDefaultSrc, secondsToTime } from "../../resources/global/functions";
import { playerStore, PlayerStoreInterface } from "../../resources/global/tools";

interface Props {
    index: number,
    beatmapset: Beatmapset
}

const BeatmapsetCard = forwardRef((p: Props, ref?: Ref<HTMLDivElement>) => {
    
    const play = playerStore((state: PlayerStoreInterface) => state.play);

    const id = p.beatmapset.id;
    const listImg = `https://assets.ppy.sh/beatmaps/${id}/covers/list.jpg?${id}`;
    const coverImg = `https://assets.ppy.sh/beatmaps/${id}/covers/cover.jpg?${id}`;

    const submitted_date = typeof p.beatmapset.submitted_date === "number" ? p.beatmapset.submitted_date * 1000 : p.beatmapset.submitted_date;

    const b = p.beatmapset;

    return (
        <div className="card flex flex-row rounded-lg bg-custom-600">
            <div className="flex grow flex-col gap-3 rounded-lg bg-custom-900 p-3">
                <div className="flex flex-row items-center justify-between gap-3">
                    <div className="flex grow flex-row gap-3">
                        <img src={listImg}
                            onError={addDefaultSrc}
                            alt="cover" className="rounded-lg" loading="lazy"
                            style={{ width: 120, height: 84, objectFit: 'cover' }} />
                        <div className="flex grow flex-col gap-2">
                            <div className="flex flex-row items-center justify-between gap-2">
                                <Link to={`/beatmaps/${b.id}`}
                                    className="text-decoration-none text-xl">
                                    {b.title} <br/> <small>by {b.artist}</small>
                                </Link>
                                <div className="text-sm"></div>
                            </div>
                            <Link to={`/users/${b.user_id}`} className="inline-block text-sm">
                                Mapper: {b.creator}
                            </Link>
                            <div data-tip={moment(submitted_date).format('DD MMM YYYY')}>
                                {moment(submitted_date).fromNow()}
                            </div>
                        </div>
                    </div>

                </div>
                <div className="flex flex-row flex-wrap items-center justify-start gap-2">
                    <StatusBadge status={b.status} />
                    {p.beatmapset.beatmaps
                        .sort((a, b) => a.mode === b.mode ?
                            a.difficulty_rating - b.difficulty_rating :
                            a.mode_int - b.mode_int)
                        .map((beatmap: Beatmap, index: number) =>
                            <DiffIcon setId={id} diffId={beatmap.id}
                                key={index}
                                diff={beatmap.difficulty_rating} size={24}
                                mode={beatmap.mode} name={beatmap.version} />
                        )}
                </div>
            </div>
            <div className="card_controls flex-col items-center justify-between rounded-lg p-1">
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
                <a href={`osu://b/${b.beatmaps[0].id}`}
                    className="tooltip" data-tip="osu!direct">
                    <button className="btn btn-circle btn-ghost btn-sm">
                        <FaFileDownload />
                    </button>
                </a>
            </div>
        </div>
    )
})

export default BeatmapsetCard;