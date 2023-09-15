import React from "react";
import { BarPieChartData } from "./TopScoresPanel";

interface BarPieChartProps {
    title: string;
    data: BarPieChartData[];
}

const BarPieChart = (props: BarPieChartProps) => {
    const width: number = 300;
    const total: number = props.data.map((obj: BarPieChartData) => obj.value).reduce((acc: number, curr: number) => acc + curr, 0);
    return (
        <div className="flex flex-col items-center">
            <div>{props.title}:</div>
            <div className="flex flex-row rounded-full overflow-hidden">
                {props.data.map((obj: BarPieChartData, index: number) =>
                    <div className="simpleDarkenOnHover" key={index + 1}
                        style={{
                            width: ((obj.value / total) * 100 * (width / 100)) ? ((obj.value / total) * 100 * (width / 100)) : 0,
                            height: 8
                        }}>
                        <div className="w-full h-full" style={{ backgroundColor: obj.color }}></div>
                    </div>
                )}
            </div>
            <div className="flex flex-row gap-3 justify-center">
                {props.data.map((obj: BarPieChartData, index: number) =>
                    obj.value > 0 &&
                    <div className="flex flex-col justify-center items-center" key={index}>
                        <div style={{ color: obj.color }}>{obj.label}</div>
                        <div>{obj.value.toLocaleString()}</div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BarPieChart;