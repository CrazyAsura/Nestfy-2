import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductImagesService } from './product-images.service';
import { ProductImage } from './entities/product-image.entity';
import { CreateProductImageInput } from './dto/create-product-image.input';
import { UpdateProductImageInput } from './dto/update-product-image.input';

@Resolver(() => ProductImage)
export class ProductImagesResolver {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @Mutation(() => ProductImage)
  createProductImage(@Args('createProductImageInput') createProductImageInput: CreateProductImageInput) {
    return this.productImagesService.create(createProductImageInput);
  }

  @Query(() => [ProductImage], { name: 'productImages' })
  findAll() {
    return this.productImagesService.findAll();
  }

  @Query(() => ProductImage, { name: 'productImage' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.productImagesService.findOne(id);
  }

  @Mutation(() => ProductImage)
  updateProductImage(@Args('updateProductImageInput') updateProductImageInput: UpdateProductImageInput) {
    return this.productImagesService.update(updateProductImageInput.id, updateProductImageInput);
  }

  @Mutation(() => ProductImage)
  removeProductImage(@Args('id', { type: () => Int }) id: number) {
    return this.productImagesService.remove(id);
  }
}
