import { BeatmapsetStatus } from "../../../resources/types/beatmapset";
import {colors} from "../../../resources/global/tools";
import { useTranslation } from "react-i18next";

interface Props {
    status: BeatmapsetStatus
}
const StatusBadge = (p: Props) => {
    const {t} = useTranslation();
    return (
        <div style={{
            backgroundColor: (colors.beatmap as any)[p.status],
            color: "#000000"
        }} className="px-2 font-semibold rounded-full">
            {t(`beatmapset.status.${p.status}`).toLowerCase()}
        </div>
    )
}

export default StatusBadge;