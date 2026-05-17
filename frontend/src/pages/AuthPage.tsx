import '../components/auth/Auth.css'
import {LoginComponent} from "@/components/auth/LoginComponent";
import {useEffect, useState} from "react";
import {RegisterComponent} from "@/components/auth/RegisterComponent";
import type {AuthViewType} from "@/types/auth";
import {ForgotComponent} from "@/components/auth/ForgotComponent";
import {useAuth} from "@/hooks/useAuth";
import {useNavigate} from "react-router-dom";

export const AuthPage = () => {

    const {user} = useAuth();
    const navigate = useNavigate();

    const [authType, setAuthType] = useState<AuthViewType>("login");

    useEffect(() => {
        if (user) {

                navigate("/", {replace: true});

        }
    }, [user, navigate]);

    const handleAuthView = (viewType: AuthViewType) => {
        setAuthType(viewType);
    }

    const authComponent = {
        login: <LoginComponent cb={handleAuthView}/>,
        register: <RegisterComponent cb={handleAuthView}/>,
        forgot: <ForgotComponent cb={handleAuthView}/>
    }[authType];

    return (
        <div className="auth-page">
            {authComponent}
        </div>
    )
}
