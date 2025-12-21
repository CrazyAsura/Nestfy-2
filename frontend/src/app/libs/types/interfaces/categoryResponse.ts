import { Category } from "../category";

export interface CategoryResponse {
    data: Category[],
    meta: {
        total: number;
        page: number;
        limit: number;
    };
}