import { createContext } from "react";
import type {AuthContextType} from "../types/AuthContextType.ts";

export const AuthContext = createContext<AuthContextType | null>(null);
