import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/services/axios";
import { API_ROUTES } from "../api/routes";

export function useReviews(productId: string) {
    return useQuery({
        queryKey: ['reviews', productId],
        queryFn: async () => {
            const { data } = await api.get(API_ROUTES.REVIEWS.BY_PRODUCT(productId));
            return data;
        },
        enabled: !!productId,
    });
}

export function useCreateReview() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { productId: string; rating: number; comment: string }) => {
            const { data } = await api.post(API_ROUTES.REVIEWS.BASE, payload);
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
        },
    });
}

export function useToggleLikeReview() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ reviewId }: { reviewId: string; productId: string }) => {
            const { data } = await api.post(`${API_ROUTES.REVIEWS.BASE}/${reviewId}/like`);
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
        },
    });
}

export function useReplyToReview() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ reviewId, comment }: { reviewId: string; productId: string; comment: string }) => {
            const { data } = await api.post(`${API_ROUTES.REVIEWS.BASE}/${reviewId}/reply`, { comment });
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
        },
    });
}
