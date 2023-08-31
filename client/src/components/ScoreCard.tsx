import React from "react";
import {BeatmapScore, ModsEntity} from "../resources/interfaces";
import {addDefaultSrc, secondsToTime} from "../resources/functions";
import {colors, playerStore, PlayerStoreInterface} from "../resources/store";
import ModIcon from "./ModIcon";
import moment from "moment/moment";
import StatusBadge from "./StatusBadge";

interface ScoreProps {
    index: number;
    score: BeatmapScore;
}

const ScoreCard = (props: ScoreProps) => {
    const play = playerStore((state: PlayerStoreInterface) => state.play);
    return (
        <div style={{backgroundImage: `url(${props.score.beatmapset.covers.cover})`, backgroundSize: "cover"}}
             className="d-flex flex-grow-1">
            <div style={{backgroundColor: "#00000099", backdropFilter: "blur(4px)"}}
                 className="d-flex flex-column flex-grow-1 p-3">
                <div className="d-flex flex-row gap-3 mb-2 align-items-center">
                    <img src={props.score.beatmapset.covers.list}
                         onError={addDefaultSrc}
                         alt="cover" className="rounded" loading="lazy"
                         style={{height: 60, width: 60}}/>
                    <div className="flex-grow-1">
                        <div className="text-truncate" style={{width: 260}}>
                            <a href={props.score.beatmap.url} target={"_blank"}
                               rel="noreferrer"
                               className="text-light h5 text-decoration-none text-truncate">
                                {props.score.beatmapset.title}
                            </a>
                        </div>
                        <div className="text-truncate" style={{width: 260}}>
                            <a href={`https://osu.ppy.sh/beatmapsets?q=${props.score.beatmapset.artist}`}
                               target={"_blank"}
                               rel="noreferrer"
                               className="text-light h6 text-decoration-none text-truncate">
                                by {props.score.beatmapset.artist}
                            </a>
                        </div>
                        <div className="text-truncate" style={{width: 260}}>
                            <h6 className="d-inline-block">
                                [{props.score.beatmap.version}] - {props.score.beatmapset.creator}
                            </h6>
                        </div>
                    </div>
                    <div style={{
                        fontSize: 60,
                        fontWeight: "bold",
                        textAlign: "center",
                        textAnchor: "middle",
                        color: (colors.ranks as any)[props.score.rank.toLowerCase()]
                    }}>
                        {props.score.rank}
                    </div>
                </div>
                <div className="d-flex flex-row gap-2 mb-2" style={{fontSize: 12}}>
                    <div>CS: {props.score.beatmap.cs}</div>
                    <div>|</div>
                    <div>AR: {props.score.beatmap.ar}</div>
                    <div>|</div>
                    <div>OD: {props.score.beatmap.accuracy}</div>
                    <div>|</div>
                    <div>HP: {props.score.beatmap.drain}</div>
                </div>
                <div className="d-flex flex-row gap-2 mb-2" style={{fontSize: 14}}>
                    <div className="d-flex flex-row gap-1">
                        <i className="bi bi-star-fill"></i>
                        {props.score.beatmap.difficulty_rating}
                    </div>
                    <div>|</div>
                    <div className="d-flex flex-row gap-1">
                        <i className="bi bi-stopwatch-fill"></i>
                        {secondsToTime(props.score.beatmap.total_length)}
                    </div>
                    <div>|</div>
                    <div className="d-flex flex-row gap-1">
                        <i className="bi bi-music-note-beamed"></i>
                        {props.score.beatmap.bpm}
                    </div>
                </div>
                <div className="d-flex flex-row justify-content-between mb-2"
                     style={{fontSize: 16}}>
                    <div className="d-flex flex-row gap-2">
                        <div>{(props.score.accuracy * 100).toFixed(2)}%</div>
                        <div>|</div>
                        <div>{props.score.max_combo}x</div>
                        <div>|</div>
                        <div>{props.score.total_score.toLocaleString()}</div>
                    </div>
                    <div className="d-flex flex-row gap-2">
                        {props.score.statistics?.perfect &&
                            <div style={{color: colors.judgements.x320}}>
                                {props.score.statistics.perfect}
                            </div>}
                        <div style={{color: colors.judgements.x300}}>
                            {props.score.statistics.great ? props.score.statistics.great : 0}
                        </div>
                        {props.score.statistics?.good &&
                            <div style={{color: colors.judgements.x200}}>
                                {props.score.statistics.good}
                            </div>}
                        <div style={{color: colors.judgements.x100}}>
                            {props.score.statistics.ok ? props.score.statistics.ok : 0}
                        </div>
                        <div style={{color: colors.judgements.x50}}>
                            {props.score.statistics.meh ? props.score.statistics.meh : 0}
                        </div>
                        <div style={{color: colors.judgements.xMiss}}>
                            {props.score.statistics.miss ? props.score.statistics.miss : 0}
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                    <StatusBadge status={props.score.beatmapset.status}/>
                    <div className="d-flex flex-row gap-1 flex-grow-1 fw-bold justify-content-end align-items-center">
                        <div className="d-flex flex-row gap-2 me-2">
                            {props.score.mods?.map((mod: ModsEntity, index: number) =>
                                <ModIcon acronym={mod.acronym} size={24} key={index}/>
                            )}
                        </div>
                        <div data-tooltip-id={'tooltip'}
                             data-tooltip-content={`Choke PP: (wip)`}
                             className="h5 m-0">
                            {Math.round(props.score.pp)}pp
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-row gap-1 justify-content-between align-items-center">
                    <div className="d-flex flex-row gap-1">
                        <div className="d-grid justify-content-center align-items-center fw-bold"
                             style={{width: 60, cursor: "default"}}>
                            #{props.index}
                        </div>
                        <a className="btn" href={`osu://b/${props.score.beatmap_id}`}><i className="bi bi-download"></i></a>
                        <button className="btn" onClick={() => {
                            play(`https:${props.score.beatmapset.preview_url}`, props.score.beatmapset.title, props.score.beatmapset.artist)
                        }}><i className="bi bi-headphones"></i></button>
                    </div>
                    <div data-tooltip-id="tooltip"
                         data-tooltip-content={moment(props.score.ended_at).fromNow()}
                         className="h6 m-0">
                        {moment(props.score.ended_at).calendar()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScoreCard;