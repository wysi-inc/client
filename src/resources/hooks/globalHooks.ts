import { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';

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

    return { divPx, divRef };
}

export function useCountTranslatedKeys(code: string) : number {
    const { i18n } = useTranslation();

    const [percentage, setPercentage] = useState<number>(0);

    useEffect(() => {
        getPercentage();
        console.log(percentage)
    }, [code, i18n]);

    function getPercentage() {
        if (code.split('-')[0] === 'en') {
            setPercentage(100);
            return;
        };
        const enLang = i18n.getDataByLanguage('en');
        if (!enLang) return 0;
        const currLang = i18n.getDataByLanguage(code);
        if (!currLang) return 0;
        const curr = countObjectKeys(currLang.translation);
        const en = countObjectKeys(enLang.translation);
        const percentage = 100 - (en - curr);
        setPercentage(percentage);
    }

    function countObjectKeys(obj: any): number {
        if (typeof obj !== 'object' || obj === null) {
            return 0;
        }
        let count = Object.keys(obj).length;
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                count += countObjectKeys(obj[key]);
            }
        }
        return count;
    }

    return percentage;
};