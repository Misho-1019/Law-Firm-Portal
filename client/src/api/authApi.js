import { useContext, useEffect, useRef } from "react";
import request from "../utils/request";
import { UserContext } from "../context/UserContext";
import { api } from "../config/api";

const baseUrl = api.auth;

export const useLogin = () => {
    const abortRef = useRef(new AbortController());
    const { userLoginHandler } = useContext(UserContext)

    const login = async (email, password) => {
        const result = await request.post(`${baseUrl}/login`, { email, password }, { signal: abortRef.current.signal })

        if (result?.token) {
          userLoginHandler(result);
        }

        return result
    }

    useEffect(() => {
        const abortController = abortRef.current;

        return () => abortController.abort();
    }, [])

    return { login }
}

export const useRegister = () => {
    const { userLoginHandler } = useContext(UserContext)

    const register = async (firstName, lastName, username, email, password, phone) => {
        const result = await request.post(`${baseUrl}/register`, { firstName, lastName, username, email, password, phone })

        if (result?.token) {
            userLoginHandler(result)
        }

        return result
    }

    return { register }
}

export const useLogout = () => {
    const { userLogoutHandler } = useContext(UserContext)
    const abortRef = useRef(new AbortController())

    useEffect(() => {
        request.get(`${baseUrl}/logout`, { signal: abortRef.current.signal })
            .finally(() => {
                userLogoutHandler();
                localStorage.removeItem('auth');
            })

        return () => abortRef.current.abort();
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