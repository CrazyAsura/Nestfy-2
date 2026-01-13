import { API_ROUTES } from "../routes";
import { api } from "./axios";
import { Product } from "../../types/product";
import { Category } from "../../types/category";
import { Profile } from "../../types/profile";

export async function getDashboardStats() {
    const response = await api.get(API_ROUTES.ADMIN.BASE);
    return response.data;
}

export async function clearSampleData() {
    const response = await api.post(API_ROUTES.ADMIN.CLEAR_SAMPLE_DATA);
    return response.data;
}

export async function getRecentOrders() {
    const response = await api.get(API_ROUTES.ADMIN.RECENTE_ORDERS);
    return response.data;
}

export async function getAllOrders() {
    const response = await api.get(API_ROUTES.ADMIN.ORDERS);
    return response.data;
}

export async function getAllUsers() {
    const response = await api.get(API_ROUTES.ADMIN.USERS);
    return response.data;
}

export async function updateOrderDelivery(orderId: string, data: any) {
    const response = await api.patch(`${API_ROUTES.ADMIN.ORDERS}/${orderId}/delivery`, data);
    return response.data;
}

export async function getUserDetails(userId: string) {
    const response = await api.get(API_ROUTES.ADMIN.USER_DETAILS(userId));
    return response.data;
}

export async function getUsersPermissions() {
    const response = await api.get(API_ROUTES.ADMIN.USERS_PERMISSIONS);
    return response.data;
}

export async function updateUserPermissions(userId: string, permissions: any) {
    const response = await api.patch(API_ROUTES.ADMIN.USERS_PERMISSIONS_UPDATE(userId), permissions);
    return response.data;
}

export async function updateUser(userId: string, userData: Partial<Profile>) {
    const response = await api.put(API_ROUTES.ADMIN.USER_UPDATE(userId), userData);
    return response.data;
}

export async function deleteUser(userId: string) {
    const response = await api.delete(API_ROUTES.ADMIN.USER_DELETE(userId));
    return response.data;
}

export async function banUser(userId: string) {
    const response = await api.patch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/ban`);
    return response.data;
}

export async function unbanUser(userId: string) {
    const response = await api.patch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/unban`);
    return response.data;
}

export async function getUserHistoric(userId: string) {
    const response = await api.get(API_ROUTES.ADMIN.USER_HISTORIC(userId));
    return response.data;
}

export async function getAllProductsAdmin() {
    const response = await api.get(API_ROUTES.ADMIN.PRODUCTS);
    return response.data;
}

export async function createProductAdmin(id: string, productData: Partial<Product>) {
    const response = await api.post(API_ROUTES.ADMIN.PRODUCTS_POST(id), productData);
    return response.data;
}

export async function updateProductAdmin(id: string, productData: Partial<Product>) {
    const response = await api.put(API_ROUTES.ADMIN.PRODUCTS_UPDATE(id), productData);
    return response.data;
}

export async function deleteProductAdmin(id: string) {
    const response = await api.delete(API_ROUTES.ADMIN.PRODUCTS_DELETE(id));
    return response.data;
}

export async function getAllCategoriesAdmin() {
    const response = await api.get(API_ROUTES.ADMIN.CATEGORIES);
    return response.data;
}

export async function createCategoryAdmin(id: string, categoryData: Partial<Category>) {
    const response = await api.post(API_ROUTES.ADMIN.CATEGORIES_POST(id), categoryData);
    return response.data;
}

export async function updateCategoryAdmin(id: string, categoryData: Partial<Category>) {
    const response = await api.put(API_ROUTES.ADMIN.CATEGORIES_UPDATE(id), categoryData);
    return response.data;
}

export async function deleteCategoryAdmin(id: string) {
    const response = await api.delete(API_ROUTES.ADMIN.CATEGORIES_DELETE(id));
    return response.data;
}

export async function getPaymentHistoric(id: string) {
    const response = await api.get(API_ROUTES.ADMIN.PAYMENT_HISTORIC(id));
    return response.data;
}

export async function getActivityLogs(page: number = 1, limit: number = 10) {
    const response = await api.get(API_ROUTES.ADMIN.ACTIVITY_LOGS, {
        params: { page, limit }
    });
    return response.data;
}