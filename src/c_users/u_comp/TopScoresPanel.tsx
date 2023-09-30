import React, { useEffect, useState, useMemo } from "react";
import { colors } from "../../resources/store/tools";
import PpLine from "./PpLine";
import BarPieChart from "./BarPieChart";
import ModIcon from "../../c_scores/s_comp/ModIcon";
import { secondsToTime } from "../../resources/functions";
import { User } from "../../resources/interfaces/user";
import { Score } from "../../resources/interfaces/score";

interface topScoresProps {
    data: User;
    best: Score[];
}

export interface BarPieChartData {
    label: string,
    color: string,
    value: number,
}

const TopScoresPanel = (props: topScoresProps) => {
    const [scoresHits, setScoresHits] = useState({
        x320: 0,
        x300: 0,
        x200: 0,
        x100: 0,
        x50: 0,
        xMiss: 0,
    })
    const [scoresRanks, setScoresRanks] = useState({
        xh: 0,
        x: 0,
        sh: 0,
        s: 0,
        a: 0,
        b: 0,
        c: 0,
        d: 0,
    })

    useEffect(() => {
        setScoresHits(getScoresHits());
        setScoresRanks(getScoresRanks());
    }, [props.best])

    const commonMods: string[] = useMemo(() => {
        const modsCounter: { [key: string]: number } = {};
        props.best.map(score =>
            score.mods.map(mod => mod ? mod : 'NM'))
            .forEach((ele) => {
                if (modsCounter[ele.join('-')]) {
                    modsCounter[ele.join('-')] += 1;
                } else {
                    modsCounter[ele.join('-')] = 1;
                }
            });
        let largestKey = null;
        let largestValue = -Infinity;

        for (const key in modsCounter) {
            if (modsCounter[key] > largestValue) {
                largestKey = key;
                largestValue = modsCounter[key];
            }
        }
        const formattedMods = largestKey ? largestKey.split("-").map(String) : [];
        return formattedMods;
    }, [props.best]);

    const scoresHitsLabels: BarPieChartData[] = [
        { label: '320', color: colors.judgements.x320, value: scoresHits.x320 },
        { label: '300', color: colors.judgements.x300, value: scoresHits.x300 },
        { label: '200', color: colors.judgements.x200, value: scoresHits.x200 },
        { label: '100', color: colors.judgements.x100, value: scoresHits.x100 },
        { label: '50', color: colors.judgements.x50, value: scoresHits.x50 },
        { label: 'Miss', color: colors.judgements.xMiss, value: scoresHits.xMiss },
    ];
    const scoresRanksLabels: BarPieChartData[] = [
        { label: 'XH', color: colors.ranks.xh, value: scoresRanks.xh },
        { label: 'X', color: colors.ranks.x, value: scoresRanks.x },
        { label: 'SH', color: colors.ranks.sh, value: scoresRanks.sh },
        { label: 'S', color: colors.ranks.s, value: scoresRanks.s },
        { label: 'A', color: colors.ranks.a, value: scoresRanks.a },
        { label: 'B', color: colors.ranks.b, value: scoresRanks.b },
        { label: 'C', color: colors.ranks.c, value: scoresRanks.c },
        { label: 'D', color: colors.ranks.d, value: scoresRanks.d },
    ];

    function getScoresHits() {
        let scoresHits = {
            x320: 0,
            x300: 0,
            x200: 0,
            x100: 0,
            x50: 0,
            xMiss: 0,
        }
        props.best.map((obj: Score) => {
            if (obj.mode !== 'osu') scoresHits.x320 += obj.statistics?.count_geki ? obj.statistics.count_geki : 0;
            scoresHits.x300 += obj.statistics?.count_300 ? obj.statistics.count_300 : 0;
            if (obj.mode !== 'osu') scoresHits.x200 += obj.statistics?.count_katu ? obj.statistics.count_katu : 0;
            scoresHits.x100 += obj.statistics?.count_100 ? obj.statistics.count_100 : 0;
            scoresHits.x50 += obj.statistics?.count_50 ? obj.statistics.count_50 : 0;
            scoresHits.xMiss += obj.statistics?.count_miss ? obj.statistics.count_miss : 0;
        });
        return scoresHits;
    }

    function getScoresRanks() {
        let scoresRanks = {
            xh: 0,
            x: 0,
            sh: 0,
            s: 0,
            a: 0,
            b: 0,
            c: 0,
            d: 0,
        }
        props.best.map((obj: any) => {
            scoresRanks.xh += obj.rank === "XH" ? 1 : 0;
            scoresRanks.x += obj.rank === "X" ? 1 : 0;
            scoresRanks.sh += obj.rank === "SH" ? 1 : 0;
            scoresRanks.s += obj.rank === "S" ? 1 : 0;
            scoresRanks.a += obj.rank === "A" ? 1 : 0;
            scoresRanks.b += obj.rank === "B" ? 1 : 0;
            scoresRanks.c += obj.rank === "C" ? 1 : 0;
            scoresRanks.d += obj.rank === "D" ? 1 : 0;
        });
        return scoresRanks
    }

    function calculateModifiedLength(length: number, mods: string[] | undefined) {
        if (!mods) return length;
        if (mods.includes('DT')) return length *= 0.75;
        if (mods.includes('HT')) return length *= 1.5;
        return length;
    }

    const lengths = props.best.map((score) => {
        return calculateModifiedLength(score.beatmap.total_length, score.mods);
    });
    const totalLength = lengths?.reduce((acc, length) => acc + length, 0);
    const averageLength = totalLength / props.best.length;

    function calculateModifiedBpm(bpm: number, mods: string[] | undefined) {
        if (!mods) return bpm
        if (mods.includes('DT')) bpm *= 1.5;
        if (mods.includes('HT')) bpm *= 0.75;
        return bpm;
    }

    const bpms = props.best.map((score) => {
        return calculateModifiedBpm(score.beatmap.bpm, score.mods);
    });
    const totalBpm = bpms?.reduce((acc, bpm) => acc + bpm, 0);

    const averageBpm = Math.round(totalBpm / props.best.length);
    const averageAcc = props.data.statistics.hit_accuracy;

    const averageCombo =
        Math.round(props.best
            .map((score) => score.max_combo)?.reduce((a, b) => a + b, 0) / props.best.length);
    const averagePP =
        Math.round(props.best
            .map(sc => sc.pp ? parseInt(sc.pp) : 0)?.reduce((a, b) => a + b, 0) / props.best.length);
    const averageRank = [...scoresRanksLabels].sort((a, b) => a.value - b.value).reverse()[0].label;

    return (
        <div className="grid grid-cols-2 gap-3 p-3">
            <div className="flex flex-col col-span-2 gap-2 items-center lg:col-span-1">
                <div>Hit Ratios</div>
                <BarPieChart data={scoresHitsLabels} width={250} />
            </div>
            <div className="flex flex-col col-span-2 gap-2 items-center lg:col-span-1">
                <div>Rank Ratios</div>
                <BarPieChart data={scoresRanksLabels} width={250} />
            </div>
            <div className="col-span-2">
                <PpLine data={props.best} color={colors.ui.font} width={350} />
            </div>
            <div className="flex flex-col col-span-2 items-center">
                <div>Average play:</div>
                <div className="flex flex-row flex-wrap gap-2 justify-center mt-2">
                    <div className="flex flex-row gap-1 items-center">
                        <div>Mods:</div>
                        <div className="flex flex-row gap-1">
                            {commonMods.map((mod: string, index: number) =>
                                <ModIcon acronym={mod} size={20} key={index + 1} />)}
                        </div>
                    </div>
                    <div>|</div>
                    <div className="flex flex-row gap-1 items-center">
                        <div>Length:</div>
                        <i className="bi bi-stopwatch"></i>
                        <div>
                            {secondsToTime(averageLength)}
                        </div>
                    </div>
                    <div>|</div>
                    <div className="flex flex-row gap-1 items-center">
                        <div>BPM:</div>
                        <div>{averageBpm}</div>
                    </div>
                    <div>|</div>
                    <div className="flex flex-row gap-1 items-center">
                        <div>Acc:</div>
                        <div>{averageAcc.toFixed(2)}%</div>
                    </div>
                    <div>|</div>
                    <div className="flex flex-row gap-1 items-center">
                        <div>Combo:</div>
                        <div>{averageCombo}x</div>
                    </div>
                    <div>|</div>
                    <div className="flex flex-row gap-1 items-center">
                        <div>PP:</div>
                        <div>{averagePP}pp</div>
                    </div>
                    <div>|</div>
                    <div className="flex flex-row gap-1 items-center">
                        <div>Rank:</div>
                        <div style={{ color: (colors.ranks as any)[averageRank.toLowerCase()] }}>
                            {averageRank}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopScoresPanel;