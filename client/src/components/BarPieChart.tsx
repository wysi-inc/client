import React from "react";
import {BarPieChartData} from "./TopScoresPanel";

interface BarPieChartProps {
    title: string;
    data: BarPieChartData[];
}

const BarPieChart = (props: BarPieChartProps) => {
    const width: number = 300;
    const total: number = props.data.map((obj: BarPieChartData) => obj.value).reduce((acc: number, curr: number) => acc + curr, 0);
    return (
        <div className="d-flex flex-column align-items-center">
            <div>{props.title}:</div>
            <div className="progress-stacked">
                {props.data.map((obj: BarPieChartData, index: number) =>
                    <div className="progress darkenOnHover" role="progressbar"
                         data-tooltip-id={"tooltip"}
                         data-tooltip-content={`${obj.label}: ${Math.round((obj.value / total) * 100)}%`}
                         key={index + 1}
                         style={{width: ((obj.value / total) * 100 * (width / 100)) ? ((obj.value / total) * 100 * (width / 100)) : 0}}>
                        <div className="progress-bar" style={{backgroundColor: obj.color}}></div>
                    </div>
                )}
            </div>
            <div className="d-flex flex-row gap-3 justify-content-center">
                {props.data.map((obj: BarPieChartData, index: number) =>
                    obj.value > 0 &&
                    <div className="d-flex flex-column justify-content-center align-items-center" key={index}>
                        <div style={{color: obj.color}}>{obj.label}</div>
                        <div>{obj.value.toLocaleString()}</div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BarPieChart;