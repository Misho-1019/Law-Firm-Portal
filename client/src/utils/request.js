const request = async (method, url, data, options = {}) => {

    if (method !== 'GET' && method !== 'HEAD') { options.method = method }

    if (data) {
        if (method === 'GET' || method === 'HEAD') {
            options = { ...data, ...options };
        } else {
            options = {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                body: JSON.stringify(data),
            }
        }
    }

    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    const token = authData?.token;
    
    options = {
      ...options,
      signal: options.signal || AbortSignal.timeout(10000),
      headers: {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    const response = await fetch(url, options)

    const responseContentType = response.headers.get('Content-Type')

    if (!responseContentType) {
        if (!response.ok) {
            throw { message: `Request failed with status ${response.status}` };
        }
        return null;
    }

    if (!response.ok) {
        let error;
        try {
            error = await response.json();
        } catch {
            error = { message: `Request failed with status ${response.status}` };
        }
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