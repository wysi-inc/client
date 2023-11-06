import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import PpLine from "../u_comp/PpLine";
import BarPieChart from "../u_comp/BarPieChart";
import ModIcon from "../../scores/s_comp/ModIcon";
import { Score } from "../../../resources/types/score";
import { colors } from "../../../resources/global/tools";
import { secondsToTime } from "../../../resources/global/functions";
import Loading from "../../../web/w_comp/Loading";
import TitleBar from "./TitleBar";
import { FaChartPie } from "react-icons/fa";
import { GameMode } from "../../../resources/types/general";
import fina from "../../../helpers/fina";
import { useQuery } from "react-query";

// interface Props {
//     data: User;
//     best: Score[];
// }

interface Props {
    userId: number,
    mode: GameMode,
    className: string,
}

export interface BarPieChartData {
    label: string,
    color: string,
    value: number,
}

const ScoresSumary = (p: Props) => {
    const { t } = useTranslation();

    const { data: bestData, status: bestStatus } = useQuery(['bestDataaa', p.userId, p.mode], getBest);

    if (bestStatus === 'loading') return (<Loading />);
    if (bestStatus === 'error') return (<div></div>);

    if (bestData.length < 1) return (<div></div>);

    const best: Score[] = bestData;

    const commonMods = getCommonMods(best);

    const scoresHits = getScoresHits(best);

    const scoresRanks = getScoresRanks(best);

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

    const lengths = best.map((score: Score) => calculateModifiedLength(score.beatmap.total_length, score.mods));
    const totalLength = lengths?.reduce((acc: number, length: number) => acc + length, 0);
    const averageLength = totalLength / best.length;

    const bpms = best.map((score: Score) => calculateModifiedBpm(score.beatmap.bpm, score.mods));
    const totalBpm = bpms?.reduce((acc: number, bpm: number) => acc + bpm, 0);

    const averageBpm = Math.round(totalBpm / best.length);
    const averageAcc = 100;

    const averageCombo = Math.round(best.map((score: Score) => score.max_combo)?.reduce((a: number, b: number) => a + b, 0) / best.length);
    const averagePP = Math.round(best.map((sc: Score) => sc.pp ? parseInt(sc.pp) : 0)?.reduce((a: number, b: number) => a + b, 0) / best.length);
    const averageRank = [...scoresRanksLabels].sort((a, b) => a.value - b.value).reverse()[0].label;

    return (
        <div className={p.className + " pb-3"}>
            <TitleBar title={t('user.sections.scores_summary.title')} icon={<FaChartPie />} info="this is a summary of the user's top plays" />
            <div className="grid grid-cols-2 gap-3 p-3 grow">
                <div className="flex flex-col items-center col-span-2">
                    <div>{t('user.sections.scores_summary.tabs.average_play')}:</div>
                    <div className="flex flex-row flex-wrap justify-center gap-2 mt-2">
                        <div className="flex flex-row items-center gap-1">
                            <div>{t('score.mods')}:</div>
                            <div className="flex flex-row gap-1">
                                {commonMods.map((mod: string, index: number) =>
                                    <ModIcon acronym={mod} size={20} key={index + 1} />)}
                            </div>
                        </div>
                        <div>|</div>
                        <div className="flex flex-row items-center gap-1">
                            <div>{t('beatmapset.length')}:</div>
                            <i className="bi bi-stopwatch"></i>
                            <div>
                                {secondsToTime(averageLength)}
                            </div>
                        </div>
                        <div>|</div>
                        <div className="flex flex-row items-center gap-1">
                            <div>{t('beatmapset.bpm')}:</div>
                            <div>{averageBpm}</div>
                        </div>
                        <div>|</div>
                        <div className="flex flex-row items-center gap-1">
                            <div>{t('score.acc')}:</div>
                            <div>{averageAcc.toFixed(2)}%</div>
                        </div>
                        <div>|</div>
                        <div className="flex flex-row items-center gap-1">
                            <div>{t('score.combo')}:</div>
                            <div>{averageCombo}x</div>
                        </div>
                        <div>|</div>
                        <div className="flex flex-row items-center gap-1">
                            <div>PP:</div>
                            <div>{averagePP}pp</div>
                        </div>
                        <div>|</div>
                        <div className="flex flex-row items-center gap-1">
                            <div>{t('score.grade')}:</div>
                            <div style={{ color: (colors.ranks as any)[averageRank.toLowerCase()] }}>
                                {averageRank}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-2">
                    <PpLine data={best} color={colors.ui.font} width={350} />
                </div>
                <div className="flex flex-col items-center col-span-2 gap-2 lg:col-span-1">
                    <div>{t('user.sections.scores_summary.tabs.hit_ratios')}</div>
                    <BarPieChart data={scoresHitsLabels} width={250} />
                </div>
                <div className="flex flex-col items-center col-span-2 gap-2 lg:col-span-1">
                    <div>{t('user.sections.scores_summary.tabs.grade_ratios')}</div>
                    <BarPieChart data={scoresRanksLabels} width={250} />
                </div>
            </div>
        </div>
    )

    function calculateModifiedBpm(bpm: number, mods: string[] | undefined) {
        if (!mods) return bpm
        if (mods.includes('DT')) bpm *= 1.5;
        if (mods.includes('HT')) bpm *= 0.75;
        return bpm;
    }

    function getScoresHits(scores: Score[]) {
        let scoresHits = {
            x320: 0,
            x300: 0,
            x200: 0,
            x100: 0,
            x50: 0,
            xMiss: 0,
        }
        scores.forEach((sc: Score) => {
            const statistics = sc.statistics;
            if (sc.mode !== "osu") {
                scoresHits.x320 += statistics.count_geki || 0;
                scoresHits.x200 += statistics.count_katu || 0;
            }
            scoresHits.x300 += statistics.count_300 || 0;
            scoresHits.x100 += statistics.count_100 || 0;
            scoresHits.x50 += statistics.count_50 || 0;
            scoresHits.xMiss += statistics.count_miss || 0;
        })
        return scoresHits;
    }

    function getScoresRanks(scores: Score[]) {
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
        scores.forEach((sc: Score) => {
            scoresRanks.xh += sc.rank === "XH" ? 1 : 0;
            scoresRanks.x += sc.rank === "X" ? 1 : 0;
            scoresRanks.sh += sc.rank === "SH" ? 1 : 0;
            scoresRanks.s += sc.rank === "S" ? 1 : 0;
            scoresRanks.a += sc.rank === "A" ? 1 : 0;
            scoresRanks.b += sc.rank === "B" ? 1 : 0;
            scoresRanks.c += sc.rank === "C" ? 1 : 0;
            scoresRanks.d += sc.rank === "D" ? 1 : 0;
        });
        return scoresRanks
    }

    function calculateModifiedLength(length: number, mods: string[] | undefined) {
        if (!mods) return length;
        if (mods.includes('DT')) return length *= 0.75;
        if (mods.includes('HT')) return length *= 1.5;
        return length;
    }

    function getCommonMods(scores: Score[]) {
        if (!scores) return [];
        console.log("SCORESSSSS",scores);
        let modsCounter: any = {};
        scores.forEach((score) => {
            const mods = score.mods.length > 0 ? score.mods.map((mod) => mod) : ['NM'];
            const key = mods.join('-');

            if (modsCounter[key]) {
                modsCounter[key] += 1;
            } else {
                modsCounter[key] = 1;
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

        const commonMods = largestKey ? largestKey.split('-').map(String) : [];
        return commonMods;
    };

    function getBest() {
        return fina.post('/user/scores', {
            id: p.userId,
            mode: p.mode,
            limit: 100,
            offset: 0,
            type: 'best'
        });
    }


}


export default ScoresSumary;