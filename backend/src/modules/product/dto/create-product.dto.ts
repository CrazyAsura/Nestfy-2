import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductImageDto } from '../../product-image/dto/create-product-image.dto';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsOptional()
    discountPrice?: number;

    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @IsNumber()
    @IsNotEmpty()
    stock: number;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateProductImageDto)
    images?: CreateProductImageDto[];
}
