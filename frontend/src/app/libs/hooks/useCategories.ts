import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api/services/category.service";
import { api } from "../api/services/axios";
import { API_ROUTES } from "../api/routes";

export function useCategories(
    page?: number,
    limit?: number,
) {
    return useQuery({
        queryKey: ['categories', page],
        queryFn: () => fetchCategories(page, limit),
        placeholderData: keepPreviousData,
    })
}

export function useCategory(id: string) {
    return useQuery({
        queryKey: ['category', id],
        queryFn: async () => {
            const { data } = await api.get(`${API_ROUTES.CATEGORIES.BASE}/${id}`);
            return data;
        },
        enabled: !!id,
    });
}
