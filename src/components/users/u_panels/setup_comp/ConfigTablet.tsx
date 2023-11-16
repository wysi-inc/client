import { ChangeEvent, Dispatch, SetStateAction } from 'react';

import { useTranslation } from 'react-i18next';

import { Tablet } from '../../../../resources/types/setup';

interface Props {
    tablet: Tablet,
    setTablet: Dispatch<SetStateAction<Tablet>>,
    edit: boolean,
    width: number,
    height: number,
}

const ConfigTablet = (p: Props) => {

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
            p.setTablet((prev) => ({ ...prev, [name[0]]: { ...(prev as any)[name[0]], [name[1]]: handleInput(e.target.value) } }));
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
                    <div className="join-item input input-sm input-bordered">×</div>
                    <input onChange={handleChange} name="size-h"
                        style={{ width: inputWidth }} value={p.tablet.size.h.toString()} type='number' className="input input-sm input-bordered join-item input-mm" placeholder="heigth" />
                    <div className="join-item input input-sm input-bordered">mm</div>
                </div>
                <div>{t('user.sections.setup.area')}:</div>
                <div className="join">
                    <input onChange={handleChange} name="area-w"
                        style={{ width: inputWidth }} value={p.tablet.area.w.toString()} type='number' className="input input-sm input-bordered join-item input-mm" placeholder="width" />
                    <div className="join-item input input-sm input-bordered">×</div>
                    <input onChange={handleChange} name="area-h"
                        style={{ width: inputWidth }} value={p.tablet.area.h.toString()} type='number' className="input input-sm input-bordered join-item input-mm" placeholder="heigth" />
                    <div className="join-item input input-sm input-bordered">mm</div>
                </div>
                <div>{t('user.sections.setup.position')}:</div>
                <div className="join">
                    <input onChange={handleChange} name="position-x"
                        style={{ width: inputWidth }} value={p.tablet.position.x.toString()} type='number' className="input input-sm input-bordered join-item input-mm" placeholder="x" />
                    <div className="join-item input input-sm input-bordered">X</div>
                    <input onChange={handleChange} name="position-y"
                        style={{ width: inputWidth }} value={p.tablet.position.y.toString()} type='number' className="input input-sm input-bordered join-item input-mm" placeholder="y" />
                    <div className="join-item input input-sm input-bordered">Y</div>
                    <input onChange={handleChange} name="position-r"
                        style={{ width: inputWidth }} value={p.tablet.position.r.toString()} type='number' className="input input-sm input-bordered join-item input-dg" placeholder="rotation" />
                    <div className="join-item input input-sm input-bordered">deg</div>
                </div>
            </div>
        </div>
    )
}

interface tabletDisplayProps {
    tablet: Tablet;
    width: number,
    height: number
}

function TabletDisplay(p: tabletDisplayProps) {

    const { w, h, sx, sy } = normalizeShape(p.tablet.size.w || 16, p.tablet.size.h || 9);

    const translate_x = (-p.tablet.area.w * sx / 2) + (p.tablet.position.x * sx);
    const translate_y = (-p.tablet.area.h * sy / 2) + (p.tablet.position.y * sy);

    return (
        <div className="relative overflow-hidden border rounded-lg"
            style={{ width: w, height: h, transform: 'scale(.8)' }}>
            <div className="absolute bg-opacity-50 border border-secondary bg-secondary"
                style={{
                    width: p.tablet.area.w * sx,
                    height: p.tablet.area.h * sy,
                    transform: `rotate(${p.tablet.position.r}deg) translate(${translate_x}px, ${translate_y}px)`
                }}>
            </div>
            <div className='absolute bottom-2 inset-x-0 text-center'>{p.tablet.area.w || '??'} x {p.tablet.area.h || '??'} mm</div>
        </div>
    )

    function normalizeShape(width: number, height: number) {
        const aspectRatio = width / height;

        let w = p.width;
        let h = w / aspectRatio;
        let scaleY = h / height;
        let scaleX = w / width;

        if (h > p.height) {
            h = p.height;
            w = h * aspectRatio;
            scaleY = h / height;
            scaleX = w / width;
        }

        return { w, h: h, sx: scaleX, sy: scaleY };
    }

}

export default ConfigTablet;