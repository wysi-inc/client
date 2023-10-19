import { useEffect, useState, useRef } from 'react';
import { FaPen } from 'react-icons/fa';

interface PageTabsProps {
    current: number;
    min: number;
    max: number;
    setNewPage: (newPage: number) => void;
}

const PageTabs = (props: PageTabsProps) => {
    const [page, setPage] = useState<number>(props.current);

    const input = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setPage(props.current);
    }, [props.current]);
    
    return (
        <div className="flex flex-row gap-3 self-center">
            {props.current > props.min + 2 && <button className="font-bold btn btn-primary text-base-100" onClick={() => page && props.setNewPage(props.min)}>{props.min}</button>}
            <div className="join">
                {props.current > props.min + 1 && <button className="font-bold join-item btn btn-primary text-base-100" onClick={() => page && props.setNewPage(props.current - 2)}>{props.current - 2}</button>}
                {props.current > props.min && <button className="font-bold join-item btn btn-primary text-base-100" onClick={() => page && props.setNewPage(props.current - 1)}>{props.current - 1}</button>}
                <form onSubmit={(e) => {
                    e.preventDefault();
                    page && props.setNewPage(page);
                }} className="join-item bg-primary flex flex-row items-center z-10">
                    <button onClick={() => input && input.current && input.current.focus()}>
                        <FaPen style={{ marginRight: -16, transform: 'translateX(12px)' }} />
                    </button>
                    <input ref={input} style={{ backgroundColor: '#ffffff44' }}
                        className="p-0 h-full text-center input input-bordered ps-4"
                        placeholder="..." type="number"
                        min={props.min} max={props.max} value={page}
                        onChange={(e) => setPage(e.target.valueAsNumber)} />
                </form>
                {props.current < props.max && <button className="font-bold join-item btn btn-primary text-base-100" onClick={() => page && props.setNewPage(props.current + 1)}>{props.current + 1}</button>}
                {props.current < props.max - 1 && <button className="font-bold join-item btn btn-primary text-base-100" onClick={() => page && props.setNewPage(props.current + 2)}>{props.current + 2}</button>}
            </div>
            {props.current < props.max - 2 && <button className="font-bold btn btn-primary text-base-100" onClick={() => page && props.setNewPage(props.max)}>{props.max}</button>}
        </div>
    )
}

export default PageTabs;