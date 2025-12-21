import { api } from './axios';
import { ProductResponse } from '../../types/interfaces/productResponse';

export async function fetchProducts(
    page?: number,
    limit?: number,
): Promise<ProductResponse> {
    const response = await api.get('/products', {
        params: {
            page, limit
        }
    });

    return response.data;
}
