import React, {useEffect, useState} from "react";
import {BeatmapsEntity, BeatmapSet} from "../resources/interfaces";
import {addDefaultSrc, secondsToTime} from "../resources/functions";
import {playerStore, PlayerStoreInterface} from "../resources/store";
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

    function DiffIconsRow() {
        return props.data.beatmaps.sort((a, b) => {
            if (a.mode === b.mode) {
                return a.difficulty_rating - b.difficulty_rating;
            } else {
                return a.mode_int - b.mode_int;
            }
        }).map((beatmap: BeatmapsEntity, index: number) => {
                if (expanded) {
                    return <DiffIcon key={index + 1} diff={beatmap.difficulty_rating} size={24}
                                     mode={beatmap.mode} name={beatmap.version}/>
                } else if (index < shortLimit) {
                    return <DiffIcon key={index + 1} diff={beatmap.difficulty_rating} size={24}
                                     mode={beatmap.mode} name={beatmap.version}/>
                } else {
                    setShowArrow(true);
                }
            }
        )
    }

    useEffect(() => {
        setDiffIconsHTML(DiffIconsRow());
    }, [expanded, props.data])

    return (
        <div style={{
            backgroundImage: `url(https://assets.ppy.sh/beatmaps/${props.data.id}/covers/cover.jpg?${props.data.id})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
        }}
             className="w-100 d-flex m-0 p-0">
            <div style={{backgroundColor: "#00000099", backdropFilter: "blur(4px)"}}
                 className="flex-grow-1 p-3">
                <div className="d-flex flex-column gap-2 flex-grow-1">
                    <div className="d-flex flex-row justify-content-between gap-3">
                        <div className="d-flex flex-column overflow-hidden">
                            <div className="d-flex flex-row gap-3 align-items-center">
                                <img src={`https://assets.ppy.sh/beatmaps/${props.data.id}/covers/list.jpg?${props.data.id}`}
                                     onError={addDefaultSrc}
                                     alt="cover" className="rounded" loading="lazy"
                                     style={{height: '100%', width: 60, objectFit: "cover"}}/>
                                <div className="d-flex flex-column flex-grow-1 gap-1" style={{width: 300}}>
                                    <a className="h5 text-truncate text-decoration-none"
                                       href={`https://osu.ppy.sh/beatmapsets/${props.data.id}`} target={"_blank"}>
                                        {props.data.title}
                                    </a>
                                    <div className="d-flex flex-row gap-2 align-items-center text-light">
                                        <i className="bi bi-music-note-beamed"></i>
                                        <div className="text-truncate">{props.data.artist}</div>
                                    </div>
                                    <div className="d-flex flex-row gap-2 align-items-center text-light">
                                        <img src={`https://a.ppy.sh/${props.data.user_id}`} className="rounded" style={{height: 24, width: 24}}/>
                                        <div>{props.data.creator}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-column gap-1 align-items-center justify-content-start">
                            <div>{secondsToTime(props.data.beatmaps.sort((a, b) => b.total_length - a.total_length)[0].total_length)}</div>
                            <div className="d-flex flex-row gap-1"><i className="bi bi-music-note-beamed"></i>
                                <div>{Math.round(props.data.bpm)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex flex-row gap-1 align-items-center">
                            <div data-tooltip-id="tooltip"
                                 data-tooltip-content={moment(typeof props.data.submitted_date === "number" ? props.data.submitted_date * 1000 : props.data.submitted_date).fromNow()}>
                                {moment(typeof props.data.submitted_date === "number" ? props.data.submitted_date * 1000 : props.data.submitted_date).format('DD MMM YYYY')}
                            </div>
                        </div>
                        <div className="d-flex flex-row gap-2 align-items-center justify-content-end">
                            <div className="py-0 px-2 m-0 d-flex flex-row gap-1 align-items-center">
                                <i className="bi bi-arrow-counterclockwise"></i>
                                <div>{props.data.play_count.toLocaleString()}</div>
                            </div>
                            <div className="py-0 px-2 m-0 d-flex flex-row gap-1 align-items-center">
                                <i className="bi bi-suit-heart-fill"></i>
                                <div>{props.data.favourite_count.toLocaleString()}</div>
                            </div>
                            <a className="py-0 px-2 m-0 darkenOnHover text-light"
                               href={`https://catboy.best/d/${props.data.id}`}
                               style={{background: "none"}} 
                               data-tooltip-id="tooltip"
                               data-tooltip-content="download">
                                <i className="bi bi-download"></i>
                            </a>
                            <a className="py-0 px-2 m-0 darkenOnHover text-light"
                               href={`osu://b/${props.data.beatmaps[0].id}`}
                               style={{background: "none"}} 
                               data-tooltip-id="tooltip"
                               data-tooltip-content="osu!direct">
                                <i className="bi bi-file-earmark-plus"></i>
                            </a>
                            <button className="py-0 px-2 m-0 border-0 darkenOnHover" onClick={() => {
                                play(props.data.id, props.data.title, props.data.artist)
                            }} style={{background: "none"}}
                            data-tooltip-id="tooltip"
                            data-tooltip-content="listen">
                                <i className="bi bi-headphones"></i>
                            </button>
                        </div>
                    </div>
                    <div className="d-flex flex-row flex-wrap gap-1 rounded p-2"
                         style={{backgroundColor: '#ffffff22'}}>
                        <StatusBadge status={props.data.status}/>
                        {expanded && <div className="w-100"></div>}
                        {diffIconsHTML}
                        {showArrow &&
                            <button className="border-0 darkenOnHover p-0 ms-auto me-2"
                                    style={{background: "none"}}
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