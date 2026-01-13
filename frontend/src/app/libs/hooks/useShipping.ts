import { useQuery } from "@tanstack/react-query";
import { api } from "../api/services/axios";
import { API_ROUTES } from "../api/routes";

export function useTracking(code: string) {
    return useQuery({
        queryKey: ['tracking', code],
        queryFn: async () => {
            const { data } = await api.get(API_ROUTES.SHIPPING.TRACK(code));
            return data;
        },
        enabled: !!code,
        retry: false,
    });
}
