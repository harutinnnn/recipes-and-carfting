import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import {PageLoading} from "@/components/partial/PageLoading";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    console.log('user',user)

    if (loading) return <PageLoading/>;

    if (!user) return <Navigate to="/auth" replace />;

    return <>{children}</>;
}