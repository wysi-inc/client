import React, { useState } from "react";
import { colors } from "../../../resources/global/tools";
import { Score } from "../../../resources/interfaces/score";

interface PpLineProps {
    data: Score[];
    color: string;
    width: number;
}

const PpLine = (props: PpLineProps) => {
    const allPPs: number[] = props.data.map((score) => score.pp ? Math.round(parseInt(score.pp)) : 0);
    const [hoverScore, setHoverScore] = useState<string>('');
    return (
        <div className="flex flex-col items-center justify-center">
            <div>Top {props.data.length} plays</div>
            <div className="flex flex-row items-center justify-center gap-2 mt-2">
                <div>{allPPs[0]}pp</div>
                <div style={{ height: 8 }} className="flex flex-row rounded-full">
                    {allPPs.map((num, index) =>
                        <div key={index + 1} className="simpleDarkenOnHover tooltip" data-tip={hoverScore}
                            onMouseEnter={() => setHoverScore(`${props.data[index].beatmapset.title} [${props.data[index].beatmap.version}]: ${num}pp ${props.data[index].rank}`)}
                            onMouseLeave={() => setHoverScore('')}
                            style={{ width: props.width / props.data.length, height: "100%", backgroundColor: (colors.ranks as any)[props.data[index].rank.toLowerCase()] }}></div>
                    )}
                </div>
                <div>{allPPs[allPPs.length - 1]}pp</div>
            </div>
            <div className="flex flex-row items-center justify-center gap-2">
                <div style={{
                    height: 10,
                    borderLeft: `2px solid ${props.color}`
                }} className="flex items-end">
                    <div style={{
                        height: 2,
                        width: props.width / 2,
                        backgroundColor: props.color,
                    }}></div>
                </div>
                <div>{allPPs[0] - allPPs[allPPs.length - 1]}pp</div>
                <div style={{
                    height: 10,
                    borderRight: `2px solid ${props.color}`
                }}
                    className="flex items-end">
                    <div style={{
                        height: 2,
                        width: props.width / 2,
                        backgroundColor: props.color,
                    }}></div>
                </div>
            </div>
        </div>
    )
}
export default PpLine;