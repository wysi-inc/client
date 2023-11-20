import { FaItunesNote, FaRegClock, FaStar } from "react-icons/fa";
import DiffIcon from "./DiffIcon";
import ModIcon from "../../scores/s_comp/ModIcon";
import { secondsToTime } from "../../../resources/global/functions";
import { useEffect, useState } from "react";
import { Beatmap } from "../../../resources/types/beatmapset";
import { useStats } from "../../../resources/hooks/scoreHooks";
import { colors } from "../../../resources/global/tools";

interface accInt {
    acc: number,
    geki: number,
    x300: number,
    katu: number,
    x100: number,
    x50: number,
    xMiss: number,
}

const mn: string[] = ['HR', 'DT', 'HD', 'FL', 'EZ', 'HT'];

interface Props {
    bset_id: number,
    diff: Beatmap,
}

const BeatmapsetStats = (p: Props) => {

    const [acc, setAcc] = useState<number>(100);
    const [mods, setMods] = useState<string[]>([]);
    const stats = useStats(p.diff, acc, mods);
    const totalNotes: number = (p.diff?.count_circles || 0) + (p.diff?.count_sliders || 0) + (p.diff?.count_spinners || 0);

    const [hits, setHits] = useState<accInt>({
        acc: 100,
        geki: 0,
        x300: totalNotes,
        katu: 0,
        x100: 0,
        x50: 0,
        xMiss: 0
    });

    useEffect(() => {
        setHits({
            acc: 100,
            geki: 0,
            x300: totalNotes,
            katu: 0,
            x100: 0,
            x50: 0,
            xMiss: 0
        })
    }, [p.diff])

    if (!p.diff) return <></>;

    window.history.replaceState({}, '', `/beatmaps/${p.bset_id}/${p.diff.id}`);

    return (
        <div className="flex flex-col gap-3 p-3 rounded-xl bg-custom-700">
            <div className="flex flex-row gap-2 p-4 rounded-lg drop-shadow-md bg-custom-950">
                <DiffIcon setId={p.bset_id} diffId={p.diff.id}
                    size={24} mode={p.diff.mode} diff={p.diff.difficulty_rating} name={p.diff.version} />
                <div>{p.diff.version}</div>
            </div>
            <div className="flex flex-col gap-4 p-4 rounded-lg drop-shadow-md bg-custom-950">
                <div className="flex flex-row flex-wrap items-center justify-center gap-8">
                    <div className="flex flex-row items-center gap-1">
                        <FaStar />
                        <div>{stats.sr}</div>
                    </div>
                    <div className="flex flex-row items-center gap-1">
                        <FaRegClock />
                        <div>{secondsToTime(stats.len)}</div>
                    </div>
                    <div className="flex flex-row items-center gap-1">
                        <FaItunesNote />
                        <div>{stats.bpm}bpm</div>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-3">
                    <div className="text-end">AR:</div>
                    <progress className="justify-between progress progress-custom"
                        value={stats.ar} max="11"></progress>
                    <div className="text-start">{stats.ar}</div>
                </div>
                <div className="flex flex-row items-center justify-between gap-3">
                    <div className="text-end">CS:</div>
                    <progress className="progress progress-custom"
                        value={stats.cs} max="11"></progress>
                    <div className="text-start">{stats.cs}</div>
                </div>
                <div className="flex flex-row items-center justify-between gap-3">
                    <div className="text-end">OD:</div>
                    <progress className="progress progress-custom" value={stats.od} max="11"></progress>
                    <div className="text-start">{stats.od}</div>
                </div>
                <div className="flex flex-row items-center justify-between gap-3">
                    <div className="text-end">HP:</div>
                    <progress className="progress progress-custom" value={stats.hp} max="11"></progress>
                    <div className="text-start">{stats.hp}</div>
                </div>
                <div className="flex flex-row flex-wrap items-center justify-center gap-2">
                    <button className={`${mods.length > 0 && 'fakeDisabled'} darkenOnHover`}
                        onClick={() => setMods([])}><ModIcon size={24} acronym="NM" />
                    </button>
                    {mn.map((t, i) =>
                        <button key={i} className={`${!mods.includes(t) && 'fakeDisabled'} darkenOnHover`}
                            onClick={() => mods.includes(t) ? setMods(mods.filter(m => m !== t)) : setMods([...mods, t])}>
                            <ModIcon size={24} acronym={t} />
                        </button>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-2 p-4 rounded-lg drop-shadow-md bg-custom-950">
                <div className="text-center">
                    {stats.pp}pp
                </div>
                <div className="flex flex-row justify-between gap-2">
                    <div style={{ color: colors.judgements.x300 }}>300</div>
                    <input type="number" className="input input-bordered input-sm"
                        value={hits.x300} onChange={(e) => setHits(prev => ({ ...prev, x300: e.target.valueAsNumber }))}
                    />
                </div>
                <div className="flex flex-row justify-between gap-2">
                    <div style={{ color: colors.judgements.x100 }}>100</div>
                    <input type="number" className="input input-bordered input-sm"
                        value={hits.x100} onChange={(e) => setHits(prev => ({ ...prev, x100: e.target.valueAsNumber }))}
                    />
                </div>
                <div className="flex flex-row justify-between gap-2">
                    <div style={{ color: colors.judgements.x50 }}>50</div>
                    <input type="number" className="input input-bordered input-sm"
                        value={hits.x50} onChange={(e) => setHits(prev => ({ ...prev, x50: e.target.valueAsNumber }))}
                    />
                </div>
                <div className="flex flex-row justify-between gap-2">
                    <div style={{ color: colors.judgements.xMiss }}>0</div>
                    <input type="number" className="input input-bordered input-sm"
                        value={hits.xMiss} onChange={(e) => setHits(prev => ({ ...prev, xMiss: e.target.valueAsNumber }))}
                    />
                </div>
            </div>
            <div className="flex flex-row flex-wrap items-center justify-center gap-2 p-4 rounded-lg drop-shadow-md bg-custom-950">

            </div>
        </div>
    )
}

export default BeatmapsetStats;