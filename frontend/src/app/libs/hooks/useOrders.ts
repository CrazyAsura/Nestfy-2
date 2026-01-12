import { useQuery } from "@tanstack/react-query";
import { api } from "../api/services/axios";
import { API_ROUTES } from "../api/routes";

export function useOrders() {
    return useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const { data } = await api.get(API_ROUTES.ORDERS.BASE);
            return data;
        },
    });
}

export function useOrder(id: string) {
    return useQuery({
        queryKey: ['order', id],
        queryFn: async () => {
            const { data } = await api.get(API_ROUTES.ORDERS.BY_ID(id));
            return data;
        },
        enabled: !!id,
    });
}
