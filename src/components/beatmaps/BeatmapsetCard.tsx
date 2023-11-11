import moment from "moment";
import { Link } from "react-router-dom";

import { FaDownload, FaFileDownload, FaHeadphonesAlt} from "react-icons/fa";

import DiffIcon from "./b_comp/DiffIcon";
import StatusBadge from "./b_comp/StatusBadge";
import { Beatmap, Beatmapset } from "../../resources/types/beatmapset";
import { addDefaultSrc } from "../../resources/global/functions";
import { playerStore, PlayerStoreInterface } from "../../resources/global/tools";

interface Props {
    index: number,
    beatmapset: Beatmapset
}

const BeatmapsetCard = (p: Props) => {

    const play = playerStore((state: PlayerStoreInterface) => state.play);

    const id = p.beatmapset.id;
    const listImg = `https://assets.ppy.sh/beatmaps/${id}/covers/list.jpg?${id}`;

    const submitted_date = typeof p.beatmapset.submitted_date === "number" ? p.beatmapset.submitted_date * 1000 : p.beatmapset.submitted_date;

    const b = p.beatmapset;

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

                </div>
                <div className="flex flex-row flex-wrap items-center justify-start gap-2">
                    <StatusBadge status={b.status} />
                    {p.beatmapset?.beatmaps?.sort((a, b) => a.mode === b.mode ?
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
                <a href={`osu://b/${b.beatmaps[0].id}`}
                    className="tooltip" data-tip="osu!direct">
                    <button className="btn btn-circle btn-ghost btn-sm">
                        <FaFileDownload />
                    </button>
                </a>
            </div>
        </div>
    )
}

export default BeatmapsetCard;