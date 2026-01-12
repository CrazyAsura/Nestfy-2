import axios from "axios";
import { store } from "../../stores";

const getBaseURL = () => {
    // 1. Tenta pegar da variável de ambiente (Vercel/Local)
    let apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // 2. Se estiver em produção e a variável estiver vazia, usa o domínio do Railway diretamente
    if (!apiUrl && typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
        apiUrl = 'https://nestfy-2-production.up.railway.app';
    }

    if (apiUrl) {
        let normalizedUrl = apiUrl;
        if (!normalizedUrl.startsWith('http')) {
            normalizedUrl = `https://${normalizedUrl}`;
        }
        const urlWithSlash = normalizedUrl.endsWith('/') ? normalizedUrl : `${normalizedUrl}/`;
        return urlWithSlash.includes('/api/') ? urlWithSlash : `${urlWithSlash}api/`;
    }

    // 3. Fallback para desenvolvimento local (Proxy do Next.js)
    return typeof window !== 'undefined' ? '/api/' : 'http://localhost:8080/api/';
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