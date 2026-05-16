type TokenPair = {
    accessToken?: string | null;
    refreshToken?: string | null;
};

export function getAccessToken() {
    return localStorage.getItem("accessToken");
}

export function getRefreshToken() {
    return localStorage.getItem("refreshToken");
}

export function setAuthTokens({ accessToken, refreshToken }: TokenPair) {
    if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
    }

    if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
    }
}

export function clearAuthStorage() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
}
