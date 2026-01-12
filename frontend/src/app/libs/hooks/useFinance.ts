import { useQuery } from "@tanstack/react-query";
import { api } from "../api/services/axios";

export function useFinanceStats() {
    return useQuery({
        queryKey: ['finance-stats'],
        queryFn: async () => {
            const { data } = await api.get('/finance/stats');
            return data;
        }
    });
}
