import React, { useEffect, useState } from "react";
import { colors } from "../resources/store";
import ModIcon from "../components/ModIcon";
import moment from "moment/moment";
import { HiDocumentArrowDown, HiMiniBarsArrowDown, HiMiniMusicalNote, HiMiniStar } from "react-icons/hi2";
import { Link } from "react-router-dom";
import CountryFlag from "../components/CountryFlag";
import { ModsEntity, Score } from "../resources/interfaces/score";

interface ScoreProps {
    index: number;
    score: Score;
}

const BeatmapsetScoreCard = (props: ScoreProps) => {
    return (
        <tr className="pb-3">
            <th>#{props.index}</th>
            <td><CountryFlag size={24} name={props.score.user.country.name} code={props.score.user.country.code} /></td>
            <td><Link to={`/users/${props.score.user.id}`}>{props.score.user.username}</Link></td>
            <td>{(props.score.accuracy * 100).toFixed(2)}%</td>
            <td>{props.score.max_combo}x</td>
            <td>{props.score.total_score.toLocaleString()}</td>
            <td>{Math.round(props.score.pp).toLocaleString()}pp</td>
            <td><div className="col-span-2 flex flex-row gap-4">
                {props.score.statistics?.perfect &&
                    <div style={{ color: colors.judgements.x320 }}>
                        {props.score.statistics.perfect}
                    </div>}
                {props.score.statistics.great &&
                    <div style={{ color: colors.judgements.x300 }}>
                        {props.score.statistics.great}
                    </div>}
                {props.score.statistics?.good &&
                    <div style={{ color: colors.judgements.x200 }}>
                        {props.score.statistics.good}
                    </div>}
                {props.score.statistics.ok &&
                    <div style={{ color: colors.judgements.x100 }}>
                        {props.score.statistics.ok}
                    </div>}
                {props.score.statistics.meh &&
                    <div style={{ color: colors.judgements.x50 }}>
                        {props.score.statistics.meh}
                    </div>}
                {props.score.statistics.large_tick_hit &&
                    <div style={{ color: colors.judgements.x200 }}>
                        {props.score.statistics.large_tick_hit}
                    </div>}
                {props.score.statistics.small_tick_hit &&
                    <div style={{ color: colors.judgements.x100 }}>
                        {props.score.statistics.small_tick_hit}
                    </div>}
                {props.score.statistics.small_tick_miss &&
                    <div style={{ color: colors.judgements.x20 }}>
                        {props.score.statistics.small_tick_miss}
                    </div>}
                {props.score.statistics.miss &&
                    <div style={{ color: colors.judgements.xMiss }}>
                        {props.score.statistics.miss}
                    </div>}
            </div></td>
            <td><div style={{
                color: (colors.ranks as any)[props.score.rank.toLowerCase()]
            }} className="font-semibold">
                {props.score.rank}
            </div></td>
            <td><div className="flex flex-row gap-1 col-span-3">
                {props.score.mods?.map((mod: ModsEntity, index: number) =>
                    <ModIcon acronym={mod.acronym} size={24} key={index} />
                )}
            </div></td>
            <td><div className="tooltip col-span-2"
                data-tip={moment(props.score.ended_at).fromNow()}>
                {moment(props.score.ended_at).format('DD MMM YYYY')}
            </div></td>
        </tr>
    );
}



export default BeatmapsetScoreCard;