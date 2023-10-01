import { Dispatch, SetStateAction } from "react";
import Key from "./Key";
import { KeyboardInterface } from "../../u_interfaces";


interface propsInterface {
    keyboard: KeyboardInterface;
    setKeyboard: Dispatch<SetStateAction<KeyboardInterface>>;
    edit: boolean;
}

const Keyboard = (p: propsInterface) => {
    function toggle(key: string) {
        if (p.edit) p.setKeyboard((prev) => ({ ...prev, keys: prev.keys.includes(key) ? prev.keys.filter(o => o !== key) : [...prev.keys, key] }));
    }

    return (
        <div className="flex flex-col gap-3 items-center">
            <div>{p.keyboard.name}</div>
            <div className="grid justify-center items-center p-3 rounded-lg border">
                <div className="grid justify-center items-center" style={{ maxHeight: 28.15 * 5, maxWidth: 422.24 }}>
                    <div className="flex flex-col" style={{ transform: 'scale(80%) translateY(-22px)' }}>
                        <div className="flex flex-row items-start">
                            <Key char={'␛'} code={'esc'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'1'} code={'1'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'2'} code={'2'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'3'} code={'3'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'4'} code={'4'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'5'} code={'5'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'6'} code={'6'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'7'} code={'7'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'8'} code={'8'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'9'} code={'9'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'0'} code={'0'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'-'} code={'minus'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'='} code={'equal'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'⌫'} code={'back'} keys={p.keyboard.keys} toggle={toggle} width={2} />
                        </div>
                        <div className="flex flex-row items-start">
                            <Key char={'↹'} code={'tab'} keys={p.keyboard.keys} toggle={toggle} width={1.5} />
                            <Key char={'q'} code={'q'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'w'} code={'w'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'e'} code={'e'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'r'} code={'r'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'t'} code={'t'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'y'} code={'y'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'u'} code={'u'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'i'} code={'i'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'o'} code={'o'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'p'} code={'p'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'['} code={'openbracket'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={']'} code={'closebracket'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'\\'} code={"backslash"} keys={p.keyboard.keys} toggle={toggle} width={1.5} />
                        </div>
                        <div className="flex flex-row items-start">
                            <Key char={'⇪'} code={'caps'} keys={p.keyboard.keys} toggle={toggle} width={1.75} />
                            <Key char={'a'} code={'a'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'s'} code={'s'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'d'} code={'d'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'f'} code={'f'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'g'} code={'g'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'h'} code={'h'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'j'} code={'j'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'k'} code={'k'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'l'} code={'l'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={';'} code={'semicolon'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={"'"} code={'singlequote'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'⏎'} code={'enter'} keys={p.keyboard.keys} toggle={toggle} width={2.25} />
                        </div>
                        <div className="flex flex-row items-start">
                            <Key char={'⇧'} code={'lshift'} keys={p.keyboard.keys} toggle={toggle} width={2.25} />
                            <Key char={'z'} code={'z'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'x'} code={'x'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'c'} code={'c'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'v'} code={'v'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'b'} code={'b'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'n'} code={'n'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'m'} code={'m'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={','} code={'comma'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'.'} code={'dot'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'/'} code={'slash'} keys={p.keyboard.keys} toggle={toggle} width={1} />
                            <Key char={'⇧'} code={'shift'} keys={p.keyboard.keys} toggle={toggle} width={2.75} />
                        </div>
                        <div className="flex flex-row items-start">
                            <Key char={'ctrl'} code={'lctrl'} keys={p.keyboard.keys} toggle={toggle} width={1.25} />
                            <Key char={'⌘'} code={'lwin'} keys={p.keyboard.keys} toggle={toggle} width={1.25} />
                            <Key char={'alt'} code={'lalt'} keys={p.keyboard.keys} toggle={toggle} width={1.25} />
                            <Key char={' '} code={'space'} keys={p.keyboard.keys} toggle={toggle} width={6.25} />
                            <Key char={'alt'} code={'ralt'} keys={p.keyboard.keys} toggle={toggle} width={1.25} />
                            <Key char={'⌘'} code={'rwin'} keys={p.keyboard.keys} toggle={toggle} width={1.25} />
                            <Key char={'fn'} code={'fn'} keys={p.keyboard.keys} toggle={toggle} width={1.25} />
                            <Key char={'ctrl'} code={'rctrl'} keys={p.keyboard.keys} toggle={toggle} width={1.25} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Keyboard;