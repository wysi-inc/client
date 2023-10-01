interface KeyInterface {
    char: string,
    code: string,
    width: number,
    keys: string[],
    toggle: (key : string) => void;
}

const Key = (p: KeyInterface) => {
    return (
        <button onClick={() => p.toggle(p.code)}>
            <kbd className={`kbd ${p.keys.includes(p.code) && 'bg-opacity-50 border border-secondary bg-secondary'}`}
                style={{ width: `${p.width * 2.199}rem` }}>
                {p.char}
            </kbd>
        </button>
    );
}

export default Key;