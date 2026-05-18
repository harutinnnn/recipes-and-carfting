import {Outlet, useLocation} from "react-router-dom";
import {useEffect} from "react";
import {socket, reconnectSocketWithFreshToken} from "@/socket";
import {useAuth} from "@/hooks/useAuth";
import {getUrlPart} from "@/utils/url.helper";
import {AdminHeader} from "@/components/admin/AdminHeader";
import {AdminSidebar} from "@/components/admin/AdminSidebar";

export type ProtectedLayoutContext = {
    socket: typeof socket;
};

export default function ProtectedAdminLayout() {
    const {user} = useAuth();

    const location = useLocation();

    const pageUrl: string = getUrlPart(location.pathname, 0)

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
        <div className={"admin-wrapper"}>
            <AdminHeader/>
            <AdminSidebar/>


            <Outlet context={{socket}}/>
        </div>
    );
}
