import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

interface AuthState {
    token: string;
    setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: '',
            setToken: (token: string) => set({token}),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);