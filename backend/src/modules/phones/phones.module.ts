import { Module } from '@nestjs/common';
import { PhonesService } from './phones.service';
import { PhonesResolver } from './phones.resolver';

@Module({
  providers: [PhonesResolver, PhonesService],
})
export class PhonesModule {}
