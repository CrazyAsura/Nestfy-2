import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/services/axios";
import { API_ROUTES } from "../api/routes";

export function useNotifications() {
    return useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const { data } = await api.get(API_ROUTES.NOTIFICATIONS.BASE);
            return data;
        },
    });
}

export function useMarkNotificationAsRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.patch(API_ROUTES.NOTIFICATIONS.READ(id));
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
}

export function useMarkAllNotificationsAsRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const { data } = await api.post(API_ROUTES.NOTIFICATIONS.READ_ALL);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
}
