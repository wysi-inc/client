export type KeyboardLayout = 'k2' | 'k3' | 'k4' | 'k60' | 'k75' | 'ktkl' | 'kfull' | '';

export type Tablet = {
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

export type Keyboard = {
    name: string,
    layout: KeyboardLayout,
    keys: string[],
}

export type Mouse = {
    name: string,
    dpi: number
}

export type Computer = {
    cpu: string,
    gpu: string,
    ram: string,
    psu: string,
    storage: string,
    motherboard: string,
    case: string,
}