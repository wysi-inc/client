import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import Key from "./Key";
import { KeyboardInterface, KeyboardLayoutType } from "../../../../resources/interfaces/setup";

interface propsInterface {
    keyboard: KeyboardInterface;
    setKeyboard: Dispatch<SetStateAction<KeyboardInterface>>;
    edit: boolean;
    sizes: { w: number, h: number };
}

const Keyboard = (p: propsInterface) => {

    const k = useMemo(() => getK(p.keyboard.layout), [p.keyboard]);

    function getK(layout: KeyboardLayoutType) {
        switch (layout) {
            case 'k2':
                return <K2 keys={p.keyboard.keys} toggle={toggle} edit={p.edit} />;
            case 'k3':
                return <K3 keys={p.keyboard.keys} toggle={toggle} edit={p.edit} />;
            case 'k4':
                return <K4 keys={p.keyboard.keys} toggle={toggle} edit={p.edit} />;
            case 'k60':
                return <K60 keys={p.keyboard.keys} toggle={toggle} edit={p.edit} />;
            case 'k75':
                return <div></div>;
            case 'ktkl':
                return <KTKL keys={p.keyboard.keys} toggle={toggle} edit={p.edit} />;
            case 'kfull':
                return <KFULL keys={p.keyboard.keys} toggle={toggle} edit={p.edit} />;
            default:
                return <div></div>;
        }
    }

    function toggle(key: string) {
        p.setKeyboard((prev) => ({ ...prev, keys: prev.keys.includes(key) ? prev.keys.filter(o => o !== key) : [...prev.keys, key] }));
    }

    return (
        <div className="flex flex-col gap-3 items-center">
            <div>{p.keyboard.name}</div>
            <div style={{ maxHeight: p.sizes.h, maxWidth: p.sizes.w }}>
                {k}
            </div>
            <div className={`${p.edit ? 'flex' : 'hidden'} flex-col gap-2`}>
                <div>Model:</div>
                <div className="join">
                    <input onChange={(e) => p.edit && p.setKeyboard((pr) => ({ ...pr, name: e.target.value }))} value={p.keyboard.name}
                        type='text' className="input input-sm input-bordered join-item input-mm" placeholder="model" />
                    <select className="select select-bordered join-item select-sm" defaultValue={p.keyboard.layout}
                        onChange={(e) => p.edit && p.setKeyboard((pr) => ({ ...pr, layout: e.target.value as KeyboardLayoutType }))}
                    >
                        <option value={"k2" as KeyboardLayoutType}>2 Keys</option>
                        <option value={"k3" as KeyboardLayoutType}>3 Keys</option>
                        <option value={"k4" as KeyboardLayoutType}>4 Keys</option>
                        <option value={"k60" as KeyboardLayoutType}>60%</option>
                        <option value={"k75" as KeyboardLayoutType}>75%</option>
                        <option value={"ktkl" as KeyboardLayoutType}>TKL</option>
                        <option value={"kfull" as KeyboardLayoutType}>FULL</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

interface kProps {
    keys: string[];
    toggle: (key: string) => void;
    edit: boolean;
}

function K2(p: kProps) {

    function toggle(key: string) {
        if (p.edit) p.toggle(key);
    }

    return (
        <div className="flex flex-row gap-1 pb-12 justify-center items-center p-3 rounded-lg border">
            <Key char={'z'} code={'z'} keys={p.keys} toggle={toggle} width={1} />
            <Key char={'x'} code={'x'} keys={p.keys} toggle={toggle} width={1} />
        </div>
    )
}
function K3(p: kProps) {

    function toggle(key: string) {
        if (p.edit) p.toggle(key);
    }

    return (
        <div className="flex flex-row gap-1 pb-12 justify-center items-center p-3 rounded-lg border">
            <Key char={'z'} code={'z'} keys={p.keys} toggle={toggle} width={1} />
            <Key char={'x'} code={'x'} keys={p.keys} toggle={toggle} width={1} />
            <Key char={'c'} code={'c'} keys={p.keys} toggle={toggle} width={1} />
        </div>
    )
}
function K4(p: kProps) {

    function toggle(key: string) {
        if (p.edit) p.toggle(key);
    }

    return (
        <div className="flex flex-row gap-1 pb-12 justify-center items-center p-3 rounded-lg border">
            <Key char={'z'} code={'z'} keys={p.keys} toggle={toggle} width={1} />
            <Key char={'x'} code={'x'} keys={p.keys} toggle={toggle} width={1} />
            <Key char={'c'} code={'c'} keys={p.keys} toggle={toggle} width={1} />
            <Key char={'v'} code={'v'} keys={p.keys} toggle={toggle} width={1} />
        </div>
    )
}
function K60(p: kProps) {

    function toggle(key: string) {
        if (p.edit) p.toggle(key);
    }

    return (
        <div className="p-3 rounded-lg border" style={{ transform: 'scale(80%) translateY(-24px)' }}>
            <div className="flex flex-col">
                <div className="flex flex-row items-start">
                    <Key char={'␛'} code={'esc'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'1'} code={'1'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'2'} code={'2'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'3'} code={'3'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'4'} code={'4'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'5'} code={'5'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'6'} code={'6'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'7'} code={'7'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'8'} code={'8'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'9'} code={'9'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'0'} code={'0'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'-'} code={'minus'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'='} code={'equal'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'⌫'} code={'back'} keys={p.keys} toggle={toggle} width={2} />
                </div>
                <div className="flex flex-row items-start">
                    <Key char={'↹'} code={'tab'} keys={p.keys} toggle={toggle} width={1.5} />
                    <Key char={'q'} code={'q'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'w'} code={'w'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'e'} code={'e'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'r'} code={'r'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'t'} code={'t'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'y'} code={'y'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'u'} code={'u'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'i'} code={'i'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'o'} code={'o'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'p'} code={'p'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'['} code={'openbracket'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={']'} code={'closebracket'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'\\'} code={"backslash"} keys={p.keys} toggle={toggle} width={1.5} />
                </div>
                <div className="flex flex-row items-start">
                    <Key char={'⇪'} code={'caps'} keys={p.keys} toggle={toggle} width={1.75} />
                    <Key char={'a'} code={'a'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'s'} code={'s'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'d'} code={'d'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'f'} code={'f'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'g'} code={'g'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'h'} code={'h'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'j'} code={'j'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'k'} code={'k'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'l'} code={'l'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={';'} code={'semicolon'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={"'"} code={'singlequote'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'⏎'} code={'enter'} keys={p.keys} toggle={toggle} width={2.25} />
                </div>
                <div className="flex flex-row items-start">
                    <Key char={'⇧'} code={'lshift'} keys={p.keys} toggle={toggle} width={2.25} />
                    <Key char={'z'} code={'z'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'x'} code={'x'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'c'} code={'c'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'v'} code={'v'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'b'} code={'b'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'n'} code={'n'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'m'} code={'m'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={','} code={'comma'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'.'} code={'dot'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'/'} code={'slash'} keys={p.keys} toggle={toggle} width={1} />
                    <Key char={'⇧'} code={'shift'} keys={p.keys} toggle={toggle} width={2.75} />
                </div>
                <div className="flex flex-row items-start">
                    <Key char={'ctrl'} code={'lctrl'} keys={p.keys} toggle={toggle} width={1.25} />
                    <Key char={'⌘'} code={'lwin'} keys={p.keys} toggle={toggle} width={1.25} />
                    <Key char={'alt'} code={'lalt'} keys={p.keys} toggle={toggle} width={1.25} />
                    <Key char={' '} code={'space'} keys={p.keys} toggle={toggle} width={6.25} />
                    <Key char={'alt'} code={'ralt'} keys={p.keys} toggle={toggle} width={1.25} />
                    <Key char={'⌘'} code={'rwin'} keys={p.keys} toggle={toggle} width={1.25} />
                    <Key char={'fn'} code={'fn'} keys={p.keys} toggle={toggle} width={1.25} />
                    <Key char={'ctrl'} code={'rctrl'} keys={p.keys} toggle={toggle} width={1.25} />
                </div>
            </div>
        </div>
    )
}
function KTKL(p: kProps) {

    function toggle(key: string) {
        if (p.edit) p.toggle(key);
    }

    return (
        <div className="p-3 rounded-lg border grow" style={{ transform: `scale(.6) translateY(-24px)` }}>
            <div className="flex flex-row gap-3">
                <div className="flex flex-col">
                    <div className="flex flex-row items-start mb-2">
                        <Key char={'␛'} code={'esc'} keys={p.keys} toggle={toggle} width={1} />
                        <div className="mx-auto"></div>
                        <Key char={'f1'} code={'f1'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'f2'} code={'f2'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'f3'} code={'f3'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'f4'} code={'f4'} keys={p.keys} toggle={toggle} width={1} />
                        <div className="px-3"></div>
                        <Key char={'f5'} code={'f5'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'f6'} code={'f6'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'f7'} code={'f7'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'f8'} code={'f8'} keys={p.keys} toggle={toggle} width={1} />
                        <div className="px-3"></div>
                        <Key char={'f9'} code={'f9'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'f10'} code={'f10'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'f11'} code={'f11'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'f12'} code={'f12'} keys={p.keys} toggle={toggle} width={1} />
                    </div>
                    <div className="flex flex-row items-start">
                        <Key char={'~'} code={'tilde'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'1'} code={'1'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'2'} code={'2'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'3'} code={'3'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'4'} code={'4'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'5'} code={'5'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'6'} code={'6'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'7'} code={'7'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'8'} code={'8'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'9'} code={'9'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'0'} code={'0'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'-'} code={'minus'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'='} code={'equal'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'⌫'} code={'back'} keys={p.keys} toggle={toggle} width={2} />
                    </div>
                    <div className="flex flex-row items-start">
                        <Key char={'↹'} code={'tab'} keys={p.keys} toggle={toggle} width={1.5} />
                        <Key char={'q'} code={'q'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'w'} code={'w'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'e'} code={'e'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'r'} code={'r'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'t'} code={'t'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'y'} code={'y'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'u'} code={'u'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'i'} code={'i'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'o'} code={'o'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'p'} code={'p'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'['} code={'openbracket'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={']'} code={'closebracket'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'\\'} code={"backslash"} keys={p.keys} toggle={toggle} width={1.5} />
                    </div>
                    <div className="flex flex-row items-start">
                        <Key char={'⇪'} code={'caps'} keys={p.keys} toggle={toggle} width={1.75} />
                        <Key char={'a'} code={'a'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'s'} code={'s'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'d'} code={'d'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'f'} code={'f'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'g'} code={'g'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'h'} code={'h'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'j'} code={'j'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'k'} code={'k'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'l'} code={'l'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={';'} code={'semicolon'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={"'"} code={'singlequote'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'⏎'} code={'enter'} keys={p.keys} toggle={toggle} width={2.25} />
                    </div>
                    <div className="flex flex-row items-start">
                        <Key char={'⇧'} code={'lshift'} keys={p.keys} toggle={toggle} width={2.25} />
                        <Key char={'z'} code={'z'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'x'} code={'x'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'c'} code={'c'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'v'} code={'v'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'b'} code={'b'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'n'} code={'n'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'m'} code={'m'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={','} code={'comma'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'.'} code={'dot'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'/'} code={'slash'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'⇧'} code={'shift'} keys={p.keys} toggle={toggle} width={2.75} />
                    </div>
                    <div className="flex flex-row items-start">
                        <Key char={'ctrl'} code={'lctrl'} keys={p.keys} toggle={toggle} width={1.25} />
                        <Key char={'⌘'} code={'lwin'} keys={p.keys} toggle={toggle} width={1.25} />
                        <Key char={'alt'} code={'lalt'} keys={p.keys} toggle={toggle} width={1.25} />
                        <Key char={' '} code={'space'} keys={p.keys} toggle={toggle} width={6.25} />
                        <Key char={'alt'} code={'ralt'} keys={p.keys} toggle={toggle} width={1.25} />
                        <Key char={'⌘'} code={'rwin'} keys={p.keys} toggle={toggle} width={1.25} />
                        <Key char={'fn'} code={'fn'} keys={p.keys} toggle={toggle} width={1.25} />
                        <Key char={'ctrl'} code={'rctrl'} keys={p.keys} toggle={toggle} width={1.25} />
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-row items-start mb-2">
                        <Key char={'prt'} code={'prt'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'slk'} code={'slk'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'pau'} code={'pause'} keys={p.keys} toggle={toggle} width={1} />
                    </div>
                    <div className="flex flex-row items-start">
                        <Key char={'ins'} code={'ins'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'hom'} code={'home'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'pup'} code={'pgpu'} keys={p.keys} toggle={toggle} width={1} />
                    </div>
                    <div className="flex flex-row items-start">
                        <Key char={'del'} code={'del'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'end'} code={'end'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'pdw'} code={'pdw'} keys={p.keys} toggle={toggle} width={1} />
                    </div>
                    <div className="flex flex-row items-start">
                        <div style={{ height: '2.2rem' }}></div>
                    </div>
                    <div className="flex flex-row items-start">
                        <div style={{ width: '2.2rem' }}></div>
                        <Key char={'↑'} code={'uparr'} keys={p.keys} toggle={toggle} width={1} />
                        <div style={{ width: '2.2rem' }}></div>
                    </div>
                    <div className="flex flex-row items-start">
                        <Key char={'←'} code={'larr'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'↓'} code={'darr'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'→'} code={'rarr'} keys={p.keys} toggle={toggle} width={1} />
                    </div>
                </div>
            </div>
        </div>
    )
}
function KFULL(p: kProps) {

    function toggle(key: string) {
        if (p.edit) p.toggle(key);
    }

    return (
        <div className="p-3 rounded-lg border" style={{ transform: `scale(.5) translateY(-24px)` }}>
            <div className="flex flex-row gap-3">
                <div className="flex flex-col">
                    <div className="flex flex-row items-start mb-2">
                        <Key char={'␛'} code={'esc'} keys={p.keys} toggle={toggle} width={1} />
                        <div className="mx-auto"></div>
                        <Key char={'f1'} code={'f1'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'f2'} code={'f2'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'f3'} code={'f3'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'f4'} code={'f4'} keys={p.keys} toggle={toggle} width={1} />
                        <div className="px-3"></div>
                        <Key char={'f5'} code={'f5'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'f6'} code={'f6'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'f7'} code={'f7'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'f8'} code={'f8'} keys={p.keys} toggle={toggle} width={1} />
                        <div className="px-3"></div>
                        <Key char={'f9'} code={'f9'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'f10'} code={'f10'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'f11'} code={'f11'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'f12'} code={'f12'} keys={p.keys} toggle={toggle} width={1} />
                    </div>
                    <div className="flex flex-row items-start">
                        <Key char={'~'} code={'tilde'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'1'} code={'1'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'2'} code={'2'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'3'} code={'3'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'4'} code={'4'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'5'} code={'5'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'6'} code={'6'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'7'} code={'7'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'8'} code={'8'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'9'} code={'9'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'0'} code={'0'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'-'} code={'minus'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'='} code={'equal'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'⌫'} code={'back'} keys={p.keys} toggle={toggle} width={2} />
                    </div>
                    <div className="flex flex-row items-start">
                        <Key char={'↹'} code={'tab'} keys={p.keys} toggle={toggle} width={1.5} />
                        <Key char={'q'} code={'q'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'w'} code={'w'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'e'} code={'e'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'r'} code={'r'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'t'} code={'t'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'y'} code={'y'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'u'} code={'u'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'i'} code={'i'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'o'} code={'o'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'p'} code={'p'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'['} code={'openbracket'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={']'} code={'closebracket'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'\\'} code={"backslash"} keys={p.keys} toggle={toggle} width={1.5} />
                    </div>
                    <div className="flex flex-row items-start">
                        <Key char={'⇪'} code={'caps'} keys={p.keys} toggle={toggle} width={1.75} />
                        <Key char={'a'} code={'a'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'s'} code={'s'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'d'} code={'d'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'f'} code={'f'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'g'} code={'g'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'h'} code={'h'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'j'} code={'j'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'k'} code={'k'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'l'} code={'l'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={';'} code={'semicolon'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={"'"} code={'singlequote'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'⏎'} code={'enter'} keys={p.keys} toggle={toggle} width={2.25} />
                    </div>
                    <div className="flex flex-row items-start">
                        <Key char={'⇧'} code={'lshift'} keys={p.keys} toggle={toggle} width={2.25} />
                        <Key char={'z'} code={'z'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'x'} code={'x'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'c'} code={'c'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'v'} code={'v'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'b'} code={'b'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'n'} code={'n'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'m'} code={'m'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={','} code={'comma'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'.'} code={'dot'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'/'} code={'slash'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'⇧'} code={'shift'} keys={p.keys} toggle={toggle} width={2.75} />
                    </div>
                    <div className="flex flex-row items-start">
                        <Key char={'ctrl'} code={'lctrl'} keys={p.keys} toggle={toggle} width={1.25} />
                        <Key char={'⌘'} code={'lwin'} keys={p.keys} toggle={toggle} width={1.25} />
                        <Key char={'alt'} code={'lalt'} keys={p.keys} toggle={toggle} width={1.25} />
                        <Key char={' '} code={'space'} keys={p.keys} toggle={toggle} width={6.25} />
                        <Key char={'alt'} code={'ralt'} keys={p.keys} toggle={toggle} width={1.25} />
                        <Key char={'⌘'} code={'rwin'} keys={p.keys} toggle={toggle} width={1.25} />
                        <Key char={'fn'} code={'fn'} keys={p.keys} toggle={toggle} width={1.25} />
                        <Key char={'ctrl'} code={'rctrl'} keys={p.keys} toggle={toggle} width={1.25} />
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-row items-start mb-2">
                        <Key char={'prt'} code={'prt'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'slk'} code={'slk'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'pau'} code={'pause'} keys={p.keys} toggle={toggle} width={1} />
                    </div>
                    <div className="flex flex-row items-start">
                        <Key char={'ins'} code={'ins'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'hom'} code={'home'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'pup'} code={'pgpu'} keys={p.keys} toggle={toggle} width={1} />
                    </div>
                    <div className="flex flex-row items-start">
                        <Key char={'del'} code={'del'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'end'} code={'end'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'pdw'} code={'pdw'} keys={p.keys} toggle={toggle} width={1} />
                    </div>
                    <div className="flex flex-row items-start">
                        <div style={{ height: '2.2rem' }}></div>
                    </div>
                    <div className="flex flex-row items-start">
                        <div style={{ width: '2.2rem' }}></div>
                        <Key char={'↑'} code={'uparr'} keys={p.keys} toggle={toggle} width={1} />
                        <div style={{ width: '2.2rem' }}></div>
                    </div>
                    <div className="flex flex-row items-start">
                        <Key char={'←'} code={'larr'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'↓'} code={'darr'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'→'} code={'rarr'} keys={p.keys} toggle={toggle} width={1} />
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-row items-start mb-2">
                        <div style={{ height: '2.2rem' }}></div>
                    </div>
                    <div className="flex flex-row items-start">
                        <Key char={'nlk'} code={'nlk'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'÷'} code={'ndiv'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'x'} code={'nmul'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'-'} code={'nmin'} keys={p.keys} toggle={toggle} width={1} />
                    </div>
                    <div className="flex flex-row items-start">
                        <Key char={'7'} code={'n7'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'8'} code={'n8'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'9'} code={'n9'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'+'} code={'nplus'} keys={p.keys} toggle={toggle} width={1} />
                    </div>
                    <div className="flex flex-row items-start">
                        <Key char={'4'} code={'n4'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'5'} code={'n5'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'6'} code={'n6'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'+'} code={'nplus'} keys={p.keys} toggle={toggle} width={1} />
                    </div>
                    <div className="flex flex-row items-start">
                        <Key char={'1'} code={'n1'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'2'} code={'n2'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'3'} code={'n3'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'en'} code={'nenter'} keys={p.keys} toggle={toggle} width={1} />
                    </div>
                    <div className="flex flex-row items-start">
                        <Key char={'0'} code={'n0'} keys={p.keys} toggle={toggle} width={2} />
                        <Key char={'.'} code={'ndot'} keys={p.keys} toggle={toggle} width={1} />
                        <Key char={'en'} code={'nenter'} keys={p.keys} toggle={toggle} width={1} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Keyboard;