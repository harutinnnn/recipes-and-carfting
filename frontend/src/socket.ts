import { io, Socket } from "socket.io-client";
import { getAccessToken } from "@/helpers/authStorage";

export interface ServerToClientEvents {
    welcome: (data: { message: string }) => void;
    chat_message: (data: { user: string; message: string }) => void;
}

export interface ClientToServerEvents {
    chat_message: (data: { user: string; message: string }) => void;
}

const URL = import.meta.env.VITE_API_URL;

export const socket: Socket = io(URL, {
    autoConnect: false,
    // transports: ["websocket"],
    auth: (cb) => {
        const token = getAccessToken();
        cb({
            token: token ? `Bearer ${token}` : "",
        });
    },
});

export const reconnectSocketWithFreshToken = () => {
    if (socket.connected) {
        socket.disconnect();
    }
    socket.connect();
};
