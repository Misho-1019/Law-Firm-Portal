import request from "../utils/request";

const baseUrl = 'http://localhost:3000/auth';

export const useLogin = () => {
    const login = async (email, password) => {
        const result = await request.post(`${baseUrl}/login`, { email, password })

        return result
    }

    return { login }
}