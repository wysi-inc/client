import { useState } from "react";
import Keyboard from "./setup_comp/Keyboard";
import Tablet from "./setup_comp/Tablet";
import { User } from "../../resources/interfaces/user";
import { UserStore, UserStoreInt } from "../../resources/store/user";
import { TabletInterface, KeyboardInterface } from "../u_interfaces";
import { FaEdit, FaCheck, FaTimes, FaDesktop } from "react-icons/fa";

interface SetupPanelProps {
    user: User
}


const SetupPanel = (p: SetupPanelProps) => {
    const user = UserStore((state: UserStoreInt) => state.user);
    const me = user.id === p.user.id;
    const TABLET_INITIAL: TabletInterface = {
        name: 'Wacom CTH-680',
        area: {
            w: 216,
            h: 121.5,
        },
        position: {
            x: 108,
            y: 60.75,
            r: 0,
        },
        size: {
            w: 216,
            h: 135,
        },
    };
    
    const KEYBOARD_INITIAL: KeyboardInterface = {
        name: 'Wooting 60HE',
        layout: 'k60',
        keys: ['z', 'x'],
    }

    const [tabsIndex, setTabsIndex] = useState<number>(1);
    const [keyboard, setKeyboard] = useState<KeyboardInterface>(KEYBOARD_INITIAL);
    const [tablet, setTablet] = useState<TabletInterface>(TABLET_INITIAL);

    const [edit, setEdit] = useState<boolean>(false);

    return (
        <div className="flex overflow-hidden flex-col col-span-5 rounded-lg drop-shadow-lg bg-custom-950 xl:col-span-3">
            <div className="shadow">
                <div className="flex flex-row gap-2 justify-center items-center p-2 bg-custom-800">
                    <FaDesktop/>
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
                            <button onClick={() => setEdit(false)} className="btn btn-success btn-sm">
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
                    <div className={`grow p-4 ${edit ? 'c-point' : 'c-normal'}`} hidden={tabsIndex !== 1}>
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