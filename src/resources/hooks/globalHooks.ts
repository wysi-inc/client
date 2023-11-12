import { RefObject, useEffect, useRef, useState } from "react";

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

const OPTIONS = {
  root: null,
  rootMargin: "0px 0px 0px 0px",
  threshold: 0,
};

export const useIsVisible = (elementRef: RefObject<HTMLDivElement>) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    if (!elementRef.current) return;
    if (elementRef === null) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      }, OPTIONS);
      observer.observe(elementRef.current);
  }, [elementRef]);

  return isVisible;
};

export default useIsVisible;