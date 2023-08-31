import React from "react";
import {colors} from "../resources/store";
import {Tooltip} from "react-tooltip";
import {BeatmapScore} from "../resources/interfaces";

interface PpLineProps {
    data: BeatmapScore[];
    color: string;
}

const PpLine = (props: PpLineProps) => {
    const allPPs: number[] = props.data.map((score) => Math.round(score.pp));
    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <Tooltip id="ppLineTooltip"/>
            <div>Top {props.data.length} plays</div>
            <div className="d-flex flex-row gap-2 align-items-center justify-content-center mt-2">
                <div>{allPPs[0]}pp</div>
                <div style={{height: 15}} className="d-flex flex-row rounded overflow-hidden">
                    {allPPs.map((num, index) =>
                        <div key={index + 1} data-tooltip-id={"ppLineTooltip"}
                             data-tooltip-content={`${props.data[index].beatmapset.title} [${props.data[index].beatmap.version}]: ${num}pp`}

                             className="simpleDarkenOnHover"
                             style={{width: 4, height: "100%", backgroundColor: (colors.ranks as any)[props.data[index].rank.toLowerCase()]}}></div>
                    )}
                </div>
                <div>{allPPs[allPPs.length - 1]}pp</div>
            </div>
            <div className="d-flex flex-row gap-2 align-items-center justify-content-center">
                <div style={{
                    height: 10,
                    borderLeft: `2px solid ${props.color}`
                }} className="d-flex align-items-end">
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
                     className="d-flex align-items-end">
                    <div style={{
                        height: 2,
                        width: allPPs.length * 2,
                        backgroundColor: props.color,
                    }}></div>
                </div>
            </div>
        </div>
    )
}
export default PpLine;