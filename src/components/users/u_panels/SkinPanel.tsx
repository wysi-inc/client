import { FaPaintBrush } from "react-icons/fa";
import TitleBar from "./TitleBar";

interface Props {
    className: string
}

const SkinPanel = (p: Props) => {
    return (
        <div className={p.className}>
            <TitleBar title={'Skin'} icon={<FaPaintBrush />} />
            <div className="flex flex-col gap-3 p-3">

            </div>
        </div>
    )
}

export default SkinPanel;