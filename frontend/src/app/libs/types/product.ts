export type Product = {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number;
    stock: number;
    sku: string;
    categoryId: string;
    brandId?: string;
    materialId?: string;
    riskId?: string;
    imageUrl?: string;
    images?: { url: string; isMain: boolean }[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
