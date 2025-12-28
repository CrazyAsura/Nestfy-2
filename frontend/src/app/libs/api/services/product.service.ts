import { api } from './axios';
import { ProductResponse } from '../../types/interfaces/productResponse';
import { API_ROUTES } from '../routes';

export async function fetchProducts(
    page?: number,
    limit?: number,
): Promise<ProductResponse> {
    const response = await api.get(API_ROUTES.PRODUCTS.BASE, {
        params: {
            page, limit
        }
    });

    return response.data;
}
