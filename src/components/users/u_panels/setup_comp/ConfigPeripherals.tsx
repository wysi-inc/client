import { useTranslation } from "react-i18next";
import EditInput from "./EditInput";

import { CgKeyboard } from "react-icons/cg";
import { BsKeyboard } from "react-icons/bs";
import { FaHeadphonesAlt, FaMicrophoneAlt, FaMouse, FaRegEdit, FaSquare, FaTv, FaVideo } from "react-icons/fa";
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

    const items = [
        { name: "keypad", title: "Keypad", icon: <CgKeyboard /> },
        { name: "keyboard", title: "Keyboard", icon: <BsKeyboard /> },
        { name: "tablet", title: "Tablet", icon: <FaRegEdit /> },
        { name: "mouse", title: "Mouse", icon: <FaMouse /> },
        { name: "mousepad", title: "Mousepad", icon: <FaSquare /> },
        { name: "monitor", title: "Monitor", icon: <FaTv /> },
        { name: "headphones", title: "Headphones", icon: <FaHeadphonesAlt /> },
        { name: "microphone", title: "Microphone", icon: <FaMicrophoneAlt /> },
        { name: "audio", title: "Audio Interface", icon: <TbDeviceAudioTape /> },
        { name: "camera", title: "Camera", icon: <FaVideo /> },
        { name: "chair", title: "Chair", icon: <CgKeyboard /> },
    ]

    return (
        <table className="table">
            <thead>
                <tr>
                    <th className="p-1">Device</th>
                    <th className="p-1">{t('user.sections.setup.components.details')}</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, i: number) =>
                    (p.peripherals as any)[item.name] !== "" || p.edit ?
                        <tr key={i}>
                            <th className="flex flex-row items-center gap-3 p-1">{item.icon}<div>{item.title}</div></th>
                            <th className="p-1">
                                <EditInput value={(p.peripherals as any)[item.name]} onChange={handleChange} name={item.name} edit={p.edit} />
                            </th>
                        </tr> : ''
                )}
            </tbody>
        </table>
    )
}

export default ConfigPeripherals;