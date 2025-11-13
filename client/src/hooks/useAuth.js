import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import request from "../utils/request";

export default function useAuth() {
    const authData = useContext(UserContext)

    const requestWrapper = (method, url, data, options = {}) => {
        const optionsWrapper = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            }
        }

        return request(method, url, data, optionsWrapper)
    }

    return {
        ...authData,
        request: {
            get: requestWrapper.bind(null, 'GET'),
            post: requestWrapper.bind(null, 'POST'),
            put: requestWrapper.bind(null, 'PUT'),
            delete: requestWrapper.bind(null, 'DELETE'),
        }
    }
}