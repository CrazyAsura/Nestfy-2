import { Module } from '@nestjs/common';
import { RisksService } from './risks.service';
import { RisksResolver } from './risks.resolver';

@Module({
  providers: [RisksResolver, RisksService],
})
export class RisksModule {}
