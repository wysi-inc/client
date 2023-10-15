import { Dispatch, SetStateAction } from "react";
import { MouseInterface } from "../../../../resources/interfaces/setup";

interface propsInterface {
    mouse: MouseInterface;
    setMouse: Dispatch<SetStateAction<MouseInterface>>;
    edit: boolean;
    width: number,
    height: number
}

const Mouse = (p: propsInterface) => {

    function handleInput(value: string) {
        const valuef: number = Number(value || '0');
        return valuef;
    }

    return (
        <div className="flex overflow-hidden flex-col gap-3 items-center justify-center" style={{width: p.width}}>
            <div className="text-center">{p.mouse.name || 'Mouse'}</div>
            <div style={{ height: p.height }} className='flex flex-col items-center justify-center'>
                <div className="border flex flex-col justify-start items-center rounded-t-3xl overflow-hidden" style={{ width: 100, height: 150, borderBottomRightRadius: 100, borderBottomLeftRadius: 100 }}>
                    <div className="border" style={{ height: 50 }}></div>
                    <div className="border w-full"></div>
                    <div className="grow flex items-center justify-center">{p.mouse.dpi || '?'} dpi</div>
                </div>
            </div>
            <div className={`${p.edit ? 'flex' : 'hidden'} flex-col gap-2`}>
                <div>Model:</div>
                <input onChange={(e) => p.edit && p.setMouse((pr) => ({ ...pr, name: e.target.value }))} value={p.mouse.name}
                    type='text' className="input input-sm input-bordered join-item input-mm" placeholder="model" />
                <div>DPI:</div>
                <input onChange={(e) => p.edit && p.setMouse((pr) => ({ ...pr, dpi: handleInput(e.target.value) }))} value={p.mouse.dpi.toString()}
                    type='number' className="input input-sm input-bordered join-item input-mm" placeholder="650" />
            </div>
        </div>
    )
}

export default Mouse;