import { api } from './axios';
import { ProductResponse } from '../../types/interfaces/productResponse';
import { API_ROUTES } from '../routes';

export async function fetchProducts(
    page?: number,
    limit?: number,
    search?: string,
    categoryId?: string,
    minPrice?: number,
    maxPrice?: number,
    sortBy?: string,
    order?: 'asc' | 'desc'
): Promise<ProductResponse> {
    const response = await api.get(API_ROUTES.PRODUCTS.BASE, {
        params: {
            page, 
            limit,
            search,
            categoryId,
            minPrice,
            maxPrice,
            sortBy,
            order
        }
    });

    return response.data;
}
