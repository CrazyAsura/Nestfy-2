import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminService from "../api/services/admin.services";
import * as cjService from "../api/services/cj.service";
import { Product } from "../types/product";
import { Category } from "../types/category";
import { Profile } from "../types/profile";
import { any, string } from "zod";

export function useAdminStats() {
    return useQuery({
        queryKey: ['admin, stats'],
        queryFn: adminService.getDashboardStats,
    });
}

export function useClearSampleData() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminService.clearSampleData,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
            queryClient.invalidateQueries({ queryKey: ['admin, stats'] });
        },
    });
}

export function useAdminRecentOrders() {
    return useQuery({
        queryKey: ['admin', 'orders', 'recent'],
        queryFn: adminService.getRecentOrders,
    });
}

export function useAdminOrders() {
    return useQuery({
        queryKey: ['admin', 'orders'],
        queryFn: adminService.getAllOrders,
    });
}

export function useAdminUsers() {
    return useQuery({
        queryKey: ['admin', 'users'],
        queryFn: adminService.getAllUsers,
    });
}

export function useAdminUserDetails(userId: string) {
    return useQuery({
        queryKey: ['admin', 'users', userId],
        queryFn: () => adminService.getUserDetails(userId),
        enabled: !!userId
    });
}

export function useAdminUsersPermissions() {
    return useQuery({
        queryKey: ['admin', 'users', 'permissions'],
        queryFn: adminService.getUsersPermissions,
    });
}

export function useAdminUserHistoric(userId: string) {
    return useQuery({
        queryKey: ['admin', 'users', userId, 'historic'],
        queryFn: () => adminService.getUserHistoric(userId),
        enabled: !!userId,
    });
}

export function useAdminProducts() {
    return useQuery({
        queryKey: ['admin', 'products'],
        queryFn: adminService.getAllProductsAdmin,
    });
}

export function useAdminCategories() {
    return useQuery({
        queryKey: ['admin', 'categories'],
        queryFn: adminService.getAllCategoriesAdmin,
    });
}


export function useAdminPaymentHistoric(id: string) {
    return useQuery({
        queryKey: ['admin', 'payment', id, 'historic'],
        queryFn: () => adminService.getPaymentHistoric(id),
        enabled: !!id,
    });
}

export function useAdminActivityLogs(page: number = 1, limit: number = 10) {
    return useQuery({
        queryKey: ['admin', 'activity-logs', page, limit],
        queryFn: () => adminService.getActivityLogs(page, limit),
    });
}

export function useCjProducts(page: number = 1, size: number = 20, search?: string) {
    return useQuery({
        queryKey: ['cj', 'products', page, size, search],
        queryFn: () => cjService.fetchCjProducts(page, size, search),
    });
}

export function useImportCjProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ pid, categoryId }: { pid: string, categoryId: string }) =>
            cjService.importCjProduct(pid, categoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
        },
    });
}

export function useUpdateUserPermissions() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, permissions }: { userId: string, permissions: any }) =>
            adminService.updateUserPermissions(userId, permissions),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'permissions' ] });
        },
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, userData }: { userId: string, userData: Partial<Profile> }) =>
            adminService.updateUser(userId, userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        },
    });
}

export function useDeleteUser()  {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => adminService.deleteUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
        },
    });
}

export function useBanUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => adminService.banUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        },
    });
}

export function useUnbanUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => adminService.unbanUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        },
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, productData }: { id: string, productData: Partial<Product> }) => 
            adminService.createProductAdmin(id, productData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => adminService.deleteProductAdmin(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
        },
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, productData }: { id: string, productData: Partial<Product> }) => 
            adminService.updateProductAdmin(id, productData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
        },
    });
}

/**
 * Hook para criar uma nova categoria.
 */
export function useCreateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, categoryData }: { id: string, categoryData: Partial<Category> }) => 
            adminService.createCategoryAdmin(id, categoryData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
        },
    });
}

/**
 * Hook para atualizar uma categoria existente.
 */
export function useUpdateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, categoryData }: { id: string, categoryData: Partial<Category> }) => 
            adminService.updateCategoryAdmin(id, categoryData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
        },
    });
}

/**
 * Hook para deletar uma categoria.
 */
export function useDeleteCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => adminService.deleteCategoryAdmin(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
        },
    });
}

export function useUpdateOrderDelivery() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ orderId, data }: { orderId: string, data: any }) => 
            adminService.updateOrderDelivery(orderId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
        },
    });
}