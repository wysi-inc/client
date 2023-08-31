import React, {useEffect, useState} from "react";
import {Beatmap, BeatmapSet} from "../resources/interfaces";
import {addDefaultSrc} from "../resources/functions";
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
    const [diffIconsHTML, setDiffIconsHTML] = useState<any>(<></>);
    const [expanded, setExpanded] = useState<boolean>(false);
    const shortLimit = 12;

    function DiffIconsRow() {
        return props.data.beatmaps.sort((a, b) => {
            if (a.mode === b.mode) {
                return a.difficulty_rating - b.difficulty_rating;
            } else {
                return a.mode_int - b.mode_int;
            }
        }).map((beatmap: Beatmap, index: number) => {
                if (expanded) {
                    return <DiffIcon key={index + 1} diff={beatmap.difficulty_rating} size={24}
                                     mode={beatmap.mode} name={beatmap.version}/>
                } else if (index < shortLimit){
                    return <DiffIcon key={index + 1} diff={beatmap.difficulty_rating} size={24}
                                     mode={beatmap.mode} name={beatmap.version}/>
                } else {
                    setShowArrow(true)
                    return <></>
                }
            }
        )
    }

    useEffect(() => {
        setDiffIconsHTML(DiffIconsRow());
    }, [expanded])

    return (
        <div style={{backgroundImage: `url(${props.data.covers.cover})`, backgroundSize: "cover"}}
             className="col-4 d-flex m-0 p-0 rounded-3 overflow-hidden">
            <div style={{backgroundColor: "#00000099", backdropFilter: "blur(4px)"}}
                 className="flex-grow-1 p-3 d-flex flex-row gap-3">
                <div className="d-flex flex-column gap-2">
                    <div className="d-flex flex-row justify-content-between gap-3">
                        <div className="d-flex flex-column">
                            <div className="d-flex flex-row gap-3 align-items-center">
                                <img src={props.data.covers.list}
                                     onError={addDefaultSrc}
                                     alt="cover" className="rounded" loading="lazy"
                                     style={{height: 60, width: 60}}/>
                                <div className="d-flex flex-column flex-grow-1">
                                    <a className="h5 text-truncate text-decoration-none" style={{width: 365}}
                                       href={`https://osu.ppy.sh/beatmapsets/${props.data.id}`} target={"_blank"}>
                                        {props.data.title}
                                    </a>
                                    <div className="d-flex flex-row gap-1 align-items-center text-light">
                                        <i className="bi bi-music-note-beamed"></i>
                                        <div className="text-truncate" style={{width: 340}}>{props.data.artist}</div>
                                    </div>
                                    <div className="d-flex flex-row gap-1 align-items-center text-light">
                                        <i className="bi bi-tools"></i>
                                        <div>{props.data.creator}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-row justify-content-between align-items-center">
                                <div className="d-flex flex-row gap-1 align-items-center">
                                    <div data-tooltip-id="tooltip"
                                         data-tooltip-content={moment(props.data.last_updated).fromNow()}>
                                        {moment(props.data.last_updated).format('DD/MM/YYYY')}
                                    </div>
                                </div>
                                <div className="d-flex flex-row gap-3 align-items-center">
                                    <div className="d-flex flex-row gap-1 align-items-center">
                                        <i className="bi bi-arrow-counterclockwise"></i>
                                        <div>{props.data.play_count.toLocaleString()}</div>
                                    </div>
                                    <div className="d-flex flex-row gap-1 align-items-center">
                                        <i className="bi bi-suit-heart-fill"></i>
                                        <div>{props.data.favourite_count.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-column gap-2 align-items-center justify-content-around">
                            <button className="border-0 darkenOnHover" onClick={() => {
                                play(`https:${props.data.preview_url}`, props.data.title, props.data.artist)
                            }} style={{background: "none"}}>
                                <i className="bi bi-headphones"></i>
                            </button>
                            <a className="border-0 darkenOnHover text-light" href={`osu://b/${props.data.beatmaps[0].id}`}
                               style={{background: "none"}}>
                                <i className="bi bi-download"></i>
                            </a>
                        </div>
                    </div>
                    <div className="d-flex flex-row flex-wrap gap-1 justify-content-sc rounded p-2" style={{backgroundColor: '#ffffff22'}}>
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