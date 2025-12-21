import { useMutation } from "@tanstack/react-query";
import { registerRequest } from "../api/services/auth.service";
import { RegisterFormData } from "../schema/register.schema";

export function useRegister() {
    return useMutation({
        mutationFn: (data: RegisterFormData) => registerRequest(data),
    });
}