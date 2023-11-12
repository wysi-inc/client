import { useState } from "react";

import { useTranslation } from "react-i18next";

import { FaComputer } from "react-icons/fa6";
import { FaCheck, FaEdit, FaKeyboard, FaTimes } from "react-icons/fa";

import fina from "../../../helpers/fina";
import ConfigMouse from "./setup_comp/ConfigMouse";
import ConfigTablet from "./setup_comp/ConfigTablet";
import ConfigComputer from "./setup_comp/ConfigComputer";
import ConfigKeyboard from "./setup_comp/ConfigKeyboard";
import { Peripherals, Setup } from "../../../resources/types/user";
import { UserStore, UserStoreInt } from "../../../resources/global/user";
import { Computer, Keyboard, Mouse, Tablet } from "../../../resources/types/setup";
import TitleBar from "./TitleBar";
import ConfigPeripherals from "./setup_comp/ConfigPeripherals";
import { BsGpuCard } from "react-icons/bs";

interface Props {
    userId: number,
    setup: Setup | null,
    className: string;
    playstyle: string[] | null,
};

const TABLET_EX: Tablet = {
    name: '',
    area: {
        w: 0,
        h: 0
    },
    position: {
        x: 0,
        y: 0,
        r: 0,
    },
    size: {
        w: 0,
        h: 0,
    },
};
const KEYBOARD_EX: Keyboard = {
    name: '',
    layout: 'k60',
    keys: [],
};
const MOUSE_EX: Mouse = {
    name: "",
    dpi: 0
};
const PERIPHERALS_EX: Peripherals = {
    monitor: "",
    headphones: "",
    microphone: "",
    tablet: "",
    mouse: "",
    keyboard: "",
    keypad: "",
    mousepad: "",
    chair: "",
    camera: "",
    audio: "",
};
const COMPUTER_EX: Computer = {
    cpu: "",
    gpu: "",
    ram: "",
    psu: "",
    storage: "",
    motherboard: "",
    case: "",
};

const SetupPanel = (p: Props) => {
    const { t } = useTranslation();

    const user = UserStore((state: UserStoreInt) => state.user);
    const me = user.id === p.userId;

    const [TABLET_INITIAL, setTABLET_INITIAL] = useState<Tablet>(p.setup?.tablet || TABLET_EX);
    const [KEYBOARD_INITIAL, setKEYBOARD_INITIAL] = useState<Keyboard>(p.setup?.keyboard || KEYBOARD_EX);
    const [MOUSE_INITIAL, setMOUSE_INITIAL] = useState<Mouse>(p.setup?.mouse || MOUSE_EX);
    const [PERIPHERALS_INITIAL, setPERIPHERALS_INITIAL] = useState<Peripherals>(p.setup?.peripherals || PERIPHERALS_EX);
    const [COMPUTER_INITIAL, setCOMPUTER_INITIAL] = useState<Computer>(p.setup?.computer || COMPUTER_EX);

    const [edit, setEdit] = useState<boolean>(false);

    const [keyboard, setKeyboard] = useState<Keyboard>(KEYBOARD_INITIAL);
    const [mouse, setMouse] = useState<Mouse>(MOUSE_INITIAL);
    const [tablet, setTablet] = useState<Tablet>(TABLET_INITIAL);
    const [peripherals, setPeripherals] = useState<Peripherals>(PERIPHERALS_INITIAL);
    const [computer, setComputer] = useState<Computer>(COMPUTER_INITIAL);

    function handleEdit() {
        setEdit(true);
    }

    function handleCancel() {
        setKeyboard(KEYBOARD_INITIAL);
        setMouse(MOUSE_INITIAL);
        setTablet(TABLET_INITIAL);
        setComputer(COMPUTER_INITIAL);
        setEdit(false);
    }

    function handleSubmit() {
        fina.sput('/user/setup', {
            setup: {
                tablet,
                keyboard,
                mouse,
                peripherals,
                computer
            }
        });
        setKEYBOARD_INITIAL(keyboard);
        setMOUSE_INITIAL(mouse);
        setTABLET_INITIAL(tablet);
        setCOMPUTER_INITIAL(computer);
        setPERIPHERALS_INITIAL(peripherals);
        setEdit(false);
    }

    const editButton = (
        <div className="flex flex-row gap-2">
            <div hidden={edit || !me}>
                <button onClick={handleEdit} className="btn btn-warning btn-sm">
                    <FaEdit />
                </button>
            </div>
            <div hidden={!edit}>
                <button onClick={handleSubmit} className="btn btn-success btn-sm">
                    <FaCheck />
                </button>
            </div>
            <div hidden={!edit}>
                <button onClick={handleCancel} className="btn btn-error btn-sm">
                    <FaTimes />
                </button>
            </div>
        </div>
    )

    return (
        <div className={p.className}>
            <TitleBar
                title={t('user.sections.setup.title')}
                icon={<FaComputer />} left={editButton}
                info="to configure the keyboard, mouse and tablet first enable them on the official osu!settings" />
            <div className="flex flex-col gap-3 p-3">
                <div className="flex flex-row flex-wrap items-start justify-around gap-3 p-3">
                    {p.playstyle?.includes('keyboard') &&
                        <ConfigKeyboard
                            width={300} height={228}
                            keyboard={keyboard}
                            setKeyboard={setKeyboard}
                            edit={edit} />}
                    {p.playstyle?.includes('tablet') &&
                        <ConfigTablet
                            width={300} height={228}
                            tablet={tablet}
                            setTablet={setTablet}
                            edit={edit} />}
                    {p.playstyle?.includes('mouse') &&
                        <ConfigMouse
                            width={300} height={228}
                            mouse={mouse}
                            setMouse={setMouse}
                            edit={edit} />}
                </div>
                <div className="rounded-lg collapse collapse-arrow bg-custom-800">
                    <input type="checkbox" />
                    <div className="flex flex-row items-center gap-3 collapse-title">
                        <FaKeyboard />
                        <div>{t("user.sections.setup.tabs.peripherals")}</div>
                    </div>
                    <div className="collapse-content">
                        <ConfigPeripherals
                            peripherals={peripherals}
                            setPeripherals={setPeripherals}
                            edit={edit} />
                    </div>
                </div>
                <div className="rounded-lg collapse collapse-arrow bg-custom-800">
                    <input type="checkbox" />
                    <div className="flex flex-row items-center gap-3 collapse-title">
                        <BsGpuCard />
                        <div>{t("user.sections.setup.tabs.computer")}</div>
                    </div>
                    <div className="collapse-content">
                        <ConfigComputer
                            computer={computer}
                            setComputer={setComputer}
                            edit={edit} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SetupPanel;