import { LoginFormData } from '../../schema/login.schema';
import { ResetPasswordFormData } from '../../schema/resetPassword.schema';
import { Profile } from '../../types/profile';
import { api } from './axios';
import { API_ROUTES } from '../routes';


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
    ? API_ROUTES.AUTH.REGISTER_PF
    : API_ROUTES.AUTH.REGISTER_PJ;

    const response = await api.post(endpoint, data);
    return response.data;
}

export async function loginRequest(data: LoginFormData) {
    const response = await api.post(API_ROUTES.AUTH.LOGIN, data);
    return response.data;
}

export async function getProfileRequest(): Promise<Profile> {
    const response = await api.get<Profile>(API_ROUTES.AUTH.PROFILE);
    return response.data;
}

export async function updateProfileRequest(data: FormData | any): Promise<Profile> {
    const response = await api.patch<Profile>(API_ROUTES.AUTH.PROFILE, data);
    return response.data;
}

export async function resetPasswordRequest(data: ResetPasswordFormData) {
    const response = await api.post(API_ROUTES.AUTH.RESET_PASSWORD, data);
    return response.data;
}