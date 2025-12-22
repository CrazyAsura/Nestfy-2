import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileRequest } from "../api/services/auth.service";
import { EditProfileFormData } from "../schema/editProfile.schema";

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: EditProfileFormData | FormData) => updateProfileRequest(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
    });
}
