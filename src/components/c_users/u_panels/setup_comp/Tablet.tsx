import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { TabletInterface } from '../../../../resources/interfaces/setup';
import './Tablet.css';
import { useTranslation } from 'react-i18next';

interface tabletProps {
    tablet: TabletInterface,
    setTablet: Dispatch<SetStateAction<TabletInterface>>,
    edit: boolean,
    width: number,
    height: number
}

const Tablet = (p: tabletProps) => {
    const { t } = useTranslation();
    const inputWidth = 64;

    function handleInput(value: string) {
        const valuef: number = Number(value || '0');
        return valuef;
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        if (!p.edit) return;
        if (e.target.name === "name") p.setTablet((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        else {
            const name: any = e.target.name.split('-');
            p.setTablet((prev) => {
                console.log(prev);
                return { ...prev, [name[0]]: { ...(prev as any)[name[0]], [name[1]]: handleInput(e.target.value) } }
            });
        }
    }

    return (
        <div className="flex flex-col items-center justify-center gap-3 overflow-hidden">
            <div className="text-center">{p.tablet.name || 'Tablet'}</div>
            <div style={{ height: p.height, width: p.width }} className='flex items-center justify-center'>
                <TabletDisplay tablet={p.tablet} width={p.width} height={p.height} />
            </div>
            <div className={`${p.edit ? 'flex' : 'hidden'} flex-col gap-2`}>
                <div>{t('user.sections.setup.model')}:</div>
                <input onChange={handleChange} name="name" value={p.tablet.name}
                    type='text' className="input input-sm input-bordered join-item input-mm" placeholder="model" />
                <div>{t('user.sections.setup.size')}:</div>
                <div className="join">
                    <input onChange={handleChange} name="size-w"
                        style={{ width: inputWidth }} value={p.tablet.size.w.toString()} type='number' className="input input-sm input-bordered join-item input-mm" placeholder="width" />
                    <div className="join-item input input-sm input-bordered">x</div>
                    <input onChange={handleChange} name="size-h"
                        style={{ width: inputWidth }} value={p.tablet.size.h.toString()} type='number' className="input input-sm input-bordered join-item input-mm" placeholder="heigth" />
                    <div className="join-item input input-sm input-bordered">mm</div>
                </div>
                <div>{t('user.sections.setup.area')}:</div>
                <div className="join">
                    <input onChange={handleChange} name="area-w"
                        style={{ width: inputWidth }} value={p.tablet.area.w.toString()} type='number' className="input input-sm input-bordered join-item input-mm" placeholder="width" />
                    <div className="join-item input input-sm input-bordered">x</div>
                    <input onChange={handleChange} name="area-h"
                        style={{ width: inputWidth }} value={p.tablet.area.h.toString()} type='number' className="input input-sm input-bordered join-item input-mm" placeholder="heigth" />
                    <div className="join-item input input-sm input-bordered">mm</div>
                </div>
                <div>{t('user.sections.setup.position')}:</div>
                <div className="join">
                    <input onChange={handleChange} name="position-x"
                        style={{ width: inputWidth }} value={p.tablet.position.x.toString()} type='number' className="input input-sm input-bordered join-item input-mm" placeholder="x" />
                    <div className="join-item input input-sm input-bordered">x</div>
                    <input onChange={handleChange} name="position-y"
                        style={{ width: inputWidth }} value={p.tablet.position.y.toString()} type='number' className="input input-sm input-bordered join-item input-mm" placeholder="y" />
                    <div className="join-item input input-sm input-bordered">mm</div>
                    <input onChange={handleChange} name="position-r"
                        style={{ width: inputWidth }} value={p.tablet.position.r.toString()} type='number' className="input input-sm input-bordered join-item input-dg" placeholder="rotation" />
                    <div className="join-item input input-sm input-bordered">deg</div>
                </div>
            </div>
        </div>
    )
}

interface tabletDisplayProps {
    tablet: TabletInterface;
    width: number,
    height: number
}

function TabletDisplay(p: tabletDisplayProps) {
    const tabletSizes = normalizeShape(p.tablet.size.w || 16, p.tablet.size.h || 9);
    function calculateFraction(width: number, height: number) {
        const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
        const commonDivisor = gcd(width, height);
        const fraction = `${width / commonDivisor}:${height / commonDivisor}`;
        return fraction;
    }
    const ratio = calculateFraction(p.tablet.area.w, p.tablet.area.h);

    return (
        <div className="relative overflow-hidden border rounded-lg"
            style={{ width: tabletSizes.w, height: tabletSizes.h, transform: 'scale(.8)' }}>
            <div className="absolute flex flex-col items-center justify-center gap-1 bg-opacity-50 border border-secondary bg-secondary"
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

        let newWidth = p.width;
        let newHeight = newWidth / aspectRatio;
        let scale = newHeight / height;

        if (newHeight > p.height) {
            newHeight = p.height;
            newWidth = newHeight * aspectRatio;
            scale = newHeight / height;
        }

        return { w: newWidth, h: newHeight, s: scale };
    }

}

export default Tablet;