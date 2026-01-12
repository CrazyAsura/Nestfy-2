import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WishlistItemService } from './wishlist-item.service';
import { CreateWishlistItemDto } from './dto/create-wishlist-item.dto';
import { UpdateWishlistItemDto } from './dto/update-wishlist-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User, UserDocument } from '../user/schemas/user.schema';

@Controller('wishlist-item')
export class WishlistItemController {
  constructor(private readonly wishlistItemService: WishlistItemService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWishlistItemDto: CreateWishlistItemDto, @CurrentUser() user: UserDocument) {
    return this.wishlistItemService.create(createWishlistItemDto, user.id);
  }

  @Get()
  findAll() {
    return this.wishlistItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistItemService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWishlistItemDto: UpdateWishlistItemDto) {
    return this.wishlistItemService.update(id, updateWishlistItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishlistItemService.remove(id);
  }
}
