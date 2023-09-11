import React from "react";
import {colors} from "../resources/store";
import {BeatmapsetStatusType} from "../resources/types";
interface StatusBadgeProps {
    status: BeatmapsetStatusType
}
const StatusBadge = (props: StatusBadgeProps) => {
    return (
        <div style={{
            backgroundColor: (colors.beatmap as any)[props.status],
            color: "#000000"
        }} className="rounded-pill px-2 fw-bold">
            {props.status}
        </div>
    )
}

export default StatusBadge;