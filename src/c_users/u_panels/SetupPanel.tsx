import { useState } from "react";
import Keyboard from "./setup_comp/Keyboard";
import Tablet from "./setup_comp/Tablet";
import { Setup, User } from "../../resources/interfaces/user";
import { UserStore, UserStoreInt } from "../../resources/store/user";
import { TabletInterface, KeyboardInterface } from "../u_interfaces";
import { FaEdit, FaCheck, FaTimes, FaDesktop } from "react-icons/fa";
import fina from "../../helpers/fina";

interface SetupPanelProps {
    id: number,
    setup: Setup | null
}


const SetupPanel = (p: SetupPanelProps) => {
    const user = UserStore((state: UserStoreInt) => state.user);
    const me = user.id === p.id;


    const TABLET_EX: TabletInterface = {
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
    const KEYBOARD_EX: KeyboardInterface = {
        name: '',
        layout: '',
        keys: [],
    }

    let TABLET_INITIAL: TabletInterface = p.setup?.tablet || TABLET_EX;

    let KEYBOARD_INITIAL: KeyboardInterface = p.setup?.keyboard || KEYBOARD_EX;

    const [tabsIndex, setTabsIndex] = useState<number>(1);
    const [keyboard, setKeyboard] = useState<KeyboardInterface>(KEYBOARD_INITIAL);
    const [tablet, setTablet] = useState<TabletInterface>(TABLET_INITIAL);
    console.log(tablet);


    const [edit, setEdit] = useState<boolean>(false);


    function handleSubmit() {
        setEdit(false);

        fina.sput('/setup', {
            setup: {
                tablet,
                keyboard
            }
        })
        console.log({
            tablet,
            keyboard
        })

    }

    return (
        <div className="flex overflow-hidden flex-col col-span-5 rounded-lg drop-shadow-lg bg-custom-950 xl:col-span-3">
            <div className="shadow">
                <div className="flex flex-row gap-2 justify-center items-center p-2 bg-custom-800">
                    <FaDesktop />
                    <div>Setup</div>
                </div>
                <div className="grid grid-cols-6 items-center bg-custom-900">
                    <div className="col-span-4 col-start-2 justify-center content-center rounded-none bg-custom-900 tabs tabs-boxed">
                        <button onClick={() => setTabsIndex(1)}
                            className={`tab flex flex-row gap-2 ${tabsIndex === 1 && 'tab-active text-base-100'}`}>
                            <div>Inputs</div>
                        </button>
                        <button onClick={() => setTabsIndex(2)}
                            className={`tab flex flex-row gap-2 ${tabsIndex === 2 && 'tab-active text-base-100'}`}>
                            <div>Peripherals</div>
                        </button>
                        <button onClick={() => setTabsIndex(3)}
                            className={`tab flex flex-row gap-2 ${tabsIndex === 3 && 'tab-active text-base-100'}`}>
                            <div>PC</div>
                        </button>
                    </div>
                    <div className="flex flex-row gap-2 justify-end pr-2">
                        <div hidden={edit || !me}>
                            <button onClick={() => setEdit(true)} className="btn btn-warning btn-sm">
                                <FaEdit />
                            </button>
                        </div>
                        <div hidden={!edit}>
                            <button onClick={handleSubmit} className="btn btn-success btn-sm">
                                <FaCheck />
                            </button>
                        </div>
                        <div hidden={!edit}>
                            <button onClick={() => {
                                setEdit(false);
                                setKeyboard(KEYBOARD_INITIAL);
                                setTablet(TABLET_INITIAL);
                            }} className="btn btn-error btn-sm">
                                <FaTimes />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <div className={`grow p-4 ${edit ? '' : 'c-normal'}`} hidden={tabsIndex !== 1}>
                        <div className="flex flex-row gap-4 justify-around items-start">
                            <Keyboard keyboard={keyboard} setKeyboard={setKeyboard} edit={edit} />
                            <Tablet tablet={tablet} setTablet={setTablet} edit={edit} />
                        </div>
                    </div>
                    <div className="p-4 grow" hidden={tabsIndex !== 2}>

                    </div>
                    <div className="p-4 grow" hidden={tabsIndex !== 3}>

                    </div>
                    <div className="p-4 grow" hidden={tabsIndex !== 4}>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default SetupPanel;