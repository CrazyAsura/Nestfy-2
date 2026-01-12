export interface Category {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string;
    parentId?: string;
    createdAt: string;
    updatedAt: string;
    _count?: {
        products: number;
    };
}