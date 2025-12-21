import { CategoryResponse } from "../../types/interfaces/categoryResponse";
import { api } from "./axios";

export async function fetchCategories(
    page?: number,
    limit?: number,
): Promise<CategoryResponse> {
    const response = await api.get('/category', {
        params: {
            page, limit
        }
    })

    return response.data;
}