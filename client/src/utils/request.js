const request = async (method, url, data, options = {}) => {

    if (method !== 'GET') { options.method = method }

    if (data) {
        options = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            body: JSON.stringify(data),
        }
    }

    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    const token = authData?.token;
    
    options = {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    const response = await fetch(url, options)

    const responseContentType = response.headers.get('Content-Type')

    if (!responseContentType) return;

    if (!response.ok) {
        const error = await response.json();

        throw error;
    }

    const result = await response.json();

    return result
}

export default {
    get: request.bind(null, 'GET'),
    post: request.bind(null, 'POST'),
    put: request.bind(null, 'PUT'),
    patch: request.bind(null, 'PATCH'),
    delete: request.bind(null, 'DELETE'),
    baseRequest: request,
}