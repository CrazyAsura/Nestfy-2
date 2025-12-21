import { useMutation } from "@tanstack/react-query";
import { ResetPasswordFormData } from "../schema/resetPassword.schema";
import { resetPasswordRequest } from "../api/services/auth.service";

export function useResetPassword() {
    return useMutation({
        mutationFn: async (data: ResetPasswordFormData) => {
            return resetPasswordRequest(data);
        }
    })
}