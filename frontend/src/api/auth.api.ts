import api from "./axios";
import {User} from "@/types/User";

export type LoginPayload = {
    email: string;
    password: string;
};
export type ForgotPayload = {
    email: string;
};

export type RegisterPayload = {
    email: string;
    name: string;
    nickname: string;
    gender: string;
    password: string;
};

export type LoginResponse = {
    token: string;
    refreshToken: string;
    user: User;
};

export type ForgotResponse = {
    email: string;
    message: string;
};


export type ErrorResponse = {
    error: string;
}

export async function registerRequest(
    data: RegisterPayload
): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/register", data);
    return response.data;
}

export async function loginRequest(
    data: LoginPayload
): Promise<LoginResponse | ErrorResponse> {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
}

export async function forgotRequest(
    data: ForgotPayload
): Promise<ForgotResponse | ErrorResponse> {
    const response = await api.post<ForgotResponse>("/auth/forgot", data);
    return response.data;
}

export async function refreshRequest(refreshToken: string) {
    const response = await api.post("/auth/refresh", {refreshToken});
    return response.data;
}

export async function logoutRequest() {
    return api.post("/auth/logout");
}

export async function getMeRequest(): Promise<User | null> {
    const response = await api.get<User>("/auth/me");
    return response.data;
}