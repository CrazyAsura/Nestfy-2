import { useQuery } from "@tanstack/react-query";
import { getProfileRequest } from "../api/services/auth.service";
import { Profile } from "../types/profile";

export function useProfile() {
    return useQuery<Profile>({
        queryKey: ['profile'],
        queryFn: getProfileRequest,
    })
}