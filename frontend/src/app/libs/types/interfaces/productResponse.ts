import { Product } from "../product";

export interface ProductResponse {
    data: Product[],
    meta: {
        total: number;
        page: number;
        limit: number;
    };
}