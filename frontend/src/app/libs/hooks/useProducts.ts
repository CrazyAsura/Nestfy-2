import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "../api/services/axios";
import { Product } from "../types/product";
import { fetchProducts } from "../api/services/product.service";
import { API_ROUTES } from "../api/routes";

async function fetchProductsCaroussel(): Promise<Product[]> {
    const { data } = await api.get(API_ROUTES.PRODUCTS.BASE)
    return data.data
}

export function useProductsCaroussel() {
    return useQuery({
        queryKey: ['products'],
        queryFn: fetchProductsCaroussel,
    })
}

export function useProducts(page: number, limit: number) {
    return useQuery({
        queryKey: ['products', page],
        queryFn: () => fetchProducts(page, limit),
        placeholderData: keepPreviousData,
    })
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const { data } = await api.get(API_ROUTES.PRODUCTS.BY_ID(id));
            return data;
        },
        enabled: !!id,
    });
}

export function useRelatedProducts(categoryId: string, currentProductId: string) {
    return useQuery({
        queryKey: ['products', 'related', categoryId],
        queryFn: async () => {
            const { data } = await api.get(`${API_ROUTES.PRODUCTS.BASE}?categoryId=${categoryId}`);
            // Filtra o produto atual da lista de relacionados
            return data.data?.filter((p: Product) => p.id !== currentProductId) || [];
        },
        enabled: !!categoryId,
    });
}
