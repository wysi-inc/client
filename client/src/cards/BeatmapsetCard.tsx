import React from "react";
import { addDefaultSrc, secondsToTime } from "../resources/functions";
import { playerStore, PlayerStoreInterface } from "../resources/store";
import DiffIcon from "../components/DiffIcon";
import moment from "moment";
import StatusBadge from "../components/StatusBadge";
import { FaHeadphonesAlt, FaDownload, FaFileDownload, FaRegClock, FaItunesNote, FaMicrophoneAlt, FaHeart } from "react-icons/fa";
import { ImSpinner11 } from "react-icons/im"
import { Beatmap, BeatmapSet } from "../resources/interfaces/beatmapset";
import { Link } from "react-router-dom";

interface BeatmapsetCardProps {
    index: number,
    data: BeatmapSet
}

const BeatmapsetCard = (props: BeatmapsetCardProps) => {
    const play = playerStore((state: PlayerStoreInterface) => state.play);

    return (
        <div className="flex grow bg-accent-900"
            style={{ background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(https://assets.ppy.sh/beatmaps/${props.data.id}/covers/cover.jpg?${props.data.id}) center / cover no-repeat` }}>
            <div className="grow flex flex-col gap-2 p-3"
                style={{ backdropFilter: "blur(2px)" }}>
                <div className="grid grid-cols-5 gap-3">
                    <div className="col-span-4 flex flex-row gap-3 items-center">
                        <img src={`https://assets.ppy.sh/beatmaps/${props.data.id}/covers/list.jpg?${props.data.id}`}
                            onError={addDefaultSrc}
                            alt="cover" className="rounded-lg" loading="lazy"
                            style={{ height: 80, width: 60, objectFit: 'cover' }} />
                        <div className="flex flex-col gap-1 grow">
                            <div className="truncate">
                                <Link to={`/beatmaps/${props.data.id}`}
                                    className="text-light h5 text-decoration-none truncate">
                                    {props.data.title}
                                </Link>
                            </div>
                            <div className="truncate flex flex-row gap-2 items-center text-light">
                                <div className="flex justify-center w-6">
                                    <FaMicrophoneAlt />
                                </div>
                                <div className="truncate">
                                    {props.data.artist}
                                </div>
                            </div>
                            <div className="truncate flex flex-row gap-2 items-center text-light">
                                <img src={`https://a.ppy.sh/${props.data.user_id}`} className="rounded-md w-6 h-6" alt="img" loading="lazy" />
                                <Link to={`/users/${props.data.user_id}`} className="inline-block">
                                    {props.data.creator}
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 flex flex-col gap-2 items-end">
                        <div className="flex flex-row gap-1 items-center">
                            <FaRegClock />
                            <div>{secondsToTime(props.data.beatmaps.sort((a, b) => b.total_length - a.total_length)[0].total_length)}</div>
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                            <FaItunesNote />
                            <div>{Math.round(props.data.bpm)}</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-2 items-center">
                        <div className="toolip"
                            data-tip={moment(typeof props.data.submitted_date === "number" ? props.data.submitted_date * 1000 : props.data.submitted_date).fromNow()}>
                            {moment(typeof props.data.submitted_date === "number" ? props.data.submitted_date * 1000 : props.data.submitted_date).format('DD MMM YYYY')}
                        </div>
                    </div>
                    <div className="flex flex-row gap-4 items-center justify-content-end">
                        <div className="flex flex-row gap-2 items-center">
                            <ImSpinner11 />
                            <div>{props.data.play_count.toLocaleString()}</div>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <FaHeart />
                            <div>{props.data.favourite_count.toLocaleString()}</div>
                        </div>
                        <div className="tooltip" data-tip="download">
                            <a className="btn btn-ghost btn-circle btn-sm"
                                href={`https://catboy.best/d/${props.data.id}`}
                                style={{ background: "none" }}>
                                <FaDownload />
                            </a>
                        </div>
                        <div className="tooltip" data-tip="osu!direct">
                            <a className="btn btn-ghost btn-circle btn-sm" href={`osu://b/${props.data.beatmaps[0].id}`}
                                style={{ background: "none" }}>
                                <FaFileDownload />
                            </a>
                        </div>
                        <div className="tooltip" data-tip="listen">
                            <button className="btn btn-ghost btn-circle btn-sm" onClick={() => {
                                play(props.data.id, props.data.title, props.data.artist)
                            }} style={{ background: "none" }}>
                                <FaHeadphonesAlt />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row flex-wrap gap-2 rounded-lg p-2"
                    style={{ backgroundColor: '#ffffff22' }}>
                    <StatusBadge status={props.data.status} />
                    {props.data.beatmaps.sort((a, b) => {
                        if (a.mode === b.mode) {
                            return a.difficulty_rating - b.difficulty_rating;
                        } else {
                            return a.mode_int - b.mode_int;
                        }
                    }).map((beatmap: Beatmap, index: number) =>
                        <DiffIcon setId={props.data.id} diffId={beatmap.id}
                            key={index} diff={beatmap.difficulty_rating} size={24}
                            mode={beatmap.mode} name={beatmap.version} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default BeatmapsetCard;