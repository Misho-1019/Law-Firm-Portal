export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export const api = {
    auth: `${API_BASE}/auth`,
    appointments: `${API_BASE}/appointments`,
    availability: `${API_BASE}/availability`,
    admin: `${API_BASE}/admin`
}