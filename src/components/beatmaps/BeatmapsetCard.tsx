import { forwardRef, Ref } from "react";

import moment from "moment";
import { Link } from "react-router-dom";

import { ImSpinner11 } from "react-icons/im"
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
        <div className=" bg-custom-900 rounded-lg flex flex-row gap-3 p-3">
            <div className="bg-custom-600 flex flex-col justify-between items-center rounded-lg p-1">
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
                <a href={`osu://b/${b.beatmaps[0].id}`}
                    className="tooltip" data-tip="osu!direct">
                    <button className="btn btn-ghost btn-circle btn-sm">
                        <FaFileDownload />
                    </button>
                </a>
            </div>
            <div className="flex flex-col grow gap-3">
                <div className="flex flex-row items-center justify-between gap-3">
                    <div className="flex flex-row gap-3 grow">
                        <img src={listImg}
                            onError={addDefaultSrc}
                            alt="cover" className="rounded-lg" loading="lazy"
                            style={{ width: 120, height: 84, objectFit: 'cover' }} />
                        <div className="flex flex-col gap-2 grow">
                            <div className="flex flex-row gap-2 items-center justify-between">
                                <div className="flex flex-row flex-wrap gap-2 items-center border-b">
                                    <Link to={`/beatmaps/${b.id}`}
                                        className="text-xl text-decoration-none">
                                        {b.title}
                                    </Link>
                                    <div className="text-sm">by {b.artist}</div>
                                </div>
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
                <div className="flex flex-row flex-wrap justify-start items-center gap-2">
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
        </div>
    )
})

export default BeatmapsetCard;