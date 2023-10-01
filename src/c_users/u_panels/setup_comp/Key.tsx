import { Dispatch, SetStateAction } from "react";
import { colors } from '../../../resources/store/tools';

interface KeyInterface {
    char: string,
    code: string,
    width: number,
    keys: string[],
    toggle: (key : string) => void;
}

const Key = (p: KeyInterface) => {
    return (
        <button onClick={() => p.toggle(p.code)}>
            <kbd className="kbd"
                style={{ width: `${p.width * 2.199}rem`, backgroundColor: p.keys.includes(p.code) ? colors.ui.accent + '44' : '' }}>
                {p.char}
            </kbd>
        </button>
    );
}

export default Key;