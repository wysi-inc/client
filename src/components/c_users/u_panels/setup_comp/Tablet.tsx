import { Dispatch, SetStateAction } from 'react';
import { TabletInterface } from '../../../../resources/interfaces/setup';
import './Tablet.css';

interface tabletProps {
    tablet: TabletInterface,
    setTablet: Dispatch<SetStateAction<TabletInterface>>,
    edit: boolean,
}

const Tablet = (p: tabletProps) => {
    const inputWidth = 64;

    function handleInput(value: string) {
        const valuef: number = Number(value || '0');
        return valuef;
    }

    return (
        <div className="flex overflow-hidden flex-col gap-3 items-center">
            <div>{p.tablet.name}</div>
            <TabletDisplay tablet={p.tablet} />
            <div className={`${p.edit ? 'flex' : 'hidden'} flex-col gap-2`}>
                <div>Model:</div>
                <input onChange={(e) => p.edit && p.setTablet((pr) => ({ ...pr, name: e.target.value }))} value={p.tablet.name}
                    list='tablets' type='text' className="input input-sm input-bordered join-item input-mm" placeholder="model" />
                <div>Size:</div>
                <div className="join">
                    <input onChange={(e) => p.edit && p.setTablet((pr) => ({ ...pr, size: { w: handleInput(e.target.value), h: pr.size.h } }))}
                        style={{ width: inputWidth }} value={p.tablet.size.w.toString()} type='number' className="input input-sm input-bordered join-item input-mm" placeholder="width" />
                    <div className="join-item input input-sm input-bordered">x</div>
                    <input onChange={(e) => p.edit && p.setTablet((pr) => ({ ...pr, size: { w: pr.size.w, h: handleInput(e.target.value) } }))}
                        style={{ width: inputWidth }} value={p.tablet.size.h.toString()} type='number' className="input input-sm input-bordered join-item input-mm" placeholder="heigth" />
                    <div className="join-item input input-sm input-bordered">mm</div>
                </div>
                <div>Area:</div>
                <div className="join">
                    <input onChange={(e) => p.edit && p.setTablet((pr) => ({ ...pr, area: { w: handleInput(e.target.value), h: pr.area.h } }))}
                        style={{ width: inputWidth }} value={p.tablet.area.w.toString()} type='number' className="input input-sm input-bordered join-item input-mm" placeholder="width" />
                    <div className="join-item input input-sm input-bordered">x</div>
                    <input onChange={(e) => p.edit && p.setTablet((pr) => ({ ...pr, area: { w: pr.area.w, h: handleInput(e.target.value) } }))}
                        style={{ width: inputWidth }} value={p.tablet.area.h.toString()} type='number' className="input input-sm input-bordered join-item input-mm" placeholder="heigth" />
                    <div className="join-item input input-sm input-bordered">mm</div>
                </div>
                <div>Position:</div>
                <div className="join">
                    <input onChange={(e) => p.edit && p.setTablet((pr) => ({ ...pr, position: { x: handleInput(e.target.value), y: pr.position.y, r: pr.position.r } }))}
                        style={{ width: inputWidth }} value={p.tablet.position.x.toString()} type='number' className="input input-sm input-bordered join-item input-mm" placeholder="x" />
                    <div className="join-item input input-sm input-bordered">x</div>
                    <input onChange={(e) => p.edit && p.setTablet((pr) => ({ ...pr, position: { x: pr.position.x, y: handleInput(e.target.value), r: pr.position.r } }))}
                        style={{ width: inputWidth }} value={p.tablet.position.y.toString()} type='number' className="input input-sm input-bordered join-item input-mm" placeholder="y" />
                    <div className="join-item input input-sm input-bordered">mm</div>
                    <input onChange={(e) => p.edit && p.setTablet((pr) => ({ ...pr, position: { x: pr.position.x, y: pr.position.y, r: handleInput(e.target.value) } }))}
                        style={{ width: inputWidth }} value={p.tablet.position.r.toString()} type='number' className="input input-sm input-bordered join-item input-dg" placeholder="rotation" />
                    <div className="join-item input input-sm input-bordered">deg</div>
                </div>
                <datalist id='tablets' className="input input-sm input-bordered">
                    <option>Custom</option>
                    <option>CTH-480</option>
                    <option>CTH-680</option>
                    <option>Bamboo</option>
                    <option>S620</option>
                </datalist>
            </div>
        </div>
    )
}

interface tabletDisplayProps {
    tablet: TabletInterface;
}

function TabletDisplay(p: tabletDisplayProps) {
    const tabletSizes = normalizeShape(p.tablet.size.w, p.tablet.size.h);
    function calculateFraction(width: number, height: number) {
        const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
        const commonDivisor = gcd(width, height);
        const fraction = `${width / commonDivisor}:${height / commonDivisor}`;
        return fraction;
    }
    const ratio = calculateFraction(p.tablet.area.w, p.tablet.area.h);

    return (
        <div hidden={p.tablet.size.h === 0 && p.tablet.size.w === 0}
            className="overflow-hidden relative rounded-lg border"
            style={{ width: tabletSizes.w, height: tabletSizes.h }}>
            <div className="flex absolute flex-col gap-1 justify-center items-center bg-opacity-50 border border-secondary bg-secondary"
                style={{
                    width: p.tablet.area.w * tabletSizes.s,
                    height: p.tablet.area.h * tabletSizes.s,
                    transform: `rotate(${p.tablet.position.r}deg) translate(${(p.tablet.position.x * tabletSizes.s) - tabletSizes.w / 2}px, ${(p.tablet.position.y * tabletSizes.s) - tabletSizes.h / 2}px)`
                }}>
                <div>{p.tablet.area.w} x {p.tablet.area.h} mm</div>
                <div>{ratio}</div>
            </div>
        </div>
    )

    function normalizeShape(width: number = 0, height: number = 0) {
        const aspectRatio = width / height;

        let newWidth = 328;
        let newHeight = newWidth / aspectRatio;
        let scale = newHeight / height;

        if (newHeight > 228) {
            newHeight = 228;
            newWidth = newHeight * aspectRatio;
            scale = newHeight / height;
        }

        return { w: newWidth, h: newHeight, s: scale };
    }

}

export default Tablet;