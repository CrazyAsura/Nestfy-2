import axios from "axios";
import { store } from "../../stores";

const getBaseURL = () => {
    // No cliente, usamos o proxy /api definido no next.config.ts para evitar CORS
    if (typeof window !== 'undefined') {
        return '/api';
    }
    // No servidor (SSR/Build), usamos a URL direta do backend
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
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