import moment from "moment";
import { Link } from "react-router-dom";

import { ImSpinner11 } from "react-icons/im"
import { FaDownload, FaFileDownload, FaHeadphonesAlt, FaHeart, FaItunesNote, FaRegClock } from "react-icons/fa";

import DiffIcon from "./b_comp/DiffIcon";
import StatusBadge from "./b_comp/StatusBadge";
import { Beatmap, BeatmapSet } from "../../resources/interfaces/beatmapset";
import { addDefaultSrc, secondsToTime } from "../../resources/global/functions";
import { playerStore, PlayerStoreInterface } from "../../resources/global/tools";

interface BeatmapsetCardProps {
    index: number,
    beatmapset: BeatmapSet
}

const BeatmapsetCard = (props: BeatmapsetCardProps) => {
    const play = playerStore((state: PlayerStoreInterface) => state.play);

    return (
        <div className="flex grow bg-custom-900"
            style={{ background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(https://assets.ppy.sh/beatmaps/${props.beatmapset.id}/covers/cover.jpg?${props.beatmapset.id}) center / cover no-repeat` }}>
            <div className="flex flex-col gap-2 p-3 grow"
                style={{ backdropFilter: "blur(2px)" }}>
                <div className="grid grid-cols-5 gap-3">
                    <div className="flex flex-row items-center col-span-4 gap-3">
                        <img src={`https://assets.ppy.sh/beatmaps/${props.beatmapset.id}/covers/list.jpg?${props.beatmapset.id}`}
                            onError={addDefaultSrc}
                            alt="cover" className="rounded-lg" loading="lazy"
                            style={{ height: 80, width: 60, objectFit: 'cover' }} />
                        <div className="flex flex-col gap-1" style={{width: 220}}>
                            <div className="grow">
                                <Link to={`/beatmaps/${props.beatmapset.id}`}
                                    className="truncate text-light h5 text-decoration-none">
                                    {props.beatmapset.title}
                                </Link>
                            </div>
                            <div className="flex flex-row items-center gap-2 truncate text-light">
                                <div className="flex justify-center w-6">
                                    <FaItunesNote />
                                </div>
                                <div className="truncate">
                                    {props.beatmapset.artist}
                                </div>
                            </div>
                            <div className="flex flex-row items-center gap-2 truncate text-light">
                                <img src={`https://a.ppy.sh/${props.beatmapset.user_id}`} className="w-6 h-6 rounded-md" alt="img" loading="lazy" />
                                <Link to={`/users/${props.beatmapset.user_id}`} className="inline-block">
                                    {props.beatmapset.creator}
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end col-span-1 gap-2">
                        <div className="flex flex-row items-center gap-1">
                            <FaRegClock />
                            <div>{secondsToTime(props.beatmapset.beatmaps.sort((a, b) => b.total_length - a.total_length)[0].total_length)}</div>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <div>{Math.round(props.beatmapset.bpm)} bpm</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-2">
                        <div className="toolip"
                            beatmapset-tip={moment(typeof props.beatmapset.submitted_date === "number" ? props.beatmapset.submitted_date * 1000 : props.beatmapset.submitted_date).format('DD MMM YYYY')}>
                            {moment(typeof props.beatmapset.submitted_date === "number" ? props.beatmapset.submitted_date * 1000 : props.beatmapset.submitted_date).fromNow()}
                        </div>
                    </div>
                    <div className="flex flex-row items-center gap-4 justify-content-end">
                        <div className="flex flex-row items-center gap-2">
                            <ImSpinner11 />
                            <div>{props.beatmapset.play_count.toLocaleString()}</div>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <FaHeart />
                            <div>{props.beatmapset.favourite_count.toLocaleString()}</div>
                        </div>
                        <div className="tooltip" beatmapset-tip="download">
                            <a className="btn btn-ghost btn-circle btn-sm"
                                href={`https://catboy.best/d/${props.beatmapset.id}`}
                                style={{ background: "none" }}>
                                <FaDownload />
                            </a>
                        </div>
                        <div className="tooltip" beatmapset-tip="osu!direct">
                            <a className="btn btn-ghost btn-circle btn-sm" href={`osu://b/${props.beatmapset.beatmaps[0].id}`}
                                style={{ background: "none" }}>
                                <FaFileDownload />
                            </a>
                        </div>
                        <div className="tooltip" beatmapset-tip="listen">
                            <button className="btn btn-ghost btn-circle btn-sm" onClick={() => {
                                play(props.beatmapset.id, props.beatmapset.title, props.beatmapset.artist)
                            }} style={{ background: "none" }}>
                                <FaHeadphonesAlt />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row flex-wrap gap-2 p-2 rounded-lg"
                    style={{ backgroundColor: '#ffffff22' }}>
                    <StatusBadge status={props.beatmapset.status} />
                    {props.beatmapset.beatmaps.sort((a, b) => {
                        if (a.mode === b.mode) {
                            return a.difficulty_rating - b.difficulty_rating;
                        } else {
                            return a.mode_int - b.mode_int;
                        }
                    }).map((beatmap: Beatmap, index: number) =>
                        <DiffIcon setId={props.beatmapset.id} diffId={beatmap.id}
                            key={index}
                            diff={beatmap.difficulty_rating} size={24}
                            mode={beatmap.mode} name={beatmap.version} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default BeatmapsetCard;