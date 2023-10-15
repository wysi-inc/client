export type KeyboardLayoutType = 'k2' | 'k3' | 'k4' | 'k60' | 'k75' | 'ktkl' | 'kfull' | '';

export interface TabletInterface {
    name: string,
    area: {
        w: number,
        h: number,
    },
    position: {
        x: number,
        y: number,
        r: number,
    },
    size: {
        w: number,
        h: number
    }
}

export interface KeyboardInterface {
    name: string,
    layout: KeyboardLayoutType,
    keys: string[],
}

export interface MouseInterface {
    name: string,
    dpi: number
}