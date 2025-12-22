import { LoginFormData } from '../../schema/login.schema';
import { ResetPasswordFormData } from '../../schema/resetPassword.schema';
import { Profile } from '../../types/profile';
import { api } from './axios';


api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export const registerRequest = async (data: any) => {
    const endpoint = data.userType === 'INDIVIDUAL'
    ? '/auth/register/pf'
    : '/auth/register/pj';

    const response = await api.post(endpoint, data);
    return response.data;
}

export async function loginRequest(data: LoginFormData) {
    const response = await api.post('/auth/login', data);
    return response.data;
}

export async function getProfileRequest(): Promise<Profile> {
    const response = await api.get<Profile>('/auth/profile');
    return response.data;
}

export async function updateProfileRequest(data: FormData | any): Promise<Profile> {
    const response = await api.patch<Profile>('/auth/profile', data);
    return response.data;
}

export async function resetPasswordRequest(data: ResetPasswordFormData) {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
}