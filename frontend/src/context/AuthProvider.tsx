import { useState, useEffect, useMemo, useCallback } from "react";
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

    const logout = useCallback(() => {
        clearAuthStorage();
        setUser(null);
    }, []);

    const refreshUser = useCallback(async () => {
        const userFromApi = await getMeRequest();
        setUser(userFromApi);
        return userFromApi;
    }, []);

    useEffect(() => {
        async function restoreSession() {
            try {
                const token = getAccessToken();
                if (!token) return setLoading(false);

                await refreshUser();
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

                        await refreshUser();
                    } else logout();
                } else {
                    logout();
                }
            } finally {
                setLoading(false);
            }
        }

        restoreSession();
    }, [logout, refreshUser]);

    const login = useCallback((token: string, user: User) => {
        setAuthTokens({ accessToken: token });
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
    }, []);

    const value = useMemo(() => ({ user, loading, login, logout, refreshUser }), [user, loading, login, logout, refreshUser]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
