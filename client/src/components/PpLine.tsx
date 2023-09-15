import React, { useState } from "react";
import { colors } from "../resources/store";
import { Tooltip } from "react-tooltip";
import { Score } from "../resources/interfaces";

interface PpLineProps {
    data: Score[];
    color: string;
}

const PpLine = (props: PpLineProps) => {
    const allPPs: number[] = props.data.map((score) => Math.round(score.pp));
    const [hoverScore, setHoverScore] = useState<string>('');
    return (
        <div className="flex flex-col justify-center items-center">
            <div>Top {props.data.length} plays</div>
            <div className="flex flex-row gap-2 items-center justify-center mt-2">
                <div>{allPPs[0]}pp</div>
                <div style={{ height: 8 }} className="flex flex-row rounded-full overflow-hidden">
                    {allPPs.map((num, index) =>
                        <div key={index + 1} className="simpleDarkenOnHover"
                            onMouseEnter={() => setHoverScore(`${props.data[index].beatmapset.title} [${props.data[index].beatmap.version}]: ${num}pp ${props.data[index].rank}`)}
                            onMouseLeave={() => setHoverScore('')}
                            style={{ width: 4, height: "100%", backgroundColor: (colors.ranks as any)[props.data[index].rank.toLowerCase()] }}></div>
                    )}
                </div>
                <div>{allPPs[allPPs.length - 1]}pp</div>
            </div>
            <div className="flex flex-row gap-2 items-center justify-center">
                <div style={{
                    height: 10,
                    borderLeft: `2px solid ${props.color}`
                }} className="flex items-end">
                    <div style={{
                        height: 2,
                        width: allPPs.length * 2,
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
                        width: allPPs.length * 2,
                        backgroundColor: props.color,
                    }}></div>
                </div>
            </div>
            <div style={{height: 20}}>
                {hoverScore}
            </div>
        </div>
    )
}
export default PpLine;