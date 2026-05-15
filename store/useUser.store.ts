import { create } from 'zustand';

type Profile = {
    user_id: number;
    username: string;
    fullname: string | null;
    role: string;
};

type UserStore = {
    profile: Profile | null;
    setProfile: (profile: Profile) => void;
    clearProfile: () => void;
};

export const useUserStore = create<UserStore>()(
    (set) => ({
        profile: null,
        setProfile: (profile) => set({ profile }),
        clearProfile: () => set({ profile: null }),
    })
);
