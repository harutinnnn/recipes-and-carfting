export type AuthViewType = "login" | "register" | "forgot";

export type AuthViewCallback = (authCbType: AuthViewType) => void;
