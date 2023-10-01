import { TabletInterface } from "../../u_interfaces";

interface propsInterface {
    tablet: TabletInterface;
}

const TabletDisplay = (p: propsInterface) => {
    const tabletSizes = normalizeShape(p.tablet.size.w, p.tablet.size.h);
    function calculateFraction(width: number, height: number) {
        const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
        const commonDivisor = gcd(width, height);
        const fraction = `${width / commonDivisor}:${height / commonDivisor}`;
        return fraction;
    }
    const ratio = calculateFraction(p.tablet.area.w, p.tablet.area.h);
    return (
        <div className="overflow-hidden relative rounded-lg border" style={{ width: tabletSizes.w, height: tabletSizes.h }}>
            <div className="flex absolute flex-col gap-1 justify-center items-center bg-opacity-50 border border-secondary bg-secondary"
                style={{
                    top: p.tablet.position.y * tabletSizes.s,
                    left: p.tablet.position.x * tabletSizes.s,
                    width: p.tablet.area.w * tabletSizes.s,
                    height: p.tablet.area.h * tabletSizes.s,
                    transform: `translate(-50%, -50%) rotate(${p.tablet.position.r}deg)`
                }}>
                <div>{p.tablet.area.w} x {p.tablet.area.h} mm</div>
                <div>{ratio}</div>
            </div>
        </div>
    )

    function normalizeShape(width: number, height: number) {
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
export default TabletDisplay;