import { create } from "zustand";

export interface UserStore {
    isLogged: boolean,
    user: {
        id: number,
        name: string,
        pfp: string
    },
    login: (id: number, name: string, pfp: string) => void,
    logout: () => void,
}

export const UserStore = create<UserStore>(
    (set) => ({
        isLogged: false,
        user: {
            id: 0,
            name: '',
            pfp: ''
        },
        login: (id: number, name: string, pfp: string) => set({ isLogged: true, user: { id: id, name: name, pfp: pfp } }),
        logout: () => {
            set({ isLogged: false, user: { id: 0, name: '', pfp: '' } });
            try {
                localStorage.removeItem('jwt');
            } catch (err) {
                console.error(err);
            }
        },
    })
)