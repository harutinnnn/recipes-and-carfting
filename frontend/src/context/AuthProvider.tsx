import { useState, useEffect, useMemo } from "react";
import { getMeRequest, refreshRequest } from "@/api/auth.api";
import { AxiosError } from "axios";
import { AuthContext } from "./AuthContext";
import {
    clearAuthStorage,
    getAccessToken,
    getRefreshToken,
    setAuthTokens,
} from "@/helpers/authStorage";
import {User} from "@/types/User";

type RefreshResponse = {
    accessToken?: string;
    token?: string;
    refreshToken?: string;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        clearAuthStorage();
        setUser(null);
    };

    useEffect(() => {
        async function restoreSession() {
            try {
                const token = getAccessToken();
                if (!token) return setLoading(false);

                const userFromApi = await getMeRequest();
                setUser(userFromApi);
            } catch (err) {

                if (err instanceof AxiosError) {
                    const refreshToken = getRefreshToken();
                    if (refreshToken) {
                        const refresh = await refreshRequest(refreshToken) as RefreshResponse;
                        const nextAccessToken = refresh.accessToken ?? refresh.token;

                        if (!nextAccessToken) {
                            logout();
                            return;
                        }

                        setAuthTokens({
                            accessToken: nextAccessToken,
                            refreshToken: refresh.refreshToken ?? refreshToken,
                        });

                        const userFromApi = await getMeRequest();
                        setUser(userFromApi);
                    } else logout();
                } else {
                    logout();
                }
            } finally {
                setLoading(false);
            }
        }

        restoreSession();
    }, []);

    const login = (token: string, user: User) => {
        setAuthTokens({ accessToken: token });
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
    };

    const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
