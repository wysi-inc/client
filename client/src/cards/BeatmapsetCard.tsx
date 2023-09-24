import React, { useEffect, useState } from "react";
import { addDefaultSrc, secondsToTime } from "../resources/functions";
import { playerStore, PlayerStoreInterface } from "../resources/store";
import DiffIcon from "../components/DiffIcon";
import moment from "moment";
import StatusBadge from "../components/StatusBadge";
import { GiMusicalNotes } from "react-icons/gi";
import { Beatmap, BeatmapSet } from "../resources/interfaces/beatmapset";
import { Link } from "react-router-dom";
import { FaHeadphonesAlt } from "react-icons/fa"

interface BeatmapsetCardProps {
    index: number,
    data: BeatmapSet
}

const BeatmapsetCard = (props: BeatmapsetCardProps) => {
    const play = playerStore((state: PlayerStoreInterface) => state.play);
    const [showArrow, setShowArrow] = useState<boolean>(false)
    const shortLimit = 12;

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
                                    <GiMusicalNotes />
                                </div>
                                <div className="truncate">
                                    {props.data.artist}
                                </div>
                            </div>
                            <div className="truncate flex flex-row gap-2 items-center text-light">
                                <img src={`https://a.ppy.sh/${props.data.user_id}`} className="rounded-md w-6 h-6" alt="img" loading="lazy" />
                                <div className="inline-block">
                                    {props.data.creator}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 flex flex-col gap-2 items-end">
                        <div>{secondsToTime(props.data.beatmaps.sort((a, b) => b.total_length - a.total_length)[0].total_length)}</div>
                        <div className="flex flex-row gap-1"><i className="bi bi-music-note-beamed"></i>
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
                    <div className="flex flex-row gap-5 items-center justify-content-end">
                        <div>
                            <i className="bi bi-arrow"></i>
                            <div>{props.data.play_count.toLocaleString()}</div>
                        </div>
                        <div className="flex gap-1">
                            <i className="bi bi-suit-heart-fill"></i>
                            <div>{props.data.favourite_count.toLocaleString()}</div>
                        </div>
                        <div className="tooltip" data-tip="download">
                            <a href={`https://catboy.best/d/${props.data.id}`}
                                style={{ background: "none" }}>
                                <i className="bi bi-download"></i>
                            </a>
                        </div>
                        <div className="tooltip" data-tip="osu!direct">
                            <a href={`osu://b/${props.data.beatmaps[0].id}`}
                                style={{ background: "none" }}>
                                <i className="bi bi-file-earmark-plus"></i>
                            </a>
                        </div>
                        <div className="tooltip" data-tip="listen">
                            <button onClick={() => {
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
                    }).map((beatmap: Beatmap, index: number) => {
                        if (index < shortLimit) {
                            return <DiffIcon setId={props.data.id} diffId={beatmap.id}
                                key={index + 1} diff={beatmap.difficulty_rating} size={24}
                                mode={beatmap.mode} name={beatmap.version} />
                        } else if (!showArrow) {
                            setShowArrow(true);
                        }
                    })}
                    {showArrow &&
                        <div className="tooltip" data-tip={`${props.data.beatmaps.length} difficulties`}>
                            +
                        </div>}
                </div>
            </div>
        </div>
    )
}

export default BeatmapsetCard;