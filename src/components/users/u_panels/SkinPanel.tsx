import { FaExternalLinkAlt, FaImage, FaPaintBrush } from "react-icons/fa";
import TitleBar from "./TitleBar";
import { GameModes } from "../../../resources/types/general";
import ModeIcon from "../../scores/s_comp/ModeIcon";
import { colors } from "../../../resources/global/tools";
import { Tooltip } from "react-tooltip";

interface Props {
    className: string
}

const SkinPanel = (p: Props) => {

    const id = "56?v=0";
    const imgs = [
        "8abf3a269dc458fb59071e9e77b20ec4",
        "5696ba49e36ed81ce4ad77e995c39c8b",
        "381e2beb54cd981d8da580713e3cd027",
        "b8f2f6d0d64c85b381c500fef54862b0",
        "801a843014356bd527d249681ec4518e",
        "093a6c7cebcfef5e11ffa756b2391ba9",
    ]

    return (
        <div className={p.className}>
            <TitleBar title={'Skins (wip)'} icon={<FaPaintBrush />} info="powered by skins.osuck.net"/>
            <div className="flex flex-col gap-3 p-3">
                <Tooltip id="skin-tooltip" />
                {[1, 2, 3].map(() =>
                    <a href={`https://skins.osuck.net/skins/${id}`} target="_blank" rel="noreferrer" referrerPolicy="no-referrer" className="flex flex-row justify-between px-4 py-2 rounded-lg simpleDarkenOnHover bg-custom-800">
                        <div className="flex flex-row items-center gap-3">
                            <FaExternalLinkAlt />
                            <div className="flex flex-row items-center gap-1">{GameModes.map((m) => <ModeIcon size={24} mode={m} color={(colors.modes as any)[m]} />)}</div>
                            <div className="text-lg">Rafis +HDDT v1.0</div>
                            <div className="text-sm">by Rafis</div>
                        </div>
                        <div className="flex flex-row items-center gap-3">
                            {imgs.map((img) =>
                                <div data-tooltip-id="skin-tooltip" className="text-lg"
                                    data-tooltip-html={`<img src="https://skimg.osuck.net/${img}_xs.webp" style="height: 180; width: 320;" />`}>
                                    <FaImage />
                                </div>
                            )}
                        </div>
                    </a>
                )}
            </div>
        </div>
    )
}

export default SkinPanel;
