import { BeatmapsetStatusType } from "../../../resources/interfaces/beatmapset";
import {colors} from "../../../resources/global/tools";
import { useTranslation } from "react-i18next";

interface StatusBadgeProps {
    status: BeatmapsetStatusType
}
const StatusBadge = (p: StatusBadgeProps) => {
    const {t} = useTranslation();
    return (
        <div style={{
            backgroundColor: (colors.beatmap as any)[p.status],
            color: "#000000"
        }} className="px-2 font-semibold rounded-full">
            {t(`beatmapset.status.${p.status}`)}
        </div>
    )
}

export default StatusBadge;