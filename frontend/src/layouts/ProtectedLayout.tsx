import {Outlet} from "react-router-dom";
import {useEffect} from "react";
import {socket, reconnectSocketWithFreshToken} from "@/socket";
import {useAuth} from "@/hooks/useAuth";
import {Header} from "@/components/Header";

export type ProtectedLayoutContext = {
    socket: typeof socket;
};

export default function ProtectedLayout() {
    const {user} = useAuth();


    useEffect(() => {
        if (!user) {
            socket.disconnect();
            return;
        }

        reconnectSocketWithFreshToken();

        return () => {
            socket.disconnect();
        };
    }, [user]);


    return (
        <>
            <Header/>

            <Outlet context={{socket}}/>
        </>
    );
}
