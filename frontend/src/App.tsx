import './App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import {MainPage} from "@/pages/MainPage";
import {Toaster} from "react-hot-toast";
import ActivationCode from "@/pages/ActivationCode";
import {AuthPage} from "@/pages/AuthPage";
import ProtectedAdminLayout from "@/layouts/ProtectedAdminLayout";
import {useAuth} from "@/hooks/useAuth";
import {AdminMain} from "@/pages/admin/admin.main";

function App() {

    const {user} = useAuth();
    const isAdminUser = user?.isAdmin;


    return (
        <div>

            <Routes>

                <Route element={<AuthLayout/>}>
                    <Route path="/auth" element={<AuthPage/>}/>
                </Route>

                <Route path="/wrong-activation-code" element={<ActivationCode/>}/>

                <Route
                    element={
                        <ProtectedRoute>
                            <ProtectedLayout/>
                        </ProtectedRoute>
                    }
                >

                    <Route path="/" element={<MainPage/>}/>

                </Route>


                <Route
                    element={
                        <ProtectedRoute>
                            <ProtectedAdminLayout/>
                        </ProtectedRoute>
                    }
                >
                    <Route path="/admin" element={isAdminUser ? <AdminMain/> : <Navigate to="/" replace/>}/>

                    {/*<Route path="/admin/product-categories"
                       element={isAdminUser ? <AdminProductCategories/> : <Navigate to="/" replace/>}/>*/}


                </Route>
            </Routes>

            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </div>
    )
}

export default App
