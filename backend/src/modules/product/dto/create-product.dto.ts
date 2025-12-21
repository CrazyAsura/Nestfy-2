import { ProductImage } from "@prisma/client";

export class CreateProductDto {
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    categoryId: number;
    stock: number;
    ProductImage: ProductImage;

}
