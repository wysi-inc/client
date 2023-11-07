import { useState } from "react";

import { secondsToTime } from "../../../resources/global/functions";
import ReactSlider from "react-slider";

import './MultiSlider.css';

interface Props {
    min: number;
    max: number;
    step: number;
    minValue: number;
    maxValue: number;
    onChange: (min: number, max: number, name: string) => void;
    name: string;
    title: string;
    CSS_CLASS: string;
    maxTxt?: string;
}

const MultiSlider = (p: Props) => {
    const [values, setValues] = useState<number[]>([p.minValue, p.maxValue]);

    function handleSliderChange(value: number[]) {
        if (value[0] > value[1] - p.step) return;
        if (value[1] < value[0] + p.step) return;
        setValues([value[0], value[1]]);
    }

    function getFirstNum(): string {
        if (p.name !== 'len') return values[0].toString();
        return secondsToTime(values[0]);
    }

    function getLastNum(): string {
        if (p.maxTxt && values[1] >= p.max) return p.maxTxt;
        if (p.name !== 'len') return values[1].toString();
        return secondsToTime(values[1]);
    }

    return (<div>
        <div className="text-center">{p.title}:</div>
        <div className="flex flex-row items-center justify-center gap-4">
            <div className="w-14 text-end">{getFirstNum()}</div>
            <div className="relative h-5 grow">
                <div className="absolute w-full">
                    <div className={`w-full relative rounded-full h-5 ${p.CSS_CLASS} overflow-hidden`}>
                        <div className="absolute h-5 border-2 border-white rounded-full" style={{
                            left: `${((values[0] - p.min) / (p.max - p.min)) * 100}%`,
                            width: `${((values[1] - values[0]) / (p.max - p.min)) * 100}%`,
                        }}></div>
                    </div>
                </div>
                <div className="absolute w-full h-5">
                    <ReactSlider
                        min={p.min}
                        max={p.max}
                        step={p.step}
                        value={values}
                        onChange={handleSliderChange}
                        onAfterChange={() => p.onChange(values[0], values[1], p.name)}
                        className="h-5 slider"
                        thumbClassName="thumb"
                        trackClassName="track"
                    />
                </div>
            </div>
            <div className="w-14 text-start">
                {getLastNum()}
            </div>
        </div>
    </div>);

}

export default MultiSlider;

// <input className="z-10 w-full" type="range"
//     min={p.min} max={p.max} value={values[0]}
//     onChange={(e) => handleSliderChange(e, 0)} step={p.step} />
// <input className="z-10 w-full" type="range"
//     min={p.min} max={p.max} value={values[1]}
//     onChange={(e) => handleSliderChange(e, 1)} step={p.step} />