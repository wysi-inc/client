import MultiRangeSlider, { ChangeResult } from "multi-range-slider-react";

interface SliderProps {
    min: number,
    max: number,
    step: number,
    minValue: number,
    maxValue: number,
    handleChange: (e: ChangeResult, name: string) => void,
    name: string,
    code: string,
    CSS_CLASS: string,
    maxTxt?: string,
}

const Slider = (p: SliderProps) => {
    return (<>
        <div className="text-center">{p.name}:</div>
        <div className="flex flex-row items-center justify-center gap-4">
            <div className="w-20 text-end">{p.minValue}</div>
            <MultiRangeSlider
                className={`grow ${p.CSS_CLASS}`}
                min={p.min}
                max={p.max}
                step={0.5}
                stepOnly={true}
                ruler={false}
                label={false}
                minValue={p.minValue}
                maxValue={p.maxValue}
                onChange={(e) => p.handleChange(e, p.code)}
            />
            <div className="w-20 text-start">{!p.maxTxt ? p.maxValue : p.maxValue < p.max ? p.maxValue : p.maxTxt}</div>
        </div>
    </>)
}

export default Slider;