import { createContext, useContext } from "react";
import type { AuthUser } from "@/models/spentResponse.model";

export const AuthUserContext = createContext<AuthUser | null>(null);

export const useAuthUser = () => useContext(AuthUserContext);
