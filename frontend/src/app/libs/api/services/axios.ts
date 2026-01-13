import axios from "axios";
import { store } from "../../stores";

export const getSocketBaseURL = () => {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl && typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
        if (window.location.hostname.includes('onrender.com')) {
            // Se estiver no Render, tenta inferir a URL do backend (geralmente o mesmo domínio ou subdomínio)
            apiUrl = window.location.origin.replace('frontend', 'backend'); 
            // Ou se o usuário forneceu https://nestfy-2.onrender.com/, podemos tentar https://nestfy-2-backend.onrender.com/
            if (window.location.hostname === 'nestfy-2.onrender.com') {
                apiUrl = 'https://nestfy-2-backend.onrender.com';
            }
        } else {
            apiUrl = 'https://nestfy-2-production.up.railway.app';
        }
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