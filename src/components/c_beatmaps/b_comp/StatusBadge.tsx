import { BeatmapsetStatusType } from "../../../resources/interfaces/beatmapset";
import {colors} from "../../../resources/global/tools";

interface StatusBadgeProps {
    status: BeatmapsetStatusType
}
const StatusBadge = (props: StatusBadgeProps) => {
    return (
        <div style={{
            backgroundColor: (colors.beatmap as any)[props.status],
            color: "#000000"
        }} className="px-2 font-semibold rounded-full">
            {props.status}
        </div>
    )
}

export default StatusBadge;