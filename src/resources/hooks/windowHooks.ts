import { useEffect, useRef, useState } from "react";

export function useDivSize(type: 'w' | 'h', init: number) {
    const [divPx, setPx] = useState(init);
    const divRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        getSize();
    }, [divRef?.current?.clientHeight]);

    function getSize() {
        if (divRef) if (divRef.current)
            setPx(type === 'h' ? divRef.current?.clientHeight : divRef.current?.clientWidth);
    }

    return {divPx, divRef};
}