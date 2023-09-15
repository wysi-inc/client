import React, { useEffect, useState } from "react";
import { BeatmapsEntity, BeatmapSet } from "../resources/interfaces";
import { addDefaultSrc, secondsToTime } from "../resources/functions";
import { playerStore, PlayerStoreInterface } from "../resources/store";
import DiffIcon from "./DiffIcon";
import moment from "moment";
import StatusBadge from "./StatusBadge";

interface BeatmapsetCardProps {
    index: number,
    data: BeatmapSet
}

const BeatmapsetCard = (props: BeatmapsetCardProps) => {
    const play = playerStore((state: PlayerStoreInterface) => state.play);
    const [showArrow, setShowArrow] = useState<boolean>(false)
    const [diffIconsHTML, setDiffIconsHTML] = useState<any>();
    const [expanded, setExpanded] = useState<boolean>(false);
    const shortLimit = 12;

    function DiffRow() {
        return props.data.beatmaps.sort((a, b) => {
            if (a.mode === b.mode) {
                return a.difficulty_rating - b.difficulty_rating;
            } else {
                return a.mode_int - b.mode_int;
            }
        }).map((beatmap: BeatmapsEntity, index: number) => {
            if (expanded) {
                return <DiffIcon key={index + 1} diff={beatmap.difficulty_rating} size={24}
                    mode={beatmap.mode} name={beatmap.version} />
            } else if (index < shortLimit) {
                return <DiffIcon key={index + 1} diff={beatmap.difficulty_rating} size={24}
                    mode={beatmap.mode} name={beatmap.version} />
            } else {
                setShowArrow(true);
            }
        }
        )
    }

    useEffect(() => {
        setDiffIconsHTML(DiffRow);
    }, [expanded, props.data])

    return (
        <div className="rounded-lg overflow-hidden">
            <div className="card image-full">
                <figure><img src={`https://assets.ppy.sh/beatmaps/${props.data.id}/covers/cover.jpg?${props.data.id}`} alt="Shoes" onError={addDefaultSrc} /></figure>
                <div style={{ backgroundColor: "#00000099", backdropFilter: "blur(2px)" }}
                    className="card-body flex flex-col gap-2 p-3">
                    <div className="grid grid-cols-5 gap-3">
                        <div className="col-span-4 flex flex-row gap-3 items-center">
                            <img src={`https://assets.ppy.sh/beatmaps/${props.data.id}/covers/list.jpg?${props.data.id}`}
                                onError={addDefaultSrc}
                                alt="cover" className="rounded-lg" loading="lazy"
                                style={{ height: '100%', width: 60, objectFit: "cover" }} />
                            <div className="flex flex-col gap-1" style={{ width: 300 }}>
                                <a className="h5 truncate text-decoration-none"
                                    href={`https://osu.ppy.sh/beatmapsets/${props.data.id}`} target={"_blank"}>
                                    {props.data.title}
                                </a>
                                <div className="flex flex-row gap-2 items-center text-light">
                                    <i className="bi bi-music-note-beamed"></i>
                                    <div className="truncate">{props.data.artist}</div>
                                </div>
                                <div className="flex flex-row gap-2 items-center text-light">
                                    <img src={`https://a.ppy.sh/${props.data.user_id}`} className="rounded" style={{ height: 24, width: 24 }} />
                                    <div>{props.data.creator}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 flex flex-col gap-1 items-center justify-content-start text-truncate">
                            <div>{secondsToTime(props.data.beatmaps.sort((a, b) => b.total_length - a.total_length)[0].total_length)}</div>
                            <div className="flex flex-row gap-1"><i className="bi bi-music-note-beamed"></i>
                                <div>{Math.round(props.data.bpm)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-row gap-1 items-center">
                            <div className="toolip"
                                data-tip={moment(typeof props.data.submitted_date === "number" ? props.data.submitted_date * 1000 : props.data.submitted_date).fromNow()}>
                                {moment(typeof props.data.submitted_date === "number" ? props.data.submitted_date * 1000 : props.data.submitted_date).format('DD MMM YYYY')}
                            </div>
                        </div>
                        <div className="flex flex-row gap-2 items-center justify-content-end">
                            <div className="py-0 px-2 m-0 flexflex-row gap-1 items-center">
                                <i className="bi bi-argrid grid-cols-12-counterclockwise"></i>
                                <div>{props.data.play_count.toLocaleString()}</div>
                            </div>
                            <div className="py-0 px-2 m-0 flex flex-row gap-1 items-center">
                                <i className="bi bi-suit-heart-fill"></i>
                                <div>{props.data.favourite_count.toLocaleString()}</div>
                            </div>
                            <div className="tooltip" data-tip="download">
                                <a className="py-0 px-2 m-0 simpleDarkenOnHover text-light"
                                    href={`https://catboy.best/d/${props.data.id}`}
                                    style={{ background: "none" }}>
                                    <i className="bi bi-download"></i>
                                </a>
                            </div>
                            <div className="tooltip" data-tip="osu!direct">
                                <a className="py-0 px-2 m-0 simpleDarkenOnHover text-light"
                                    href={`osu://b/${props.data.beatmaps[0].id}`}
                                    style={{ background: "none" }}>
                                    <i className="bi bi-file-earmark-plus"></i>
                                </a>
                            </div>
                            <div className="tooltip" data-tip="listen">
                                <button className="py-0 px-2 m-0 simpleDarkenOnHover border-0" onClick={() => {
                                    play(props.data.id, props.data.title, props.data.artist)
                                }} style={{ background: "none" }}>
                                    <i className="bi bi-headphones"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row flex-wrap gap-1 rounded-lg p-2"
                        style={{ backgroundColor: '#ffffff22' }}>
                        <StatusBadge status={props.data.status} />
                        {expanded && <div className="w-full"></div>}
                        {diffIconsHTML}
                        {showArrow &&
                            <button className="border-0 darkenOnHover p-0 ms-auto me-2"
                                style={{ background: "none" }}
                                data-tooltip-id="tooltip"
                                data-tooltip-content={`${props.data.beatmaps.length} difficulties`}
                                onClick={() => setExpanded(!expanded)}>
                                <i className={`bi bi-caret-${expanded ? 'up' : 'down'}-fill`}></i>
                            </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BeatmapsetCard;