import { Dispatch, SetStateAction } from "react";
import { MouseInterface } from "../../../../resources/interfaces/setup";
import { useTranslation } from "react-i18next";

interface propsInterface {
    mouse: MouseInterface;
    setMouse: Dispatch<SetStateAction<MouseInterface>>;
    edit: boolean;
    width: number,
    height: number
}

const Mouse = (p: propsInterface) => {
    const {t} = useTranslation();

    function handleInput(value: string) {
        const valuef: number = Number(value || '0');
        return valuef;
    }

    return (
        <div className="flex flex-col items-center justify-center gap-3 overflow-hidden" style={{width: p.width}}>
            <div className="text-center">{p.mouse.name || 'Mouse'}</div>
            <div style={{ height: p.height }} className='flex flex-col items-center justify-center'>
                <div className="flex flex-col items-center justify-start overflow-hidden border rounded-t-3xl" style={{ width: 100, height: 150, borderBottomRightRadius: 100, borderBottomLeftRadius: 100 }}>
                    <div className="border" style={{ height: 50 }}></div>
                    <div className="w-full border"></div>
                    <div className="flex items-center justify-center grow">{p.mouse.dpi || '?'} dpi</div>
                </div>
            </div>
            <div className={`${p.edit ? 'flex' : 'hidden'} flex-col gap-2`}>
                <div>{t('user.sections.setup.model')}:</div>
                <input onChange={(e) => p.edit && p.setMouse((pr) => ({ ...pr, name: e.target.value }))} value={p.mouse.name}
                    type='text' className="input input-sm input-bordered join-item input-mm" placeholder="model" />
                <div>{t('user.sections.setup.dpi')}:</div>
                <input onChange={(e) => p.edit && p.setMouse((pr) => ({ ...pr, dpi: handleInput(e.target.value) }))} value={p.mouse.dpi.toString()}
                    type='number' className="input input-sm input-bordered join-item input-mm" placeholder="650" />
            </div>
        </div>
    )
}

export default Mouse;