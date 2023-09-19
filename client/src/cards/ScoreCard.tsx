import React, { useEffect, useState } from "react";
import { Score, ModsEntity } from "../resources/interfaces";
import { addDefaultSrc, secondsToTime } from "../resources/functions";
import { colors, modsInt, playerStore, PlayerStoreInterface } from "../resources/store";
import ModIcon from "../components/ModIcon";
import moment from "moment/moment";
import StatusBadge from "../components/StatusBadge";
import axios from "../resources/axios-config";
import DiffIcon from "../components/DiffIcon";
import { HiDocumentArrowDown, HiMiniBarsArrowDown, HiMiniMusicalNote, HiMiniStar } from "react-icons/hi2";
import { HiOutlineClock } from "react-icons/hi";
import { FaHeadphones } from "react-icons/fa";
import {GiMusicalNotes} from "react-icons/gi";

interface ScoreProps {
    index: number;
    score: Score;
}

const ScoreCard = (props: ScoreProps) => {
    const play = playerStore((state: PlayerStoreInterface) => state.play);
    const [chokePP, setChokePP] = useState<number | undefined>();
    const [newAR, setNewAR] = useState<number | undefined>();
    const [newOD, setNewOD] = useState<number | undefined>();
    const [newCS, setNewCS] = useState<number | undefined>();
    const [newHP, setNewHP] = useState<number | undefined>();
    const [newSR, setNewSR] = useState<number | undefined>();
    const [newBPM, setNewBPM] = useState<number | undefined>();
    const [newLen, setNewLen] = useState<number | undefined>();

    useEffect(() => {
        getPPChoke();
    }
        , []);

    function getPPChoke() {
        if (props.score.legacy_perfect) return;
        const acc = props.score.accuracy * 100;
        const mods = props.score.mods?.map((m) => m.acronym === 'NC' ? 64 : (modsInt as any)[m.acronym]);
        const modComv = mods !== undefined ? mods.length > 0 ? mods.reduce((a, b) => a + b) : mods[0] : '';

        const url = `https://catboy.best/api/meta/${props.score.beatmap_id}?misses=0&acc=${acc}&mods=${modComv}`;
        axios.post('/proxy', { url: url })
            .then((r) => {
                if (props.score.mods) {
                    if (props.score.mods?.length > 0) {
                        setNewAR(parseFloat(r.data.map.ar.toFixed(1)));
                        setNewCS(parseFloat(r.data.map.cs.toFixed(1)));
                        setNewOD(parseFloat(r.data.map.od.toFixed(1)));
                        setNewHP(parseFloat(r.data.map.hp.toFixed(1)));
                        setNewSR(r.data.difficulty.stars.toFixed(2));
                        setNewBPM(Math.round(r.data.map.bpm));
                        const m = props.score.mods.map(obj => obj.acronym);
                        const length = props.score.beatmap.total_length;
                        if (m.includes('DT')) setNewLen(length * 0.75);
                        if (m.includes('HT')) setNewLen(length * 1.5);
                    }
                }
                const pp = r.data.pp[parseFloat(acc.toString())];
                if (Math.round(pp.pp) !== Math.round(props.score.pp))
                    setChokePP(Math.round(pp.pp));
            })
            .catch(e => console.error(e));
    }

    function playSong() {
        play(props.score.beatmapset.id, props.score.beatmapset.title, props.score.beatmapset.artist);
    }

    return (
        <div className="flex grow drop-shadow-lg rounded-xl"
            style={{ background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${props.score.beatmapset.covers.cover})`, backgroundSize: "cover", backgroundPosition: 'center' }}>
            <div className="flex flex-col p-3 gap-2 grow"
                style={{ backdropFilter: "blur(2px)" }}>
                <div className="flex flex-row justify-between gap-3 items-center">
                    <div className="grow flex flex-row gap-3">
                        <img src={props.score.beatmapset.covers.list}
                            onError={addDefaultSrc}
                            alt="cover" className="rounded-lg" loading="lazy"
                            style={{ height: 80, width: 60, objectFit: 'cover' }} />
                        <div className="flex flex-col gap-1 grow">
                            <div className="truncate">
                                <a href={props.score.beatmap.url} target={"_blank"}
                                    rel="noreferrer"
                                    className="text-light h5 text-decoration-none truncate">
                                    {props.score.beatmapset.title}
                                </a>
                            </div>
                            <div className="truncate flex flex-row gap-2 items-center text-light">
                                <div className="flex justify-center w-6">
                                    <GiMusicalNotes/>
                                </div>
                                <div className="truncate">{props.score.beatmapset.artist}</div>
                            </div>
                            <div className="truncate flex flex-row gap-2 items-center text-light">
                                <img src={`https://a.ppy.sh/${props.score.beatmapset.user_id}`} className="rounded-md w-6 h-6" alt="img" />
                                <div className="inline-block">
                                    {props.score.beatmapset.creator}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        fontSize: '74px',
                        lineHeight: '74px',
                        marginTop: -24,
                        color: (colors.ranks as any)[props.score.rank.toLowerCase()]
                    }} className="font-semibold col-span-1">
                        <div className="text-end">{props.score.rank}</div>
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-4 items-center">
                        <div data-tooltip-id="tooltip"
                            data-tooltip-content={moment(props.score.ended_at).fromNow()}
                            className="h6">
                            {moment(props.score.ended_at).format('DD MMM YYYY')}
                        </div>
                    </div>
                    <div className="flex flex-row items-center content-end gap-5">
                        <div>
                            #{props.index}
                        </div>
                        <div data-tooltip-id="tooltip" data-tooltip-content="download">
                            <a href={`https://catboy.best/d/${props.score.beatmapset.id}`}>
                                <HiDocumentArrowDown />
                            </a>
                        </div>
                        <div data-tooltip-id="tooltip" data-tooltip-content="osu!direct">
                            <a href={`osu://b/${props.score.beatmap_id}`}>
                                <HiMiniBarsArrowDown />
                            </a>
                        </div>
                        <div data-tooltip-id="tooltip" data-tooltip-content="listen">
                            <button onClick={playSong}>
                                <FaHeadphones />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row flex-wrap gap-4 items-center"
                    style={{ fontSize: 14 }}>
                    <div className="flex flex-row gap-1 items-center">
                        <HiMiniStar />
                        {newSR ? newSR : props.score.beatmap.difficulty_rating}
                    </div>
                    <div className="flex flex-row gap-1 items-center">
                        <HiOutlineClock />
                        {secondsToTime(newLen ? newLen : props.score.beatmap.total_length)}
                    </div>
                    <div className="flex flex-row gap-1 items-center">
                        <HiMiniMusicalNote />
                        {newBPM ? newBPM : props.score.beatmap.bpm}
                    </div>
                    <div>CS: {newCS ? newCS : props.score.beatmap.cs}</div>
                    <div>AR: {newAR ? newAR : props.score.beatmap.ar}</div>
                    <div>OD: {newOD ? newOD : props.score.beatmap.accuracy}</div>
                    <div>HP: {newHP ? newHP : props.score.beatmap.drain}</div>
                </div>
                <div className="flex flex-row justify-between items-center"
                    style={{ fontSize: 16 }}>
                    <div className="flex flex-row gap-4">
                        <div>{(props.score.accuracy * 100).toFixed(2)}%</div>
                        <div>{props.score.max_combo}x</div>
                        <div>{props.score.total_score.toLocaleString()}</div>
                    </div>
                    <div className="flex flex-row gap-4">
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
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center rounded-lg p-2 "
                    style={{ backgroundColor: '#ffffff22' }}>
                    <div className="flex flex-row items-center gap-2">
                        <StatusBadge status={props.score.beatmapset.status} />
                        <DiffIcon diff={props.score.beatmap.difficulty_rating} size={24}
                            mode={props.score.beatmap.mode} name={props.score.beatmap.version} />
                    </div>
                    <div className="flex flex-row gap-1 fw-bold justify-content-end items-center">
                        <div className="flex flex-row gap-2 me-2">
                            {props.score.mods?.map((mod: ModsEntity, index: number) =>
                                <ModIcon acronym={mod.acronym} size={24} key={index} />
                            )}
                        </div>
                        <div className="flex flex-row gap-2 align-items-end">
                            <div className="h5">{Math.round(props.score.pp)}pp</div>
                            <div className="h6" style={{ color: '#cccccc' }}>{chokePP ? `(${chokePP}pp if FC)` : `FC`}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScoreCard;