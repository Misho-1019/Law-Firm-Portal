import { useContext, useEffect, useRef } from "react";
import request from "../utils/request";
import { UserContext } from "../context/UserContext";

const baseUrl = 'http://localhost:3000/auth';

export const useLogin = () => {
    const abortRef = useRef(new AbortController());

    const login = async (email, password) => {
        const result = await request.post(`${baseUrl}/login`, { email, password }, { signal: abortRef.current.signal })

        return result
    }

    useEffect(() => {
        const abortController = abortRef.current;

        return () => abortController.abort();
    }, [])

    return { login }
}

export const useRegister = () => {
    const register = (firstName, lastName, username, email, password, phone) =>
        request.post(`${baseUrl}/register`, { firstName, lastName, username, email, password, phone })

    return { register }
}

export const useLogout = () => {
    const { userLogoutHandler } = useContext(UserContext)

    useEffect(() => {
        request.get(`${baseUrl}/logout`)
            .finally(userLogoutHandler)
    }, [userLogoutHandler])

    return {
        isLoggedOut: true,
    }
}

export const useChangePassword = () => {
    const abortRef = useRef(new AbortController())

    const changePassword = async (currentPassword, newPassword) => {
        const result = await request.put(`
            ${baseUrl}/users/me/password`, 
            { currentPassword, newPassword}, 
            { signal: abortRef.current.signal }
        )

        return result;
    }

    useEffect(() => {
        const abortController = abortRef.current;

        return () => abortController.abort();
    }, [])

    return { changePassword }
}