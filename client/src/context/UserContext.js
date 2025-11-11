import { createContext } from "react";

export const UserContext = createContext({
    id: '',
    username: '',
    email: '',
    role: '',
    token: '',
    userLoginHandler: () => null,
    userLogoutHandler: () => null,
})