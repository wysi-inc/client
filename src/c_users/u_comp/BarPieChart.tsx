import { BarPieChartData } from "../u_panels/TopScoresPanel";

interface BarPieChartProps {
    data: BarPieChartData[];
    width: number;
}

const BarPieChart = (props: BarPieChartProps) => {
    const total: number = props.data.map((obj: BarPieChartData) => obj.value).reduce((acc: number, curr: number) => acc + curr, 0);
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-3 justify-between grow">
                {props.data.map((obj: BarPieChartData, index: number) =>
                    obj.value > 0 &&
                    <div className="flex flex-col justify-center items-center" key={index}>
                        <div className="font-bold" style={{ color: obj.color }}>{obj.label}</div>
                        <div>{obj.value.toLocaleString()}</div>
                    </div>
                )}
            </div>
            <div className="flex flex-row rounded-full">
                {props.data.map((obj: BarPieChartData, index: number) =>
                    <div key={index + 1} className="tooltip tooltip-bottom" data-tip={`${Math.round(obj.value / total * 100)}%`}>
                        <div className="simpleDarkenOnHover"
                            style={{
                                width: ((obj.value / total) * 100 * (props.width / 100)) ? ((obj.value / total) * 100 * (props.width / 100)) : 0,
                                height: 8
                            }}>
                            <div className="w-full h-full" style={{ backgroundColor: obj.color }}></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BarPieChart;