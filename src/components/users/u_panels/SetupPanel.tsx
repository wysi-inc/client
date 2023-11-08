import { useState } from "react";

import { useTranslation } from "react-i18next";

import { BsGpuCard } from "react-icons/bs";
import { FaComputer } from "react-icons/fa6";
import { FaCheck, FaEdit, FaKeyboard, FaTimes, FaWheelchair } from "react-icons/fa";

import fina from "../../../helpers/fina";
import ConfigMouse from "./setup_comp/ConfigMouse";
import ConfigTablet from "./setup_comp/ConfigTablet";
import ConfigComputer from "./setup_comp/ConfigComputer";
import ConfigKeyboard from "./setup_comp/ConfigKeyboard";
import { Setup } from "../../../resources/types/user";
import { useDivSize } from "../../../resources/hooks/globalHooks";
import { UserStore, UserStoreInt } from "../../../resources/global/user";
import { Computer, Keyboard, Mouse, Tablet } from "../../../resources/types/setup";
import TitleBar from "./TitleBar";

interface Props {
    userId: number,
    setup: Setup | null,
    className: string;
    playstyle: string[] | null,
}

const SetupPanel = (p: Props) => {
    const {t} = useTranslation();

    const user = UserStore((state: UserStoreInt) => state.user);
    const me = user.id === p.userId;

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
    }
    const MOUSE_EX: Mouse = {
        name: "",
        dpi: 0
    }
    const COMPUTER_EX: Computer = {
        cpu: "",
        gpu: "",
        ram: "",
        psu: "",
        storage: "",
        motherboard: "",
        case: "",
    }

    const [TABLET_INITIAL, setTABLET_INITIAL ] = useState<Tablet>(p.setup?.tablet || TABLET_EX);
    const [KEYBOARD_INITIAL, setKEYBOARD_INITIAL ] = useState<Keyboard>(p.setup?.keyboard || KEYBOARD_EX);
    const [MOUSE_INITIAL, setMOUSE_INITIAL ] = useState<Mouse>(p.setup?.mouse || MOUSE_EX);
    const [COMPUTER_INITIAL, setCOMPUTER_INITIAL ] = useState<Computer>(p.setup?.computer || COMPUTER_EX);

    const [tabsIndex, setTabsIndex] = useState<number>(1);
    const [edit, setEdit] = useState<boolean>(false);

    const [keyboard, setKeyboard] = useState<Keyboard>(KEYBOARD_INITIAL);
    const [mouse, setMouse] = useState<Mouse>(MOUSE_INITIAL);
    const [tablet, setTablet] = useState<Tablet>(TABLET_INITIAL);
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
                computer
            }
        });
        setKEYBOARD_INITIAL(keyboard);
        setMOUSE_INITIAL(mouse);
        setTABLET_INITIAL(tablet);
        setCOMPUTER_INITIAL(computer);
        setEdit(false);
    }

    const {divPx, divRef} = useDivSize('w', 300);

    return (
        <div className={p.className}>
            <div className="shadow">
                <TitleBar title={t('user.sections.setup.title')} icon={<FaComputer />} />
                <div className="grid items-center grid-cols-6 bg-custom-900">
                    <div className="content-center justify-center col-span-4 col-start-2 rounded-none bg-custom-900 tabs tabs-boxed">
                        <button onClick={() => setTabsIndex(1)}
                            className={`tab flex flex-row gap-2 ${tabsIndex === 1 && 'tab-active text-base-100'}`}>
                            <FaKeyboard />
                            <div>{t('user.sections.setup.tabs.inputs')}</div>
                        </button>
                        <button onClick={() => setTabsIndex(2)}
                            className={`tab flex flex-row gap-2 ${tabsIndex === 2 && 'tab-active text-base-100'}`}>
                            <FaWheelchair />
                            <div>{t('user.sections.setup.tabs.peripherals')}</div>
                        </button>
                        <button onClick={() => setTabsIndex(3)}
                            className={`tab flex flex-row gap-2 ${tabsIndex === 3 && 'tab-active text-base-100'}`}>
                            <BsGpuCard />
                            <div>{t('user.sections.setup.tabs.computer')}</div>
                        </button>
                    </div>
                    <div className="flex flex-row justify-end gap-2 pr-2">
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
                </div>
                <div className={`flex items-center ${tabsIndex === 1 && p.playstyle && p.playstyle.length > 2 && 'overflow-x-scroll'}`} ref={divRef}>
                    <div className={`grow p-4 ${edit === false && 'c-normal'}`} hidden={tabsIndex !== 1}>
                        <div className="flex flex-row gap-6">
                            {p.playstyle?.includes('keyboard') && <ConfigKeyboard width={divPx / 2 - 30} height={228} keyboard={keyboard} setKeyboard={setKeyboard} edit={edit} />}
                            {p.playstyle?.includes('tablet') && <ConfigTablet width={divPx / 2 - 30} height={228} tablet={tablet} setTablet={setTablet} edit={edit} />}
                            {p.playstyle?.includes('mouse') && <ConfigMouse width={divPx / 2 - 30} height={228} mouse={mouse} setMouse={setMouse} edit={edit} />}
                        </div>
                    </div>
                    <div className="p-4 grow" hidden={tabsIndex !== 2}>

                    </div>
                    <div className="p-4 grow" hidden={tabsIndex !== 3}>
                        <ConfigComputer computer={computer} setComputer={setComputer} edit={edit} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SetupPanel;