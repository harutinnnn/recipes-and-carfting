import axios from "axios";
import {FailedQueueItem} from "@/types/FailedQueueItem";
import {
    clearAuthStorage,
    getAccessToken,
    getRefreshToken,
    setAuthTokens,
} from "@/helpers/authStorage";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/api',
});

type RefreshResponse = {
    accessToken?: string;
    token?: string;
    refreshToken?: string;
};

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};
api.interceptors.request.use((config) => {
    const token = getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const requestUrl = originalRequest?.url ?? "";

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !requestUrl.includes("/auth/refresh")
        ) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({resolve, reject});
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = "Bearer " + token;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = getRefreshToken();

                if (!refreshToken) {
                    throw error;
                }

                const {data} = await axios.post<RefreshResponse>(
                    `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
                    {refreshToken}
                );

                const nextAccessToken = data.accessToken ?? data.token;

                if (!nextAccessToken) {
                    throw error;
                }

                setAuthTokens({
                    accessToken: nextAccessToken,
                    refreshToken: data.refreshToken ?? refreshToken,
                });

                processQueue(null, nextAccessToken);

                originalRequest.headers.Authorization =
                    "Bearer " + nextAccessToken;

                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                clearAuthStorage();
                if (window.location.pathname !== "/auth") {
                    window.location.href = "/auth";
                }
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;