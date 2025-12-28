import { CategoryResponse } from "../../types/interfaces/categoryResponse";
import { api } from "./axios";
import { API_ROUTES } from "../routes";

export async function fetchCategories(
    page?: number,
    limit?: number,
): Promise<CategoryResponse> {
    const response = await api.get(API_ROUTES.CATEGORIES.BASE, {
        params: {
            page, limit
        }
    })

    return response.data;
}