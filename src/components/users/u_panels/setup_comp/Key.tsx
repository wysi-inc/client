interface Props {
    char: string,
    code: string,
    width: number,
    keys: string[],
    toggle: (key : string) => void;
}

const Key = (p: Props) => {
    return (
        <button onClick={() => p.toggle(p.code)}>
            <kbd className={`kbd ${p.keys.includes(p.code) && 'bg-opacity-50 border border-secondary bg-secondary'}`}
                style={{ width: `${p.width * 2.2}rem` }}>
                {p.char}
            </kbd>
        </button>
    );
}

export default Key;