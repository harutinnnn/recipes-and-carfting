import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "@/context/AuthProvider";
import App from "./App";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <AuthProvider>
            <App/>
        </AuthProvider>
    </BrowserRouter>
)
