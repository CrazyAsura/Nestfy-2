import axios from "axios";
import { store } from "../../stores";

export const getSocketBaseURL = () => {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl && typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
        apiUrl = 'https://nestfy-2-production.up.railway.app';
    }

    if (apiUrl) {
        let normalizedUrl = apiUrl;
        if (!normalizedUrl.startsWith('http')) {
            normalizedUrl = `https://${normalizedUrl}`;
        }
        return normalizedUrl.endsWith('/') ? normalizedUrl.slice(0, -1) : normalizedUrl;
    }

    return 'http://localhost:8080';
};

export const getBaseURL = () => {
    const socketUrl = getSocketBaseURL();
    const urlWithSlash = socketUrl.endsWith('/') ? socketUrl : `${socketUrl}/`;
    return urlWithSlash.includes('/api/') ? urlWithSlash : `${urlWithSlash}api/`;
};

export const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    let token = store.getState().auth.accessToken;

    // Se não estiver no Redux, tenta pegar do localStorage (útil em refresh de página)
    if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('accessToken');
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});