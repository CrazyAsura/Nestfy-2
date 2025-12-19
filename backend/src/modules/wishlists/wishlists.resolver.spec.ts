import { Test, TestingModule } from '@nestjs/testing';
import { WishlistsResolver } from './wishlists.resolver';
import { WishlistsService } from './wishlists.service';

describe('WishlistsResolver', () => {
  let resolver: WishlistsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WishlistsResolver, WishlistsService],
    }).compile();

    resolver = module.get<WishlistsResolver>(WishlistsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
