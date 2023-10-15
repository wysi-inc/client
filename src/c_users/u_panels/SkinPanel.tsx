import { FaPaintBrush } from "react-icons/fa";

interface SkinProps {
    className: string
}

const SkinPanel = (p : SkinProps) => {
    return (
        <div className={p.className}>
                <div className="flex flex-row gap-2 justify-center items-center p-2 bg-custom-800">
                    <FaPaintBrush />
                    <div>Skin</div>
                </div>
                <div className="flex flex-col gap-3 p-3">

                </div>
            </div>
    )
}

export default SkinPanel;