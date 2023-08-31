import React from "react";
import {Beatmap, BeatmapSet} from "../resources/interfaces";
import {addDefaultSrc} from "../resources/functions";
import {colors, playerStore, PlayerStoreInterface} from "../resources/store";
import DiffIcon from "./DiffIcon";

interface BeatmapsetCardProps {
    index: number,
    data: BeatmapSet
}

const BeatmapsetCard = (props: BeatmapsetCardProps) => {
    const play = playerStore((state: PlayerStoreInterface) => state.play);

    return (
        <div style={{backgroundImage: `url(${props.data.covers.cover})`, backgroundSize: "cover"}}
             className="col-4 d-flex m-0 p-0 rounded-3 overflow-hidden">
            <div style={{backgroundColor: "#00000099", backdropFilter: "blur(4px)"}}
                 className="flex-grow-1 p-3">
                <div className="d-flex flex-column">
                    <div className="d-flex flex-row justify-content-between gap-3 ">
                        <div className="d-flex flex-column">
                            <div className="d-flex flex-row gap-3 align-items-center">
                                <img src={props.data.covers.list}
                                     onError={addDefaultSrc}
                                     alt="cover" className="rounded" loading="lazy"
                                     style={{height: 60, width: 60}}/>
                                <div className="d-flex flex-column flex-grow-1">
                                    <div className="h5 text-truncate" style={{width: 365}}>
                                        {props.data.title}
                                    </div>
                                    <div className="d-flex flex-row gap-1 align-items-center text-light">
                                        <i className="bi bi-music-note-beamed"></i>
                                        <div>{props.data.artist}</div>
                                    </div>
                                    <div className="d-flex flex-row gap-1 align-items-center text-light">
                                        <i className="bi bi-tools"></i>
                                        <div>{props.data.creator}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-row justify-content-between align-items-center">
                                <div className="d-flex flex-row gap-1 align-items-center">
                                    <div className="btn border-0" style={{cursor: 'default'}}>
                                        #{props.index + 1}
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
                            <a className="border-0 darkenOnHover text-light" href={`osu://b/${props.data.id}`}
                               style={{background: "none"}}>
                                <i className="bi bi-download"></i>
                            </a>
                        </div>
                    </div>
                    <div className="d-flex flex-row flex-wrap gap-2 justify-content-start">
                        <div style={{
                            backgroundColor: (colors.beatmap as any)[props.data.status.toLowerCase()],
                            color: "#000000"
                        }} className="rounded-pill px-2 fw-bold">
                            {props.data.status}
                        </div>
                        {props.data.beatmaps.sort((a, b) => {
                            if (a.mode === b.mode) {
                                return a.difficulty_rating - b.difficulty_rating;
                            } else {
                                return a.mode_int - b.mode_int;
                            }
                        }).map((beatmap: Beatmap, index: number) =>
                            <DiffIcon key={index+1} diff={beatmap.difficulty_rating} size={24} mode={beatmap.mode}/>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BeatmapsetCard;