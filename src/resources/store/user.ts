import { create } from "zustand";

export interface UserStoreInt {
    isLogged: boolean,
    user: {
        id: number,
        name: string,
        pfp: string
    },
    login: (id: number, name: string, pfp: string) => void,
    logout: () => void,
}

export const UserStore = create<UserStoreInt>(
    (set) => ({
        isLogged: false,
        user: {
            id: 0,
            name: '',
            pfp: ''
        },
        login: (id: number, name: string, pfp: string) => {

            localStorage.setItem('pfp', pfp);
            localStorage.setItem('name', name);

            set({ isLogged: true, user: { id: id, name: name, pfp: pfp } })
        },
        logout: () => {
            set({ isLogged: false, user: { id: 0, name: '', pfp: '' } });
            localStorage.removeItem('jwt');
            localStorage.removeItem('name');
            localStorage.removeItem('pfp');
        },
    })
)