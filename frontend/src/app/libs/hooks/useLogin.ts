import { useMutation } from '@tanstack/react-query';
import { loginRequest } from '@/app/libs/api/services/auth.service';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/app/libs/stores/slices/auth.slice';

export function useLogin() {
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: loginRequest,
        onSuccess: (data) => {
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
            }
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            dispatch(loginSuccess(data));
        }
    })
}