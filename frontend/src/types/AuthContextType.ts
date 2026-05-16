import type {User} from "./User.ts";

export type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
};