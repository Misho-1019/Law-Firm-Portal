import { createContext, useContext } from "react";

export const UserContext = createContext({
    id: '',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    role: '',
    phone: '',
    token: '',
    userLoginHandler: () => null,
    userLogoutHandler: () => null,
})

export function useUserContext() {
    const data = useContext(UserContext)

    return data;
}