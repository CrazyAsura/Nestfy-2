import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/services/axios";
import { API_ROUTES } from "../api/routes";
import { useSelector } from "react-redux";
import { RootState } from "../stores";

export function useWishlist() {
    const user = useSelector((state: RootState) => state.auth.user);
    const userId = user?.id;

    return useQuery({
        queryKey: ['wishlist', userId],
        queryFn: async () => {
            if (!userId) return null;
            const { data } = await api.get(API_ROUTES.WISHLIST.BY_USER(String(userId)));
            return data;
        },
        enabled: !!userId,
    });
}

export function useAddToWishlist() {
    const queryClient = useQueryClient();
    const user = useSelector((state: RootState) => state.auth.user);
    const userId = user?.id;

    return useMutation({
        mutationFn: async (productId: string) => {
            if (!userId) throw new Error("Usuário não autenticado");
            
            // Primeiro, pegamos a wishlist do usuário para obter o wishlistId
            const { data: wishlist } = await api.get(API_ROUTES.WISHLIST.BY_USER(String(userId)));
            
            const { data } = await api.post(API_ROUTES.WISHLIST.ADD_ITEM, {
                wishlistId: wishlist.id,
                productId
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
        },
    });
}

export function useRemoveFromWishlist() {
    const queryClient = useQueryClient();
    const user = useSelector((state: RootState) => state.auth.user);
    const userId = user?.id;

    return useMutation({
        mutationFn: async (wishlistItemId: string) => {
            const { data } = await api.delete(API_ROUTES.WISHLIST.REMOVE_ITEM(wishlistItemId));
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
        },
    });
}
