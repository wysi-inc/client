import { useEffect, useRef, useState } from "react";

export function useHeight(init: number) {
    const [px, setPx] = useState(init);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleResize = () => {
            if (ref) if (ref.current)
                setPx(ref.current?.clientHeight);
        }
        window.addEventListener('resize', handleResize)
    }, []);

    return { px, ref };
}