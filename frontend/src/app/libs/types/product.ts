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
    brand?: {
        id: string;
        name: string;
    };
    category?: {
        id: string;
        name: string;
    };
    materialId?: string;
    riskId?: string;
    imageUrl?: string;
    images?: { url: string; isMain: boolean }[];
    isActive: boolean;
    isDropshipping: boolean;
    cjProductId?: string;
    vendor: string;
    costPrice: number;
    cjSku?: string;
    createdAt: string;
    updatedAt: string;
}
