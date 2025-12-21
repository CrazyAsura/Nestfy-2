import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api/services/category.service";

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