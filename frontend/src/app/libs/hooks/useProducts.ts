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