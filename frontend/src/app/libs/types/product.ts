export type Product = {
    id: number;
    name: string;
    price: number;
    discountPrice?: number;
    categoryId: number;
    imageUrl: string;
}
