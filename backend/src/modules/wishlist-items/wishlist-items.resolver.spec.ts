import { Test, TestingModule } from '@nestjs/testing';
import { WishlistItemsResolver } from './wishlist-items.resolver';
import { WishlistItemsService } from './wishlist-items.service';

describe('WishlistItemsResolver', () => {
  let resolver: WishlistItemsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WishlistItemsResolver, WishlistItemsService],
    }).compile();

    resolver = module.get<WishlistItemsResolver>(WishlistItemsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
