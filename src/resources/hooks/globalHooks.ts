import { useEffect, useRef, useState } from "react";

export function useDivSize(type: 'w' | 'h', init: number) {
    const [divPx, setPx] = useState(init);
    const divRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!divRef) return; 
        if (!divRef?.current) return;
        setPx(type === 'h' ? divRef.current.clientHeight : divRef.current.clientWidth);
    }, [divRef?.current?.clientHeight]);

    return { divPx, divRef };
}