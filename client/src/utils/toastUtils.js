import { toast } from "react-toastify";

export const showToast = (message, type = 'success', options = {}) => {
    const defaultOptions = {
        position: 'top-center',
        autoClose: 1500,
        theme: 'light',
    }

    const toastOptions = { ...defaultOptions, ...options };

    switch (type) {
        case 'success':
            toast.success(message, toastOptions)
            break;
        case 'error':
            toast.error(message, toastOptions)
            break;
        case 'info':
            toast.info(message, toastOptions)
            break;
        case 'warning':
            toast.warning(message, toastOptions)
            break;
        default:
            toast(message, toastOptions)
            break;
    }
}