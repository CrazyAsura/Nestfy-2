import { api } from './axios';
import { API_ROUTES } from '../routes';

export async function fetchCjProducts(page: number = 1, size: number = 20, search?: string) {
  const response = await api.get(API_ROUTES.CJ_DROPSHIPPING.PRODUCTS, {
    params: { page, size, search },
  });
  return response.data;
}

export async function fetchCjProductDetail(pid: string) {
  const response = await api.get(API_ROUTES.CJ_DROPSHIPPING.PRODUCT_DETAIL(pid));
  return response.data;
}

export async function importCjProduct(pid: string, categoryId: string) {
  const response = await api.post(API_ROUTES.CJ_DROPSHIPPING.IMPORT, {
    pid,
    categoryId,
  });
  return response.data;
}
