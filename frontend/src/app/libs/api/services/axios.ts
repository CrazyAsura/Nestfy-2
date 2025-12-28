import axios from "axios";
import { store } from "../../stores";

const getBaseURL = () => {
    const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Se tivermos a URL pública, garantimos que ela termine com /api
    if (publicApiUrl) {
        const normalizedUrl = publicApiUrl.replace(/\/$/, '');
        // Se a URL já termina com /api, não adicionamos de novo
        return normalizedUrl.endsWith('/api') ? normalizedUrl : `${normalizedUrl}/api`;
    }

    // Fallback para desenvolvimento local via proxy do Next.js
    return '/api';
};

export const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})