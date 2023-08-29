import React, {useEffect, useState} from "react";
import {BeatmapScore, userData} from "../resources/interfaces";
import {colors} from "../resources/store";
import PpLine from "./PpLine";
import BarPieChart from "./BarPieChart";

interface topScoresProps {
    data: userData;
    best: BeatmapScore[];
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

    const scoresHitsLabels: BarPieChartData[] = [
        {label: '320', color: colors.judgements.x320, value: scoresHits.x320},
        {label: '300', color: colors.judgements.x300, value: scoresHits.x300},
        {label: '200', color: colors.judgements.x200, value: scoresHits.x200},
        {label: '100', color: colors.judgements.x100, value: scoresHits.x100},
        {label: '50', color: colors.judgements.x50, value: scoresHits.x50},
        {label: 'Miss', color: colors.judgements.xMiss, value: scoresHits.xMiss},
    ];
    const scoresRanksLabels: BarPieChartData[] = [
        {label: 'XH', color: colors.ranks.xh, value: scoresRanks.xh},
        {label: 'X', color: colors.ranks.x, value: scoresRanks.x},
        {label: 'SH', color: colors.ranks.sh, value: scoresRanks.sh},
        {label: 'S', color: colors.ranks.s, value: scoresRanks.s},
        {label: 'A', color: colors.ranks.a, value: scoresRanks.a},
        {label: 'B', color: colors.ranks.b, value: scoresRanks.b},
        {label: 'C', color: colors.ranks.c, value: scoresRanks.c},
        {label: 'D', color: colors.ranks.d, value: scoresRanks.d},
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
        props.best.map((obj: BeatmapScore) => {
            scoresHits.x320 += obj.statistics?.perfect ? obj.statistics.perfect : 0;
            scoresHits.x300 += obj.statistics?.great ? obj.statistics.great : 0;
            scoresHits.x200 += obj.statistics?.good ? obj.statistics.good : 0;
            scoresHits.x100 += obj.statistics?.ok ? obj.statistics.ok : 0;
            scoresHits.x50 += obj.statistics?.meh ? obj.statistics.meh : 0;
            scoresHits.xMiss += obj.statistics?.miss ? obj.statistics.miss : 0;
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

    return (
        <div className="row">
            <div className="p-3 row">
                <div className="col-12 col-lg-6 mt-3">
                    <BarPieChart title={"Hit Ratios"} data={scoresHitsLabels}/>
                </div>
                <div className="col-12 col-lg-6 mt-3">
                    <BarPieChart title={"Rank Ratios"} data={scoresRanksLabels}/>
                </div>
                <div className="col-12 mt-4">
                    <PpLine data={props.best} color={colors.ui.font}/>
                </div>
            </div>
        </div>
    )
}

export default TopScoresPanel;