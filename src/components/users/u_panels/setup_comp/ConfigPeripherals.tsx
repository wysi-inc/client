import { useTranslation } from "react-i18next";
import EditInput from "./EditInput";

import { CgKeyboard } from "react-icons/cg";
import { BsKeyboard } from "react-icons/bs";
import { FaChair, FaHeadphonesAlt, FaMicrophoneAlt, FaMouse, FaRegEdit, FaSquare, FaTv, FaVideo } from "react-icons/fa";
import { TbDeviceAudioTape } from "react-icons/tb";
import { Peripherals } from "../../../../resources/types/user";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface Props {
    edit: boolean,
    peripherals: Peripherals,
    setPeripherals: Dispatch<SetStateAction<Peripherals>>;
}

const ConfigPeripherals = (p: Props) => {

    const { t } = useTranslation();

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        if (!p.edit) return;
        p.setPeripherals((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-3">
                <div className="col-span-1">Device</div>
                <div className="col-span-2">{t('user.sections.setup.components.details')}</div>
            </div>
            <div className="col-span-4 p-0 m-0 divider"></div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <CgKeyboard />
                    <div>Keypad</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.peripherals.keypad} onChange={handleChange} name="keypad" edit={p.edit} />
                </div>
            </div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <BsKeyboard />
                    <div>Keyboard</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.peripherals.keyboard} onChange={handleChange} name="keyboard" edit={p.edit} />
                </div>
            </div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <FaRegEdit />
                    <div>Tablet</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.peripherals.tablet} onChange={handleChange} name="tablet" edit={p.edit} />
                </div>
            </div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <FaMouse />
                    <div>Mouse</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.peripherals.mouse} onChange={handleChange} name="mouse" edit={p.edit} />
                </div>
            </div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <FaSquare />
                    <div>Mousepad</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.peripherals.mousepad} onChange={handleChange} name="mousepad" edit={p.edit} />
                </div>
            </div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <FaTv />
                    <div>Monitor</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.peripherals.monitor} onChange={handleChange} name="monitor" edit={p.edit} />
                </div>
            </div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <FaHeadphonesAlt />
                    <div>Headphones</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.peripherals.headphones} onChange={handleChange} name="headphones" edit={p.edit} />
                </div>
            </div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <FaMicrophoneAlt />
                    <div>Microhone</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.peripherals.microphone} onChange={handleChange} name="microphone" edit={p.edit} />
                </div>
            </div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <TbDeviceAudioTape />
                    <div>Audio Interface</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.peripherals.audio} onChange={handleChange} name="audio" edit={p.edit} />
                </div>
            </div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <FaVideo />
                    <div>Camera</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.peripherals.camera} onChange={handleChange} name="camera" edit={p.edit} />
                </div>
            </div>
            <div className="grid grid-cols-3">
                <div className="flex flex-row items-center col-span-1 gap-3">
                    <FaChair />
                    <div>Chair</div>
                </div>
                <div className="flex col-span-2">
                    <EditInput value={p.peripherals.chair} onChange={handleChange} name="chair" edit={p.edit} />
                </div>
            </div>
        </div>
    )
}

export default ConfigPeripherals;